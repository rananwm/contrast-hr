import {
  profile_account,
  profile_personal_information,
  profile_mailing_address,
  profile_home_address,
  profile_contact_information,
  profile_self_identification,
} from "./profile.js";

const profile_register = [
  {
    id: "password",
    label: "Password",
    prompt: "Your username will be set to the email address entered above.",
    type: "password-update",
    required: true,
    subtext:
      "Please note Passwords are case sensitive and can include special characters.",
  },
  {
    id: "declaration",
    label: "Declaration",
    type: "toggles",
    options: [
      {
        value: "agree_a",
        label: "The information I have provided is true and accurate;",
        required: true,
      },
      {
        value: "agree_b",
        label:
          "This information will be used by EXPORT to assist applicants in finding employment and identify training opportunities for its members; and",
        required: true,
      },
      {
        value: "agree_c",
        label:
          "This information may be shared with my community and companies interested in partnering with First Nations in employment and training initiatives.",
        required: true,
      },
    ],
  },
];

// put all profile fields into one array
export const registration_fields = [
  ...profile_personal_information,
  // ...profile_mailing_address,
  // ...profile_home_address,
  // ...profile_contact_information,
  ...profile_self_identification,
  ...profile_register,
];

export const registration_config = {
  sections: [
    {
      id: "registration",
      group: "registration",
      title: "Registration",
      fields: registration_fields,
    },
  ],
};
