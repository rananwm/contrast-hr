import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import mime from "mime";
import { storeData } from "./store";
import RNFS from "react-native-fs";
import Share from "react-native-share";
import { Alert } from "react-native";
import { API_BASE_URL, API_KEY } from "../constants";
//function to authenticate via api

export const login = async (username, password) => {
  var formdata = new FormData();
  formdata.append("api_key", API_KEY);
  formdata.append("action", "profile_signin");
  formdata.append("username", username);
  formdata.append("password", password);

  var requestOptions = {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Content-Type": "multipart/form-data",
    },
    body: formdata,
    credentials: "omit",
  };

  // console.log(JSON.stringify(requestOptions))
  var response = await fetch(API_BASE_URL, requestOptions);
  // console.log("response", response)
  // var derp = await response.text()
  // console.log("derp", derp)

  // try to convert to json or return false for failure
  try {
    var responseJson = await response.json();
    if (responseJson?.data?.session_auth) {
      await storeData("session_auth", responseJson.data.session_auth);
    }

    // on successful login the response will have a data.name property that isn't null
    if (responseJson && responseJson.data && responseJson.data.name) {
      //get PHPSESSID cookie value from response headers
      responseJson.cookie = response.headers.get("set-cookie").split(";")[0];
      // console.log(JSON.stringify(responseJson))

      return responseJson;
    } else {
      return false;
    }
  } catch (error) {
    // console.log("error", error)
    return false;
  }
};

//function to get data from api
const getAuthCreds = async () => {
  try {
    const authCreds = await AsyncStorage.getItem("authCreds");
    return JSON.parse(authCreds);
  } catch (error) {
    console.log("🚀 ~ getAuthCreds ~ error:", error);
    return null;
  }
};
let calling_time = 0;
export const getData = async (
  action,
  profile_auth,
  session_cookie,
  additional_form_data = []
) => {
  var formdata = new FormData();
  const authCreds = await getAuthCreds();
  formdata.append("api_key", API_KEY);
  formdata.append("action", action);
  formdata.append("profile_auth", profile_auth);
  formdata.append("username", authCreds?.username);
  formdata.append("password", authCreds?.password);
  const session_auth = await AsyncStorage.getItem("session_auth");
  if (session_auth) {
    formdata.append("session_auth", session_auth);
  }
  if (additional_form_data) {
    additional_form_data.forEach((item) => {
      formdata.append(item.name, item.value);
    });
  }

  // var requestOptions = {
  //   method: "POST",
  //   body: formdata,
  //   headers: {
  //     Cookie: session_cookie,
  //   },
  //   credentials: "omit",
  // };

  // // console.log("requestOptions: ", JSON.stringify(requestOptions))
  // // console.log("\n\n", session_cookie, "\n\n", JSON.stringify(requestOptions), "\n\n")

  // var response = await fetch(
  //   "https://v2.myexectras.com/api-app",
  //   requestOptions
  // );
  const requestData = {
    method: "POST",
    url: API_BASE_URL,
    data: formdata,
    headers: {
      Cookie: session_cookie,
      "content-type": "multipart/form-data",
    },
    withCredentials: true, // Equivalent to "credentials: 'include'" in fetch
  };

  // try to convert to json or return false for failed login

  try {
    let response = await axios(requestData);
    var responseJson = await response.data;
    calling_time++;
    if (
      response.headers["content-type"].includes("text/html") &&
      typeof responseJson === "string" &&
      calling_time < 4
    ) {
      return getData(action, profile_auth, session_cookie);
      // run again if response is html
    }
    // on successful request the response will have the status property set to 'success'
    if (responseJson && responseJson.status) {
      // console.log("success Called:", action);
      calling_time = 0;
      return responseJson;
    } else {
      calling_time = 0;
      // console.log("failed Called:", action);

      return false;
    }
  } catch (error) {
    console.log("ERROR GETTING PROFILE", error, "action:", action);
    return false;
  }
};

//function to pull profile from api
export const profile_get = async (profile_auth, session_cookie) => {
  return await getData("profile_get", profile_auth, session_cookie);
};

//function to pull skills from api
export const skills_get = async (profile_auth, session_cookie) => {
  return await getData("skills_get", profile_auth, session_cookie);
};

// Job Object
// Array [
//     "id",
//     "name",
//     "description",
//     "location",
//     "employer",
//     "job_number",
//     "job_application_link",
//     "company_name",
//     "project_name",
//   ]
//function to pull jobs from api
export const perks_get = async (profile_auth, session_cookie) => {
  return await getData("perks_get", profile_auth, session_cookie);
};

export const perk_get = async (profile_auth, session_cookie, job_id) => {
  return await getData("perk_get", profile_auth, session_cookie, [
    { name: "perk_id", value: job_id },
  ]);
};

//function to pull events from api
export const events_get = async (profile_auth, session_cookie) => {
  // dummy list of events
  return {
    data: [
      {
        id: 1,
        name: "Job Fair",
        short_description: "Job Fair at the local mall",
        long_description:
          "Job Fair at the local mall. Come and meet with local employers and find your next job.",
        date: "2023-12-17",
        time: "16:29:00",
        location: "123 Main Street, Anytown, SK",
      },
      {
        id: 2,
        name: "Exhibition",
        short_description: "Exhibition at the local mall",
        long_description:
          "Exhibition at the local mall. Come and meet with local employers and find your next job.",
        date: "2023-12-17",
        time: "16:29:00",
        location: "123 Main Street, Anytown, SK",
      },
      {
        id: 3,
        name: "Cameco Meet & Greet",
        short_description: "Cameco Meet & Greet at the local mall",
        long_description:
          "Cameco Meet & Greet at the local mall. Come and meet with local employers and find your next job.",
        date: "2023-12-17",
        time: "16:29:00",
        location: "123 Main Street, Anytown, SK",
      },
    ],
  };
  // return await getData('events_get', profile_auth, session_cookie);
};

//function to pull events from api
export const event_get = async (profile_auth, session_cookie) => {
  return await getData("event_get", profile_auth, session_cookie, [
    { name: "event_id", value: event_id },
  ]);
};

//function to pull notifications from api
export const notifications_get = async (
  profile_auth,
  session_cookie,
  company_auth = null
) => {
  const data = await getData(
    "notifications_get",
    profile_auth,
    session_cookie,
    [{ scope: "active" }],
    company_auth
  );
  return data;
};

//function to pull notifications from api
export const notifications_archived_get = async (
  profile_auth,
  session_cookie
) => {
  const old_notifications = await getData(
    "notifications_get",
    profile_auth,
    session_cookie,
    [{ name: "scope", value: "archived" }]
  );
  return old_notifications;
};

//function to pull notifications from api
export const notification_get = async (profile_auth, session_cookie) => {
  // return await getData('notification_get', profile_auth, session_cookie, [{name: 'notification_id', value: notification_id}]);
};

export const notification_clear = async (
  profile_auth,
  session_cookie,
  notification_id
) => {
  return await getData("notification_clear", profile_auth, session_cookie, [
    { name: "notification_id", value: notification_id },
  ]);
};

//function to pull training from api
export const trainings_get = async (profile_auth, session_cookie) => {
  // dummy list of trainings
  return {
    data: [
      {
        id: 1,
        name: "Resume Writing",
        short_description: "Learn how to write a resume",
        long_description:
          "Learn how to write a resume. This will help you find jobs that match your skills.",
        date: "2022-12-17",
        time: "16:29:00",
        location: "123 Main Street, Anytown, SK",
        employer: "Anytown Employment Centre",
      },
      {
        id: 2,
        name: "Interview Skills",
        short_description: "Learn how to interview",
        long_description:
          "Learn how to interview. This will help you find jobs that match your skills.",
        date: "2022-12-17",
        time: "16:29:00",
        location: "123 Main Street, Anytown, SK",
        employer: "Anytown Employment Centre",
      },
      {
        id: 3,
        name: "Salary Negotiation Tactics",
        short_description: "Learn how to negotiate your salary",
        long_description:
          "Learn how to negotiate your salary. This will help you find jobs that match your skills.",
        date: "2022-12-17",
        time: "16:29:00",
        location: "123 Main Street, Anytown, SK",
        employer: "Anytown Employment Centre",
      },
    ],
  };
  // return await getData('trainings_get', profile_auth, session_cookie);
};

//function to pull training from api
export const training_get = async (profile_auth, session_cookie) => {
  return await getData("training_get", profile_auth, session_cookie, [
    { name: "training_id", value: training_id },
  ]);
};

//function to save data to api
export const saveData = async (
  action,
  profile_auth,
  company_auth,
  session_cookie,
  data,
  image
) => {
  var formdata = new FormData();
  const authCreds = await getAuthCreds();
  formdata.append("api_key", API_KEY);
  formdata.append("action", action);
  formdata.append("profile_auth", profile_auth);
  formdata.append("company_auth", company_auth);
  formdata.append("data", JSON.stringify(data));
  formdata.append("username", authCreds?.username);
  formdata.append("password", authCreds?.password);
  const session_auth = await AsyncStorage.getItem("session_auth");
  if (session_auth) {
    formdata.append("session_auth", session_auth);
  }
  // formdata.append("password", "test");
  // file type form data append
  if (image) {
    formdata.append("profile_image", {
      uri: image,
      name: "profile_image" + new Date().getTime(),
      type: mime.getType(image),
    });
  }
  var requestOptions = {
    method: "POST",
    body: formdata,
    headers: {
      Cookie: session_cookie,
      "content-type": "multipart/form-data",
    },
    credentials: "omit",
  };

  // console.log("\n\n", session_cookie, "\n\n", JSON.stringify(requestOptions), "\n\n")
  var response = await fetch(API_BASE_URL, requestOptions);
  // try to convert to json or return false for failed login
  try {
    var responseJson = await response.json();
    // console.log(JSON.stringify(responseJson))

    // on successful request the response will have the status property set to 'success'
    if (
      responseJson &&
      responseJson.status &&
      responseJson.status == "success"
    ) {
      return responseJson;
    } else {
      return false;
    }
  } catch (error) {
    console.log("🚀 ~ saveData ~ error:", error);
    return false;
  }
};

//function to save profile to api
export const profile_update = async (
  profile_auth,
  company_auth,
  session_cookie,
  data,
  image
) => {
  // validate that data matches expected format
  // {"name":"test","surname":"def","gender":"male","mailing_address":"123 fake street","mailing_city":"Saskatoon","mailing_province":"Saskatchewan","mailing_postal":"S1A 2B3","email":"a@b.com","phone":"3069559948","first_nation_metis":"first_nation","status_number":"1234567","band_id":"634"}
  return await saveData(
    "profile_save",
    profile_auth,
    company_auth,
    session_cookie,
    data,
    image
  );
};
export const profile_bio_save = async (profile_auth, session_cookie, data) => {
  return await getData("profile_bio_save", profile_auth, session_cookie, data);
};
export const profile_bio_get = async (profile_auth, session_cookie) => {
  return await getData("profile_bio_get", profile_auth, session_cookie);
};
export const profile_signout = async (session_cookie) => {
  const authCreds = await getAuthCreds();

  var formdata = new FormData();
  formdata.append("api_key", API_KEY);
  formdata.append("action", "profile_signout");
  formdata.append("username", authCreds?.username);
  // formdata.append("username", "bmiller@icloud.com");
  formdata.append("password", authCreds?.password);
  // formdata.append("password", "test");

  var requestOptions = {
    method: "POST",
    body: formdata,
    headers: {
      Cookie: session_cookie,
    },
    credentials: "omit",
  };

  // try to convert to json or return false for failed login
  try {
    var response = await fetch(API_BASE_URL, requestOptions);
    var responseJson = await response.json();

    // on successful request the response will have the status property set to 'success'
    if (
      responseJson &&
      responseJson.status &&
      responseJson.status == "success"
    ) {
      return responseJson;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const register_account = async (data) => {
  // validate that data matches expected format
  // email and password are requiremed - the rest are nice to have
  var formdata = new FormData();
  formdata.append(
    "api_key",
    "e4PVSBmELGvUkAUBdK4En8MXrbubnDrrPJnlqTI738ReafmNYJFnn8RAnWZ5EoA"
  );
  formdata.append("action", "profile_save");
  formdata.append("data", JSON.stringify(data));

  var requestOptions = {
    method: "POST",
    body: formdata,
    credentials: "omit",
  };

  var response = await fetch(API_BASE_URL, requestOptions);

  // try to convert to json or return false for failed login
  try {
    var responseJson = await response.json();
    console.log(JSON.stringify(responseJson));

    // on successful request the response will have the status property set to 'success'
    if (
      responseJson &&
      responseJson.status &&
      responseJson.status == "success"
    ) {
      return responseJson;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

//function to save skills to api
export const skills_save = async (profile_auth, session_cookie, data) => {
  // validate that data matches expected format
  // {"name":"test","surname":"def","gender":"male","mailing_address":"123 fake street","mailing_city":"Saskatoon","mailing_province":"Saskatchewan","mailing_postal":"S1A 2B3","email":"a@b.com","phone":"3069559948","first_nation_metis":"first_nation","status_number":"1234567","band_id":"634"}
  return await saveData("skills_save", profile_auth, session_cookie, data);
};
export const challenges_get = async (profile_auth, session_cookie) => {
  const result = await getData("challenges", profile_auth, session_cookie);
  return result;
};
export const programs_get = async (profile_auth, session_cookie) => {
  return await getData("challenges", profile_auth, session_cookie, [
    { name: "challenge_type", value: "program" },
  ]);
};

export const challenge_get = async (
  profile_auth,
  session_cookie,
  challenge_instance_auth
) => {
  return await getData("challenge", profile_auth, session_cookie, [
    { name: "challenge_instance_auth", value: challenge_instance_auth },
  ]);
};
export const get_chapter_detail = async (
  profile_auth,
  session_cookie,
  challenge_instance_auth,
  challenge_chapter_auth
) => {
  return await getData("challenge_chapter", profile_auth, session_cookie, [
    { name: "challenge_instance_auth", value: challenge_instance_auth },
    { name: "challenge_chapter_auth", value: challenge_chapter_auth },
  ]);
};
export const get_chapter_comments = async (
  profile_auth,
  session_cookie,
  challenge_instance_auth,
  challenge_chapter_auth
) => {
  return await getData("challenge_comment_wall", profile_auth, session_cookie, [
    { name: "challenge_instance_auth", value: challenge_instance_auth },
    { name: "challenge_chapter_auth", value: challenge_chapter_auth },
  ]);
};
export const search_challenges = async (
  profile_auth,
  session_cookie,
  language = [],
  category = [],
  type = "challenge"
) => {
  const result = await getData(
    "challenge_templates_search",
    profile_auth,
    session_cookie,
    [
      { name: "languages", value: JSON.stringify(language) },
      { name: "tags", value: JSON.stringify(category) },
      { name: "challenge_type", value: type },
    ]
  );
  return result;
};
export const challenges_categories = async (profile_auth, session_cookie) => {
  return await getData(
    "challenge_templates_search_params",
    profile_auth,
    session_cookie
  );
};
export const programs_categories = async (profile_auth, session_cookie) => {
  return await getData(
    "challenge_templates_search_params",
    profile_auth,
    session_cookie,
    [{ name: "challenge_type", value: "program" }]
  );
};
export const get_challenge_leaderboard = async (
  profile_auth,
  session_cookie,
  challenge_instance_auth
) => {
  return await getData("challenge_leaderboard", profile_auth, session_cookie, [
    { name: "challenge_instance_auth", value: challenge_instance_auth },
  ]);
};
export const get_challenges_templates = async (
  profile_auth,
  session_cookie
) => {
  return await getData("challenge_templates", profile_auth, session_cookie);
};
export const get_potential_participants = async (
  profile_auth,
  session_cookie
) => {
  return await getData(
    "challenge_potential_participants",
    profile_auth,
    session_cookie
  );
};
export const start_challenge = async (
  profile_auth,
  session_cookie,
  participants
) => {
  return await getData(
    "challenge_setup",
    profile_auth,
    session_cookie,
    participants
  );
};
export const submit_task_data = async (profile_auth, session_cookie, data) => {
  return await getData("challenge_task", profile_auth, session_cookie, data);
};
export const add_comment = async (
  profile_auth,
  session_cookie,
  challenge_instance_auth,
  challenge_chapter_auth,
  comment
) => {
  return await getData(
    "challenge_comment_wall_comment",
    profile_auth,
    session_cookie,
    [
      { name: "challenge_instance_auth", value: challenge_instance_auth },
      { name: "challenge_chapter_auth", value: challenge_chapter_auth },
      { name: "comment", value: comment },
    ]
  );
};
export const add_reply = async (
  profile_auth,
  session_cookie,
  challenge_instance_auth,
  challenge_chapter_auth,
  comment_auth,
  reply,
  comment
) => {
  return await getData(
    "challenge_comment_wall_comment",
    profile_auth,
    session_cookie,
    [
      { name: "challenge_instance_auth", value: challenge_instance_auth },
      { name: "challenge_chapter_auth", value: challenge_chapter_auth },
      { name: "comment", value: comment },
      // { name: "comment_auth", value: comment_auth },
      { name: "reply", value: reply },
    ]
  );
};
export const edit_comment = async (
  profile_auth,
  session_cookie,
  challenge_instance_auth,
  challenge_chapter_auth,
  comment_auth,
  comment
) => {
  return await getData(
    "challenge_comment_wall_comment",
    profile_auth,
    session_cookie,
    [
      { name: "challenge_instance_auth", value: challenge_instance_auth },
      { name: "challenge_chapter_auth", value: challenge_chapter_auth },
      { name: "comment_auth", value: comment_auth },
      { name: "comment", value: comment },
    ]
  );
};
export const like_comment = async (
  profile_auth,
  session_cookie,
  challenge_instance_auth,
  challenge_chapter_auth,
  comment_auth
) => {
  return await getData(
    "challenge_comment_wall_like",
    profile_auth,
    session_cookie,
    [
      { name: "challenge_instance_auth", value: challenge_instance_auth },
      { name: "challenge_chapter_auth", value: challenge_chapter_auth },
      { name: "comment_auth", value: comment_auth },
    ]
  );
};
export const get_challenge_featured = async (profile_auth, session_cookie) => {
  return await getData("challenges_featured", profile_auth, session_cookie);
};
export const get_photo_gallery = async (
  profile_auth,
  session_cookie,
  challenge_instance_auth
) => {
  return await getData("challenge_photos", profile_auth, session_cookie, [
    { name: "challenge_instance_auth", value: challenge_instance_auth },
  ]);
};
export const get_telehealth_status = async (profile_auth, session_cookie) => {
  return await getData(
    "telehealth_subscriber_status",
    profile_auth,
    session_cookie
  );
};
export const start_telehealth = async (profile_auth, session_cookie) => {
  return await getData(
    "telehealth_subscriber_create",
    profile_auth,
    session_cookie
  );
};
export const start_telehealth_session = async (
  profile_auth,
  session_cookie
) => {
  return await getData(
    "telehealth_start_session",
    profile_auth,
    session_cookie
  );
};
export const get_timeoff_summary = async (profile_auth, session_cookie) => {
  return await getData("timeoff_summary", profile_auth, session_cookie);
};
export const get_timeoff_settings = async (profile_auth, session_cookie) => {
  return await getData("timeoff_settings", profile_auth, session_cookie);
};
export const submit_timeoff_request = async (
  profile_auth,
  session_cookie,
  data
) => {
  return await getData("timeoff_request", profile_auth, session_cookie, data);
};
export const get_timeoff_requests = async (profile_auth, session_cookie) => {
  return await getData("timeoff_requests", profile_auth, session_cookie);
};
export const get_employment_summary = async (profile_auth, session_cookie) => {
  return await getData("profile_employment_get", profile_auth, session_cookie);
};
export const get_compensation_summary = async (
  profile_auth,
  session_cookie
) => {
  return await getData(
    "profile_compensation_get",
    profile_auth,
    session_cookie
  );
};
export const get_profile_assets_allowances = async (
  profile_auth,
  session_cookie
) => {
  return await getData(
    "profile_assets_allowances_get",
    profile_auth,
    session_cookie
  );
};
export const get_profile_qualification = async (
  profile_auth,
  session_cookie
) => {
  return await getData(
    "profile_qualifications_get",
    profile_auth,
    session_cookie
  );
};
export const get_events = async (profile_auth, session_cookie) => {
  return await getData("events", profile_auth, session_cookie);
};
export const get_event_calendar = async (profile_auth, session_cookie) => {
  return await getData("events_calendar", profile_auth, session_cookie);
};
export const get_event_subscription = async (profile_auth, session_cookie) => {
  return await getData("event_subscriptions", profile_auth, session_cookie);
};
export const get_documents = async (profile_auth, session_cookie) => {
  return await getData("documents", profile_auth, session_cookie);
};

const downloadDocument = async (
  action,
  profile_auth,
  session_cookie,
  additional_form_data = [],
  isDownloadable = true,
  fileName = "document.pdf"
) => {
  try {
    var formdata = new FormData();
    const authCreds = await getAuthCreds();
    formdata.append("api_key", API_KEY);
    formdata.append("action", action);
    formdata.append("profile_auth", profile_auth);
    formdata.append("username", authCreds?.username);
    formdata.append("password", authCreds?.password);
    const session_auth = await AsyncStorage.getItem("session_auth");
    if (session_auth) {
      formdata.append("session_auth", session_auth);
    }
    if (additional_form_data) {
      additional_form_data.forEach((item) => {
        formdata.append(item.name, item.value);
      });
    }
    const requestData = {
      method: "POST",
      maxBodyLength: Infinity,
      url: API_BASE_URL,
      data: formdata,

      headers: {
        Cookie: session_cookie,
        "Content-Type": "multipart/form-data",
      },
      responseType: "blob",

      withCredentials: true,
    };
    const response = await axios.request(requestData);
    if (response.status === 200) {
      const contentDisposition = response.headers["content-disposition"];
      const filenameMatch =
        contentDisposition && contentDisposition.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : fileName;

      const path = `${RNFS.DocumentDirectoryPath}/${filename}`;

      const base64String = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const result = reader?.result?.split(",")?.[1];
            await RNFS.writeFile(path, result, "base64");
            if (!isDownloadable) {
              resolve(result);
              return;
            }
            await Share.open({
              title: "Share PDF",
              url: `file://${path}`,
              type: `application/pdf`,
            });
            resolve(result);
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(response.data);
      });

      return base64String;
    } else {
      Alert.alert("Error", "Failed to download the file");
    }
    return "";
  } catch (error) {
    console.error("Error downloading the PDF:", error);
    // Alert.alert("Error", "An error occurred while downloading the file");
  }
};
export const download_document = async (
  profile_auth,
  session_cookie,
  document_auth,
  document
) => {
  return await downloadDocument("document", profile_auth, session_cookie, [
    {
      name: "document_auth",
      value: document_auth,
    },
    {
      name: "document",
      value: document,
    },
  ]);
};

export const submit_signature = async (
  profile_auth,
  session_cookie,
  document_auth,
  signature
) => {
  return await getData("document_signature", profile_auth, session_cookie, [
    {
      name: "document_auth",
      value: document_auth,
    },
    {
      name: "signature",
      value: signature,
    },
  ]);
};
export const download_document_signature = async (
  profile_auth,
  session_cookie,
  document_auth
) => {
  return await downloadDocument(
    "document_signature_get",
    profile_auth,
    session_cookie,
    [
      {
        name: "document_auth",
        value: document_auth,
      },
    ],
    false,
    "signature.png"
  );
};
export const submit_health_data = async (
  profile_auth,
  session_cookie,
  data
) => {
  return await getData("challenge_device_data", profile_auth, session_cookie, [
    {
      name: "data",
      value: data,
    },
  ]);
};
export const get_features = async (profile_auth, session_cookie, data) => {
  return await getData("features", profile_auth, session_cookie);
};
