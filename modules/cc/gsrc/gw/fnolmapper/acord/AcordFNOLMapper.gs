package gw.fnolmapper.acord

uses gw.api.fnolmapper.FNOLMapper
uses gw.api.fnolmapper.FNOLMapperException
uses java.util.Date

uses xsd.acord.ACORD_Type
uses xsd.acord.ACORD_Type_ACORDREQ
uses xsd.acord.ClaimsNotificationAddRq_Type

uses gw.xml.xsd.types.XSDTime
uses gw.api.financials.CurrencyAmount

/**
 * Main class for mapping an ACORD XML document to an FNOL Claim. This is a reference
 * implementation only: not all ACORD properties or codes are mapped. Specific additional requirements
 * may require extension or modification of this and related classes. Type list mappings are configurable
 * using the standard TypecodeMapping mechanism with the "acord" namespace.
 * PRE: requires (and only processes) a <ClaimsNotificationAddRq> child element in the XML document
 */
@Export
class AcordFNOLMapper implements FNOLMapper 
{   
  var config:AcordConfig
  var mapperFactory:IMapperFactory
  var contactMapper:IContactMapper
  var contactManager:ContactManager
  
  construct() {
    config = new AcordConfig()
    mapperFactory = config.MapperFactory
    contactManager = new ContactManager()
    contactMapper = mapperFactory.getContactMapper()
  }
  
  /**
   * Populates Claim data from ACORD XML.
   */
  override function populateClaim(claim:Claim, acordXML:String) {
    var acordRequest = ACORD_Type.parse(acordXML).ACORDREQ
    //get first "Add Request" for Claim
    var addRequest = this.getFirstValidRequest(acordRequest)
    if(addRequest==null)
      throw new FNOLMapperException("No Claims Notification Add Request (<ClaimsNotificationAddRq>) in document")
    config.getLogger().info("Processing Claim Service Request UID=" + addRequest.RqUID!=null ? addRequest.RqUID : "Not Given")
    populatePolicy(claim.Policy, addRequest)
    populateClaimInfo(claim, addRequest.ClaimsOccurrence)
    populatePrincipals(claim, addRequest)
    populateClaimParties(claim, addRequest)
    populateLossDetails(claim, addRequest)
    populateIncidentsAndExposures(claim, addRequest)
  }
  
  //Finds the first valid Claim Add Request or returns null
  private function getFirstValidRequest(acordReq:ACORD_Type_ACORDREQ): ClaimsNotificationAddRq_Type {
    var addRequest:ClaimsNotificationAddRq_Type = null
    for(claimSvcReq in acordReq.ClaimsSvcRqs) {
      if(addRequest!=null) break;
      for(msg in claimSvcReq.CLAIMSSVCRQMSGSs) {
          if(msg.Choice.ClaimsNotificationAddRq!=null) {
            addRequest = msg.Choice.ClaimsNotificationAddRq
            break;
          }
      }
    }
    return addRequest
  }
  
  /**
   * Sets basic info on the claim.
   */
  private function populateClaimInfo(claim:Claim, claimInfo:xsd.acord.ClaimsOccurrence_Type) {
    //set loss date if present
    if(claimInfo.LossDt_elem!=null) {
      if(claimInfo.LossTime!=null)
        claim.LossDate = getDateTime(claimInfo.LossDt_elem, claimInfo.LossTime)
      else
        claim.LossDate = claimInfo.LossDt_elem.toDate()
    }
    if(claimInfo.Addr!=null)
      claim.LossLocation = mapperFactory.getAddressMapper().getAddress(claimInfo.Addr)
  }
    
  //populates Claim policy information
  private function populatePolicy(claimPolicy:Policy, req:ClaimsNotificationAddRq_Type) {
      mapperFactory.getPolicyMapper().populate(claimPolicy, req)
  }
  
  //populates Insured or Principal contacts as Claim contacts
  private function populatePrincipals(claim:Claim, req:ClaimsNotificationAddRq_Type) {
      for(contact in req.InsuredOrPrincipals) {
          var claimContact = contactMapper.getContact(contact, claim.Policy)
          if(claimContact!=null) {
            contactManager.addContact(contact.id, claimContact)
            claim.addToContacts(claimContact)
          }
      }
  }
  
  //populates the Claim parties as Claim contacts
  private function populateClaimParties(claim:Claim, claimReq:ClaimsNotificationAddRq_Type) {
      for(claimParty in claimReq.ClaimsPartys) {
        var claimContact = contactMapper.getContact(claimParty)
        if(claimContact!=null) {
          contactManager.addContact(claimParty.id, claimContact)
          claim.addToContacts(claimContact)
        }
      }
  }
  
  //populates the Loss details on the Claim
  private function populateLossDetails(claim: Claim, claimReq:ClaimsNotificationAddRq_Type) {
      var claimOccur =  claimReq.ClaimsOccurrence
      claim.LossType = config.getLossTypeMap().get(claimReq.Policy.LOBCd_elem.Text)
      claim.LossDate = getDateTime(claimOccur.LossDt_elem, claimOccur.LossTime)
      var address = claimReq.ClaimsOccurrence.Addr==null ? new Address() : 
        mapperFactory.getAddressMapper().getAddress(claimReq.ClaimsOccurrence.Addr)
      claim.LossLocation = address
      claim.JurisdictionState = address.State
      claim.LOBCode = config.getLOBTypeMap().get(claimReq.Policy.LOBCd_elem.Text)
      claim.ReportedDate = claimOccur.ClaimsReporteds[0].ReportedDt_elem.toDate()
      claim.Description = claimOccur.IncidentDesc
  }
  
  //populates the incidents and exposures on the Claim
  private function populateIncidentsAndExposures(claim: Claim, claimReq:ClaimsNotificationAddRq_Type) {
      var exposureMapper = mapperFactory.getExposureMapper(contactManager)
      var incidentMapper = mapperFactory.getIncidentMapper(contactManager)
      //Choice of one of the following...
      //auto loss
      for(autoLoss in claimReq.Choice.AutoLossInfos) {
        var incident = incidentMapper.getIncident(claim, autoLoss)
        exposureMapper.getExposure(claim, autoLoss, incident)
      }
      //general liability loss
      for(liabilityLoss in claimReq.Choice.LiabilityLossInfos) {
        var incident = incidentMapper.getIncident(claim, liabilityLoss)
        exposureMapper.getExposure(claim, liabilityLoss, incident)
      }
      //property loss
      for(propertyLoss in claimReq.Choice.PropertyLossInfos) {
        var incident = incidentMapper.getIncident(claim, propertyLoss)
        exposureMapper.getExposure(claim, propertyLoss, incident)
      }
      //worker's comp loss
      for(wcLoss in claimReq.Choice.WorkCompLossInfos) {
        if(wcLoss.EmployeeInfo!=null)
          addEmploymentData(claim, wcLoss.EmployeeInfo)
        var incident = incidentMapper.getIncident(claim, wcLoss)
        exposureMapper.getExposure(claim, wcLoss, incident)
      }

      //create incidents and exposures for claimant's ClaimsInjuredInfo, if present
      for(claimParty in claimReq.ClaimsPartys) {
        if(claimParty.hasRole(AcordUtil.ROLE_CLAIMANT)) {
          if(claimParty.ClaimsInjuredInfo!=null) {
            var incident = incidentMapper.getIncident(claim, claimParty.ClaimsInjuredInfo)
            exposureMapper.getExposure(claim, claimParty.ClaimsInjuredInfo, incident)
          }
        }
      }
  }
  
  /**
   * Additional data for Worker's Comp claims
   */
  private function addEmploymentData(claim:Claim, employeeInfo:xsd.acord.EmployeeInfo_Type) {
    var employmentData = new EmploymentData()
    employmentData.HireDate = employeeInfo.HiredDt_elem.toDate()
    employmentData.HireState = State.get(employeeInfo.HiredStateProvCd);
    employmentData.EmploymentStatus = config.getEmploymentStatusTypeMap().get(employeeInfo.EmploymentStatusCd_elem.Text)
    employmentData.DepartmentCode = employeeInfo.RegularDept
    if(employeeInfo.EmployeePays.HasElements) {
      var pay = employeeInfo.EmployeePays.first()
      employmentData.WageAmount = AcordUtil.getCurrencyAmount(pay.AvgAmt.Amt,pay.AvgAmt.CurCd)
    }
    employmentData.WagePaymentCont = employeeInfo.SalaryContinuanceInd
    employmentData.PaidFull = employeeInfo.FullPayDayInjuredInd
    if(employeeInfo.EmployeeSchedules!=null) {
      var schedule = employeeInfo.EmployeeSchedules.first()
      employmentData.NumDaysWorked = schedule.NumDaysPerWeek
      employmentData.NumHoursWorked = schedule.NumHoursPerDay
    }
    claim.InjuredOnPremises = employeeInfo.OccurredPremisesCd_elem.Text.equalsIgnoreCase("Employer")
    claim.SafetyEquipProv = employeeInfo.SafeguardsProvidedInd
    claim.SafetyEquipUsed = employeeInfo.SafeguardsUsedInd
    claim.EmploymentData = employmentData
  }
  
  //returns a java.util.Date that reflects the appropriate Date & Time
  private function getDateTime(dateElem:xsd.acord.Date, xsdTime:XSDTime) : Date {
    return dateElem.toDateTime(xsdTime)
  }
}
