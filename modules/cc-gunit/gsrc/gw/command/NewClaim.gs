package gw.command
uses gw.api.databuilder.ClaimBuilder
uses java.util.Date
uses gw.api.databuilder.VehicleIncidentBuilder
uses gw.api.databuilder.VehicleBuilder
uses gw.api.databuilder.CatastropheBuilder
uses java.lang.Math
uses gw.api.databuilder.AddressBuilder
uses gw.api.databuilder.CatastrophePerilBuilder
uses gw.api.database.Query
uses gw.api.databuilder.LargeLossThresholdBuilder
uses gw.api.util.DateUtil
uses java.math.BigDecimal
uses gw.api.databuilder.InjuryIncidentBuilder
uses gw.api.databuilder.ReserveBuilder
uses gw.api.databuilder.CheckBuilder

class NewClaim extends BaseCommand {

  function withDefault() {
    var claim = ClaimBuilder
                     .uiReadyAuto()
                     .withNonConflictingClaimNumber()
                     .open()
                     .assigned()
                     .withAssignedGroupFoundByName("Auto1 - TeamA")
                     .withAssignedUserFoundByName("aapplegate")
                     .withDescription( (Argument == null || Argument.length() == 0) ? "description" : Argument )
                     .withSegment("auto_low")
                     .create(Bundle)
    Bundle.commit()
    pcf.ClaimSummary.go( claim )  
  }

  function atAbilityToPay() {
    var claim = ClaimBuilder
                     .uiReadyAuto()
                     .withNonConflictingClaimNumber()
                     .open()
                     .assigned()
                     .withAssignedGroupFoundByName("Auto1 - TeamA")
                     .withAssignedUserFoundByName("aapplegate")
                     .withDescription( (Argument == null || Argument.length() == 0) ? "description" : Argument )
                     .atAbilityToPay()
                     .withSegment("auto_low")
                     .create(Bundle)
    Bundle.commit()
    pcf.ClaimSummary.go( claim )
  }

  function dayOld() {
    var claim = ClaimBuilder
                     .uiReadyAuto()
                     .withNonConflictingClaimNumber()
                     .open()
                     .assigned()
                     .withAssignedGroupFoundByName("Auto1 - TeamA")
                     .withAssignedUserFoundByName("aapplegate")
                     .withDescription( (Argument == null || Argument.length() == 0) ? "description" : Argument )
                     .atAbilityToPay()
                     .withReportedDate( "yesterday" as Date )
                     .withSegment("auto_low")                     
                     .create(Bundle)
    Bundle.commit()
    pcf.ClaimSummary.go( claim )
  }

  function homeowners() {
    var claim = ClaimBuilder
                     .uiReadyHomeowners()
                     //.withPolicyFoundByNumber( "53-235675" ) 
                     .withNonConflictingClaimNumber()
                     .open()
                     .assigned()
                     .withAssignedGroupFoundByName("Midwest Property A")
                     .withAssignedUserFoundByName("wdufraine")
                     .withDescription( (Argument == null || Argument.length() == 0) ? "description" : Argument )
                     .withSegment("prop_low")
                     .atAbilityToPay()
                     .create(Bundle)
    Bundle.commit()
    pcf.ClaimSummary.go( claim )
  }

  function wc() {
    var claim = ClaimBuilder
                     .uiReadyWorkersCompWithExposures()
                     .withNonConflictingClaimNumber()
                     .open()
                     .assigned()
                     .withAssignedGroupFoundByName("Comp - TeamA")
                     .withAssignedUserFoundByName("gickes")
                     .withDescription( (Argument == null || Argument.length() == 0) ? "description" : Argument )
                     .withSegment("wc_med_only")
                     .create(Bundle)
    Bundle.commit()
    pcf.ClaimSummary.go( claim )
  }
  
  function travel() {
    var claim = ClaimBuilder
                     .uiReadyTravelWithTripRU()
                     .withNonConflictingClaimNumber()
                     .open()
                     .assigned()
                     .withAssignedGroupFoundByName("Western Travel Group")
                     .withAssignedUserFoundByName("eaustin")
                     .withDescription( (Argument == null || Argument.length() == 0) ? "description" : Argument )
                     .withSegment("travel_low")
                     .create(Bundle)
    Bundle.commit()
    pcf.ClaimSummary.go( claim )
  }  

  function autoWithVehicleIncident() {
    var claim = ClaimBuilder
                     .uiReadyAuto()
                     .withNonConflictingClaimNumber()
                     .open()
                     .assigned()
                     .withAssignedGroupFoundByName("Auto1 - TeamA")
                     .withAssignedUserFoundByName("aapplegate")
                     .withDescription( (Argument == null || Argument.length() == 0) ? "description" : Argument )
                     .withIncident( VehicleIncidentBuilder.uiReadyVehicleIncident().withVehicle(new VehicleBuilder().uiReadyVehicle()))
                     .withSegment("auto_low")
                     .create(Bundle)
    Bundle.commit()
    pcf.ClaimSummary.go( claim )  
  }

  function catClaims() {
    var catastrophe = Query.make(entity.Catastrophe).compare("Name", Equals, "CA Otto Water Catastrophe").select().AtMostOneRow
    if (catastrophe == null) {
        var  cat = CatastropheBuilder.uiReadyCatastrophe()
                    .withName("CA Otto Water Catastrophe")
                    .withNumber("CA Otto Water Catastrophe")
                    .withDescription("CA Otto Water Catastrophe")
                    .withValidFrom(CurrentDate.addDays(-30))
                    .withValidTo(CurrentDate.addDays(30))
                    .withPeril(CatastrophePerilBuilder.uiReadyCatastrophePeril()
                            .withLossCause(LossCause.TC_WATERDAMAGE)
                            .withLossType(LossType.TC_PR))
                    .withPeril(CatastrophePerilBuilder.uiReadyCatastrophePeril()
                            .withLossCause(LossCause.TC_GLASSBREAKAGE)
                            .withLossType(LossType.TC_AUTO))
                    .withZone("CA", "state", "US")                
          .create() 
    
         var addresses = {                      
             {"870 MARKET ST STE 215","SAN FRANCISCO","CA","94102-3002","exact","233445409","37.7857","-122.4059"},
             {"22 BATTERY ST STE 333","SAN FRANCISCO","CA","94111","exact","233453586","37.7916","-122.3996"},    
             {"760 MARKET STREET, STE 939","SAN FRANCISCO","CA","94102-2310","exact","233445409","37.7866","-122.4049"}, 
             {"351 VALENCIA ST","SAN FRANCISCO","CA","94103","exact","233445422","37.7673","-122.4221"},
             {"ONE EMBARCADERO CTR, 16TH FL","SAN FRANCISCO","CA","94111-3765","postalcode","233453586","37.7946","-122.4003"},
             {"SUITE 301 4306 GEARY BLVD.","SAN FRANCISCO","CA","94118","exact","233445415","37.7810","-122.4655"},
             {"450 SUTTER SUITE 1038","SAN FRANCISCO","CA","94108","exact","233453586","37.7893","-122.4078"},
             {"1580 VALENCIA ST STE 605","SAN FRANCISCO","CA","94110","exact","233445423","37.7483","-122.4203"},
             {"2100 WEBSTER ST STE. #423","SAN FRANCISCO","CA","94115","exact","233445414","37.7900","-122.4324"},
             {"246 FIRST STREET, STE.101","SAN FRANCISCO","CA","94105-2637","postalcode","233453586","37.7881","-122.3954"},   
             {"2233 IRVING ST","SAN FRANCISCO","CA","94122-1618","exact","233445430","37.7634","-122.4818"},  
             {"2619 1/2 SUTTER ST","SAN FRANCISCO","CA","94115-2924","exact","233445414","37.7848","-122.4435"},
             {"2204 UNION ST","SAN FRANCISCO","CA","94123","exact","233453593","37.7971","-122.4356"}, 
             {"545 SANSOME STREET","SAN FRANCISCO","CA","94111-2908","exact","233453586","37.7954","-122.4015"},    
             {"909 HYDE ST, SUITE 234","SAN FRANCISCO","CA","94109","exact","233445409","37.7892","-122.4170"},
             {"2645 OCEAN AVE","SAN FRANCISCO","CA","94132-1633","exact","233445425","37.7320","-122.4739"},
             {"1580 VALENCIA, STE 201","SAN FRANCISCO","CA","94110","exact","233445423","37.7483","-122.4203"},    
             {"156 WEST PORTAL AVE","SAN FRANCISCO","CA","94127-1306","exact","233445425","37.7392","-122.4676"},
             {"4736 MISSION ST.","SAN FRANCISCO","CA","94112","exact","233445419","37.7225","-122.4365"}, 
             {"323 6TH AVE","SAN FRANCISCO","CA","94118-2313","exact","233445415","37.7826","-122.4644"} }
    
          for (address in addresses) {
              var lat = address[6] as double
              var long = address[7] as double 
              lat = Math.round(lat*100000)/100000.
              long = Math.round(long*100000)/100000.
    
              ClaimBuilder.uiReadyHomeowners()
              .withNonConflictingClaimNumber()
              .withCatastrophe(cat)
              .withLossCause(LossCause.TC_WATERDAMAGE)
              .withLossType(LossType.TC_PR)
              .withLossLocation(AddressBuilder.uiReadyUSA()
                                              .withAddressLine1(address[0])
                                              .withCity(address[1])
                                              .withState(address[2])
                                              .withPostalCode(address[3])
                                              .withLatitude(lat)
                                              .withLongitude(long)
                                              .withGeocodeStatus(address[4]) 
              ).createAndCommit()
          }
       }
   }
   
   function withClaimIndicators() : String {
    var newClaim : Claim
    var yellowClaim : Claim
    var redClaim : Claim
    
    gw.transaction.Transaction.runWithNewBundle(\ newBundle -> {
      var lossDate = DateUtil.currentDate().addBusinessDays(-5)   
 
      new LargeLossThresholdBuilder()
            .withPolicyType( PolicyType.TC_AUTO_PER )
            .withNotificationType( LargeLossNotificationType.TC_CC )
            .withThresholdValue( new BigDecimal("20000") )
            .create(newBundle)      
      newClaim = ClaimBuilder.uiReadyAuto()
            .coverageInQuestion()
            .withNonConflictingClaimNumber()
            .withIncident(InjuryIncidentBuilder.uiReadyInjuryIncident().withSeverity(SeverityType.TC_FATAL))
            .withFlag(FlaggedType.TC_ISFLAGGED)
            .withLitigationStatus(LitigationStatus.TC_LITIGATED)
            .withLossDate(lossDate)
            .withReportedDate(lossDate)        
            .create(newBundle)

      var reserve = ReserveBuilder.uiReadyClaimLevelReserve(newClaim, new BigDecimal(100000)).create(newBundle)
      CheckBuilder.uiReadySinglePaymentCheckWithAutoAdjustmentForBusinessDay(reserve.ReserveLine, 10000).create(newBundle)  
          
      newClaim.SIUStatus = SIUStatus.TC_UNDER_INVESTIGATION 
      newClaim.setCreateTime(lossDate)
  
      newBundle.commit()  
      print("ClaimNumber = " + newClaim.ClaimNumber)  
    }, "su")    
    pcf.ClaimSummary.go(newClaim)
    
    //create a claim with yellow open days progress bar
    gw.transaction.Transaction.runWithNewBundle(\ newBundle -> {
      var lossDate = DateUtil.currentDate().addBusinessDays(-10)   
 
      new LargeLossThresholdBuilder()
            .withPolicyType( PolicyType.TC_AUTO_PER )
            .withNotificationType( LargeLossNotificationType.TC_CC )
            .create(newBundle)      
      yellowClaim = ClaimBuilder.uiReadyAuto()
            .withNonConflictingClaimNumber()
            .withLossDate(lossDate)
            .withReportedDate(lossDate)        
            .create(newBundle)
      newClaim.setCreateTime(lossDate)  
      newBundle.commit()  
      print("Yellow ClaimNumber = " + yellowClaim.ClaimNumber)  
    }, "su")
    
    //create a claim with red open days progress bar
    gw.transaction.Transaction.runWithNewBundle(\ newBundle -> {
      var lossDate = DateUtil.currentDate().addBusinessDays(-45)   
 
      new LargeLossThresholdBuilder()
            .withPolicyType( PolicyType.TC_AUTO_PER )
            .withNotificationType( LargeLossNotificationType.TC_CC )
            .create(newBundle)      
      redClaim = ClaimBuilder.uiReadyAuto()
            .withNonConflictingClaimNumber()
            .withLossDate(lossDate)
            .withReportedDate(lossDate)        
            .create(newBundle)
      newClaim.setCreateTime(lossDate)
      newBundle.commit()  
      print("Red ClaimNumber = " + redClaim.ClaimNumber)
    }, "su")
    
    return "Yellow ClaimNumber = " + yellowClaim.ClaimNumber + "; Red ClaimNumber = " + redClaim.ClaimNumber
        
  }// end withClaimIndicators

}
