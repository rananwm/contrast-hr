import { bands } from "./bands.js";

export const profile_account = [
  {
    id: "username",
    label: "Username",
    type: "display",
    required: true,
  },
  // {
  //       "id": "password",
  //       "label": "Password",
  //       "type": "password-update",
  //       "required": true,
  //       "footer": "Please note Passwords are case sensitive and can include special characters."
  // }
];

export const profile_personal_information = [
  {
    id: "name",
    label: "profile.general.first_name",
    type: "text",
    required: true,
  },
  {
    id: "surname",
    label: "profile.general.last_name",
    type: "text",
    required: true,
  },
  {
    id: "dob",
    label: "profile.general.dob",
    type: "datepicker",
    required: true,
  },
  {
    id: "gender",
    label: "profile.general.gender",
    type: "select",
    // "m", "f", "o"
    options: [
      { value: "male", label: "profile.general.male" },
      { value: "female", label: "profile.general.female" },
      // {"value": "o", "label": "Other"},
    ],
    required: true,
  },
  {
    id: "phone_work",
    label: "profile.general.phone_work",
    type: "text",
    required: true,
  },
  {
    id: "phone_mobile",
    label: "profile.general.phone_mobile",
    type: "text",
    required: false,
  },
  {
    id: "address",
    label: "profile.general.address",
    type: "text",
    required: false,
  },
  {
    id: "city",
    label: "profile.general.city",
    type: "text",
    required: false,
  },
  {
    id: "province",
    label: "profile.general.province",
    type: "text",
    required: false,
  },
  {
    id: "email_notifications",
    label: "profile.general.email_notification",
    type: "toggle",
    valueType: "number",
  },
];

export const profile_home_address = [
  {
    id: "home_same_toggle",
    label: "Home Address Same as Mailing",
    type: "toggles",
    options: [
      {
        value: "home_same",
        label:
          "If your home address is the same as your mailing address, check this box.",
      },
    ],
  },
  {
    id: "home_address",
    label: "Home Address",
    type: "text",
    required: true,
    hide_if: [{ home_same: "yes" }],
  },
  {
    id: "home_city",
    label: "Home City",
    type: "text",
    required: true,
    hide_if: [{ home_same: "yes" }],
  },
  {
    id: "home_province",
    label: "Home Province",
    type: "select",
    options: [
      { value: "Alberta", label: "Alberta" },
      { value: "British Columbia", label: "British Columbia" },
      { value: "Manitoba", label: "Manitoba" },
      { value: "New Brunswick", label: "New Brunswick" },
      {
        value: "Newfoundland and Labrador",
        label: "Newfoundland and Labrador",
      },
      { value: "Northwest Territories", label: "Northwest Territories" },
      { value: "Nova Scotia", label: "Nova Scotia" },
      { value: "Nunavut", label: "Nunavut" },
      { value: "Ontario", label: "Ontario" },
      { value: "Prince Edward Island", label: "Prince Edward Island" },
      { value: "Quebec", label: "Quebec" },
      { value: "Saskatchewan", label: "Saskatchewan" },
      { value: "Yukon", label: "Yukon" },
    ],
    hide_if: [{ home_same: "yes" }],
  },
  {
    id: "home_postal",
    label: "Home Postal Code",
    type: "text",
    required: true,
    hide_if: [{ home_same: "yes" }],
  },
];

export const profile_mailing_address = [
  {
    id: "mailing_address",
    label: "Mailing Address",
    type: "text",
    required: true,
  },
  {
    id: "mailing_city",
    label: "Mailing City",
    type: "text",
    required: true,
  },
  {
    id: "mailing_province",
    label: "Mailing Province",
    type: "select",
    options: [
      { value: "Alberta", label: "Alberta" },
      { value: "British Columbia", label: "British Columbia" },
      { value: "Manitoba", label: "Manitoba" },
      { value: "New Brunswick", label: "New Brunswick" },
      {
        value: "Newfoundland and Labrador",
        label: "Newfoundland and Labrador",
      },
      { value: "Northwest Territories", label: "Northwest Territories" },
      { value: "Nova Scotia", label: "Nova Scotia" },
      { value: "Nunavut", label: "Nunavut" },
      { value: "Ontario", label: "Ontario" },
      { value: "Prince Edward Island", label: "Prince Edward Island" },
      { value: "Quebec", label: "Quebec" },
      { value: "Saskatchewan", label: "Saskatchewan" },
      { value: "Yukon", label: "Yukon" },
    ],
    required: true,
  },
  {
    id: "mailing_postal",
    label: "Mailing Postal Code",
    type: "text",
    required: true,
  },
];

export const profile_self_identification = [
  {
    id: "first_nation_metis",
    label: "Self Identification",
    type: "select",
    options: [
      { value: "first_nation", label: "First Nation" },
      { value: "metis", label: "Metis" },
      { value: "inuit", label: "Inuit" },
      { value: "non_status_first_nation", label: "Non Status First Nation" },
      { value: "not_applicable", label: "Not Applicable / Did Not Disclose" },
    ],
    required: true,
  },
  {
    id: "band_id",
    label: "Band",
    type: "large-select",
    options: bands,
    show_if: [{ first_nation_metis: "first_nation" }],
  },
  {
    id: "fnm_status_number",
    label: "Status Number",
    type: "text",
    options: [],
    show_if: [{ first_nation_metis: "first_nation" }],
  },
  {
    id: "on_reserve",
    label: "Do you live on a reserve?",
    type: "radiogroup",
    options: [
      { value: "1", label: "Yes" },
      { value: "0", label: "No" },
    ],
    show_if: [{ first_nation_metis: "first_nation" }],
  },
  {
    id: "band_alt_id",
    label: "Enter an Altnernate Band",
    type: "large-select",
    options: bands,
    subtext:
      "If you live on a reserve that is different from the Band to which you have self identified",
    show_if: [{ on_reserve: "1" }],
  },
];

export const profile_bio_information = [
  {
    id: "personal_photo.profile_image",
    label: "profile.preferences.profile_image",
    type: "image-picker",
    required: true,
  },
  {
    id: "personal_photo.family_image",
    label: "profile.preferences.family_image",
    type: "image-picker",
    required: true,
  },
  {
    id: "preferences.personal.partner",
    label: "profile.preferences.partner",
    type: "text",
    required: false,
  },
  {
    id: "preferences.personal.children",
    label: "profile.preferences.children",
    type: "text",
    required: false,
  },
  {
    id: "preferences.personal.pets",
    label: "profile.preferences.pets",
    type: "text",
    required: false,
  },
  {
    id: "preferences.personal.college_degrees",
    label: "profile.preferences.college",
    type: "text",
    required: false,
  },
  {
    id: "preferences.personal.community_activities",
    label: "profile.preferences.community",
    type: "text",
    required: false,
  },
  {
    id: "preferences.favourites.beverage",
    label: "profile.preferences.beverages",
    type: "text",
    required: false,
  },
  {
    id: "preferences.favourites.food",
    label: "profile.preferences.food",
    type: "text",
    required: false,
  },
  {
    id: "preferences.favourites.dessert",
    label: "profile.preferences.dessert",
    type: "text",
    required: false,
  },
  {
    id: "preferences.favourites.lunch",
    label: "profile.preferences.lunch",
    type: "text",
    required: false,
  },
  {
    id: "preferences.favourites.dinner",
    label: "profile.preferences.dinner",
    type: "text",
    required: false,
  },
  {
    id: "preferences.favourites.wine",
    label: "profile.preferences.wine",
    type: "text",
    required: false,
  },
  {
    id: "preferences.favourites.music",
    label: "profile.preferences.music",
    type: "text",
    required: false,
  },
  {
    id: "preferences.favourites.movies",
    label: "profile.preferences.movies",
    type: "text",
    required: false,
  },
  {
    id: "preferences.favourites.tv",
    label: "profile.preferences.tv",
    type: "text",
    required: false,
  },
  {
    id: "preferences.favourites.books",
    label: "profile.preferences.books",
    type: "text",
    required: false,
  },
  {
    id: "preferences.favourites.sports_watch",
    label: "profile.preferences.sports_to_watch",
    type: "text",
    required: false,
  },
  {
    id: "preferences.favourites.sports_play",
    label: "profile.preferences.sports_to_play",
    type: "text",
    required: false,
  },
  {
    id: "preferences.favourites.sports_teams_pro",
    label: "profile.preferences.professional_teams",
    type: "text",
    required: false,
  },
  {
    id: "preferences.favourites.other_hobbies",
    label: "profile.preferences.other_hobbies",
    type: "text",
    required: false,
  },
  {
    id: "preferences.favourites.vacation_activities",
    label: "profile.preferences.vacation_activities",
    type: "text",
    required: false,
  },
  {
    id: "preferences.favourites.local_attractions",
    label: "profile.preferences.local_attractions",
    type: "text",
    required: false,
  },
  {
    id: "preferences.personal.allergies",
    label: "profile.preferences.allergies",
    type: "text",
    required: false,
  },
];

//export profile config
export const profile_config = {
  sections: [
    // {
    //       "id": "account",
    //       "group": "account",
    //       "title": "Account Information",
    //       "fields": profile_account
    // },
    {
      id: "personal",
      group: "personal",
      title: "profile.general.general",
      fields: profile_personal_information,
    },
    {
      id: "language_preference",
      group: "language",
      title: "profile.language_preference",
      fields: [
        {
          id: "localization",
          label: "profile.language",
          type: "select",
          options: [
            { value: "en", label: "English" },
            { value: "sp", label: "Spanish" },
          ],
          required: true,
        },
      ],
    },
    {
      id: "contact_information",
      group: "contact",
      title: "profile.bio",
      fields: profile_bio_information,
    },
    // {
    //       "id": "contact_mailing_address",
    //       "group": "contact",
    //       "title": "Mailing Address",
    //       "fields": profile_mailing_address
    // },
    // {
    //       "id": "contact_home_address",
    //       "group": "contact",
    //       "title": "Home Address",
    //       "fields": profile_home_address
    // },
    // {
    //       "id": "selfidentification",
    //       "group": "selfidentification",
    //       "title": "Workforce Self Identification",
    //       "fields": profile_self_identification
    // }
  ],
};
