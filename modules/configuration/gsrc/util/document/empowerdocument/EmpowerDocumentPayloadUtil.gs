package util.document.empowerdocument

uses java.lang.StringBuilder
uses gw.plugin.document.IDocumentTemplateDescriptor
uses com.gaic.claims.ecfdocinterface.plugin.DocumentContentSource
uses libraries.Claim_Entity.ClaimFunctions
uses util.StringUtils
uses gw.api.util.Logger
uses java.io.ByteArrayOutputStream
uses java.math.BigDecimal
uses libraries.Document_Entity.Document_Functions

class empowerDocumentPayloadUtil {
  construct() { }
  
  /**
   * Generates the payload for HP Empower Documents
   */
  @Returns("returns XML string for HP Empower document creation")
  static function buildEmpowerDocumentXML(doc:Document, desc:IDocumentTemplateDescriptor) : String {
    var empPayload = new util.document.empowerdocument.EmpowerDocumentPayload.CCBusinessObject()
    var claim = doc.Claim
    // *** Current Date ***
    empPayload.CurrentDate.CurrentDate = gw.api.util.StringUtil.formatDate(gw.api.util.DateUtil.currentDate(), "MMMMM d, yyyy")
    empPayload.CurrentDate.ShortCurrentDate = gw.api.util.StringUtil.formatDate( gw.api.util.DateUtil.currentDate(), "MM/dd/yyyy")
    empPayload.CurrentDate.CurrentYear = gw.api.util.StringUtil.formatNumber(gw.api.util.DateUtil.getYear(gw.api.util.DateUtil.currentDate() ), "####")
    
    // *** Claim Information ***
    empPayload.Claim.ClaimNumber = claim.ClaimNumber
    empPayload.Claim.OpenDate=claim.RptCreateDateExt
    empPayload.Claim.CloseDate=claim.CloseDate
    empPayload.Claim.ReopenDate=claim.ReopenDate
    empPayload.Claim.LamenessSixMonthDate=claim.get6monthExpDate()
    empPayload.Claim.ClaimOffice=(util.custom_Ext.OfficeBranchFunctions.getClaimOfficeBranch(claim)==""&&claim.AssignedGroup==null)?null:util.custom_Ext.OfficeBranchFunctions.getClaimOfficeBranch(claim) + ", " + claim.AssignedGroup
    empPayload.Claim.ClaimCloseReason=claim.ClosedOutcome
    empPayload.Claim.ReopenReason=claim.ReopenedReason
    empPayload.Claim.ProfitCenterNumber=claim.Policy.ex_Agency.ex_AgencyProfitCenter
    empPayload.Claim.ReportedBy=doc.getDisplayNameWithoutFormerAndClosed(claim.reporter.DisplayName)==""?null:doc.getDisplayNameWithoutFormerAndClosed(claim.reporter.DisplayName)
    empPayload.Claim.VetAddress=doc.vetAddress()
    empPayload.Claim.SIUClaimant=doc.getSIUClaimant()
    empPayload.Claim.SIUInvestigator=doc.getSIUInvestigator()
    empPayload.Claim.IncidentClaimant=claim.incidentclaimant.DisplayName==""?null:claim.incidentclaimant
    empPayload.Claim.ClaimantLabel=claim.incidentclaimant.DisplayName==""?null:"Claimant:"
    empPayload.Claim.Plaintiff = claim.getListOfItemsFromObjectArray(claim.plaintiff, "Contact")
    empPayload.Claim.DefenseAttorneyAndFirm = claim.getListOfItemsFromObjectArray(claim.defensecounsel, "Contact")
    
    // LossInformation
    empPayload.Claim.LossInformation.TypeLoss=claim.LOBCode.DisplayName
    empPayload.Claim.LossInformation.LossCauseAndLossDetails=claim.getLossCause()
    empPayload.Claim.LossInformation.LossCause=claim.LossCause
    empPayload.Claim.LossInformation.DetailLossCause=claim.ex_DetailLossCause
    empPayload.Claim.LossInformation.LossDueTo=claim.ex_LossDueTo
    empPayload.Claim.LossInformation.LossDescription=claim.Description
    empPayload.Claim.LossInformation.CatastropheCode=claim.Catastrophe.Name
    empPayload.Claim.LossInformation.PoliceReport=claim.getListOfItemsFromObjectArray(claim.Officials.where(\ o -> o.OfficialType=="police"), "PoliceReport")
    // Loss Location Address
    empPayload.Claim.LossInformation.LossLocation.AddressLine1=claim.LossLocation.AddressLine1
    empPayload.Claim.LossInformation.LossLocation.AddressLine2=claim.LossLocation.AddressLine2
    empPayload.Claim.LossInformation.LossLocation.City=claim.LossLocation.City
    empPayload.Claim.LossInformation.LossLocation.State=claim.LossLocation.State
    empPayload.Claim.LossInformation.LossLocation.ZipCode=claim.LossLocation.PostalCode
    empPayload.Claim.LossInformation.LossLocation.Country=claim.LossLocation.Country
    empPayload.Claim.LossInformation.LossLocation.FullStreetAddress=Document_Functions.getFullStreetAddress(claim.LossLocation)
    empPayload.Claim.LossInformation.LossLocation.CityStateZip=claim.LossLocation.CityStateZip
    // Loss Dates
    empPayload.Claim.LossInformation.DateOfLoss=gw.api.util.StringUtil.formatDate(claim.LossDate, "MM/dd/yyyy")
    empPayload.Claim.LossInformation.DateOfLossMonth=doc.getLossMonth()
    empPayload.Claim.LossInformation.DateOfLossYear=gw.api.util.StringUtil.formatNumber(gw.api.util.DateUtil.getYear(claim.LossDate), "####")
    empPayload.Claim.LossInformation.DateOfLossDay=gw.api.util.StringUtil.formatNumber(gw.api.util.DateUtil.getDayOfMonth(claim.LossDate), "##")
    empPayload.Claim.LossInformation.DateOfLossTime=gw.api.util.StringUtil.formatDate(claim.LossDate, "hh:mm:ss a")
    empPayload.Claim.LossInformation.LastLossReserveDate = claim.getLossReserveDate()
    // AssignedGroup
    empPayload.Claim.AssignedGroup.AssignedGroup=claim.AssignedGroup
    if(claim.AssignedGroup!=null){
      empPayload.Claim.AssignedGroup.Address.AddressLine1=claim.AssignedGroup.getBusinessAddress().AddressLine1
      empPayload.Claim.AssignedGroup.Address.AddressLine2=claim.AssignedGroup.getBusinessAddress().AddressLine2
      empPayload.Claim.AssignedGroup.Address.City=claim.AssignedGroup.getBusinessAddress().City
      empPayload.Claim.AssignedGroup.Address.State=claim.AssignedGroup.getBusinessAddress().State
      empPayload.Claim.AssignedGroup.Address.ZipCode=claim.AssignedGroup.getBusinessAddress().PostalCode
      empPayload.Claim.AssignedGroup.Address.FullStreetAddress=Document_Functions.getFullStreetAddress(claim.AssignedGroup.getBusinessAddress())
      empPayload.Claim.AssignedGroup.Address.CityStateZip=claim.AssignedGroup.getBusinessAddress().CityStateZip
    }
    empPayload.Claim.AssignedGroup.BranchOffice=claim.getClaimOfficeBranch()
    empPayload.Claim.AssignedGroup.Supervisor=claim.AssignedGroup.Supervisor
    // Adjuster Information
    empPayload.Claim.Adjuster.AdjusterFirstName=doc.returnAdjusterField("FirstName")
    empPayload.Claim.Adjuster.AdjusterLastName=doc.returnAdjusterField("LastName")
    empPayload.Claim.Adjuster.AdjusterFormalName=doc.returnAdjusterField("FormalName")
    
    empPayload.Claim.Adjuster.Contact.Address.AddressLine1=doc.returnAdjusterField("AddressLine1")
    empPayload.Claim.Adjuster.Contact.Address.AddressLine2=doc.returnAdjusterField("AddressLine2")
    empPayload.Claim.Adjuster.Contact.Address.City=doc.returnAdjusterField("City")
    empPayload.Claim.Adjuster.Contact.Address.State=doc.returnAdjusterField("State")
    empPayload.Claim.Adjuster.Contact.Address.ZipCode=doc.returnAdjusterField("PostalCode")
    empPayload.Claim.Adjuster.Contact.Address.FullStreetAddress =doc.returnAdjusterField("FullStreetAddress") 
    empPayload.Claim.Adjuster.Contact.Address.CityStateZip=doc.returnAdjusterField("CityStateZip")
    empPayload.Claim.Adjuster.Contact.TollFreePhone=doc.returnAdjusterField("TollFreePhone")
    empPayload.Claim.Adjuster.Contact.WorkPhone=doc.returnAdjusterField("WorkPhone")
    
    var adjusterFaxPhone = doc.returnAdjusterField("FaxPhone")
    empPayload.Claim.Adjuster.Contact.Fax = adjusterFaxPhone!=""&& adjusterFaxPhone!=null ? adjusterFaxPhone : null
    empPayload.Claim.Adjuster.Contact.FaxLabel = adjusterFaxPhone !="" && adjusterFaxPhone!=null ? "Fax" : null
    empPayload.Claim.Adjuster.Contact.Extension=claim.getClaimOwnerExtension()
    empPayload.Claim.Adjuster.Contact.Email1=doc.returnAdjusterField("Email")
    empPayload.Claim.Adjuster.AdjInitials=doc.returnAdjusterField("Initials")
    empPayload.Claim.Adjuster.AdjusterSignature=doc.returnAdjusterField("Signature")
    empPayload.Claim.Adjuster.AdjusterJobTitle=doc.Claim.AssignedUser.JobTitle
    if(empPayload.Claim.Adjuster.Contact.Address.Children.Empty)empPayload.Claim.Adjuster.Contact.Address=null
    if(empPayload.Claim.Adjuster.Contact.Children.Empty)empPayload.Claim.Adjuster.Contact=null
    // Main Contact
    empPayload.Claim.MainContact.MainContact=doc.getDisplayNameWithoutFormerAndClosed(claim.maincontact.DisplayName)==""?null:doc.getDisplayNameWithoutFormerAndClosed(claim.maincontact.DisplayName)
    empPayload.Claim.MainContact.Contact.Phone1=claim.maincontact.PrimaryPhoneValue
    empPayload.Claim.MainContact.Contact.Email1=claim.maincontact.EmailAddress1
    empPayload.Claim.MainContact.Contact.Email2=claim.maincontact.EmailAddress2
    if(empPayload.Claim.MainContact.Contact.Children.Empty) empPayload.Claim.MainContact.Contact=null
    if(empPayload.Claim.MainContact.Children.Empty) empPayload.Claim.MainContact=null
    // Certificate
    empPayload.Claim.CertificateNumber=claim.CertNumberExt
    empPayload.Claim.CertificateHolder=claim.CertHolderExt
    empPayload.Claim.LocationID=claim.CertLocationIDExt
    
    // Exposures
    empPayload.Claim.Exposures.FeatureName=doc.Exposure
    empPayload.Claim.Exposures.FeatureType=doc.getExposureValue("Type")
    empPayload.Claim.Exposures.FeatureType2=doc.Exposure.ExposureType
    empPayload.Claim.Exposures.Coverage=doc.getExposureValue("CoverageName")
    empPayload.Claim.Exposures.AmountOfInsurance=doc.getExposureValue("AmountofInsurance")==""?null:doc.getExposureValue("AmountofInsurance")
    empPayload.Claim.Exposures.Deductible=claim.formatFinancialValue(doc.getExposureValue("Deductible") as java.math.BigDecimal,0)
    
    empPayload.Claim.Exposures.LeadingInjury=doc.getExposureValue("LeadingInjury")
    empPayload.Claim.Exposures.DetailedInjury=doc.getExposureValue("DetailedInjury")
    empPayload.Claim.Exposures.MedicalTreatment=doc.getExposureValue("MedicalTreatment")
    empPayload.Claim.Exposures.Address.FullStreetAddress=doc.getExposureAddress()
    empPayload.Claim.Exposures.Address.CityStateZip=doc.getExposureValue("ExposureCityStateZip")
    if(empPayload.Claim.Exposures.Address.Children.Empty)empPayload.Claim.Exposures.Address=null
    
    empPayload.Claim.Exposures.ExposureClosedReason=doc.Exposure.ClosedOutcome.DisplayName
    empPayload.Claim.Exposures.ExposureClosedType=doc.Exposure.ClosedOutcome.Description
    empPayload.Claim.Exposures.InLitigation = doc.getExposureValue("Insuit")
    empPayload.Claim.Exposures.ReturnToWorkDate=claim.Exposures.firstWhere(\ e -> e.ExposureType=="wc_indemnity_timeloss").ReturnToWorkDateExt
  
    // Notes
    if(claim.Notes.HasElements){
      empPayload.Claim.CurrentNotes.SIUNote=claim.Notes==null?null:ClaimFunctions.latestNoteIfExists(claim.Notes.where(\ n -> n.Topic==NoteTopicType.TC_SIU))
      empPayload.Claim.CurrentNotes.MedicalIssue=claim.Notes==null?null:ClaimFunctions.latestNoteIfExists(claim.Notes.where(\ n -> n.Topic==NoteTopicType.TC_MEDICAL))
      empPayload.Claim.CurrentNotes.PlanOfAction=claim.Notes==null?null:ClaimFunctions.latestNoteIfExists(claim.Notes.where(\ n -> n.Topic==NoteTopicType.TC_PLANOFACTION))
      empPayload.Claim.CurrentNotes.Subrogation=claim.Notes==null?null:ClaimFunctions.latestNoteIfExists(claim.Notes.where(\ n -> n.Topic==NoteTopicType.TC_SUBROGATION))
    }
    
    // Claimant
    empPayload.Claim.Exposures.Claimant.Claimant=doc.getExposureValue("Claimant")
    empPayload.Claim.Exposures.Claimant.ClaimantFirst=doc.getExposureValue("ClaimantFirst")
    empPayload.Claim.Exposures.Claimant.ClaimantLast=doc.getExposureValue("ClaimantLast")
    empPayload.Claim.Exposures.Claimant.ClaimantMI=doc.getExposureValue("ClaimantMI")
    empPayload.Claim.Exposures.Claimant.ClaimantDOB=doc.getExposureValue("ClaimantDOB")
    empPayload.Claim.Exposures.Claimant.ClaimantSSN=doc.getExposureValue("ClaimantTaxID")
    empPayload.Claim.Exposures.Claimant.ClaimantOccupation=doc.getExposureValue("ClaimantOccupation")
    empPayload.Claim.Exposures.Claimant.ClaimantMaritalStatus=doc.getExposureValue("ClaimantMaritalStatus")
    empPayload.Claim.Exposures.Claimant.ClaimantAge=doc.getExposureValue("ClaimantAge")
    empPayload.Claim.Exposures.Claimant.ClaimantAverageWeeklyWage = gw.api.util.StringUtil.formatNumber(doc.getExposureValue("ClaimantAWW"), "$#,##0.00")
    empPayload.Claim.Exposures.Claimant.ClaimantDateOfHire = gw.api.util.StringUtil.formatDate(doc.getExposureValue("ClaimantDateOfHire"), "MM/dd/yyyy")
    empPayload.Claim.Exposures.Claimant.ClaimantAttorneyOrFirm = doc.getExposureValue("ClaimantAttorneyOrFirm")
    empPayload.Claim.Exposures.Claimant.EducationLevel = doc.getExposureValue("ClaimantEducationLevel")
    
    // Aviation
    empPayload.Claim.Aviation.TailNumber = claim.TailNumberExt
    empPayload.Claim.Aviation.TailNumLabel = doc.getTailNumLabel()
    
    // Claimant Contact Information
      // *** Claimant Home and Business Addresses ***
    var homeAddress : Address
    var workAddress : Address
    
    if(doc.Claim.claimant.AllAddresses.HasElements==true){
     homeAddress = doc.Claim.claimant.AllAddresses.firstWhere(\ a -> a.AddressType=="home")
     workAddress = doc.Claim.claimant.AllAddresses.firstWhere(\ a -> a.AddressType=="business")
    }
    if(homeAddress!=null){
      empPayload.Claim.Exposures.Claimant.Home.Address.AddressLine1=homeAddress.AddressLine1
      empPayload.Claim.Exposures.Claimant.Home.Address.AddressLine2=homeAddress.AddressLine2
      empPayload.Claim.Exposures.Claimant.Home.Address.City=homeAddress.City
      empPayload.Claim.Exposures.Claimant.Home.Address.State=homeAddress.State
      empPayload.Claim.Exposures.Claimant.Home.Address.ZipCode=homeAddress.PostalCode
      empPayload.Claim.Exposures.Claimant.Home.Address.FullStreetAddress=Document_Functions.getFullStreetAddress(homeAddress)
      empPayload.Claim.Exposures.Claimant.Home.Address.CityStateZip=homeAddress.CityStateZip
    }
    
    if(workAddress!=null){
      empPayload.Claim.Exposures.Claimant.Work.Address.AddressLine1 = workAddress.AddressLine1
      empPayload.Claim.Exposures.Claimant.Work.Address.AddressLine2 = workAddress.AddressLine2
      empPayload.Claim.Exposures.Claimant.Work.Address.City=workAddress.City
      empPayload.Claim.Exposures.Claimant.Work.Address.State=workAddress.State
      empPayload.Claim.Exposures.Claimant.Work.Address.ZipCode=workAddress.PostalCode
      empPayload.Claim.Exposures.Claimant.Work.Address.FullStreetAddress=Document_Functions.getFullStreetAddress(workAddress)
      empPayload.Claim.Exposures.Claimant.Work.Address.CityStateZip = workAddress.CityStateZip
    }
    if(empPayload.Claim.Exposures.Claimant.Home.Address.Children.Empty)empPayload.Claim.Exposures.Claimant.Home.Address=null
    if(empPayload.Claim.Exposures.Claimant.Home.Children.Empty)empPayload.Claim.Exposures.Claimant.Home=null
    if(empPayload.Claim.Exposures.Claimant.Work.Address.Children.Empty)empPayload.Claim.Exposures.Claimant.Work.Address=null
    if(empPayload.Claim.Exposures.Claimant.Work.Children.Empty)empPayload.Claim.Exposures.Claimant.Work=null
    if(empPayload.Claim.Exposures.Claimant.Children.Empty)empPayload.Claim.Exposures.Claimant=null
    
    empPayload.Claim.Exposures.Claimant.Contact.Email1=claim.claimant.EmailAddress1
    empPayload.Claim.Exposures.Claimant.Contact.Email2=claim.claimant.EmailAddress2
    empPayload.Claim.Exposures.Claimant.CompensabilityDecision = doc.Claim.Compensable
    empPayload.Claim.Exposures.Claimant.Dependents = doc.getDependentsOnClaim()
    empPayload.Claim.Exposures.Claimant.EmploymentStatus =  doc.getExposureValue("ClaimantEmploymentStatus") //claim.EmploymentData.EmploymentStatus
    // WorkStatus on Indemnity-Benefits
    //doc.getLatestWorkStatus()
    //empPayload.Claim.Exposures.Claimant.Contact.Phone1=doc.getExposureValue("ClaimantPhone")
    
    empPayload.Claim.Exposures.JurisdictionState = doc.getExposureValue("JurisdictionState")
    empPayload.Claim.Exposures.JurisdictionCountry = doc.getExposureValue("JurisdictionCountry")
    
    // Insured
    empPayload.Claim.Insured.Insured = claim.Insured.PrimaryContact!=null?doc.getDisplayNameWithoutFormerAndClosed(claim.Insured.PrimaryContact):doc.getDisplayNameWithoutFormerAndClosed(claim.Insured)
    if(typeof claim.Insured == Person){
      empPayload.Claim.Insured.InsuredFirstName=(claim.Insured as Person).FirstName
      empPayload.Claim.Insured.InsuredLastName=(claim.Insured as Person).LastName
      empPayload.Claim.Insured.InsuredMiddleName=(claim.Insured as Person).MiddleName
    }
    else{
      empPayload.Claim.Insured.InsuredFirstName=null
      empPayload.Claim.Insured.InsuredLastName=null
      empPayload.Claim.Insured.InsuredMiddleName=null
    }
    empPayload.Claim.Insured.Contact.Address.AddressLine1=claim.Insured.PrimaryAddress.AddressLine1
    empPayload.Claim.Insured.Contact.Address.AddressLine2=claim.Insured.PrimaryAddress.AddressLine2
    empPayload.Claim.Insured.Contact.Address.City=claim.Insured.PrimaryAddress.City
    empPayload.Claim.Insured.Contact.Address.State=claim.Insured.PrimaryAddress.State
    empPayload.Claim.Insured.Contact.Address.ZipCode=claim.Insured.PrimaryAddress.PostalCode
    empPayload.Claim.Insured.Contact.Address.FullStreetAddress=doc.getInsuredAddress()==""?null:doc.getInsuredAddress()
    empPayload.Claim.Insured.Contact.Address.CityStateZip=claim.Insured.PrimaryAddress.CityStateZip
    empPayload.Claim.Insured.Contact.Phone1=doc.getInsuredPrimaryPhone()==""?null:doc.getInsuredPrimaryPhone()
    empPayload.Claim.Insured.Contact.Phone2=doc.getInsuredAlternatePhone()==""?null:doc.getInsuredAlternatePhone()
    empPayload.Claim.Insured.Contact.BestPhone=claim.Insured.PrimaryContact!=null?claim.Insured.PrimaryContact.PrimaryPhoneValue:claim.Insured.PrimaryPhoneValue
    if(empPayload.Claim.Insured.Contact.Children.Empty)empPayload.Claim.Insured.Contact=null
    
    empPayload.Claim.Insured.InsuredFormal=claim.Insured typeis Person && claim.Insured.Prefix!=null?claim.Insured.Prefix.DisplayName+" "+doc.getDisplayNameWithoutFormerAndClosed(claim.Insured.DisplayName):doc.getDisplayNameWithoutFormerAndClosed(claim.Insured.DisplayName)
    empPayload.Claim.Insured.InsuredContact=claim.Insured.PrimaryContact!=null?doc.getDisplayNameWithoutFormerAndClosed(claim.Insured.PrimaryContact):doc.getDisplayNameWithoutFormerAndClosed(claim.Insured)
    empPayload.Claim.Insured.DBA=claim.Policy.doingbusinessas
    
    empPayload.Claim.Insured.MoreNamedInsureds=doc.getMoreNamedInsuredsEmp()
    //Vehicle Info
    empPayload.Claim.Exposures.VehicleInfo.VehicleYear=doc.getExposureValue("VehicleYear")
    empPayload.Claim.Exposures.VehicleInfo.VehicleMake=doc.getExposureValue("VehicleMake")
    empPayload.Claim.Exposures.VehicleInfo.VehicleModel=doc.getExposureValue("VehicleModel")
    // VIN Number
    var vehVin = doc.getExposureValue("VehicleVin")
    empPayload.Claim.Exposures.VehicleInfo.VehicleVin=vehVin
    // Last 4 digits of VIN number
    if(vehVin!=null and vehVin!=""){
      if(vehVin.length>4){empPayload.Claim.Exposures.VehicleInfo.LastFourDigitsVIN=vehVin.substring(vehVin.length-4, vehVin.length)}
      else{empPayload.Claim.Exposures.VehicleInfo.LastFourDigitsVIN=vehVin}
    }
    else{empPayload.Claim.Exposures.VehicleInfo.LastFourDigitsVIN=null}
    
    empPayload.Claim.Exposures.VehicleInfo.VehicleMileageOdometer=doc.getExposureValue("VehicleOdometerMileage")
    
    // Driver Info
    empPayload.Claim.Exposures.VehicleInfo.Driver.DriverFirstName=doc.getExposureValue("DriverFirstName")
    empPayload.Claim.Exposures.VehicleInfo.Driver.DriverLastName=doc.getExposureValue("DriverLastName")
    empPayload.Claim.Exposures.VehicleInfo.Driver.DriverMiddleName=doc.getExposureValue("DriverMiddleName")
    empPayload.Claim.Exposures.VehicleInfo.Driver.Contact.Address.AddressLine1=doc.getExposureValue("DriverAddressLine1")
    empPayload.Claim.Exposures.VehicleInfo.Driver.Contact.Address.AddressLine2=doc.getExposureValue("DriverAddressLine2")
    empPayload.Claim.Exposures.VehicleInfo.Driver.Contact.Address.City=doc.getExposureValue("DriverAddressCity")
    empPayload.Claim.Exposures.VehicleInfo.Driver.Contact.Address.State=doc.getExposureValue("DriverAddressState")
    empPayload.Claim.Exposures.VehicleInfo.Driver.Contact.Address.ZipCode=doc.getExposureValue("DriverAddressZipCode")
    empPayload.Claim.Exposures.VehicleInfo.Driver.Contact.Address.FullStreetAddress=doc.getExposureValue("DriverAddressFullStreet")
    empPayload.Claim.Exposures.VehicleInfo.Driver.Contact.Address.CityStateZip=doc.getExposureValue("DriverAddressCityStateZip")
    empPayload.Claim.Exposures.VehicleInfo.Driver.Contact.Phone1=doc.getExposureValue("DriverPhone")
    empPayload.Claim.Exposures.VehicleInfo.Driver.Contact.Email1=doc.getExposureValue("DriverEmail")
    if(empPayload.Claim.Exposures.VehicleInfo.Driver.Contact.Address.Children.Empty)empPayload.Claim.Exposures.VehicleInfo.Driver.Contact.Address=null
    if(empPayload.Claim.Exposures.VehicleInfo.Driver.Contact.Children.Empty)empPayload.Claim.Exposures.VehicleInfo.Driver.Contact=null
    if(empPayload.Claim.Exposures.VehicleInfo.Driver.Children.Empty)empPayload.Claim.Exposures.VehicleInfo.Driver=null
    if(empPayload.Claim.Exposures.VehicleInfo.Children.Empty)empPayload.Claim.Exposures.VehicleInfo=null
    // Animal Info
    empPayload.Claim.Exposures.AnimalInfo.Breed=doc.getExposureValue("Breed")
    empPayload.Claim.Exposures.AnimalInfo.BreedUse=doc.getExposureValue("Use")
    empPayload.Claim.Exposures.AnimalInfo.BreedUse2=doc.getExposureValue("Use2")
    empPayload.Claim.Exposures.AnimalInfo.Barn=doc.getExposureValue("Barn")
    empPayload.Claim.Exposures.AnimalInfo.HorseNumber=doc.getAnimalNumber()==""?null:doc.getAnimalNumber()
    empPayload.Claim.Exposures.AnimalInfo.AnimalName=doc.getExposureValue("AnimalName")
    empPayload.Claim.Exposures.AnimalInfo.AnimalDescription=doc.animalDescription()==""?null:doc.animalDescription()
    empPayload.Claim.Exposures.AnimalInfo.Venue=doc.getExposureValue("SuitVenue")
    empPayload.Claim.Exposures.AnimalInfo.Insuit=doc.getExposureValue("Insuit")
    empPayload.Claim.Exposures.AnimalInfo.Age=doc.getExposureValue("Age")==""?null:doc.getExposureValue("Age")
    empPayload.Claim.Exposures.AnimalInfo.Sex=doc.getExposureValue("Sex")
    empPayload.Claim.Exposures.AnimalInfo.TrainerName=doc.getExposureValue("Trainer")==""?null:doc.getExposureValue("Trainer")
    empPayload.Claim.Exposures.AnimalInfo.TrainerPhone=doc.getExposureValue("TrainerPhone")
    if(empPayload.Claim.Exposures.AnimalInfo.Children.Empty)empPayload.Claim.Exposures.AnimalInfo=null
    // Vet Info
    empPayload.Claim.Exposures.VetInfo.Vet=doc.getExposureValue("VetName")==""?null:doc.getExposureValue("VetName")
    empPayload.Claim.Exposures.VetInfo.VetContact.Address.AddressLine1=doc.getExposureValue("VetAddr")
    empPayload.Claim.Exposures.VetInfo.VetContact.Address.AddressLine2=doc.getExposureValue("VetAddr2")
    empPayload.Claim.Exposures.VetInfo.VetContact.Address.FullStreetAddress=doc.getExposureValue("VetFullStreetAddress")
    empPayload.Claim.Exposures.VetInfo.VetContact.Address.CityStateZip=doc.getExposureValue("VetCityStZip")
    empPayload.Claim.Exposures.VetInfo.VetContact.Phone1=doc.getExposureValue("VetPhone")
    empPayload.Claim.Exposures.VetInfo.VetContact.Fax=doc.getExposureValue("Fax")
      // EQVet - MailToContact
    empPayload.Claim.Exposures.VetInfo.EQVet.EQVet=claim.PrimaryDoctor
    empPayload.Claim.Exposures.VetInfo.EQVet.EQVetAddress.AddressLine1=(doc.MailToExt==null||doc.MailToExt.PrimaryAddress == null)?null:doc.MailToExt.PrimaryAddress.AddressLine1
    empPayload.Claim.Exposures.VetInfo.EQVet.EQVetAddress.AddressLine2=(doc.MailToExt==null||doc.MailToExt.PrimaryAddress == null)?null:doc.MailToExt.PrimaryAddress.AddressLine2
    empPayload.Claim.Exposures.VetInfo.EQVet.EQVetAddress.FullStreetAddress=(doc.MailToExt==null||doc.MailToExt.PrimaryAddress == null)?null: Document_Functions.getFullStreetAddress(doc.MailToExt.PrimaryAddress)
    empPayload.Claim.Exposures.VetInfo.EQVet.EQVetAddress.CityStateZip=(doc.MailToExt==null||doc.MailToExt.PrimaryAddress == null)?null:doc.MailToExt.PrimaryAddress.CityStateZip
    if(empPayload.Claim.Exposures.VetInfo.VetContact.Address.Children.Empty)empPayload.Claim.Exposures.VetInfo.VetContact.Address=null
    if(empPayload.Claim.Exposures.VetInfo.VetContact.Children.Empty)empPayload.Claim.Exposures.VetInfo.VetContact=null
    // Policy
    empPayload.Claim.Policy.PolicyNumber=claim.Policy.PolicyNumber
    empPayload.Claim.Policy.PolicySymbol=claim.Policy.PolicyType
    empPayload.Claim.Policy.PolicyEffectiveDate=claim.Policy.EffectiveDate
    empPayload.Claim.Policy.PolicyExpirationDate=claim.Policy.ExpirationDate
    empPayload.Claim.Policy.PolicyExp12=claim.Policy!=null?claim.Policy.get12monthExpDate():null
    empPayload.Claim.Policy.PolicyExp3=claim.Policy!=null?claim.Policy.get3monthExpDate():null
    empPayload.Claim.Policy.IssuingCompany=claim.Policy.IssuingCompanyExt.DisplayName
    empPayload.Claim.Policy.ProfitCenter=claim.Policy.ex_Agency.AgencyProfitCenterNameExt
    empPayload.Claim.Policy.Mod=claim.Policy.PolicySuffix
    empPayload.Claim.Policy.Underwriter=claim.Policy.underwriter == null ? "Underwriting Department" : claim.Policy.underwriter
    empPayload.Claim.Policy.Obligee=claim.getObligee()
    empPayload.Claim.Policy.Indemnitor=claim.getIndemnitor()
    
    // Producer / Agency
    empPayload.Claim.Policy.Producer.ProducerName=claim.Policy.ex_Agency.DisplayName
    empPayload.Claim.Policy.Producer.ProducerContact.Address.AddressLine1=claim.Policy.ex_Agency.PrimaryAddress.AddressLine1
    empPayload.Claim.Policy.Producer.ProducerContact.Address.AddressLine2=claim.Policy.ex_Agency.PrimaryAddress.AddressLine2
    empPayload.Claim.Policy.Producer.ProducerContact.Address.City=claim.Policy.ex_Agency.PrimaryAddress.City
    empPayload.Claim.Policy.Producer.ProducerContact.Address.State=claim.Policy.ex_Agency.PrimaryAddress.State
    empPayload.Claim.Policy.Producer.ProducerContact.Address.ZipCode=claim.Policy.ex_Agency.PrimaryAddress.PostalCode
    empPayload.Claim.Policy.Producer.ProducerContact.Address.FullStreetAddress=Document_Functions.getFullStreetAddress(claim.Policy.ex_Agency.PrimaryAddress)
    empPayload.Claim.Policy.Producer.ProducerContact.Address.CityStateZip=claim.Policy.ex_Agency.PrimaryAddress.CityStateZip
    if(empPayload.Claim.Policy.Producer.ProducerContact.Address.Children.Empty)empPayload.Claim.Policy.Producer.ProducerContact.Address=null
    if(empPayload.Claim.Policy.Producer.ProducerContact.Children.Empty)empPayload.Claim.Policy.Producer.ProducerContact=null
    if(empPayload.Claim.Policy.Producer.Children.Empty)empPayload.Claim.Policy.Producer=null

    // Reported Date
    empPayload.Claim.ReportedDate=gw.api.util.StringUtil.formatDate(claim.ReportedDate, "MM/dd/yyyy")
    empPayload.Claim.ReportedDateTime=gw.api.util.StringUtil.formatDate(claim.ReportedDate, "hh:mm a" )
    // Dates
    empPayload.Claim.DeathDate=claim.DeathDate
    empPayload.Claim.DeathDateTime=gw.api.util.StringUtil.formatDate(claim.DeathDate, "hh:mm:ss a")
    // Financial Info
    empPayload.Claim.FinancialInfo.TotalIncurred = claim.getTotalIncurred()
    empPayload.Claim.FinancialInfo.PaidLoss=claim.getClaimCostTotals()
    empPayload.Claim.FinancialInfo.Recoveries=claim.formatFinancialValue(claim.ClaimRpt.TotalRecoveries,0)
    empPayload.Claim.FinancialInfo.RecoveryEstimates=claim.formatFinancialValue(claim.ClaimRpt.OpenRecoveryReserves,0)
    empPayload.Claim.FinancialInfo.TotalExpense=claim.getExpenseTotals()
    empPayload.Claim.FinancialInfo.ExpenseLossReserve=claim.getLossReserve()
    empPayload.Claim.FinancialInfo.OpenReserves=claim.formatFinancialValue(doc.getExposureValue("OpenReserves"),0)
    empPayload.Claim.FinancialInfo.OpenReservesNull=claim.formatFinancialValue(doc.getExposureValue("OpenReserves"),null)
    empPayload.Claim.FinancialInfo.NDLossPay=claim.formatFinancialValue(doc.getSimillarPayments("el_Indemnity","claimcost"),null)
    empPayload.Claim.FinancialInfo.NDExpPay=claim.formatFinancialValue(doc.getSimillarPayments("el_Indemnity","expense"),null)
    empPayload.Claim.FinancialInfo.NDLossRes=claim.formatFinancialValue(doc.getsimillarReserves("el_Indemnity","claimcost"),null)
    empPayload.Claim.FinancialInfo.NDExpRes=claim.formatFinancialValue(doc.getsimillarReserves("el_Indemnity","expense"),null)
    empPayload.Claim.FinancialInfo.B1LossPay=claim.formatFinancialValue(doc.getSimillarPayments("el_DutyDefWthnLimits","claimcost"),null)
    empPayload.Claim.FinancialInfo.B1ExpPay=claim.formatFinancialValue(doc.getSimillarPayments("el_DutyDefWthnLimits","expense"), null)
    empPayload.Claim.FinancialInfo.B1LossRes=claim.formatFinancialValue(doc.getsimillarReserves("el_DutyDefWthnLimits","claimcost"),null)
    empPayload.Claim.FinancialInfo.B1ExpRes=claim.formatFinancialValue(doc.getsimillarReserves("el_DutyDefWthnLimits","expense"), null)
    empPayload.Claim.FinancialInfo.B2LossPay=claim.formatFinancialValue(doc.getSimillarPayments("el_DutyDefOtsdLimits","claimcost"),null)
    empPayload.Claim.FinancialInfo.B2ExpPay=claim.formatFinancialValue(doc.getSimillarPayments("el_DutyDefOtsdLimits","expense"), null)
    empPayload.Claim.FinancialInfo.B2LossRes=claim.formatFinancialValue(doc.getsimillarReserves("el_DutyDefOtsdLimits","claimcost"),null)
    empPayload.Claim.FinancialInfo.B2ExpRes=claim.formatFinancialValue(doc.getsimillarReserves("el_DutyDefOtsdLimits","expense"),null)
    empPayload.Claim.FinancialInfo.CELossPay=claim.formatFinancialValue(doc.getSimillarPayments("el_LossAdjustExp","claimcost"),null)
    empPayload.Claim.FinancialInfo.CEExpPay=claim.formatFinancialValue(doc.getSimillarPayments("el_LossAdjustExp","expense"),null)
    empPayload.Claim.FinancialInfo.CELossRes=claim.formatFinancialValue(doc.getsimillarReserves("el_LossAdjustExp","claimcost"),null)
    empPayload.Claim.FinancialInfo.CEExpRes=claim.formatFinancialValue(doc.getsimillarReserves("el_LossAdjustExp","expense"),null)
    empPayload.Claim.FinancialInfo.PolicyForm=claim.PolicyFormExt
    empPayload.Claim.FinancialInfo.NoticeDate=claim.NoticeDateExt
    empPayload.Claim.FinancialInfo.DeductibleExt=doc.getExposureValue("DeductibleExt")
    empPayload.Claim.FinancialInfo.AggregateLimitExt=claim.formatFinancialValue(doc.getExposureValue("ExposureCoverage"), null)

    //var incurredExpenseReserveIncludingRecoveries = gw.api.util.StringUtil.formatNumber(claim.getTotalExpenseReserve(), "#,##0.00")
    //print ("incurred Reserve Including Recoveries: "+ incurredExpenseReserveIncludingRecoveries)
    //var total = claim.getTotalIncurredIncludingRecovery()
    //print("Total Incurred on a claim: "+total)

    // Evaluations
    // ** Indemnity
    empPayload.Claim.FinancialInfo.IndemnityEvaluation.IndemnityEvaluationReserve = claim.formatFinancialValue(claim.getLossReserveForExposure("Indemnity"), 0)
    empPayload.Claim.FinancialInfo.IndemnityEvaluation.IndemnityEvaluationRationale = claim.latestReserveRationale(ExposureType.TC_WC_INDEMNITY_TIMELOSS)
    // ** Med Loss
    empPayload.Claim.FinancialInfo.MedicalEvaluation.MedicalEvaluationReserve = claim.formatFinancialValue(claim.getLossReserveForExposure("Medical"), 0)
    empPayload.Claim.FinancialInfo.MedicalEvaluation.MedicalEvaluationRationale = claim.latestReserveRationale(ExposureType.TC_WC_MEDICAL_DETAILS)
    // ** VocRehab
    empPayload.Claim.FinancialInfo.VocRehabEvaluation.VocRehabEvaluationReserve = claim.formatFinancialValue(claim.getLossReserveForExposure("Vocational Rehab"), 0)
    empPayload.Claim.FinancialInfo.VocRehabEvaluation.VocRehabEvaluationRationale = claim.latestReserveRationale(ExposureType.TC_WC_VOCATIONAL_REHAB)

    // *** Document ***
    empPayload.Document.DocumentName=desc.Name
    empPayload.Document.TemplateId=desc.TemplateId
    empPayload.Document.DocuName=doc.FormIDExt
    empPayload.Document.CCAgency=doc.getCCUsers(true, true)==""?null:doc.getCCUsers(true, true)
    empPayload.Document.CCNoAgency=doc.getCCUsers(false, true)==""?null:doc.getCCUsers(false, true)
    empPayload.Document.MatterType=doc.Matter.MatterType
    // Send To
    empPayload.Document.SendTo.SendTo=doc.getDisplayNameWithoutFormerAndClosed(doc.MailToExt)
    empPayload.Document.SendTo.Contact.Address.AddressLine1=(doc.MailToExt == null || doc.MailToExt.PrimaryAddress == null) ? null : doc.MailToExt.PrimaryAddress.AddressLine1
    empPayload.Document.SendTo.Contact.Address.AddressLine2=(doc.MailToExt == null || doc.MailToExt.PrimaryAddress == null) ? null : doc.MailToExt.PrimaryAddress.AddressLine2
    empPayload.Document.SendTo.Contact.Address.City=(doc.MailToExt == null || doc.MailToExt.PrimaryAddress == null) ? null : doc.MailToExt.PrimaryAddress.City
    empPayload.Document.SendTo.Contact.Address.State=(doc.MailToExt == null || doc.MailToExt.PrimaryAddress == null) ? null : doc.MailToExt.PrimaryAddress.State
    empPayload.Document.SendTo.Contact.Address.ZipCode=(doc.MailToExt == null || doc.MailToExt.PrimaryAddress == null) ? null : doc.MailToExt.PrimaryAddress.PostalCode
    empPayload.Document.SendTo.Contact.Address.FullStreetAddress=(doc.MailToExt == null || doc.MailToExt.PrimaryAddress == null) ? null : Document_Functions.getFullStreetAddress(doc.MailToExt.PrimaryAddress)
    empPayload.Document.SendTo.Contact.Address.CityStateZip=(doc.MailToExt == null || doc.MailToExt.PrimaryAddress == null) ? null : doc.MailToExt.PrimaryAddress.CityStateZip
    empPayload.Document.SendTo.Contact.Fax=doc.MailToExt.FaxPhone
    empPayload.Document.SendTo.Contact.Phone1=doc.getSendToPhone()
    empPayload.Document.SendTo.Contact.Email1=doc.MailToExt.EmailAddress1 ==""?null:doc.MailToExt.EmailAddress1 
    
    empPayload.Document.RelatedTo = doc.getRelatedToValue()
    
    //empPayload.Document.Signature=doc.adjustersignature()
    empPayload.Document.ClaimAssociation=doc.claimassociation()
    empPayload.Document.ClaimsManager.ClaimsManager=doc.getClaimsManager()
    empPayload.Document.ClaimsManager.ClaimsManagerPhone=doc.getClaimsManagerPhone()
    if(empPayload.Document.ClaimsManager.Children.Empty)empPayload.Document.ClaimsManager=null
    
    empPayload.Document.TypeOfLoss=doc.getLossType()
    empPayload.Document.User=doc.Author
    empPayload.Document.CorpClaims=doc.getClaimsAssignment()
    empPayload.Document.LossType=doc.getLossTypeDivision()==""?null:doc.getLossTypeDivision()
    empPayload.Document.LobName=doc.getLobDivsionClaims()==""?null:doc.getLobDivsionClaims()
    empPayload.Document.POAddress=doc.getPOAdd()==""?null:doc.getPOAdd()
    empPayload.Document.CityAdd=doc.getCityAdd()==""?null:doc.getCityAdd()
    empPayload.Document.Phone1=doc.getPrimaryPhone()==""?null:doc.getPrimaryPhone()
    empPayload.Document.Phone2=doc.getSecondaryPhone()==""?null:doc.getSecondaryPhone()
    empPayload.Document.Fax=doc.getFaxNum()==""?null:doc.getFaxNum()
    empPayload.Document.DescOfRisk=doc.getDescOfRisk()
    // Created By
    if(gw.plugin.util.CurrentUserUtil.getCurrentUser().User!=null){
      empPayload.Document.CreatedBy.CreatedByInitials=gw.plugin.util.CurrentUserUtil.getCurrentUser().User.Contact.getContactInitials().toLowerCase()
      empPayload.Document.CreatedBy.CreatedByName=gw.plugin.util.CurrentUserUtil.getCurrentUser().User
    }
    // Legal Actions Initial Assignment Letter
    empPayload.Document.LegalActionsInitialAssignmentLetter.CaseCaption=doc.Matter.CaseCaption
    empPayload.Document.LegalActionsInitialAssignmentLetter.CaseNumber=doc.Matter.CaseNumber
    empPayload.Document.LegalActionsInitialAssignmentLetter.ViaEmailTo=doc.MailToExt.EmailAddress1==""?null:"Via email to"
    empPayload.Document.LegalActionsInitialAssignmentLetter.LegalActionClaimants=doc.getLegalActionClaimantsTemplateDisplay()==""?null:doc.getLegalActionClaimantsTemplateDisplay()
    empPayload.Document.LegalActionsInitialAssignmentLetter.LeadCounsel=doc.LeadCounsel
    // Dynamic Header Text
    //empPayload.Document.DynamicHeaderText.AdjusterMailingSignature=doc.adjusterMailingSignature()
    // Adjuster Mailing Address
    var adjMailingAddress = doc.adjusterMailingAddress()
    empPayload.Document.DynamicHeaderText.AdjusterMailingAddress.AddressLine1 = adjMailingAddress.AddressLine1
    empPayload.Document.DynamicHeaderText.AdjusterMailingAddress.AddressLine2 = adjMailingAddress.AddressLine2
    empPayload.Document.DynamicHeaderText.AdjusterMailingAddress.City = adjMailingAddress.City
    empPayload.Document.DynamicHeaderText.AdjusterMailingAddress.State = adjMailingAddress.State
    empPayload.Document.DynamicHeaderText.AdjusterMailingAddress.ZipCode = adjMailingAddress.PostalCode
    empPayload.Document.DynamicHeaderText.AdjusterMailingAddress.FullStreetAddress = doc.getFullStreetAddress(adjMailingAddress)
    empPayload.Document.DynamicHeaderText.AdjusterMailingAddress.CityStateZip = adjMailingAddress.CityStateZip
    
    empPayload.Document.DynamicHeaderText.addDivision=(doc.Claim.NCWOnlyBusinessUnitExt.DisplayName == "ab" || doc.Claim.NCWOnlyBusinessUnitExt.DisplayName == "eq") ? " Division" : null
    empPayload.Document.DynamicHeaderText.TradeMark=doc.Claim.NCWOnlyBusinessUnitExt.DisplayName == "ab" ? "®" : null
    empPayload.Document.DynamicHeaderText.BusinessUnit=doc.Claim.AssignedUser!=null?doc.Claim.AssignedUser.getUserBusinessUnit():null   //doc.getLossTypes()
    empPayload.Document.DynamicHeaderText.DivisionName=doc.getDivisionName()==""?null:doc.getDivisionName() 
    
    // Generating XML Payload
    var out = new ByteArrayOutputStream()
    var ixmlNF = new util.document.empowerdocument.EmpowerIXMLNodeFormat()
    empPayload.writeTo(out, ixmlNF)
    var result : String = out.toString("UTF-8")
    return  result //empPayload.asUTFString()
  } // end buildEmpowerDocumentXML function
  
  @Returns("returns ecfMetadata XML for HP Empower document finalizing")
  static function ecfMetadataForFinalizing(doc:Document) : String {
    // CC_Feature
    var feature = DocumentContentSource.getExposureTypeLit(doc);
    if (feature == null) feature = "";
    
    // ClaimOffice
    var claimOffice = DocumentContentSource.getClaimOffice(doc.Claim.LOBCode);
    
    // SecurityGroup
    var securityGroup = "Spec Gen";
    if (doc.Claim.BusinessLineExt == "FIDCRIME") securityGroup = "Fidelity and Crime";
    
    // Claimant name
    var claimant = DocumentContentSource.getClaimant(doc.Claim, doc.Exposure, doc);
    var claimantName = DocumentContentSource.getClaimantName(claimant);
    if(claimantName != null){
      if (claimantName.length()>50){
        claimantName = claimantName.substring(0, 50);
      }
      claimantName=StringUtils.getXMLValue(claimantName, false);
    }
    // Insured name
    var insuredName = "";
    if (doc.Claim.Insured != null){
      insuredName = doc.Claim.Insured.toString();
      if (insuredName.length()>60) {
        insuredName = insuredName.substring(0, 60);
      }
      insuredName = StringUtils.getXMLValue(insuredName, false);
    }
    // BatchNumber
    var batchNumber = DocumentContentSource.getDatabaseNameForEnvironment();
    
    var ecfMetadata = new StringBuilder() 
    ecfMetadata.append("<MetadataList>")
    ecfMetadata.append("<TemplateID>" + doc.Name + "</TemplateID>")
    ecfMetadata.append("<ClaimNumber>" + doc.Claim.ClaimNumber + "</ClaimNumber>")
    ecfMetadata.append("<BatchNumber>"+batchNumber+"</BatchNumber>")
    ecfMetadata.append("<InsuredName>"+insuredName.replaceAll("<","&lt;").replaceAll(">","&gt;")+"</InsuredName>")
    ecfMetadata.append("<ClaimantName>"+claimantName.replaceAll("<","&lt;").replaceAll(">","&gt;")+"</ClaimantName>")
    ecfMetadata.append("<SecurityGroup>"+securityGroup+"</SecurityGroup>")
    ecfMetadata.append("<ClaimOffice>"+claimOffice+"</ClaimOffice>")
    ecfMetadata.append("<CC_Feature>"+ feature + "</CC_Feature>")
    ecfMetadata.append("<CC_DocumentIdentifier>"+ doc.ECFIDExt + "</CC_DocumentIdentifier>")
    ecfMetadata.append("<DocComment>"+ doc.Description.replaceAll("<","&lt;").replaceAll(">","&gt;") + "</DocComment>")
    
    if(doc.ProcessMethod==EmailProcessMethod.TC_FORWARD_TO_ADJUSTER){
      var userID = doc.Claim.getAssignedUser().getCredential().getUserName();
      ecfMetadata.append("<Login>"+ userID +"</Login>")  
      ecfMetadata.append("<RouteBox>"+ userID +"</RouteBox>") 
      ecfMetadata.append("<RouteNote>Imported from ClaimCenter</RouteNote>")   
    } 
    else{
      ecfMetadata.append("<Login></Login>")  
      ecfMetadata.append("<RouteBox></RouteBox>") 
      ecfMetadata.append("<RouteNote></RouteNote>")
    }
    ecfMetadata.append("</MetadataList>")
    var result = ecfMetadata.toString()
    // Replacing all ampersands in the payload with HTML representation &amp;, except in &lt; and &gt;
    result = doc.replaceAmpSymbol(result)
    return result
  } //end ecfMetadataForFinalizing function
}//end empPayloadUtil class
