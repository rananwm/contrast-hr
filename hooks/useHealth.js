import moment from "moment";
import {
  initialize,
  readRecords,
  requestPermission,
} from "react-native-health-connect";
import { Platform } from "react-native";
import AppleHealthKit from "react-native-health";
import { submit_health_data } from "../src/api";
import { getAuthData } from "../src/store";
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
    value: Math.min(Math.max(value, 1), 1000000).toString(), // Clamp value between 1 and 1000000
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

      console.log("Data synced successfully: ", response);
    } catch (apiError) {
      console.log("Error syncing data to backend: ", apiError);
    }
  };
  const AppleHealthInitializeAndSync = async (userAuth) => {
    try {
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

        const challengeWindowStartDate = new Date(
          new Date().setDate(new Date().getDate() - 1)
        ).toISOString();
        const challengeWindowEndDate = new Date().toISOString();

        // Fetch all data in parallel
        const stepsData = await fetchData(
          AppleHealthKit.getStepCount,
          {
            startDate: challengeWindowStartDate,
            endDate: challengeWindowEndDate,
          },
          "steps"
        );

        const workoutMinutesData = await fetchData(
          AppleHealthKit.getActiveEnergyBurned,
          {
            startDate: challengeWindowStartDate,
            endDate: challengeWindowEndDate,
          },
          "workout_minutes"
        );

        const workoutDistanceData = await fetchData(
          AppleHealthKit.getDistanceWalkingRunning,
          {
            startDate: challengeWindowStartDate,
            endDate: challengeWindowEndDate,
          },
          "workout_distance"
        );
        const mentalMinutesData = await fetchData(
          AppleHealthKit.getMindfulSession,
          {
            startDate: challengeWindowStartDate,
            endDate: challengeWindowEndDate,
          },
          "mental_minutes",
          "value",
          (result) => {
            const mentalMinutes = moment(result?.endDate).diff(
              moment(result?.startDate),
              "minutes",
              true
            );
            return mentalMinutes;
          }
        );

        const sleepData = await fetchData(
          AppleHealthKit.getSleepSamples,
          {
            startDate: challengeWindowStartDate,
            endDate: challengeWindowEndDate,
          },
          "sleep",
          "value",
          (result) => {
            const hoursSleep = moment(result?.endDate).diff(
              moment(result?.startDate),
              "hours",
              true
            );
            return hoursSleep;
          }
        );

        const waterData = await fetchData(
          AppleHealthKit.getWaterSamples,
          {
            startDate: challengeWindowStartDate,
            endDate: challengeWindowEndDate,
          },
          "water"
        );

        // Combine all data
        finalHealthData.push(
          ...stepsData,
          ...workoutMinutesData,
          ...workoutDistanceData,
          ...mentalMinutesData,
          ...sleepData,
          ...waterData
        );

        await syncData(userAuth, finalHealthData);
      });
    } catch (error) {
      console.log("🚀 ~ AppleHealthInitializeAndSync ~ error:", error);
      throw error;
    }
  };

  const AndroidHealthInitializeAndSync = async (userAuth) => {
    try {
      const filter = {
        timeRangeFilter: {
          operator: "between",
          startTime: new Date(
            new Date().setDate(new Date().getDate() - 1)
          ).toISOString(),
          endTime: new Date().toISOString(),
        },
      };
      await initialize();
      await requestPermission([
        { accessType: "read", recordType: "Steps" },
        { accessType: "read", recordType: "Distance" },
        { accessType: "read", recordType: "SleepSession" },
        { accessType: "read", recordType: "Hydration" },
        { accessType: "read", recordType: "ExerciseSession" },
      ]);
      const data = [];
      const { records: StepsRecords } = await readRecords("Steps", filter);
      const { records: DistanceRecord } = await readRecords("Distance", filter);
      const { records: SleepData } = await readRecords("SleepSession", filter);
      const { records: HydrationRecord } = await readRecords(
        "Hydration",
        filter
      );
      const stepsData = StepsRecords.map((record) => {
        return transformData(
          "steps",
          record?.count,
          record?.metadata.lastModifiedTime
        );
      });

      const distanceData = DistanceRecord.map((record) => {
        return transformData(
          "distance",
          record?.distance.inKilometers,
          record?.metadata.lastModifiedTime
        );
      });

      const sleepData = SleepData.map((record) => {
        return transformData(
          "sleep",
          moment(record?.endTime).diff(
            moment(record?.startTime),
            "hours",
            true
          ),
          record?.metadata.lastModifiedTime
        );
      });

      const hydrationData = HydrationRecord.map((record) => {
        return transformData(
          "water",
          record?.volume.inMilliliters,
          record?.metadata.lastModifiedTime
        );
      });
      data.push(...stepsData, ...distanceData, ...sleepData, ...hydrationData);
      await syncData(userAuth, data);
    } catch (error) {
      console.log("🚀 ~ initializeHealthConnect ~ error:", error);
      throw error;
    }
    // check if granted
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
  return {
    AppleHealthInitializeAndSync,
    AndroidHealthInitializeAndSync,
    initializeAndSyncHealthData,
  };
};

export default useHealth;
