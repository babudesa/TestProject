package gw.plugin.policy.impl

uses gw.plugin.policy.search.IPolicySearchAdapter
uses gw.api.util.Logger
uses com.guidewire.pl.system.bundle.BundleUtil
uses java.util.Date
uses gw.util.concurrent.LazyVar

class PolicySearchPluginDemoImpl implements IPolicySearchAdapter  {

  var _policyStore = LazyVar.make(\ -> new PolicySearchDemoDataStore())
  
  construct() {
  }

  override function retrievePolicyFromPolicySummary( policySummary : PolicySummary ) : PolicyRetrievalResultSet {
    var effDate = policySummary.LossDate != null ? policySummary.LossDate : policySummary.EffectiveDate
    var resultSet = getResult( policySummary.PolicyNumber, effDate )
    if(resultSet.Result != null) {
      filterRiskUnits( resultSet.Result, policySummary )
    }
    return resultSet
  }
  
  override function retrievePolicyFromPolicy( policy : Policy ) : PolicyRetrievalResultSet {
    var resultSet = getResult( policy.PolicyNumber, policy.EffectiveDate )
    if(resultSet.Result != null) {
      filterRiskUnits( resultSet.Result, policy )
    }
    return resultSet
  }
  
  override function searchPolicies( criteria : PolicySearchCriteria ) : PolicySearchResultSet {
    var resultSet = new PolicySearchResultSet()
    resultSet.ResultsCapped = Boolean.FALSE
    var policies = getDataStore().findPolicies( criteria )
    for( var policy in policies ) {
      var insured = policy.insured
      if(insured == null) {
        insured = policy.policyholder
      }
      var summary = convertPolicyToSummary(policy, insured)
      resultSet.addToSummaries( summary )
    }
    resultSet.UncappedResultCount = policies.length
    return resultSet
  }
  
  protected function getDataStore() : PolicySearchDemoDataStore {
    return _policyStore.get()
  }
  
  private function getResult( policyNumber : String, lossDate : Date ) : PolicyRetrievalResultSet {
    var policy : Policy
    var resultSet = new PolicyRetrievalResultSet()
    try {
      policy = getDataStore().getPolicy(policyNumber, lossDate)
    } catch (e : PolicyNotUniqueException) {
      Logger.logError( e.Message )
      resultSet.NotUnique = true
      return resultSet
    }
    resultSet.NotUnique = false
    if(policy == null) {
      return resultSet
    }
    var copiedPolicy = BundleUtil.copyBeanGraphToBundle( policy, resultSet.Bundle ) as Policy
    resultSet.Result = copiedPolicy
    return resultSet
  }

  private function filterRiskUnits( policy : Policy, policySummary : PolicySummary ) {
    var selectedCount = policySummary.Properties.countWhere(\ p -> p.Selected == true) +
                        policySummary.Vehicles.countWhere(\ v -> v.Selected == true)
    if(selectedCount == 0) {
      return
    }
    for( var locationRU in policy.Properties ) {
      var match = policySummary.Properties.firstWhere( \ summaryProperty -> 
                                                          summaryProperty.Selected and
                                                          summaryProperty.PropertyNumber == locationRU.RUNumber )
      if(match == null) {
        policy.removeFromRiskUnits(locationRU)
      }
    }
    
    for( var vehicleRU in policy.Vehicles ) {
      var match = policySummary.Vehicles.firstWhere( \ summaryVehicle -> 
                                                        summaryVehicle.Selected and
                                                        summaryVehicle.VehicleNumber == vehicleRU.RUNumber )
      if(match == null) {
        policy.removeFromRiskUnits(vehicleRU)
      }
    }
  }
  
  private function filterRiskUnits( retrievedPolicy : Policy, modelPolicy : Policy ) {
    for( var retrievalProperty in retrievedPolicy.Properties ) {
      var match = modelPolicy.Properties.firstWhere( \ modelProperty -> 
                                                        typeof modelProperty == typeof retrievalProperty and
                                                        modelProperty.RUNumber == retrievalProperty.RUNumber )
      if(match == null) {
        retrievedPolicy.removeFromRiskUnits(retrievalProperty)
      }
    }
    
    for( var retrievalVehicle in retrievedPolicy.Vehicles ) {
      var match = modelPolicy.Vehicles.firstWhere( \ modelVehicle -> modelVehicle.RUNumber == retrievalVehicle.RUNumber )
      if(match == null) {
        retrievedPolicy.removeFromRiskUnits(retrievalVehicle)
      }
    }
  }
  
  private function convertPolicyToSummary(policy : Policy, insured : Contact) : PolicySummary {
    var summary = new PolicySummary()

    if (insured != null) {
      summary.InsuredName = insured.DisplayName

      var primaryAddress = insured.PrimaryAddress
      if (primaryAddress != null) {
        summary.Address = primaryAddress.AddressLine1
        summary.City = primaryAddress.City
        summary.State = primaryAddress.State
        summary.PostalCode = primaryAddress.PostalCode
      }
    }

    summary.EffectiveDate = policy.EffectiveDate
    summary.ExpirationDate = policy.ExpirationDate
    summary.PolicyNumber = policy.PolicyNumber

    summary.PolicyType = policy.PolicyType
    summary.Status = policy.Status
    summary.ProducerCode = policy.ProducerCode

    for (var vehicleRU in policy.Vehicles) {
      var psVehicle = new PolicySummaryVehicle()
      var vehicle = vehicleRU.Vehicle
      psVehicle.Color = vehicle.Color
      psVehicle.LicensePlate = vehicle.LicensePlate
      psVehicle.Make = vehicle.Make
      psVehicle.Model = vehicle.Model
      psVehicle.VehicleNumber = vehicleRU.RUNumber
      psVehicle.Vin = vehicle.Vin
      psVehicle.Selected = false
      summary.addToVehicles(psVehicle)
    }

    for (var locationBasedRU in policy.Properties) {
      var location = locationBasedRU.PolicyLocation
      var building = locationBasedRU.Building
      var address = location.Address

      var psProperty = new PolicySummaryProperty()
      psProperty.PropertyNumber = locationBasedRU.RUNumber
      psProperty.Location = location.LocationNumber

      if (building != null) {
        psProperty.BuildingNumber = building.BuildingNumber
      }

      if (address != null) {
        psProperty.Address = address.AddressLine1
        psProperty.City = address.City
      }
      
      psProperty.Selected = false
      summary.addToProperties(psProperty)
    }
    return summary
  }
}
