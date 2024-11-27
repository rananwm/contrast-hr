import { MText } from "../components/MComponents";
import { ROUTES } from "../constants";
import { PERKS_ROUTES } from "../constants/perks";

export const perks_config = [
  {
    id: 1,
    image: require("./../assets/perk_images/benefit_telehealth.png"),
    name: "perks.virtual_primary_care.title",
    description: "perks.virtual_primary_care.description",
    route: PERKS_ROUTES.VIRTUAL_PRIMARY_CARE,
    cta: "perks.virtual_primary_care.label",
  },
  {
    id: 2,
    image: require("./../assets/perk_images/benefit_physical-wellness.png"),
    name: "perks.employee_wellness.title",
    description: "perks.employee_wellness.description",
    route: ROUTES.CHALLENGES_STACK,
    cta: "perks.employee_wellness.label",
  },
  {
    id: 3,
    image: require("./../assets/perk_images/benefit_prescription-savings.png"),
    name: "perks.prescription_savings.title",
    description: "perks.prescription_savings.description",
    cta: "perks.prescription_savings.label",
    route: PERKS_ROUTES.PERCEPTION_SAVINGS,
  },
  {
    id: 4,
    image: require("./../assets/perk_images/benefit_home-auto-insurance.jpg"),
    name: "perks.auto_home_insurance.title",
    description: "perks.auto_home_insurance.description",
    cta: "perks.auto_home_insurance.label",
    route: PERKS_ROUTES.AUTO_HOME_INSURANCE,
  },
  {
    id: 5,
    image: require("./../assets/perk_images/benefit_identity-theft.png"),
    name: "perks.id_theft_resolution.title",
    description: "perks.id_theft_resolution.description",
    cta: "perks.id_theft_resolution.label",
    route: PERKS_ROUTES.ID_THEFT,
  },
  // {
  //   id: 6,
  //   image: require("./../assets/perk_images/benefit_interest-free-credit.png"),
  //   name: "perks.interest_free_credit_line.title",
  //   description: "perks.interest_free_credit_line.description",
  //   cta: "perks.interest_free_credit_line.label",
  //   route: PERKS_ROUTES.INTEREST_FREE_CREDIT_LINE,
  // },
  {
    id: 7,
    image: require("./../assets/perk_images/benefit_financial-literacy.png"),
    name: "perks.financial_literacy_program.title",
    description: "perks.financial_literacy_program.description",
    cta: "perks.financial_literacy_program.label",
    route: PERKS_ROUTES.FINANCIAL_LITERACY,
  },
  {
    id: 8,
    image: require("../assets/perk_images/volunteer/koru.jpg"),
    name: "perks.voluntary_benefits.title",
    description: "perks.voluntary_benefits.description",
    cta: "perks.financial_literacy_program.label",
    route: PERKS_ROUTES.VOLUNTARY_BENEFITS,
  },
  {
    id: 9,
    image: require("../assets/perk_images/discount/benefit_discounts.png"),
    route: PERKS_ROUTES.BENEFITS_DISCOUNTS,
    name: "perks.benefits_discounts.title",
    description: "perks.benefits_discounts.description",
    cta: "perks.financial_literacy_program.label",
  },
];
