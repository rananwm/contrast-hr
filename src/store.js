import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import SecureStore from '@react-native-async-storage/secure-storage';

//write exportstate value to secure storage
// export const secureStoreData = async (key, value) => {
//   try {
//     await SecureStore.setItemAsync(key, value)
//   } catch (e) {
//       console.log(e)
//   }
// }

//read exportstate value from secure storage
// export const secureGetData = async (key, stateHook) => {
//   try {
//     const value = await SecureStore.getItemAsync(key)
//     if (value !== null) {
//       stateHook(value)
//     }
//     return value
//   } catch(e) {
//       console.log(e)
//   }
// }

export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.log(e);
  }
};

export const getData = async (key, stateHook) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null && stateHook) {
      stateHook(value);
      // value previously stored
    }
    return value;
  } catch (e) {
    console.log(e);
    // error reading value
  }
};

export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log(e);
  }
};

export const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    console.log(e);
  }
};

export const getJSONData = async (key) => {
  try {
    let value = await AsyncStorage.getItem(key);
    // console.log("store value/s: ", value)

    // console.log("store key: " + key + ", value: ", typeof value, ", hasValue: ", value && typeof value !== 'undefined' && value !== null)
    if (value && typeof value !== "undefined" && value !== null) {
      value = await JSON.parse(value);
      // console.log("store value/s: ", typeof value, value && typeof value !== 'undefined' && value !== null)
      // value previously stored
    }
    return value;
  } catch (e) {
    console.log("unexpected error getting auth", e);
    return null;
    // error reading value
  }
};

export const getAuthData = async (stateHook) => {
  const authJson = await getJSONData("auth");

  if (authJson && authJson.data) {
    // console.log("setting auth state", authJson)
    return authJson;
  } else {
    return false;
  }
};

export const getItem = async (authJson, key, stateHook, apiFallback) => {
  if (authJson) {
    // let itemValue = await getJSONData(key);
    let itemValue = null;

    // console.log("itemValue type: ", typeof itemValue, "key: ", key, ", is empty:", !itemValue || itemValue.length == 0)
    if (!itemValue || itemValue.length == 0) {
      itemValue = await apiFallback(
        authJson.data.profile_auth,
        authJson.cookie
      );
      await storeData(key, JSON.stringify(itemValue));
    }

    await stateHook(itemValue?.data || null);
  } else {
    // await removeData("auth")
    return false;
  }

  // await stateHook(itemValue)
  return true;
};

// itemGetters is an array of objects with keys: key, stateHook, apiFallback
export const getItems = async (authJson, itemGetters) => {
  if (authJson) {
    const promises = itemGetters?.map((itemGetter) => {
      return getItem(
        authJson,
        itemGetter?.key,
        itemGetter?.stateHook,
        itemGetter?.apiFallback
      );
    });

    await Promise.all(promises);

    /*
    // Old code to handle fallback and storing data
    await Promise.all(itemGetters.map(async itemGetter => {
      let itemValue = await getJSONData(itemGetter.key, itemGetter.stateHook);
      if (!itemValue || itemValue.length == 0) {
        itemValue = await itemGetter.apiFallback(authJson.data.profile_auth, authJson.cookie);
        await storeData(itemGetter.key, JSON.stringify(itemValue));
      }
      await itemGetter.stateHook(itemValue.data);
    }));
    */
  } else {
    // await removeData("auth")
    return false;
  }

  return true;
};

export const getJobs = async (authJson, stateSetJobs, apiFallback) => {
  return await getItem(authJson, "jobs", stateSetJobs, apiFallback);
};

const getNotifications = async () => {
  const authJson = await getAuth();

  if (!authJson) {
    return false;
  }

  var notificationsJson = await getJSONData("notifications", setNotifications);
  // console.log("notifications from store", notificationsJson)
  if (!notificationsJson) {
    // get notifications from API
    notificationsJson = await notifications_get(
      authJson.data.profile_auth,
      authJson.cookie
    );
    // console.log("notifications from store", notificationsJson)
    storeData("notifications", JSON.stringify(notificationsJson));
  }

  setNotifications(notificationsJson.data);
};
