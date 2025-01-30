import moment from "moment";
import {
  initialize,
  readRecords,
  requestPermission,
} from "react-native-health-connect";
import { Platform } from "react-native";
import AppleHealthKit from "react-native-health";
import { submit_health_data } from "../src/api";
import { getAuthData, getData, storeData } from "../src/store";
import { useState } from "react";
const useHealth = () => {
  const [auth, setAuth] = useState(null);
  const transformData = (datatype, value, timestamp, note = "") => ({
    identifier: `${datatype}_${new Date().getTime()}_${
      Math.floor(Math.random() * 1000000) + 1
    }`,
    timestamp: moment(timestamp).format("MM/DD/YYYY hh:mm:ss"), // Timestamp of the data
    note,
    datatype,
    value: Math.min(Math.max(value, 0), 1000000).toString(), // Clamp value between 1 and 1000000
  });
  const getAuth = async () => {
    try {
      const auth = await getAuthData(setAuth);
      setAuth(auth);
      return auth;
    } catch (error) {
      console.log("🚀 ~ getAuth ~ error:", error);
    }
  };
  const fetchData = async (
    fetchFunction,
    params,
    datatype,
    valueKey = "value",
    formattedValue = null
  ) => {
    return new Promise((resolve) => {
      fetchFunction(params, (err, results) => {
        if (err) {
          console.log(`Error fetching ${datatype}: `, err);
          resolve([]);
          return;
        }
        const transformed = (Array.isArray(results) ? results : [results]).map(
          (result) => {
            return transformData(
              datatype,
              formattedValue ? formattedValue(result) : result?.[valueKey],
              result?.startDate
            );
          }
        );
        resolve(transformed);
      });
    });
  };
  const syncData = async (auth, data) => {
    try {
      const response = await submit_health_data(
        auth.data.profile_auth,
        auth.cookie,
        JSON.stringify(data)
      );
    } catch (apiError) {
      console.log("Error syncing data to backend: ", apiError);
    }
  };
  const AppleHealthInitializeAndSync = async (
    userAuth,
    datesInRange = null
  ) => {
    try {
      console.log("Initializing Apple HealthKit...");
      const finalHealthData = [];

      let options = {
        permissions: {
          read: [
            "StepCount",
            "ActiveEnergyBurned",
            "DistanceWalkingRunning",
            "MindfulSession",
            "SleepAnalysis",
            "Water",
          ],
          write: [],
        },
      };

      AppleHealthKit.initHealthKit(options, async (err) => {
        if (err) {
          console.log("Error initializing HealthKit: ", err);
          return;
        }

        let dateList = datesInRange || [moment().format("YYYY-MM-DD")];
        console.log("Processing dates:", dateList);

        for (const date of dateList) {
          let startDate = moment(date).startOf("day").toISOString();
          let endDate = moment(date).endOf("day").toISOString();
          console.log(`Fetching data for date: ${date}`);
          // console.log("StepsRecords", StepsRecords.records);
          const stepsData = await fetchData(
            AppleHealthKit.getStepCount,
            { date: startDate, startDate, endDate },
            "steps"
          );
          // console.log("Steps Data Fetched:", stepsData);

          const workoutMinutesData = await fetchData(
            AppleHealthKit.getActiveEnergyBurned,
            { date: startDate, startDate, endDate },
            "workout_minutes"
          );
          // console.log("Workout Minutes Data Fetched:", workoutMinutesData);

          const workoutDistanceData = await fetchData(
            AppleHealthKit.getDistanceWalkingRunning,
            { date: startDate, startDate, endDate },
            "workout_distance"
          );
          // console.log("Workout Distance Data Fetched:", workoutDistanceData);

          const mentalMinutesData = await fetchData(
            AppleHealthKit.getMindfulSession,
            { date: startDate, startDate, endDate },
            "mental_minutes",
            "value",
            (result) =>
              moment(result?.endDate).diff(
                moment(result?.startDate),
                "minutes",
                true
              )
          );
          // console.log("Mental Minutes Data Fetched:", mentalMinutesData);

          const sleepData = await fetchData(
            AppleHealthKit.getSleepSamples,
            { date: startDate, startDate, endDate },
            "sleep",
            "value",
            (result) => {
              const sleep_time = moment(result?.endDate).diff(
                moment(result?.startDate),
                "minutes"
              );
              const hours = Math.floor(sleep_time / 60);
              const minutes = sleep_time % 60;
              const formattedTime = `${hours}.${minutes
                .toString()
                .padStart(2, "0")}`;
              return formattedTime;
            }
          );
          // console.log("Sleep Data Fetched:", sleepData);

          const waterData = await fetchData(
            AppleHealthKit.getWaterSamples,
            { date: startDate, startDate, endDate },
            "water"
          );
          // console.log("Water Data Fetched:", waterData);

          finalHealthData.push(
            ...stepsData,
            ...workoutMinutesData,
            ...workoutDistanceData,
            ...mentalMinutesData,
            ...sleepData,
            ...waterData
          );
        }

        // console.log("Final Health Data to Sync:", finalHealthData);

        if (finalHealthData.length === 0) {
          console.log("No data to sync.");
        } else {
          await syncData(userAuth, finalHealthData);
        }
      });
    } catch (error) {
      console.log("🚀 ~ AppleHealthInitializeAndSync ~ error:", error);
      throw error;
    }
  };

  const AndroidHealthInitializeAndSync = async (
    userAuth,
    datesInRange = null
  ) => {
    try {
      await initialize();
      await requestPermission([
        { accessType: "read", recordType: "Steps" },
        { accessType: "read", recordType: "Distance" },
        { accessType: "read", recordType: "SleepSession" },
        { accessType: "read", recordType: "Hydration" },
        { accessType: "read", recordType: "ExerciseSession" },
      ]);
      const data = [];
      let dateList = datesInRange || [moment().format("YYYY-MM-DD")];

      for (const date of dateList) {
        let startDate = moment(date).startOf("day").toISOString();
        let endDate = moment(date).endOf("day").toISOString();

        const filter = {
          timeRangeFilter: {
            operator: "between",
            startTime: startDate,
            endTime: endDate,
          },
        };

        const fetchTasks = [
          readRecords("Steps", filter),
          readRecords("Distance", filter),
          readRecords("SleepSession", filter),
          readRecords("Hydration", filter),
        ];

        const [StepsRecords, DistanceRecord, SleepData, HydrationRecord] =
          await Promise.all(fetchTasks);
        data.push(
          ...StepsRecords.records.map((record) =>
            transformData(
              "steps",
              record?.count,
              record?.metadata.lastModifiedTime
            )
          ),
          ...DistanceRecord.records.map((record) =>
            transformData(
              "distance",
              record?.distance.inKilometers,
              record?.metadata.lastModifiedTime
            )
          ),
          ...SleepData.records.map((record) =>
            transformData(
              "sleep",
              moment(record?.endTime).diff(
                moment(record?.startTime),
                "hours",
                true
              ),
              record?.metadata.lastModifiedTime
            )
          ),
          ...HydrationRecord.records.map((record) =>
            transformData(
              "water",
              record?.volume.inMilliliters,
              record?.metadata.lastModifiedTime
            )
          )
        );
      }
      await syncData(userAuth, data);
    } catch (error) {
      console.log("🚀 ~ AndroidHealthInitializeAndSync ~ error:", error);
      throw error;
    }
  };

  const initializeAndSyncHealthData = async (callback = () => {}) => {
    try {
      const auth = await getAuth();
      if (!auth?.data?.profile_auth) {
        console.log("Health data synced Failed: User not logged in.");
        callback && callback(false, "User not logged in.");
        return;
      }
      if (Platform.OS === "ios") {
        await AppleHealthInitializeAndSync(auth);
        callback && callback(true, "Health data synced successfully.");
      } else {
        await AndroidHealthInitializeAndSync(auth);
        callback && callback(true, "Health data synced successfully.");
      }
    } catch (error) {
      console.log("🚀 ~ initializeAndSyncHealthData ~ error:", error);
      callback && callback(false, "Error syncing health data");
    }
  };
  const getDatesInRange = (startDate, endDate) => {
    const dates = [];
    let currentDate = moment(startDate);
    while (currentDate <= moment(endDate)) {
      dates.push(currentDate.format("YYYY-MM-DD"));
      currentDate = currentDate.add(1, "days");
    }
    return dates;
  };
  const getHealthData = async (challenge_start, challenge_end) => {
    try {
      const auth = await getAuth();
      if (!auth?.data?.profile_auth) {
        console.log("Health data sync failed: User not logged in.");
        return;
      }
      const datesInRange = getDatesInRange(challenge_start, challenge_end);
      console.log("Dates in range:", datesInRange);
      if (Platform.OS === "ios") {
        await AppleHealthInitializeAndSync(auth, datesInRange);
      } else {
        await AndroidHealthInitializeAndSync(auth, datesInRange);
      }
    } catch (error) {
      console.log("🚀 ~ getHealthData ~ error:", error);
    }
  };

  return {
    AppleHealthInitializeAndSync,
    AndroidHealthInitializeAndSync,
    initializeAndSyncHealthData,
    getHealthData,
  };
};

export default useHealth;
