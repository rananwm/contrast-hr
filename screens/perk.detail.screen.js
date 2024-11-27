import React from "react";
import { StyleSheet } from "react-native";
import { PERKS_ROUTES } from "../constants/perks";
import VirtualPrimaryCare from "../components/perks/VirtualPrimaryCare";
import EmployeeWellness from "../components/perks/EmployeeWellness";
import PerceptionSaving from "../components/perks/PerceptionSaving";
import AutoHomeInsurance from "../components/perks/AutoHomeInsurance";
import IdTheft from "../components/perks/IdTheft";
import InterestFreeCreditLine from "../components/perks/InterestFreeCreditLine";
import FinancialLiteracy from "../components/perks/FinancialLiteracy";
import { MText } from "../components/MComponents";
import VoluntaryBenefits from "../components/perks/VoluntaryBenefits";
import BenefitsDiscount from "../components/perks/BenefitsDiscount";

const PerkDetail = ({ navigation, route }) => {
  switch (route?.params?.name) {
    case PERKS_ROUTES.VIRTUAL_PRIMARY_CARE:
      return <VirtualPrimaryCare navigation={navigation} />;
    case PERKS_ROUTES.EMPLOYEE_WELLNESS:
      return <EmployeeWellness navigation={navigation} />;
    case PERKS_ROUTES.PERCEPTION_SAVINGS:
      return <PerceptionSaving navigation={navigation} />;
    case PERKS_ROUTES.AUTO_HOME_INSURANCE:
      return <AutoHomeInsurance navigation={navigation} />;
    case PERKS_ROUTES.ID_THEFT:
      return <IdTheft navigation={navigation} />;
    case PERKS_ROUTES.INTEREST_FREE_CREDIT_LINE:
      return <InterestFreeCreditLine navigation={navigation} />;
    case PERKS_ROUTES.FINANCIAL_LITERACY:
      return <FinancialLiteracy navigation={navigation} />;
    case PERKS_ROUTES.VOLUNTARY_BENEFITS:
      return <VoluntaryBenefits navigation={navigation} />;
    case PERKS_ROUTES.BENEFITS_DISCOUNTS:
      return <BenefitsDiscount navigation={navigation} />;
    default:
      return (
        <MText
          style={{
            fontSize: 24,
            fontWeight: "500",
          }}
        >
          {route?.params?.name}
        </MText>
      );
  }
};

const styles = StyleSheet.create({});

export default PerkDetail;
