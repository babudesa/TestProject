package gw.command

uses gw.api.databuilder.ClaimBuilder
uses gw.api.databuilder.PropertyWaterDamageBuilder
uses gw.api.databuilder.ExposureBuilder
uses gw.api.databuilder.ActivityBuilder
uses java.util.Date
uses gw.api.databuilder.ReserveLineBuilder
uses gw.api.databuilder.ReserveBuilder
uses gw.api.databuilder.CheckBuilder
uses gw.api.databuilder.PaymentBuilder
uses gw.api.databuilder.CheckSetBuilder
uses gw.transaction.Bundle
uses gw.api.databuilder.CatastropheBuilder
uses gw.api.databuilder.CatastrophePerilBuilder
uses gw.api.databuilder.PersonBuilder
uses gw.api.database.Query
uses gw.api.databuilder.RecoveryBuilder
uses gw.api.databuilder.RecoveryReserveBuilder
uses gw.api.databuilder.RecoveryReserveSetBuilder
uses gw.api.util.Logger
uses gw.api.databuilder.PolicyBuilder
uses gw.api.databuilder.RecoverySetBuilder
uses gw.api.databuilder.ReserveSetBuilder
uses gw.api.financials.CurrencyAmount
uses gw.api.system.PLConfigParameters

class CreateReportData extends BaseCommand  {

  static final var DEFAULT_DESCRIPTION = "Data for Report Testing"
  var _payee : Person

  /**
   * Quick Jump command:  Run CreateReportData withDefault
   * 
   * Run CreateReportData with no argument will execute withDefault()
   * This will create data for the Claim Health Metric, Claims, Dashboard, Financials, and SUI reports
   */
  function withDefault() {
    try{
      // Create payee to share across claims - used in SUI Match Payee report
      _payee = createABLinkedPerson()
      
      createClaimHealthMetricsData()
      createOpenClaims()
      createReopenedClaims()
      createClaimsWithCatastrophe()
      createMulticurrencyClaims()
      createCheckWithUserAddress()

      Logger.logInfo("Create Report Data Completed")       
      
    }  catch ( e ) {
      e.printStackTrace()
      throw e
    }    
  }
    
  /**
   * Quick Jump command:  Run CreateReportData fromDefaultSampleData
   * 
   * This assumes that the OOTB sample data has already been imported.  This will set up the
   * report admin, add catastrophes, add claim and exposure metric admin data, and call withDefault
   * to create report data.
   */
  function fromDefaultSampleData() {
    setUpReportAdmin()
    setUpCatastropheAdmin()

    var claimMetricLimit = new gw.command.ClaimMetricLimit()
    claimMetricLimit.TopLocation = TopLocation
    claimMetricLimit.Argument = ""
    claimMetricLimit.withDefault()

    var expMetricLimit = new gw.command.ExpMetricLimit()
    expMetricLimit.TopLocation = TopLocation
    expMetricLimit.Argument = ""
    expMetricLimit.withDefault()

    withDefault()
  }

  /**
   * Quick Jump command:  Run CreateReportData fromScratch
   * 
   * You'll want to use this command with an empty database.  This will import the OOTB sample data and 
   * call fromDefaultSampleData to do the rest of the setup for report demos/testing.
   */
  function fromScratch() {
     var sampleData = new Import()
     sampleData.TopLocation = TopLocation
     sampleData.Argument = ""
     sampleData.fromDemoSampleData()
     fromDefaultSampleData()
  }
  
  /**
   * Quick Jump command:  Run CreateReportData setUpReportAdmin
   * 
   * setUpReportAdmin will get the reports from StyleReport and assign specific reports to the
   * different report permission sets
   */
  function setUpReportAdmin() {
    // Sync Reports and add reports to OOTB Permission Sets
    if(gw.api.sree.SREEUtil.isRunning()) {
      gw.api.sree.ReportRepository.sync(gw.api.sree.StyleReportAPI.getReplets(User.util.CurrentUser))
      setUpReportManagerPermissionSet()
      setUpViewAggClaimMetricsPermissionSet()
      setUpViewSupMetricAlertsPermissionSet()
      setUpViewOwnMetricAlertsPermissionSet()
    }
  }

  /**
   * Quick Jump command:  Run CreateReportData setUpCatastropheAdmin
   * 
   * setUpCatastropheAdmin will add two new catastrophes that will have perils for 
   * auto and property
   */
  function setUpCatastropheAdmin() {
    var catastrophe = Query.make(entity.Catastrophe).compare("Name", Equals, "Report Water Catastrophe").select().AtMostOneRow

    if(catastrophe == null) {
      gw.transaction.Transaction.runWithNewBundle( \ adminBundle -> {
        
        // Auto does not have Loss Cause = water damage.  Using Glass breakage for now.
        CatastropheBuilder.uiReadyCatastrophe()
                .withName("Report Water Catastrophe")
                .withDescription("Report Demo Data")
                .withValidFrom(CurrentDate.addDays(-30))
                .withValidTo(CurrentDate.addDays(30))
                .withPeril(CatastrophePerilBuilder.uiReadyCatastrophePeril()
                        .withLossCause(LossCause.TC_WATERDAMAGE)
                        .withLossType(LossType.TC_PR))
                .withPeril(CatastrophePerilBuilder.uiReadyCatastrophePeril()
                        .withLossCause(LossCause.TC_GLASSBREAKAGE)
                        .withLossType(LossType.TC_AUTO))
                .withZone("CA", "state", "US")
                .create(adminBundle)

        CatastropheBuilder.uiReadyCatastrophe()
                .withName("Report Fire Catastrophe")
                .withDescription("Report Demo Data")
                .withValidFrom(CurrentDate.addDays(-30))
                .withValidTo(CurrentDate.addDays(30))
                .withPeril(CatastrophePerilBuilder.uiReadyCatastrophePeril()
                        .withLossCause(LossCause.TC_FIRE)
                        .withLossType(LossType.TC_PR))
                .withPeril(CatastrophePerilBuilder.uiReadyCatastrophePeril()
                        .withLossCause(LossCause.TC_FIRE)
                        .withLossType(LossType.TC_AUTO))
                .withZone("CA", "state", "US")
                .create(adminBundle)
      })
    }
  }    
  
  /**
   * Quick Jump command:  Run CreateReportData createClaimHealthMetricsData
   * 
   * Claim Health Metrics reports queries CLOSED CLAIMS
   * There should be a total of 22 claims that show up in the reports.  18 closed claims created
   * by this function and another 4 generated by createClaimsWithCatastrophe().  Make sure to
   * update this total Claims count if you add more claims.
   */
  function createClaimHealthMetricsData() {
    
    // Green Days Open - elee groups:  LossDate = CloseDate
    closeClaim(createOpenPAClaim(CurrentDate, "aapplegate", "Auto1 - TeamA", Currency.TC_USD, Currency.TC_USD), CurrentDate)
    closeClaim(createOpenPAClaim(CurrentDate, "bbaker", "Auto1 - TeamB", Currency.TC_USD, Currency.TC_USD), CurrentDate)
    closeClaim(createOpenTravelClaim(CurrentDate), CurrentDate)
    closeClaim(createOpenWaterHOClaim(CurrentDate, "jyancy", "Property - TeamA", Currency.TC_USD, Currency.TC_USD), CurrentDate)
    closeClaim(createOpenFireHOClaim(CurrentDate, "sdunn", "Property - TeamB", Currency.TC_USD, Currency.TC_USD), CurrentDate)
    closeClaim(createOpenWCClaim(CurrentDate, "gickes", "Comp - TeamA", Currency.TC_USD, Currency.TC_USD), CurrentDate)

    // Yellow Days Open - elee groups:  LossDate varies and CloseDate = CurrentDate
    closeClaim(createOpenPAClaim(CurrentDate.addBusinessDays(-12), "aapplegate", "Auto1 - TeamA", Currency.TC_USD, Currency.TC_USD), CurrentDate)
    closeClaim(createOpenPAClaim(CurrentDate.addBusinessDays(-12), "bbaker", "Auto1 - TeamB", Currency.TC_USD, Currency.TC_USD), CurrentDate)
    closeClaim(createOpenTravelClaim(CurrentDate.addBusinessDays(-16)), CurrentDate)
    closeClaim(createOpenWaterHOClaim(CurrentDate.addBusinessDays(-13), "jyancy", "Property - TeamA", Currency.TC_USD, Currency.TC_USD), CurrentDate)
    closeClaim(createOpenFireHOClaim(CurrentDate.addBusinessDays(-14), "sdunn", "Property - TeamB", Currency.TC_USD, Currency.TC_USD), CurrentDate)
    closeClaim(createOpenWCClaim(CurrentDate.addBusinessDays(-15), "gickes", "Comp - TeamA", Currency.TC_USD, Currency.TC_USD), CurrentDate)

    // Red Days Open - elee groups:  LossDate varies and CloseDate = CurrentDate
    closeClaim(createOpenPAClaim(CurrentDate.addBusinessDays(-25), "aapplegate", "Auto1 - TeamA", Currency.TC_USD, Currency.TC_USD), CurrentDate)
    closeClaim(createOpenPAClaim(CurrentDate.addBusinessDays(-30), "bbaker", "Auto1 - TeamB", Currency.TC_USD, Currency.TC_USD), CurrentDate)
    closeClaim(createOpenTravelClaim(CurrentDate.addBusinessDays(-50)), CurrentDate)
    closeClaim(createOpenWaterHOClaim(CurrentDate.addBusinessDays(-35), "jyancy", "Property - TeamA", Currency.TC_USD, Currency.TC_USD), CurrentDate)
    closeClaim(createOpenFireHOClaim(CurrentDate.addBusinessDays(-40), "sdunn", "Property - TeamB", Currency.TC_USD, Currency.TC_USD), CurrentDate)
    closeClaim(createOpenWCClaim(CurrentDate.addBusinessDays(-45), "gickes", "Comp - TeamA", Currency.TC_USD, Currency.TC_USD), CurrentDate)
    
    // Previous Month data
    for ( i in 3 ) {
      closeClaim(createOpenPAClaim(CurrentDate.addBusinessDays(-(50+i)), "aapplegate", "Auto1 - TeamA", Currency.TC_USD, Currency.TC_USD), CurrentDate.addBusinessDays(-30))
      closeClaim(createOpenPAClaim(CurrentDate.addBusinessDays(-(45+i)), "bbaker", "Auto1 - TeamB", Currency.TC_USD, Currency.TC_USD), CurrentDate.addBusinessDays(-10))
      closeClaim(createOpenTravelClaim(CurrentDate.addBusinessDays(-(30+i))), CurrentDate.addBusinessDays(-20))
      closeClaim(createOpenWaterHOClaim(CurrentDate.addBusinessDays(-(40+i)), "jyancy", "Property - TeamA", Currency.TC_USD, Currency.TC_USD), CurrentDate.addBusinessDays(-25))
      closeClaim(createOpenFireHOClaim(CurrentDate.addBusinessDays(-(50+i)), "sdunn", "Property - TeamB", Currency.TC_USD, Currency.TC_USD), CurrentDate.addBusinessDays(-30))
      closeClaim(createOpenWCClaim(CurrentDate.addBusinessDays(-(45+i)), "gickes", "Comp - TeamA", Currency.TC_USD, Currency.TC_USD), CurrentDate.addBusinessDays(-15))
    }   
  }
  
  /**
   * Quick Jump command:  Run CreateReportData createOpenClaims
   * The data created will be displayed in the reports under Claims, Dashboard, Financials, and SUI folders
   */
  function createOpenClaims() {   
    createOpenPAClaim(CurrentDate, "aapplegate", "Auto1 - TeamA", Currency.TC_USD, Currency.TC_USD)
    createOpenPAClaim(CurrentDate, "bbaker", "Auto1 - TeamB", Currency.TC_USD, Currency.TC_USD)
    createOpenTravelClaim(CurrentDate)
    createOpenWaterHOClaim(CurrentDate, "jyancy", "Property - TeamA", Currency.TC_USD, Currency.TC_USD)
    createOpenFireHOClaim(CurrentDate, "sdunn", "Property - TeamB", Currency.TC_USD, Currency.TC_USD)
    createOpenWCClaim(CurrentDate, "gickes", "Comp - TeamA", Currency.TC_USD, Currency.TC_USD)
  }
  
  /**
   * Quick Jump command:  Run CreateReportData createReopenedClaims
   * These claims are reopened and displayed in Claims -> Reopened Claims List report
   */
  function createReopenedClaims() {
    reopenClaim(closeClaim(createOpenPAClaim(CurrentDate, "aapplegate", "Auto1 - TeamA", Currency.TC_USD, Currency.TC_USD), CurrentDate))
    reopenClaim(closeClaim(createOpenPAClaim(CurrentDate, "bbaker", "Auto1 - TeamB", Currency.TC_USD, Currency.TC_USD), CurrentDate))
    reopenClaim(closeClaim(createOpenTravelClaim(CurrentDate), CurrentDate))
    reopenClaim(closeClaim(createOpenWaterHOClaim(CurrentDate, "jyancy", "Property - TeamA", Currency.TC_USD, Currency.TC_USD), CurrentDate))
    reopenClaim(closeClaim(createOpenFireHOClaim(CurrentDate, "sdunn", "Property - TeamB", Currency.TC_USD, Currency.TC_USD), CurrentDate))
    reopenClaim(closeClaim(createOpenWCClaim(CurrentDate, "gickes", "Comp - TeamA", Currency.TC_USD, Currency.TC_USD), CurrentDate))
  }
  
  /**
   * Quick Jump command:  Run CreateReportData createClaimsWithCatastrophe
   * These claims are associated with a catastrophe 
   */
  function createClaimsWithCatastrophe() {
    // Open claims with catastrophe
    setWaterCatastrophe(createOpenPAClaim(CurrentDate, "aapplegate", "Auto1 - TeamA", Currency.TC_USD, Currency.TC_USD))
    setFireCatastrophe(createOpenPAClaim(CurrentDate, "bbaker", "Auto1 - TeamB", Currency.TC_USD, Currency.TC_USD))
    setWaterCatastrophe(createOpenWaterHOClaim(CurrentDate, "jyancy", "Property - TeamA", Currency.TC_USD, Currency.TC_USD))
    setFireCatastrophe(createOpenFireHOClaim(CurrentDate, "sdunn", "Property - TeamB", Currency.TC_USD, Currency.TC_USD))
    
    // Closed claims with catastrophe
    setFireCatastrophe(closeClaim(createOpenPAClaim(CurrentDate, "aapplegate", "Auto1 - TeamA", Currency.TC_USD, Currency.TC_USD), CurrentDate))
    setWaterCatastrophe(closeClaim(createOpenPAClaim(CurrentDate, "bbaker", "Auto1 - TeamB", Currency.TC_USD, Currency.TC_USD), CurrentDate))
    setWaterCatastrophe(closeClaim(createOpenWaterHOClaim(CurrentDate, "jyancy", "Property - TeamA", Currency.TC_USD, Currency.TC_USD), CurrentDate))
    setFireCatastrophe(closeClaim(createOpenFireHOClaim(CurrentDate, "sdunn", "Property - TeamB", Currency.TC_USD, Currency.TC_USD), CurrentDate))    
  }
  
  /**
   * Quick Jump command:  Run CreateReportData createMulticurrencyClaims
   * The data created will be displayed in the Open Claim Financials Claim Currency report
   */
  function createMulticurrencyClaims() {
    // Only create multicurrency claims when the config.xml parameter is set to:  <param name="MulticurrencyDisplayMode" value="MULTIPLE"/>
    if(PLConfigParameters.MulticurrencyDisplayMode.Value == "MULTIPLE") {
        
      // Claims with claim currency and financial transactions are the same
      createOpenPAClaim(CurrentDate, "aapplegate", "Auto1 - TeamA", Currency.TC_EUR, Currency.TC_EUR)
      createOpenPAClaim(CurrentDate, "bbaker", "Auto1 - TeamB", Currency.TC_GBP, Currency.TC_GBP)
      createOpenWaterHOClaim(CurrentDate, "wdufraine", "Midwest Property A", Currency.TC_AUD, Currency.TC_AUD)
      createOpenWaterHOClaim(CurrentDate, "jyancy", "Property - TeamA", Currency.TC_CAD, Currency.TC_CAD)
      createOpenWCClaim(CurrentDate, "gickes", "Comp - TeamA", Currency.TC_RUB, Currency.TC_RUB)
    
      // Claims with claim currency = USD and financial transactions = EUR, GBP
      createOpenPAClaim(CurrentDate, "aapplegate", "Auto1 - TeamA", Currency.TC_USD, Currency.TC_EUR)
      createOpenPAClaim(CurrentDate, "bbaker", "Auto1 - TeamB", Currency.TC_USD, Currency.TC_GBP)
      createOpenWaterHOClaim(CurrentDate, "jyancy", "Property - TeamA", Currency.TC_USD, Currency.TC_CAD)
      createOpenWCClaim(CurrentDate, "gickes", "Comp - TeamA", Currency.TC_USD, Currency.TC_RUB)

      // Claims with claim currency = GBP and financial transactions = USD, EUR
      createOpenPAClaim(CurrentDate, "aapplegate", "Auto1 - TeamA", Currency.TC_GBP, Currency.TC_USD)
      createOpenPAClaim(CurrentDate, "bbaker", "Auto1 - TeamB", Currency.TC_GBP, Currency.TC_EUR)
      createOpenWaterHOClaim(CurrentDate, "jyancy", "Property - TeamA", Currency.TC_GBP, Currency.TC_CAD)
      createOpenWCClaim(CurrentDate, "gickes", "Comp - TeamA", Currency.TC_GBP, Currency.TC_RUB)
    
      // Claims with claim currency and different financial transactions currency
      addMulticurrencyTransactions(createOpenPAClaim(CurrentDate, "aapplegate", "Auto1 - TeamA", Currency.TC_GBP, Currency.TC_EUR), Currency.TC_RUB)
      addMulticurrencyTransactions(createOpenPAClaim(CurrentDate, "bbaker", "Auto1 - TeamB", Currency.TC_USD, Currency.TC_CAD), Currency.TC_EUR)
      addMulticurrencyTransactions(createOpenWCClaim(CurrentDate, "gickes", "Comp - TeamA", Currency.TC_EUR, Currency.TC_USD), Currency.TC_EUR)
    }
  }

  /**
   * Creates a check with an address that matches a User's address
   * displayed in SIU -> Matching Payment Address report
   */  
  function createCheckWithUserAddress() {
    var autoClaim : Claim
    gw.transaction.Transaction.runWithNewBundle( \ claimBundle -> {
      autoClaim = ClaimBuilder.uiReadyAuto()
              .withPolicy(PolicyBuilder.uiReadyPersonalAuto()
                      .withUnderwritingCo(UnderwritingCompanyType.TC_PARENT)
                      .withUnderwritingGroup(UnderwritingGroupType.TC_ACME_AUTO)
                      .create(claimBundle))
              .withAssignedUserFoundByName("aapplegate")
              .withAssignedGroupFoundByName("Auto1 - TeamA")
              .withLossDate(CurrentDate)
              .withReportedDate(CurrentDate)
              .withDescription(DEFAULT_DESCRIPTION)
              .withValidationLevel(ValidationLevel.TC_PAYMENT)
              .create(claimBundle)
            
      var exposure1 = ExposureBuilder.uiReadyVehicleDamage()
              .onClaim(autoClaim)
              .create(claimBundle)
              
      var reserveLine = new ReserveLineBuilder().withClaim( autoClaim ) 
              .withExposure( exposure1 )
              .withCostType( CostType.TC_CLAIMCOST )
              .withCostCategory( CostCategory.TC_OTHER )
              .create(claimBundle)

      ReserveBuilder.uiReadyReserve(exposure1, CurrencyAmount.getStrict(1500, Currency.TC_USD) )
              .withReserveLine( reserveLine ) 
              .create(claimBundle)

      var check = CheckBuilder.uiReadyCheckWithoutPaymentOrCheckSetWithAutoAdjustmentForBusinessDay(autoClaim)
              .withStatus( TransactionStatus.TC_ISSUED )
              .withIssueDate(CurrentDate)
              .withMailToAddress( "143 Lake Ave. Suite 501, Pasadena, CA 91253" )
              .create(claimBundle)   
                                                                                      
      new PaymentBuilder().onCheck(check)
              .onClaim(autoClaim)
              .withStatus( TransactionStatus.TC_SUBMITTED )
              .withReportingCurrency()
              .withPaymentType( PaymentType.TC_PARTIAL )
              .withDoesNotErodeReserves(True)
              .withLineItem(CurrencyAmount.getStrict(10, Currency.TC_USD), LineCategory.TC_DOCTOR)
              .onTransactionSet( new CheckSetBuilder().onClaim( autoClaim )
                      .withCheck( check )
                      .withRequestingUser( autoClaim.AssignedUser )
                      .create(claimBundle))
              .withReserveLine(reserveLine)                    
              .create(claimBundle)              
    })
    
    Logger.logInfo("SUI Report - Open Auto Claim: " + autoClaim.ClaimNumber)
  }
       
  // private helper ----------------------------------------
  
  /**
   * Add all reports to the reportmanager permission set
   */
  private function setUpReportManagerPermissionSet() {
    var reportsList = Query.make(SREEReport).select().toList()
    var reports = new SREEReport[reportsList.size()]
    reportsList.eachWithIndex( \ report, i -> {reports[i] = report})

    gw.transaction.Transaction.runWithNewBundle( \ reportBundle -> {
      var group = Query.make(entity.ReportGroup).compare("Name", Equals, "reportmanager").select().AtMostOneRow      
      reportBundle.add(group)
      if (group != null) {
        group.setReports( reports )
      }
    })
  }

  /**
   * Add Claim Health Metric reports and drill downs except for reports viewed by supervisors
   * and adjusters to the viewaggclaimmetrics permission set
   * Reports:  Claim Overall Avg, Claim by Group, Claim by Group and Tier, Exposure by Tier
   */
  private function setUpViewAggClaimMetricsPermissionSet() {
    var reportsList = Query.make(SREEReport).select().toList()
    var permissionSetReportList : List<SREEReport> = {}
    permissionSetReportList.add(reportsList.firstWhere(\ s -> s.DisplayName.equals("ClaimCenter")))
    permissionSetReportList.addAll(reportsList.where(\ s -> s.DisplayName.contains("ClaimCenter/Claim Health Metrics")))
    permissionSetReportList.removeWhere(\ s -> s.DisplayName.contains("ClaimCenter/Claim Health Metrics/My Claim and Exposure"))
    permissionSetReportList.removeWhere(\ s -> s.DisplayName.contains("ClaimCenter/Claim Health Metrics/Open Alert Supervisor"))

    var reports = new SREEReport[permissionSetReportList.size()]
    permissionSetReportList.eachWithIndex( \ report, i -> {reports[i] = report})

    gw.transaction.Transaction.runWithNewBundle( \ reportBundle -> {
      var group = Query.make(entity.ReportGroup).compare("Name", Equals, "viewaggclaimmetrics").select().AtMostOneRow      
      reportBundle.add(group)
      if (group != null) {
        group.setReports( reports )
      }
    })
  }
    
  /**
   * Add Claim Health Metric reports viewed by supervisors to the viewsupmetricalerts permission set
   * Reports:  Open Alert Supervisor Red, Open Alert Supervisor Yellow
   */
  private function setUpViewSupMetricAlertsPermissionSet() {
    var reportsList = Query.make(SREEReport).select().toList()
    var permissionSetReportList : List<SREEReport> = {}
    permissionSetReportList.add(reportsList.firstWhere(\ s -> s.DisplayName.equals("ClaimCenter")))
    permissionSetReportList.add(reportsList.firstWhere(\ s -> s.DisplayName.equals("ClaimCenter/Claim Health Metrics")))
    permissionSetReportList.addAll(reportsList.where(\ s -> s.DisplayName.contains("ClaimCenter/Claim Health Metrics/Open Alert Supervisor")))

    var reports = new SREEReport[permissionSetReportList.size()]
    permissionSetReportList.eachWithIndex( \ report, i -> {reports[i] = report})

    gw.transaction.Transaction.runWithNewBundle( \ reportBundle -> {
      var group = Query.make(entity.ReportGroup).compare("Name", Equals, "viewsupmetricalerts").select().AtMostOneRow      
      reportBundle.add(group)
      if (group != null) {
        group.setReports( reports )
      }
    })
  }  

  /**
   * Add Claim Health Metric reports viewed by users to the viewownmetricalerts permission set
   * Reports:  My Claim and Exposure Alerts Red, My Claim and Exposure Alerts Yellow
   */
  private function setUpViewOwnMetricAlertsPermissionSet() {
    var reportsList = Query.make(SREEReport).select().toList()
    var permissionSetReportList : List<SREEReport> = {}
    permissionSetReportList.add(reportsList.firstWhere(\ s -> s.DisplayName.equals("ClaimCenter")))
    permissionSetReportList.add(reportsList.firstWhere(\ s -> s.DisplayName.equals("ClaimCenter/Claim Health Metrics")))
    permissionSetReportList.addAll(reportsList.where(\ s -> s.DisplayName.contains("ClaimCenter/Claim Health Metrics/My Claim and Exposure")))

    var reports = new SREEReport[permissionSetReportList.size()]
    permissionSetReportList.eachWithIndex( \ report, i -> {reports[i] = report})
    
    gw.transaction.Transaction.runWithNewBundle( \ reportBundle -> {
      var group = Query.make(entity.ReportGroup).compare("Name", Equals, "viewownmetricalerts").select().AtMostOneRow      
      reportBundle.add(group)
      if (group != null) {
        group.setReports( reports )
      }
    })
  }
  
  // Create Open Claims
  
  /**
   * Returns an open Personal Auto claim with activities, exposures, and financials
   */
  private function createOpenPAClaim(lossDate : Date, username : String, group : String, claimCurrency : Currency, transactionCurrency : Currency) : Claim {
    var autoClaim : Claim
    var reserveLine2 : ReserveLine
    gw.transaction.Transaction.runWithNewBundle( \ claimBundle -> {
      autoClaim = ClaimBuilder.uiReadyAuto()
              .withPolicy(PolicyBuilder.uiReadyPersonalAuto()
                      .withUnderwritingCo(UnderwritingCompanyType.TC_PARENT)
                      .withUnderwritingGroup(UnderwritingGroupType.TC_ACME_AUTO)
                      .withCurrency(claimCurrency)
                      .create(claimBundle))
              .withNonConflictingClaimNumber()
              .withAssignedUserFoundByName(username)
              .withAssignedGroupFoundByName(group)
              .withLossDate(lossDate)
              .withReportedDate(lossDate)
              .withDescription(DEFAULT_DESCRIPTION)
              .withSubrogationStatus(SubrogationStatus.TC_OPEN)
              .withValidationLevel(ValidationLevel.TC_PAYMENT)
              .create(claimBundle)
            
      var exposure1 = ExposureBuilder.uiReadyVehicleDamage()
              .onClaim(autoClaim)
              .withClaimAssignedUser()
              .withClaimAssignedGroup()
              .create(claimBundle)

      var exposure2 = ExposureBuilder.uiReadyBodilyInjuryDamage()
              .onClaim(autoClaim)
              .withClaimAssignedUser()
              .withClaimAssignedGroup()
              .create(claimBundle)
                  
      claimBundle.commit()   
      
      autoClaim.setCreateTime(lossDate)          
      exposure1.setCreateTime(lossDate)
      exposure2.setCreateTime(lossDate)

      createActivities(claimBundle, autoClaim)

      var reserveLine1 = createExposureLevelReserve(claimBundle, autoClaim, exposure1, CostType.TC_CLAIMCOST, transactionCurrency)
      createCheckAndPayment(claimBundle, autoClaim, PaymentType.TC_PARTIAL, reserveLine1, CurrencyAmount.getStrict(100, transactionCurrency), transactionCurrency, true)
    
      reserveLine2 = createExposureLevelReserve(claimBundle, autoClaim, exposure2, CostType.TC_AOEXPENSE, transactionCurrency)
      createCheckAndPayment(claimBundle, autoClaim, PaymentType.TC_PARTIAL, reserveLine2, CurrencyAmount.getStrict(100, transactionCurrency), transactionCurrency, false)
    
      var reserveLine3 = createClaimLevelReserve(claimBundle, autoClaim, claimCurrency)
      createCheckAndPayment(claimBundle, autoClaim, PaymentType.TC_PARTIAL, reserveLine3, CurrencyAmount.getStrict(100, transactionCurrency), transactionCurrency, true)
    
      createRecoveries(claimBundle, autoClaim, exposure2, reserveLine2, transactionCurrency)                               
      createReserveChanges(claimBundle, autoClaim, reserveLine2, 5, transactionCurrency)
    })
    
    
    Logger.logInfo("Open Auto Claim: " + autoClaim.ClaimNumber + "  Claim Currency = " + claimCurrency + "  Transaction Currency = " + transactionCurrency)
    return autoClaim
  }  
  
  /**
   * Returns an open Travel claim with activities, exposures, and financials
   */
  private function createOpenTravelClaim(lossDate : Date) : Claim {
    var travelClaim : Claim
    var reserveLine3 : ReserveLine
    gw.transaction.Transaction.runWithNewBundle( \ claimBundle -> {
      travelClaim = ClaimBuilder.uiReadyTravelWithTripRU()
              .withNonConflictingClaimNumber()
              .withAssignedUserFoundByName("eaustin")
              .withAssignedGroupFoundByName("Western Travel Group")
              .withLossDate(lossDate)
              .withReportedDate(lossDate)
              .withDescription(DEFAULT_DESCRIPTION)
              .withValidationLevel(ValidationLevel.TC_PAYMENT)
              .create(claimBundle)
   
      var exposure1 = ExposureBuilder.uiReadyBaggage()
              .onClaim(travelClaim)
              .withClaimAssignedUser()
              .withClaimAssignedGroup()
              .create(claimBundle)

      var exposure2 = ExposureBuilder.uiReadyTripCancellationOrDelay()
              .onClaim(travelClaim)
              .withClaimAssignedUser()
              .withClaimAssignedGroup()
              .create(claimBundle)
                  
      claimBundle.commit()   
                
      travelClaim.Policy.UnderwritingCo = UnderwritingCompanyType.TC_CHILD2
      travelClaim.Policy.UnderwritingGroup = UnderwritingGroupType.TC_SOUTHWESTERN
      exposure1.setCreateTime(lossDate)
      exposure2.setCreateTime(lossDate)

      createActivities(claimBundle, travelClaim)
      
      // Create Additional escalated activities for make RED
      for(i in 3) {
        var activity = ActivityBuilder.uiReadyGeneral()
              .onClaim(travelClaim)
              .withCompleteStatus()
              .withTargetDate(lossDate)
              .withEscalationDateNow()
              .withEscalated(true)
              .create(claimBundle)
              
        claimBundle.commit()
        activity.setCreateTime(lossDate)
        claimBundle.commit()
      }
      var claimCurrency = travelClaim.Policy.Currency
      var reserveLine1 = createExposureLevelReserve(claimBundle, travelClaim, exposure1, CostType.TC_CLAIMCOST, claimCurrency)
      createCheckWithPayeeAndPayment(claimBundle, travelClaim, PaymentType.TC_PARTIAL, reserveLine1, Currency.TC_USD, true)
    
      var reserveLine2 = createExposureLevelReserve(claimBundle, travelClaim, exposure2, CostType.TC_CLAIMCOST, claimCurrency)
      createCheckWithPayeeAndPayment(claimBundle, travelClaim, PaymentType.TC_PARTIAL, reserveLine2, Currency.TC_USD, true)
    
      reserveLine3 = createClaimLevelReserve(claimBundle, travelClaim, claimCurrency)
      createCheckWithPayeeAndPayment(claimBundle, travelClaim, PaymentType.TC_PARTIAL, reserveLine3, Currency.TC_USD, true)
    
      createRecoveries(claimBundle, travelClaim, exposure2, reserveLine2, claimCurrency)                               
      createReserveChanges(claimBundle, travelClaim, reserveLine3, 10, claimCurrency)
    })
        
    Logger.logInfo("Open Travel Claim: " + travelClaim.ClaimNumber)
    return travelClaim
  }
  
  /**
   * Returns an open Homeowner's (water damage) claim with activities, exposures, and financials
   */
  private function createOpenWaterHOClaim(lossDate : Date, username : String, group : String, claimCurrency : Currency, transactionCurrency : Currency) : Claim {
    var waterHOClaim : Claim
    gw.transaction.Transaction.runWithNewBundle( \ claimBundle -> {
      waterHOClaim = ClaimBuilder.uiReadyHomeowners()
              .withPolicy(PolicyBuilder.uiReadyHomeowners()
                      .withUnderwritingCo(UnderwritingCompanyType.TC_PARENT)
                      .withUnderwritingGroup(UnderwritingGroupType.TC_ACME_PROP)
                      .withCurrency(claimCurrency)
                      .create(claimBundle))
              .withNonConflictingClaimNumber()
              .withAssignedUserFoundByName(username)
              .withAssignedGroupFoundByName(group)
              .withLossDate(lossDate)
              .withReportedDate(lossDate)
              .withDescription(DEFAULT_DESCRIPTION)
              .withLossCause(LossCause.TC_WATERDAMAGE)
              .withPropertyWaterDamage(new PropertyWaterDamageBuilder()
                      .withHasWaterBeenTurnedOff(true)
                      .withWaterSource(WaterSource.TC_PLUMBING_APPLIANCES))
              .withValidationLevel(ValidationLevel.TC_PAYMENT)
              .create(claimBundle)

      var exposure1 = ExposureBuilder.uiReadyOtherStructure()
              .onClaim(waterHOClaim)
              .withClaimAssignedUser()
              .withClaimAssignedGroup()
              .create(claimBundle)

      var exposure2 = ExposureBuilder.uiReadyContent()
              .onClaim(waterHOClaim)
              .withClaimAssignedUser()
              .withClaimAssignedGroup()
              .create(claimBundle)

      var exposure3 = ExposureBuilder.uiReadyLivingExpenses()
              .onClaim(waterHOClaim)
              .withClaimAssignedUser()
              .withClaimAssignedGroup()
              .create(claimBundle)

      var exposure4 = ExposureBuilder.uiReadyDwelling()
              .onClaim(waterHOClaim)
              .withClaimAssignedUser()
              .withClaimAssignedGroup()
              .create(claimBundle)
                  
      claimBundle.commit()   
                
      exposure1.setCreateTime(lossDate)
      exposure2.setCreateTime(lossDate)
      exposure3.setCreateTime(lossDate)
      exposure4.setCreateTime(lossDate)

      createActivities(claimBundle, waterHOClaim)

      // Create Additional escalated activities for make RED
      for(i in 3) {
        var activity = ActivityBuilder.uiReadyGeneral()
              .onClaim(waterHOClaim)
              .withCompleteStatus()
              .withTargetDate(lossDate)
              .withEscalationDateNow()
              .withEscalated(true)
              .create(claimBundle)
              
        claimBundle.commit()
        activity.setCreateTime(lossDate)
        claimBundle.commit()
      }
      
      var reserveLine1 = createExposureLevelReserve(claimBundle, waterHOClaim, exposure1, CostType.TC_CLAIMCOST, transactionCurrency)
      createCheckAndPayment(claimBundle, waterHOClaim, PaymentType.TC_PARTIAL, reserveLine1, CurrencyAmount.getStrict(100, transactionCurrency), transactionCurrency, false)
    
      var reserveLine2 = createExposureLevelReserve(claimBundle, waterHOClaim, exposure2, CostType.TC_CLAIMCOST, transactionCurrency)
      createCheckAndPayment(claimBundle, waterHOClaim, PaymentType.TC_PARTIAL, reserveLine2, CurrencyAmount.getStrict(100, transactionCurrency), transactionCurrency, false)
    
      var reserveLine3 = createClaimLevelReserve(claimBundle, waterHOClaim, transactionCurrency)
      createCheckAndPayment(claimBundle, waterHOClaim, PaymentType.TC_PARTIAL, reserveLine3, CurrencyAmount.getStrict(100, transactionCurrency), transactionCurrency, false)
    
      createRecoveries(claimBundle, waterHOClaim, exposure2, reserveLine2, transactionCurrency)                               
    })
    
    Logger.logInfo("Open Homeowner's (water damage) Claim: " + waterHOClaim.ClaimNumber  + "  Claim Currency = " + claimCurrency + "  Transaction Currency = " + transactionCurrency)
    return waterHOClaim
  }

  /**
   * Returns an open Homeowner's (fire damage) claim with activities, exposures, and financials
   */
  private function createOpenFireHOClaim(lossDate : Date, username : String, group : String, claimCurrency : Currency, transactionCurrency : Currency) : Claim {
    var fireHOClaim : Claim
    gw.transaction.Transaction.runWithNewBundle( \ claimBundle -> {
      fireHOClaim = ClaimBuilder.uiReadyHomeowners()
              .withPolicy(PolicyBuilder.uiReadyHomeowners()
                      .withUnderwritingCo(UnderwritingCompanyType.TC_PARENT)
                      .withUnderwritingGroup(UnderwritingGroupType.TC_ACME_PROP)
                      .withCurrency(claimCurrency)
                      .create(claimBundle))
              .withNonConflictingClaimNumber()
              .withAssignedUserFoundByName(username)
              .withAssignedGroupFoundByName(group)
              .withLossDate(lossDate)
              .withReportedDate(lossDate)
              .withDescription(DEFAULT_DESCRIPTION)
              .withLossCause(LossCause.TC_FIRE)
              .withValidationLevel(ValidationLevel.TC_PAYMENT)
              .create(claimBundle)

      var exposure1 = ExposureBuilder.uiReadyOtherStructure()
              .onClaim(fireHOClaim)
              .withClaimAssignedUser()
              .withClaimAssignedGroup()
              .create(claimBundle)

      var exposure2 = ExposureBuilder.uiReadyContent()
              .onClaim(fireHOClaim)
              .withClaimAssignedUser()
              .withClaimAssignedGroup()
              .create(claimBundle)

      var exposure3 = ExposureBuilder.uiReadyLivingExpenses()
              .onClaim(fireHOClaim)
              .withClaimAssignedUser()
              .withClaimAssignedGroup()
              .create(claimBundle)

      var exposure4 = ExposureBuilder.uiReadyDwelling()
              .onClaim(fireHOClaim)
              .withClaimAssignedUser()
              .withClaimAssignedGroup()
              .create(claimBundle)
                  
      claimBundle.commit()   
                
      exposure1.setCreateTime(lossDate)
      exposure2.setCreateTime(lossDate)
      exposure3.setCreateTime(lossDate)
      exposure4.setCreateTime(lossDate)

      createActivities(claimBundle, fireHOClaim)

      var reserveLine1 = createExposureLevelReserve(claimBundle, fireHOClaim, exposure1, CostType.TC_CLAIMCOST, transactionCurrency)
      createCheckAndPayment(claimBundle, fireHOClaim, PaymentType.TC_FINAL, reserveLine1,CurrencyAmount.getStrict(100, transactionCurrency), transactionCurrency, true)
    
      var reserveLine2 = createExposureLevelReserve(claimBundle, fireHOClaim, exposure2, CostType.TC_CLAIMCOST, transactionCurrency)
      createCheckAndPayment(claimBundle, fireHOClaim, PaymentType.TC_PARTIAL, reserveLine2, CurrencyAmount.getStrict(100, transactionCurrency), transactionCurrency, true)
    
      var reserveLine3 = createClaimLevelReserve(claimBundle, fireHOClaim, transactionCurrency)
      createCheckAndPayment(claimBundle, fireHOClaim, PaymentType.TC_PARTIAL, reserveLine3, CurrencyAmount.getStrict(100, transactionCurrency), transactionCurrency, true)
    
      var reserveLine4 = createExposureLevelReserve(claimBundle, fireHOClaim, exposure3, CostType.TC_AOEXPENSE, transactionCurrency)
      createCheckAndPayment(claimBundle, fireHOClaim, PaymentType.TC_PARTIAL, reserveLine4, CurrencyAmount.getStrict(600, transactionCurrency), transactionCurrency, true)
    
      var reserveLine5 = createExposureLevelReserve(claimBundle, fireHOClaim, exposure4, CostType.TC_AOEXPENSE, transactionCurrency)
      createCheckAndPayment(claimBundle, fireHOClaim, PaymentType.TC_PARTIAL, reserveLine5, CurrencyAmount.getStrict(700, transactionCurrency), transactionCurrency, true)
    
      createRecoveries(claimBundle, fireHOClaim, exposure2, reserveLine2, transactionCurrency)                               
    })
    
    Logger.logInfo("Open Homeowner's (fire damage) Claim: " + fireHOClaim.ClaimNumber  + "  Claim Currency = " + claimCurrency + "  Transaction Currency = " + transactionCurrency)
    return fireHOClaim
  }

  /**
   * Returns an open WC claim with activities, exposures, and financials
   */
  private function createOpenWCClaim(lossDate : Date, username : String, group : String, claimCurrency : Currency, transactionCurrency : Currency) : Claim {
    var wcClaim : Claim
    gw.transaction.Transaction.runWithNewBundle( \ claimBundle -> {
      wcClaim = ClaimBuilder.uiReadyWorkersComp()
              .withPolicy(PolicyBuilder.uiReadyWorkersComp()
                      .withUnderwritingCo(UnderwritingCompanyType.TC_PARENT)
                      .withUnderwritingGroup(UnderwritingGroupType.TC_ACME_WC)
                      .withCurrency(claimCurrency)
                      .create(claimBundle))
              .withNonConflictingClaimNumber()
              .withAssignedUserFoundByName(username)
              .withAssignedGroupFoundByName(group)
              .withLossDate(lossDate)
              .withReportedDate(lossDate)
              .withDescription(DEFAULT_DESCRIPTION)
              .withLossCause(LossCause.TC_FIRE)
              .withValidationLevel(ValidationLevel.TC_PAYMENT)
              .create(claimBundle)

      var exposure1 = ExposureBuilder.uiReadyTimeLoss()
              .onClaim(wcClaim)
              .withClaimAssignedUser()
              .withClaimAssignedGroup()
              .create(claimBundle)

      var exposure2 = ExposureBuilder.uiReadyEmployerLiability()
              .onClaim(wcClaim)
              .withClaimAssignedUser()
              .withClaimAssignedGroup()
              .create(claimBundle)

      var exposure3 = ExposureBuilder.uiReadyMedicalDetails()
              .onClaim(wcClaim)
              .withClaimAssignedUser()
              .withClaimAssignedGroup()
              .create(claimBundle)

      claimBundle.commit()

      exposure1.setCreateTime(lossDate)
      exposure2.setCreateTime(lossDate)
      exposure3.setCreateTime(lossDate)

      createActivities(claimBundle, wcClaim)

      var reserveLine1 = createExposureLevelReserve(claimBundle, wcClaim, exposure1, CostType.TC_CLAIMCOST, transactionCurrency)
      createCheckAndPayment(claimBundle, wcClaim, PaymentType.TC_FINAL, reserveLine1, CurrencyAmount.getStrict(100, transactionCurrency), transactionCurrency, false)
      
      var reserveLine3 = createExposureLevelReserve(claimBundle, wcClaim, exposure3, CostType.TC_AOEXPENSE, transactionCurrency)
      createCheckAndPayment(claimBundle, wcClaim, PaymentType.TC_PARTIAL, reserveLine3, CurrencyAmount.getStrict(200, transactionCurrency), transactionCurrency, true)                                                        
    })
    
    Logger.logInfo("Open WC Claim: " + wcClaim.ClaimNumber   + "  Claim Currency = " + claimCurrency + "  Transaction Currency = " + transactionCurrency)
    return wcClaim
  }

  /**
   * Create activities for a given claim
   */
  private function createActivities(claimBundle : Bundle, claim : Claim) {
      ActivityBuilder.uiReadyGeneral()
              .onClaim(claim)
              .withActivityPattern(ActivityPattern.finder.getActivityPatternByCode("contact_insured"))
              .withSubject("Make initial contact with insured")
              .withCompleteStatus()
              .withTargetDate(claim.LossDate)
              .withAssignmentDate(claim.LossDate)
              .withEscalationDateNow()
              .withEscalated(true)
              .create(claimBundle) 
      
      if(claim.Exposures.Count > 0) {    
        if(claim.LOBCode == LOBCode.TC_WC) {
          for (exposure in claim.Exposures) {
              ActivityBuilder.uiReadyGeneral()
                      .onClaim(claim)
                      .withExposure(exposure)
                      .withActivityPattern(ActivityPattern.finder.getActivityPatternByCode("contact_claimant"))
                      .withSubject("Make initial contact with claimant")
                      .withTargetDate(claim.LossDate)
                      .withAssignmentDate(claim.LossDate)
                      .create(claimBundle)
          }
        }     
        
        for(exposure in claim.Exposures) {
          ActivityBuilder.uiReadyGeneral()
                  .onClaim(claim)
                  .withExposure(exposure)
                  .withTargetDate(claim.LossDate)
                  .withAssignmentDate(claim.LossDate)
                  .create(claimBundle)
        }
      }
      
      claimBundle.commit()
      
      for(activity in claim.Activities) {
        activity.setCreateTime(claim.LossDate)
      }
      
      claimBundle.commit()
  }
  
  private function createExposureLevelReserve(claimBundle : Bundle, claim : Claim, exposure : Exposure, costType : CostType, reserveCurrency : Currency) : ReserveLine {   
    var reserveLine = new ReserveLineBuilder().withClaim( claim ) 
            .withExposure( exposure )
            .withCostType( costType )
            .withCostCategory( CostCategory.TC_OTHER )
            .create(claimBundle)
            

    var reserve = ReserveBuilder.uiReadyReserve(exposure, CurrencyAmount.getStrict(1000, reserveCurrency) )
            .withReserveLine( reserveLine ) 
            .withCurrency(reserveCurrency)
            .onTransactionSet(new ReserveSetBuilder()
                    .withRequestingUser(claim.AssignedUser)
                    .withApprovalStatus(ApprovalStatus.TC_APPROVED)
                    .withApprovalDate(claim.LossDate)
                    .create(claimBundle))            
            .create(claimBundle) 
            
    claimBundle.commit()   
    reserveLine.setCreateTime(claim.LossDate)     
    reserve.setCreateTime(claim.LossDate)     
    claimBundle.commit()   
    
    return reserveLine
  }
  
  private function createClaimLevelReserve(claimBundle : Bundle, claim : Claim, reserveCurrency : Currency) : ReserveLine {
    var reserveLine = new ReserveLineBuilder().withClaim( claim ) 
            .withCostType( CostType.TC_CLAIMCOST )
            .withCostCategory( CostCategory.TC_OTHER )
            .create(claimBundle)
            

    var reserve = ReserveBuilder.uiReadyClaimLevelReserve( claim, CurrencyAmount.getStrict(1000, reserveCurrency) )
            .withReserveLine( reserveLine ) 
            .withCurrency(reserveCurrency)
            .onTransactionSet(new ReserveSetBuilder()
                    .withRequestingUser(claim.AssignedUser)
                    .withApprovalStatus(ApprovalStatus.TC_APPROVED)
                    .withApprovalDate(claim.LossDate)
                    .create(claimBundle))            
            .create(claimBundle)
            
    claimBundle.commit()   
    reserveLine.setCreateTime(claim.LossDate)     
    reserve.setCreateTime(claim.LossDate)     
    claimBundle.commit()
       
    return reserveLine
  }
  
  /**
   * create data for Number of Reserve Changes metric
   */
  private function createReserveChanges(claimBundle : Bundle, claim : Claim, reserveLine : ReserveLine, reserveChanges : int, reserveCurrency : Currency) {
    var reserve : Reserve
    var reserveDate : Date
    for (i in reserveChanges) {
      reserveDate = claim.LossDate.addBusinessDays(i+3)
      reserve = ReserveBuilder.uiReadyClaimLevelReserve( claim, CurrencyAmount.getStrict(50, reserveCurrency) )
            .withReserveLine( reserveLine ) 
            .withCurrency(reserveCurrency)
            .withStatus(TransactionStatus.TC_SUBMITTING)
            .onTransactionSet(new ReserveSetBuilder()
                    .withRequestingUser(claim.AssignedUser)
                    .withApprovalStatus(ApprovalStatus.TC_APPROVED)
                    .withApprovalDate(reserveDate)
                    .create(claimBundle))            
            .create(claimBundle) 
    claimBundle.commit()
    reserve.setCreateTime(reserveDate)
    claimBundle.commit()
    }     
  }
  
  private function createCheckAndPayment(claimBundle : Bundle, claim : Claim, paymentType : PaymentType, reserveLine : ReserveLine, amount : CurrencyAmount, checkCurrency : Currency, erode : Boolean) {                     
    var check = CheckBuilder.uiReadyCheckWithoutPaymentOrCheckSetWithAutoAdjustmentForBusinessDay(claim)
            .withStatus( TransactionStatus.TC_ISSUED )
            .withIssueDate(claim.LossDate)
            .withCurrency(checkCurrency)
            .create(claimBundle)   
                                                                                      
    var payment = PaymentBuilder.uiReadyPayment(claim, check, amount)
            .withStatus( TransactionStatus.TC_SUBMITTED )
            .withReportingCurrency()
            .withPaymentType( paymentType )
            .withDoesNotErodeReserves(erode)
            .withCurrency(checkCurrency)
            .onTransactionSet( new CheckSetBuilder().onClaim( claim )
                    .withCheck( check )
                    .withRequestingUser( claim.AssignedUser )
                    .withApprovalDate(claim.LossDate)
                    .create(claimBundle))
            .withReserveLine(reserveLine)                    
            .create(claimBundle)
            
    claimBundle.commit()   
    check.setCreateTime(claim.LossDate)     
    payment.setCreateTime(claim.LossDate)     
    claimBundle.commit()
  }
  
  private function createCheckWithPayeeAndPayment(claimBundle : Bundle, claim : Claim, paymentType : PaymentType, reserveLine : ReserveLine, checkCurrency : Currency, erode : Boolean) {                     
    if(_payee == null){
      _payee = createABLinkedPerson()
    }
    
    var check = CheckBuilder.uiReadyCheckWithoutPaymentOrCheckSetWithAutoAdjustmentForBusinessDay(claim)
            .withStatus( TransactionStatus.TC_ISSUED )
            .withIssueDate(claim.LossDate)
            .withPayee(_payee)
            .withPayTo(_payee.getDisplayName())
            .withMailTo(_payee.getDisplayName())
            .withCurrency(checkCurrency)
            .create(claimBundle)   
                                                                                      
    var payment = PaymentBuilder.uiReadyPayment(claim, check, CurrencyAmount.getStrict(100, checkCurrency))
            .withStatus( TransactionStatus.TC_SUBMITTED )
            .withReportingCurrency()
            .withPaymentType( paymentType )
            .withDoesNotErodeReserves(erode)
            .withCurrency(checkCurrency)
            .onTransactionSet( new CheckSetBuilder().onClaim( claim )
                    .withCheck( check )
                    .withRequestingUser( claim.AssignedUser )
                    .create(claimBundle))
            .withReserveLine(reserveLine)                    
            .create(claimBundle)
            
    claimBundle.commit()   
    check.setCreateTime(claim.LossDate)     
    payment.setCreateTime(claim.LossDate)     
    claimBundle.commit()
  }
  
  private function createRecoveries(claimBundle : Bundle, claim : Claim, exposure : Exposure, reserveLine : ReserveLine, recoveryCurrency : Currency) {
    var recoveryReserve1 = RecoveryReserveBuilder.uiReadyClaimLevelRecoveryReserve(claim, CurrencyAmount.getStrict(1000, recoveryCurrency))
            .withCostType( CostType.TC_CLAIMCOST )
            .withCostCategory( CostCategory.TC_OTHER )
            .withCurrency(recoveryCurrency)
            .onTransactionSet(new RecoveryReserveSetBuilder()
                    .withRequestingUser(claim.AssignedUser)
                    .withApprovalStatus(ApprovalStatus.TC_APPROVED)
                    .withApprovalDate(claim.LossDate)
                    .create(claimBundle))            
            .create(claimBundle)
            
    var recovery1 = RecoveryBuilder.uiReadyRecovery(claim, CurrencyAmount.getStrict(100, recoveryCurrency))       
            .withCostType( CostType.TC_CLAIMCOST )
            .withCostCategory( CostCategory.TC_OTHER )
            .withCurrency(recoveryCurrency)
            .onTransactionSet(new RecoverySetBuilder()
                    .withRequestingUser(claim.AssignedUser)
                    .withApprovalStatus(ApprovalStatus.TC_APPROVED)
                    .withApprovalDate(claim.LossDate)
                    .create(claimBundle))            
            .create(claimBundle)  
             
    var recoveryReserve2 = new RecoveryReserveBuilder().onClaim(claim)
            .onExposure(exposure)
            .withReserveLine(reserveLine)
            .withLineItem(CurrencyAmount.getStrict(1000, recoveryCurrency), null)
            .withStatus(TransactionStatus.TC_SUBMITTING)
            .withCurrency(recoveryCurrency)
            .onTransactionSet(new RecoveryReserveSetBuilder()
                    .withRequestingUser(claim.AssignedUser)
                    .withApprovalStatus(ApprovalStatus.TC_APPROVED)
                    .withApprovalDate(claim.LossDate)
                    .create(claimBundle))
            .create(claimBundle)  
                      
    var recovery2 = RecoveryBuilder.uiReadyRecovery(claim, CurrencyAmount.getStrict(100, recoveryCurrency))
            .onExposure(exposure)
            .withReserveLine(reserveLine)
            .withCurrency(recoveryCurrency)
            .onTransactionSet(new RecoverySetBuilder()
                    .withRequestingUser(claim.AssignedUser)
                    .withApprovalStatus(ApprovalStatus.TC_APPROVED)
                    .withApprovalDate(claim.LossDate)
                    .create(claimBundle))            
            .create(claimBundle) 
            
    claimBundle.commit()   
    recoveryReserve1.setCreateTime(claim.LossDate)     
    recovery1.setCreateTime(claim.LossDate)     
    recoveryReserve2.setCreateTime(claim.LossDate)     
    recovery2.setCreateTime(claim.LossDate)     
    claimBundle.commit()
  }
  
  /**
   * Returns a close claim
   * 
   * Completes all open activities, closes any exposures, sets the subrogation status, and
   * closes the given claim
   */
  private function closeClaim(claim : Claim, closeDate : Date) : Claim {
    // complete any open activities
    if(claim.Activities.length > 0) {
      for(activity in claim.Activities) {
        activity.complete()
        activity.CloseDate = closeDate   
      }
    }
    
    // close any open exposures
    if(claim.Exposures.length > 0) {
      for(exp in claim.Exposures) {
        exp.close( ExposureClosedOutcomeType.TC_COMPLETED, DEFAULT_DESCRIPTION )
        exp.CloseDate = closeDate   
      }
    }
    
    // set Subrogation status to close
    if(claim.SubrogationStatus != null) {
      claim.SubrogationStatus = SubrogationStatus.TC_CLOSED
    }
  
    // close claim
    claim.FaultRating = FaultRating.TC_NOFAULT
    claim.close(ClaimClosedOutcomeType.TC_COMPLETED, DEFAULT_DESCRIPTION)
    claim.CloseDate = closeDate
    claim.Bundle.commit()
    
    Logger.logInfo("Closed Claim: " + claim.ClaimNumber)
    return claim
  }

  /**
   * Reopens a given claim
   */
  private function reopenClaim(claim : Claim) {
    claim.reopen(ClaimReopenedReason.TC_MISTAKE, DEFAULT_DESCRIPTION)
    claim.Bundle.commit()
    
    Logger.logInfo("Reopened Claim: " + claim.ClaimNumber)
  }
  
  /**
   * Associates a given claim with Report Water Catastrophe
   */
  private function setWaterCatastrophe(claim : Claim) {
    var waterCatastrophe = Query.make(Catastrophe).compare("Name", Equals, "Report Water Catastrophe").select().AtMostOneRow
    
    // OOB Auto does not have water damage loss cause
    claim.LossCause = claim.LOBCode == LOBCode.TC_AUTO ? LossCause.TC_GLASSBREAKAGE : LossCause.TC_WATERDAMAGE
    claim.Catastrophe = waterCatastrophe
    claim.Bundle.commit()
    
    Logger.logInfo("Water CAT Claim: " + claim.ClaimNumber)
  }

  /**
   * Associates a given claim with Report Fire Catastrophe
   */
  private function setFireCatastrophe(claim : Claim) {
    var fireCatastrophe = Query.make(Catastrophe).compare("Name", Equals, "Report Fire Catastrophe").select().AtMostOneRow

    claim.LossCause= LossCause.TC_FIRE
    claim.Catastrophe = fireCatastrophe
    claim.Bundle.commit()
    
    Logger.logInfo("Fire CAT Claim: " + claim.ClaimNumber)
  }
  
  /**
   * Creates a person and links with addressbook person
   */
  private function createABLinkedPerson() : Person {
    var person : Person
    gw.transaction.Transaction.runWithNewBundle( \ personBundle -> {
      person = PersonBuilder.uiReadyPerson()
              .withUniqueTaxID()
              .create(personBundle)
            
      person.createInAddressBook(true)           
    })
    
    return person
  }

  private function addMulticurrencyTransactions(claim : Claim, transactionCurrency : Currency) {    
    gw.transaction.Transaction.runWithNewBundle( \ claimBundle -> {
      var exposure = ExposureBuilder.uiReadyMedPay()
              .onClaim(claim)
              .withClaimAssignedUser()
              .withClaimAssignedGroup()
              .create(claimBundle)

      var reserveLine1 = createExposureLevelReserve(claimBundle, claim, exposure, CostType.TC_AOEXPENSE, transactionCurrency)
      createCheckAndPayment(claimBundle, claim, PaymentType.TC_PARTIAL, reserveLine1, CurrencyAmount.getStrict(100, transactionCurrency), transactionCurrency, false)
      createCheckAndPayment(claimBundle, claim, PaymentType.TC_PARTIAL, reserveLine1, CurrencyAmount.getStrict(50, transactionCurrency), transactionCurrency, true)
    })
    
    Logger.logInfo("Claim: " + claim.ClaimNumber + " - Add additional transactions with currency = " + transactionCurrency)
  }
    
}
