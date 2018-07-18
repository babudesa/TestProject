package util.gaic.EDW;

class EDWPolicyFunctions {
  
  private construct() {
  }

  static function getInstance() : EDWPolicyFunctions {
    return new EDWPolicyFunctions();
  }
  
  protected function policyFieldChanged(policy : Policy) : boolean {
    if (policy.Verified && util.gaic.CommonFunctions.fieldFromListChanged(policy, new String[] { "PolicyEBIExt", "PolicyEBIInstExt" })) {
      return true;
    }
    if (!policy.Verified && util.gaic.CommonFunctions.fieldFromListChanged(policy, new String[] { "PolicyNumber", "ex_PolicyVersion", "PolicySuffix", "PolicyType", "UnverifiedRsnExt",
       "ProducerCode", "EffectiveDate", "ExpirationDate", "CancellationDate", "IssuingCompanyExt", "NAICSCodeExt", "Account", "PolicyTypeCvgFamilyExt", "ObligeeBondNumExt"})) {
      return true;
    }
    
    // policy property changes including property coverage changes
    for (p in policy.Properties) {
      if (policyPropertyFieldChanged(p)) {
        return true;
      }
    }
    
    // policy risk unit deletes
    if (policy.getRemovedArrayElements( "RiskUnits" ) != null and policy.getRemovedArrayElements( "RiskUnits" ).length > 0) {
      return true;
    }
    
    for (v in policy.Vehicles) {
      if (v.Vehicle.getRemovedArrayElements( "EnginesExt" ) != null and v.Vehicle.getRemovedArrayElements( "EnginesExt" ).length > 0) {
        return true;
      }
      if (v.Vehicle.getAddedArrayElements( "EnginesExt" ) != null and v.Vehicle.getAddedArrayElements( "EnginesExt" ).length > 0) {
        return true;
      }
      if (v.New or policyVehicleFieldChanged(v)) {
        return true;
      }
    }
    
    return false;
  }

  protected function policyPropertyFieldChanged(policyProperty : LocationBasedRU) : boolean
  {
    if (policyProperty typeis PropertyRU && util.gaic.CommonFunctions.fieldFromListChanged(policyProperty, new String[] { "PropertyNumberExt" })) {
      return true;
    }
    if (util.gaic.CommonFunctions.fieldFromListChanged(policyProperty.Property, new String[] { "LocationNumber","ex_Breed",
    "ex_Sex","ex_AnimalUse","ex_DateofBirth","ex_BarnName","AnimalValueExt","VetBillsExt","BoardingExt","Notes",
    "AnimalUse2Ext","ex_AlternateTrainer" })) {
      return true;
    }
    if (policyProperty typeis JobsiteRUExt && util.gaic.CommonFunctions.fieldFromListChanged(policyProperty, new String[] { "JobsiteNumberExt", "JobsiteDescExt" })) {
      return true;
    }
    if (util.gaic.CommonFunctions.addressFieldChanged(policyProperty.Property.Address)) {
      return true;
    }

    return false;
  }

  protected function policyVehicleFieldChanged(policyVehicle : VehicleRU) : boolean {
    if (util.gaic.CommonFunctions.fieldFromListChanged(policyVehicle, new String[] { "RUNumber" })) {
      return true;
    }
    

    if (util.gaic.CommonFunctions.fieldFromListChanged(policyVehicle.Vehicle, new String[] {  "BoatFuelTankMaterialTypeExt",
    "BoatHullDesignTypeExt","BoatHullMaterialTypeExt","BoatHullMaxSpeedExt","BoatHullTypeExt","BoatType","ClassCodeDescExt",
    "ClassCodeExt","Color","DesignExplanationExt","FuelTankExt","HullDesignExt","HullTypeExplanationExt","HullTypeExt",
    "InsuranceLimitExt","LicensePlate","Loan","LoanMonthlyPayment","LoanMonthsRemaining","LoanPayoffAmount","Make",
    "MaxSpeedExt","Model","OffRoadStyle","PhysicalDamageExt","PhysicalDamageLimitExt","PurchaseDateExt","RegistrationNoExt",
    "SerialNumber","VehicleCurrentValueExt","VehicleEffDateExt","VehicleExpDateExt","VehicleHorsePowerExt","VehicleLengthExt",
    "Manufacturer","VehicleMaterialTypeExt","VehicleNameExt","VehicleNewValueExt","VehiclePowerTypeExt","State","Style",
    "WaterNavigatedExt","WatersNavigatedExt","Year","EnginesExt", "MechanicalLiftExt" })) {
      return true;
    }
    if (policyVehicle.Vehicle != null) {
      // check for policy vehicle engine changes
      for (e in policyVehicle.Vehicle.EnginesExt) {
        if (policyEngineFieldChanged(e)) {
          return true;
        }
      }
      // check for policy vehicle trailer changes
      if (policyTrailerFieldChanged(policyVehicle.Vehicle.TrailerExt)) {
        return true;
      }
    }

    return false;
  }

  public function policyEngineFieldChanged(engine : EngineExt) : boolean {
    if (util.gaic.CommonFunctions.fieldFromListChanged(engine, new String[] {  "InsuranceLimit","Manufacturer",
    "Model","PhysicalDamageIndicator","PhysicalDamageLimit","SerialNo","Year","EngineNumber","EnginePowerCatTypeExt",
    "HorsePower" })) {
      return true;
    }

    return false;
  }

  public function policyTrailerFieldChanged(trailer : TrailerExt) : boolean {
    if (util.gaic.CommonFunctions.fieldFromListChanged(trailer, new String[] {  "InsuranceLimit","Manufacturer",
    "Model","PhysicalDamageIndicator","PhysicalDamageLimit","SerialNo","Year","Length" })) {
      return true;
    }

    return false;
  }
}