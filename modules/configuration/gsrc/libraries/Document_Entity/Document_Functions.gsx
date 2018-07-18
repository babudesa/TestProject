package libraries.Document_Entity
uses java.util.Collections
uses java.util.ArrayList
uses com.gaic.integration.cc.centralprint.plugin.CentralPrint;
uses java.lang.StringBuilder
uses gaic.plugin.cc.document.EmpowerDocumentUtil
uses gw.util.Pair
uses gw.api.util.Logger
uses gaic.plugin.cc.document.EmpowerDocumentUtil
    
enhancement Document_Functions : entity.Document {

  /*This method checks for ID at the beginning of 
   *the docuID, if it exists we know that it hasn&amp;apos;t
   *been processed by ECF yet, otherwise it has.
   */
  function checkForID() : boolean{
    if(this.DocUID == null) return true;
    if(this.DocUID.startsWith("ID")) return true;
    if (EmpowerDocumentUtil.isUnFinalizedEmpowerDocument(this)) return true;
    if (EmpowerDocumentUtil.isFinalizedEmpowerDocumentPreECF(this)) return true;
    return false;
  }
  
  function getRelatedToValue():String{
    if(this.IsMatterRelated)
      return  this.Matter
    return this.RelatedTo
  }
  
  function getFixedPropIncident():FixedPropertyIncident{
    try{
      var fpi:FixedPropertyIncident = null;
  
      if(this.Claim.Exposures.length > 0){
        fpi = this.Claim.Exposures[0].FixedPropertyIncident;

      }
      else if(this.Claim.FixedPropertyIncidentsOnly.length > 0){
        fpi = this.Claim.FixedPropertyIncidentsOnly[0]
      }
      return fpi;
    }
    catch(e){
      gw.api.util.Logger.logError( "Error occurred in getfixedpropincident in documentextensions" );
      return null;  
    }
  }
  /*This method takes a field name (user defined) looks it up and
   *returns the value of that pre-define field name back to the user
   *this method is used in documents to avoid stack traces as a result
   *of a user not choosing a feature from the drop down list on a 
   *document that uses a feature to grab data.
   */
   //updated sprzygocki 4/11/11 - Changed Property.Location to Property.LocationNumber
  public function getExposureValue(fieldName : String) : String{

      if(this.RelatedTo.IntrinsicType.TypeInfo == Exposure.Type.TypeInfo){ //check to see if related object is an exposure
        var exp = this.RelatedTo as Exposure;
        var vet = exp.FixedPropertyIncident.VeterinarianExt
          
        if(fieldName.equalsIgnoreCase( "AnimalName")){
          return exp.FixedPropertyIncident.Property.LocationNumber;
        }
        if(fieldName.equalsIgnoreCase( "Barn")){
          return exp.FixedPropertyIncident.Property.ex_BarnName;
        }
        if(fieldName.equalsIgnoreCase( "ExposureAddress1")){
          return exp.FixedPropertyIncident.Property.Address.AddressLine1
        }
        if(fieldName.equalsIgnoreCase( "ExposureAddress2")){
          return exp.FixedPropertyIncident.Property.Address.AddressLine2
        }
        if(fieldName.equalsIgnoreCase( "ExposureCityStateZip")){
          return exp.FixedPropertyIncident.Property.Address.CityStateZip
        }
        if(fieldName.equalsIgnoreCase( "Use")){
          return exp.FixedPropertyIncident.Property.ex_AnimalUse.DisplayName;
         }
        if(fieldName.equalsIgnoreCase( "Use 2")){
          return exp.FixedPropertyIncident.Property.AnimalUse2Ext.DisplayName;
        }
        if(fieldName.equalsIgnoreCase( "Breed")){
          return exp.FixedPropertyIncident.Property.ex_Breed.DisplayName;
        }
        if(fieldName.equalsIgnoreCase( "Sex")){
          return exp.FixedPropertyIncident.Property.ex_Sex.DisplayName;
        }
        if(fieldName.equalsIgnoreCase( "Age")){
  //        6/18/09 - birth year should be used for age - KBirdseye said in an email dated 6/16/09
  //        return exp.FixedPropertyIncident.Property.getAge();
          if (exp.FixedPropertyIncident.Property.ex_DateofBirth == null) return "N/A";
          return exp.FixedPropertyIncident.Property.ex_DateofBirth.toString();
        }
        
        if(fieldName.equalsIgnoreCase( "Trainer")){        
          return exp.FixedPropertyIncident.PrimaryTrainer.DisplayName
        }
        if(fieldName.equalsIgnoreCase( "TrainerPhone")){
          return exp.FixedPropertyIncident.PrimaryTrainer.PrimaryPhoneValue
        }
     
        if(fieldName.equalsIgnoreCase( "VetName")){
          if (vet.Subtype == "Doctor" || vet.Subtype == "Ex_ForeignPersonVndr") {
            if (vet typeis Person && vet.Prefix != null) {
              return vet.Prefix.DisplayName + " " + vet.DisplayName
            } else {
              return this.getDisplayNameWithoutFormerAndClosed(vet.DisplayName)
            }
          } else {
            return this.getDisplayNameWithoutFormerAndClosed(vet.DisplayName); 
          }
        }
        if(fieldName.equalsIgnoreCase( "VetAddr")){
          return vet.PrimaryAddress.AddressLine1;
        }
        if(fieldName.equalsIgnoreCase( "VetAddr2")){
          return vet.PrimaryAddress.AddressLine2;
        }
        if(fieldName.equalsIgnoreCase( "VetFullStreetAddress")){
          return getFullStreetAddress(vet.PrimaryAddress);
        }
        if(fieldName.equalsIgnoreCase( "VetCityStZip")){
          return vet.PrimaryAddress.CityStateZip;
        }
        if(fieldName.equalsIgnoreCase( "VetPhone" )){
          return vet.WorkPhone
        }
        if(fieldName.equalsIgnoreCase( "VetFax" )){
          return vet.FaxPhone  
        }
        if(fieldName.equalsIgnoreCase( "ExposureCoverage" )){
          return exp.Coverage.AggregateLimitExt as java.lang.String
        }
        if(fieldName.equalsIgnoreCase("Deductible")){
          return exp.Coverage.Deductible.Amount as java.lang.String
        }
        if(fieldName.equalsIgnoreCase("DeductibleExt")){
          return exp.getDeductibleText(exp.ExposureDeductibleExt)
        }
        if(fieldName.equalsIgnoreCase( "fullMortalityCoverage")){
          return this.Claim.Policy.amountOfCoverage("eq_fullmortality", exp.FixedPropertyIncident.Property.LocationNumber) as java.lang.String;
        }
        if(fieldName.equalsIgnoreCase( "majMedCoverage")){
          return this.Claim.Policy.amountOfCoverage("eq_majmedFM", exp.Coverage as java.lang.String) as java.lang.String
        }
        if(fieldName.equalsIgnoreCase( "ClaimantFirst")){
          if(exp.Claimant.Subtype == "person" || exp.Claimant.Subtype == "InjuredWorkerExt"){
            return (exp.Claimant as Person).FirstName;
          }else{
            return "NA"
          }
        }
        if(fieldName.equalsIgnoreCase( "ClaimantLast")){
          if(exp.Claimant.Subtype == "person" || exp.Claimant.Subtype == "InjuredWorkerExt"){
            return (exp.Claimant as Person).LastName;
          }else{
            return ""
          }
        }
        if(fieldName.equalsIgnoreCase( "ClaimantMI")){
          if(exp.Claimant.Subtype == "person" || exp.Claimant.Subtype == "InjuredWorkerExt"){
            return (exp.Claimant as Person).MiddleName;
          }
          return ""
        }
        if(fieldName.equalsIgnoreCase("Claimant")){
          return this.getDisplayNameWithoutFormerAndClosed(exp.Claimant.DisplayName)
        }  
        if(fieldName.equalsIgnoreCase("Dependents")){
          return this.Claim.getListOfItemsFromObjectArray(exp.getClaimContactsByRole("claimantdep"), "ClaimContact")
        }
        if(fieldName.equalsIgnoreCase( "ClaimantAddr")){
          return this.Exposure.Claimant.PrimaryAddress.AddressLine1;
        }
        if(fieldName.equalsIgnoreCase( "ClaimantAddr2")){
          return this.Exposure.Claimant.PrimaryAddress.AddressLine2;
        }
        if(fieldName.equalsIgnoreCase( "ClaimantCity")){
          return this.Exposure.Claimant.PrimaryAddress.City;
        }
        if(fieldName.equalsIgnoreCase( "ClaimantState")){
          return (this.Exposure.Claimant.PrimaryAddress.State != null)?this.Exposure.Claimant.PrimaryAddress.State.toString():"";
        }
        if(fieldName.equalsIgnoreCase( "ClaimantZip")){
          return this.Exposure.Claimant.PrimaryAddress.PostalCode;
        }
        if(fieldName.equalsIgnoreCase( "ClaimantPhone")){
          return this.Exposure.Claimant.PrimaryPhoneValue;
        }
        if(fieldName.equalsIgnoreCase( "ClaimantTaxID")){
          return this.Exposure.Claimant.TaxID;
        }
        if(fieldName.equalsIgnoreCase( "ClaimantDOB")){
          if((exp.Claimant.Subtype == "person" || exp.Claimant.Subtype == "InjuredWorkerExt") && (exp.Claimant as Person).DateOfBirth != null){
            return (exp.Claimant as Person).DateOfBirth.formatDate(MEDIUM);
          }else{
            return "NA"
          }
        }
        if(fieldName.equalsIgnoreCase("ClaimantAge") && exp.Claimant!=null){
          return util.WCHelper.currentAge(this.Claim) as String  
        }
        if(fieldName.equalsIgnoreCase("ClaimantOccupation")){
          if(exp.Claimant.Subtype == "person" || exp.Claimant.Subtype == "InjuredWorkerExt"){
            return (exp.Claimant as Person).Occupation;  
          }else{
            return "NA"
          }
        }
        if(fieldName.equalsIgnoreCase("ClaimantDateOfHire") && exp.Claimant!=null){
          return this.Claim.EmploymentData.HireDate as String
        }
        if(fieldName.equalsIgnoreCase("ClaimantEmploymentStatus") && exp.Claimant!=null){
          return this.Claim.EmploymentData.EmploymentStatus.DisplayName
        }
        if(fieldName.equalsIgnoreCase("ClaimantAWW") && exp.Claimant!=null){
          return this.Claim.EmploymentData.WageAmount.Amount
        }
        if(fieldName.equalsIgnoreCase("ClaimantEducationLevel") && exp.Claimant!=null){
          return this.Claim.claimant.EducationLevelExt.DisplayName
        }
        if(fieldName.equalsIgnoreCase("ClaimantAttorneyOrFirm")){
          if(exp.opposingcounsel!=null) return exp.opposingcounsel.DisplayName
          return null
        }
        if(fieldName.equalsIgnoreCase( "ClaimantCityStateZip" )){
          return exp.Claimant.PrimaryAddress.CityStateZip
        }
        if(fieldName.equalsIgnoreCase( "ClaimantMaritalStatus" )){
          if((exp.Claimant.Subtype == "person" || exp.Claimant.Subtype == "InjuredWorkerExt") && (exp.Claimant as Person).MaritalStatus != null){
            return (exp.Claimant as Person).MaritalStatus.toString()
          }else{
            return ""
          }
        }
        if(fieldName.equalsIgnoreCase( "LossLocation")){
          return exp.Claim.LossLocation.toString();
        }
        if(fieldName.equalsIgnoreCase( "Insuit" )){
          if(exp.ex_InSuit){
            return "Y"
          }else if(!exp.ex_InSuit){
            return "N"
          }else{
            return "      "
          }
        }
        
        // Returns State/Province of the Matter where RelatedTo feature (if picked) is registered 
        // under Counsel -> Claimants of Legal Actions screen
        if(fieldName.equalsIgnoreCase("SuitVenue")){
          var venue:String = ""
          var count = 0
          var list = new ArrayList()
          // going through all Matters on a Claim
          for(matter in this.Claim.Matters){
            if(matter.MatterAssignmentsExt*.AssignmentExposuresExt*.Exposure.contains(exp)){
              if(matter.StateExt!=null && !list.contains(matter.StateExt.DisplayName))
                list.add(matter.StateExt.DisplayName)
            }
          }
          for(each in list){
            if(count==0){
              venue += each
              count++
            }
            else
              venue += ", " + each  
          }
          return venue 
        }
        
        if(fieldName.equalsIgnoreCase( "JurisdictionCountry")){
          return exp.JurisdictionCountryExt
        }
        
        if(fieldName.equalsIgnoreCase( "JurisdictionState")){
          return exp.Claim.JurisdictionState==null?exp.JurisdictionState:exp.Claim.JurisdictionState
        }
        
//        if(fieldName.equalsIgnoreCase("LeadingInjury")){
//          return exp.LeadingInjury
//        }
//        if(fieldName.equalsIgnoreCase("DetailedInjury")){
//          return exp.DetailedInjury
//        }
//        if(fieldName.equalsIgnoreCase("MedicalTreatment")){
//          return exp.MedicalTreatment
//        }
        if(fieldName.equalsIgnoreCase("vehicleYear")){
          return exp.VehicleIncident.Vehicle.Year as java.lang.String
        }
         if(fieldName.equalsIgnoreCase("vehicleVin")){
          return exp.VehicleIncident.Vehicle.Vin
        }
        //Driver Contact Info
        if(fieldName.equalsIgnoreCase("DriverFirstName")){
          if(exp.DriverExt.Subtype == "person" || exp.DriverExt.Subtype == "InjuredWorkerExt"){
            return (exp.DriverExt as Person).FirstName
          }
        }
        
        if(fieldName.equalsIgnoreCase("DriverLastName")){
          if(exp.DriverExt.Subtype == "person" || exp.DriverExt.Subtype == "InjuredWorkerExt"){
            return (exp.DriverExt as Person).LastName
          }
        }
        
        if(fieldName.equalsIgnoreCase("DriverMiddleName")){
          if(exp.DriverExt.Subtype == "person" || exp.DriverExt.Subtype == "InjuredWorkerExt"){
            return (exp.DriverExt as Person).MiddleName
          }
        }
        
        if(fieldName.equalsIgnoreCase("DriverAddressLine1")){
          if(exp.DriverExt.Subtype == "person" || exp.DriverExt.Subtype == "InjuredWorkerExt"){
            return (exp.DriverExt as Person).PrimaryAddress.AddressLine1
          }
        }
        
        if(fieldName.equalsIgnoreCase("DriverAddressLine2")){
          if(exp.DriverExt.Subtype == "person" || exp.DriverExt.Subtype == "InjuredWorkerExt"){
            return (exp.DriverExt as Person).PrimaryAddress.AddressLine2
          }
        }
        
        if(fieldName.equalsIgnoreCase("DriverAddressCity")){
          if(exp.DriverExt.Subtype == "person" || exp.DriverExt.Subtype == "InjuredWorkerExt"){
            return (exp.DriverExt as Person).PrimaryAddress.City
          }
        }
        
        if(fieldName.equalsIgnoreCase("DriverAddressState")){
          if(exp.DriverExt.Subtype == "person" || exp.DriverExt.Subtype == "InjuredWorkerExt"){
            return (exp.DriverExt as Person).PrimaryAddress.State.DisplayName
          }
        }
        
        if(fieldName.equalsIgnoreCase("DriverAddressZipCode")){
          if(exp.DriverExt.Subtype == "person" || exp.DriverExt.Subtype == "InjuredWorkerExt"){
            return (exp.DriverExt as Person).PrimaryAddress.PostalCode
          }
        }
        
        if(fieldName.equalsIgnoreCase("DriverAddressFullStreet")){
          if(exp.DriverExt.Subtype == "person" || exp.DriverExt.Subtype == "InjuredWorkerExt"){
            return getFullStreetAddress((exp.DriverExt as Person).PrimaryAddress)
          }
        }
        
        if(fieldName.equalsIgnoreCase("DriverAddressCityStateZip")){
          if(exp.DriverExt.Subtype == "person" || exp.DriverExt.Subtype == "InjuredWorkerExt"){
            return (exp.DriverExt as Person).PrimaryAddress.CityStateZip
          }
        }
        
        if(fieldName.equalsIgnoreCase("DriverPhone")){
          if(exp.DriverExt.Subtype == "person" || exp.DriverExt.Subtype == "InjuredWorkerExt"){
            var phoneType=(exp.DriverExt as Person).PrimaryPhone
            var phoneNumber:String = ""
            if(phoneType == PrimaryPhoneType.TC_WORK){
              phoneNumber = (exp.DriverExt as Person).WorkPhone
            }else if(phoneType == PrimaryPhoneType.TC_HOME){
              phoneNumber = (exp.DriverExt as Person).HomePhone
            }else{
              phoneNumber = (exp.DriverExt as Person).CellPhoneExt 
            }
            return phoneNumber
          }
        }
        
        if(fieldName.equalsIgnoreCase("DriverEmail")){
          if(exp.DriverExt.Subtype == "person" || exp.DriverExt.Subtype == "InjuredWorkerExt"){
            return (exp.DriverExt as Person).EmailAddress1
          }
        }
        
        if(fieldName.equalsIgnoreCase("vehicleMake")){
          return exp.VehicleIncident.Vehicle.Make 
        }
        if(fieldName.equalsIgnoreCase("vehicleModel")){
          return exp.VehicleIncident.Vehicle.Model
        }
        
        if(fieldName.equalsIgnoreCase("vehicleOdometerMileage")){
          return exp.VehicleIncident.OdomRead as String
        }
        
        if(fieldName.equalsIgnoreCase("CoverageName")){
          return exp.Coverage.Type.DisplayName;
        }
        if(fieldName.equalsIgnoreCase("OpenReserves")){
          return exp.openReserves() as java.lang.String
        }
        if(fieldName.equalsIgnoreCase("Type")){
                return exp.ExposureType.DisplayName
        }
        if (fieldName.equalsIgnoreCase("AmountofInsurance")){
          if (exp.FixedPropertyIncident.Property.ex_AmountofInsurance == null){ 
            return "N/A"
          }else{
            return gw.api.util.StringUtil.formatNumber(exp.FixedPropertyIncident.Property.ex_AmountofInsurance, "$#,##0")   
          }
        }
        if(fieldName.equalsIgnoreCase("PrimaryAreaOfBody")){ 
          return exp.PrimaryBodyPartExt.DisplayName
        }
      }else{
        var fpi:FixedPropertyIncident = getFixedPropIncident();
        if(fieldName.equalsIgnoreCase( "AnimalName")){
          return fpi.Property.LocationNumber;
        }
        if(fieldName.equalsIgnoreCase( "Barn")){
          return fpi.Property.ex_BarnName;
        }
        if(fieldName.equalsIgnoreCase( "ExposureAddress1")){
          return fpi.Property.Address.AddressLine1
        }
        if(fieldName.equalsIgnoreCase( "ExposureAddress2")){
          return fpi.Property.Address.AddressLine2
        }
        if(fieldName.equalsIgnoreCase( "ExposureCityStateZip")){
          return fpi.Property.Address.CityStateZip
        }
        if(fieldName.equalsIgnoreCase( "Use")){
          return fpi.Property.ex_AnimalUse.DisplayName;
         }
        if(fieldName.equalsIgnoreCase( "Use 2")){
          return fpi.Property.AnimalUse2Ext.DisplayName;
        }
        if(fieldName.equalsIgnoreCase( "Breed")){
          return fpi.Property.ex_Breed.DisplayName;
        }
        if(fieldName.equalsIgnoreCase( "Sex")){
          return fpi.Property.ex_Sex.DisplayName;
        }
        if(fieldName.equalsIgnoreCase( "Age")){
  //        6/18/09 - birth year should be used for age - KBirdseye said in an email dated 6/16/09
  //        return exp.FixedPropertyIncident.Property.getAge();
          var x = fpi.Property.ex_DateofBirth;
          return (x!= null) ? x.toString() : "";
        }
        if(fieldName.equalsIgnoreCase( "Trainer")){
          return this.getDisplayNameWithoutFormerAndClosed(fpi.PrimaryTrainer.DisplayName)
        }
        if(fieldName.equalsIgnoreCase( "TrainerPhone")){
          return fpi.PrimaryTrainer.PrimaryPhoneValue
        }
        if(fieldName.equalsIgnoreCase( "VetName")){
          if ((fpi.VeterinarianExt.Subtype == "Doctor" or fpi.VeterinarianExt.Subtype == "Ex_ForeignPersonVndr") and
             ((fpi.VeterinarianExt as Person).Prefix != null)) {
             return this.getDisplayNameWithoutFormerAndClosed((fpi.VeterinarianExt as Person).Prefix.DisplayName + " " + fpi.VeterinarianExt.DisplayName)
          } else {
            return this.getDisplayNameWithoutFormerAndClosed(fpi.VeterinarianExt.DisplayName); 
          }
        }
        if(fieldName.equalsIgnoreCase( "VetAddr")){
          return fpi.VeterinarianExt.PrimaryAddress.AddressLine1;
        }
        if(fieldName.equalsIgnoreCase( "VetAddr2")){
          return fpi.VeterinarianExt.PrimaryAddress.AddressLine2;
        }

        if(fieldName.equalsIgnoreCase( "VetCityStZip")){
          return fpi.VeterinarianExt.PrimaryAddress.CityStateZip;
         }
        if(fieldName.equalsIgnoreCase( "VetPhone" )){
          return (fpi.VeterinarianExt as Doctor).WorkPhone
         }
        if(fieldName.equalsIgnoreCase( "VetFax" )){
         return (fpi.VeterinarianExt as Doctor).FaxPhone  
         }
        if (fieldName.equalsIgnoreCase("AmountofInsurance")){
          var x = fpi.Property.ex_AmountofInsurance; 
          return (x != null)? x.toString(): "";
         }
        if(fieldName.equalsIgnoreCase("OpenReserves")){
          var x = gw.api.financials.FinancialsCalculationUtil.getOpenReserves().getAmount( this.Claim );
          return (x!= null)? x.toString(): "";
        }
    
      }

      return null;  
  }
  // Defect 399 reorder document related to
  public function getRelatedToExt() : List {
    var relToList = new ArrayList();
  
    for( EXP in this.Claim.Exposures){
      relToList.add(EXP);
    }
    Collections.sort(relToList, Collections.reverseOrder())
    for (CON in this.Claim.RelatedContacts){
      relToList.add(CON);
     }
    relToList.add(this.Claim)   
   
    //If this is a matter related document then filter then get the
    //correct list 
    if(this.IsMatterRelated){
       return this.LegalActionRelatedToValues as java.util.List<java.lang.Object>
    }
   
    return relToList  
  }

  //Defect 399 set Related To to the first Expsosure if it exists
  public function setRelatedTo(investigation : SIUInvestigationExt){
    if(this.Name!="Special Investigative Report"){
      // Defect#8350 ivorobyeva: to fix database inconsistency 
      // "A document can be associated with a claimant or an exposure or a matter, but not more than one"
      // so, if the document is related to a matter it cannot be related to an exposure at the same time
      if(this.IsMatterRelated){
        this.Exposure=null
      }
      else { 
        if(this.Claim.Exposures.length > 0){
          this.RelatedTo = this.Claim.Exposures[this.Claim.Exposures.length-1]
        }
      }
    } else {
      if(investigation!=null){
        this.Claim.linkDocumentToInvestigation( this, this.Claim.SIUInvestigationsExt[0] )
      }
    }
  }

  /*This method grabs the list of CC&apos;d users and puts them in
   a string such that each CC user shows up on a new line.
   Need to have the agency listed if there is not one.
   5/13/08 ER - Added Subro and Suit condition as these are the only 2 documents that Agri wants
   to have the Agency in the cc field.  If we have another LOB that has additional conditions
   we might want to change this to a CASE statement.

   Updated: 10/16/2008 - Removed checks for equine LOBCode and specific agri documents.  
   Instead the agentReq boolean will be used to determine whether or not to put agency 
   on the document automatically.  This will be controlled on the individual document level.  
   If agency is to be put in CC automatically use getCCUsers(true), otherwise use getCCUsers(false).
   */

  function getCCUsers(agentReq : boolean, empower:boolean) : String{
    
    var ccString = "";
    var first = true;
    for(person in this.ex_CCUsers) {
      if(person.Contact != null)
        if(first) {
          ccString = "cc: " + ccString + person.Contact;
          first = false
        } else {
          if(empower)
            ccString = ccString + "\n" + "      " + person.Contact;
          else
            ccString = ccString + "\\par" + "      " + person.Contact;
        }
      }
    return this.getDisplayNameWithoutFormerAndClosed(ccString);
  }  //end getCCUsers function
  
  
  
  /**
   *  Function for cancelling Central Print on Documents screen.  
   */
  function cancelCentralPrint() : boolean {
    try{
      if (EmpowerDocumentUtil.isUnFinalizedEmpowerDocument(this) 
      || ((EmpowerDocumentUtil.isFinalizedEmpowerDocumentPreECF(this) || EmpowerDocumentUtil.isFinalizedEmpowerDocumentPostECF(this)) && EmpowerDocumentUtil.cancelCentralPrintEmp(this.PendingDocUID))
      || CentralPrint.getInstance().deleteCentralPrintByID(this.ex_CentralPrintRowNumInDb)) {
        this.ex_CentralPrintCancelled = true
        if(this.Name == "Auto Acknowledgement Letter" and this.ex_Type == "Correspondence" and 
            this.ex_SubType == "Claim Acknowledgement" and this.Description == "Auto Acknowledgement Letter"){
          util.document.AutoACKLetter.createNoteOnCancelECFDocument(this)
        }
        return true
      }
      else{
        gw.api.util.Logger.logError("Central Print for document " + this.ECFIDExt + " was not cancelled!");
        return false
      }
    }catch (e) {
      gw.api.util.Logger.logError("Exception while cancelling Central Print", e);
      return false
    }
  } //end cancelCentralPrint

  /*  mwissel 01/12/09 Equine 12 Defect # 1249
modifed function to determine if document is related to the feature or claim to determine adjuster information
  */
  /* cmullin 2/18/14 - added code as part of Specialty E&S development which will now be used Enterprise-wide: 
  -Display local work phone if toll-free number is not available 
  -Display adjuster's fax number for all letters, if it's available. 
  */

  function adjustersignature() : String{

    var adjsign = "";
    if (this.Exposure == null)
      {
        if (this.Claim.AssignedUser.ex_Signature != NULL){
        adjsign = adjsign + "" + this.Claim.AssignedUser.ex_Signature+"\\par "}
        if (this.Claim.AssignedUser.JobTitle != NULL){
        adjsign = adjsign + "" + this.Claim.AssignedUser.JobTitle+"\\par ";}
        if (this.Claim.Policy.IssuingCompanyExt!= NULL){
        adjsign = adjsign + "" + this.Claim.Policy.IssuingCompanyExt.DisplayName+"\\par "}
        if (this.Claim.AssignedUser.Contact.EmailAddress1 != NULL){
        adjsign = adjsign + "" + this.Claim.AssignedUser.Contact.EmailAddress1+"\\par "}
        if (this.Claim.AssignedUser.ex_TollFreePhone != NULL){
          adjsign = adjsign + "" + this.Claim.AssignedUser.ex_TollFreePhone+"\\par "
        }else if(this.Claim.AssignedUser.Contact.WorkPhone != NULL){
          adjsign = adjsign + "" + this.Claim.AssignedUser.Contact.WorkPhone+"\\par "
        }
           if (this.Claim.AssignedUser.Contact.FaxPhone != NULL){
          adjsign = adjsign + "" + this.Claim.AssignedUser.Contact.FaxPhone+ " Fax"+"\\par "
        }
        
      }
     else
      {
        if (this.Exposure.AssignedUser.ex_Signature != null) {
        adjsign = adjsign + "" + this.Exposure.AssignedUser.ex_Signature+"\\par "
        }
        if (this.Exposure.AssignedUser.JobTitle != NULL) {
        adjsign = adjsign +"" + this.Exposure.AssignedUser.JobTitle+"\\par "
        }
        if (this.Exposure.Claim.Policy.IssuingCompanyExt != NULL) {
        adjsign = adjsign + "" + this.Exposure.Claim.Policy.IssuingCompanyExt.DisplayName+"\\par "
        }
        if (this.Exposure.AssignedUser.Contact.EmailAddress1 != NULL) {
        adjsign = adjsign + "" + this.Exposure.Claim.AssignedUser.Contact.EmailAddress1+"\\par "
        }
        if (this.Exposure.Claim.AssignedUser.ex_TollFreePhone != NULL){
          adjsign = adjsign + "" + this.Exposure.Claim.AssignedUser.ex_TollFreePhone+"\\par "
        }else if(this.Exposure.Claim.AssignedUser.Contact.WorkPhone != NULL){
          adjsign = adjsign + "" + this.Exposure.Claim.AssignedUser.Contact.WorkPhone+"\\par "
        }
           if (this.Exposure.Claim.AssignedUser.Contact.FaxPhone != NULL){
           adjsign = adjsign + "" + this.Exposure.Claim.AssignedUser.Contact.FaxPhone+ " Fax" + "\\par "
           }
        }   
    return adjsign;
  }
  // Adjuster's signature for regular ClaimCenter documents
  function adjusterMailingSignature() : String {
    var adjsign = "" 
    if (this.Exposure == null) {
      adjsign = this.Claim.AssignedUser.getUserBusinessUnit() + "\\par "
      // get adjuster's mailing address or display 
      // "301 East Fourth Street, Cincinnati, OH 45202" if it's not available
      for(ref in this.Claim.AssignedUser.Contact.AllAddresses) {
        if(ref.AddressType == "mailing") {
          if(ref.AddressLine1 != null)
            adjsign += ref.AddressLine1 + "\\par "
          if(ref.AddressLine2 != null)
            adjsign += ref.AddressLine2 + "\\par "
          if(ref.CityStateZip != null)
            adjsign += ref.CityStateZip + "\\par "
          //break the loop...added so that it will not iterate to more than just on mailing address
          //There should only be one mailing address for an ajuster
          break;
        }  //end mailing if
      }  //end iteration
      // If there is no adjuster's mailing address on file, the default address will be set
      if(adjsign == this.Claim.AssignedUser.getUserBusinessUnit() + "\\par "){
        adjsign += "301 East Fourth Street\\par Cincinnati, OH 45202"
      }
    }  //end if
    else {
      adjsign = this.Exposure.Claim.AssignedUser.getUserBusinessUnit() + "\\par "
      for(ref in this.Exposure.Claim.AssignedUser.Contact.AllAddresses) {
        if(ref.AddressType == "mailing") {
          if(ref.AddressLine1 != null)
            adjsign += ref.AddressLine1 + "\\par "
          if(ref.AddressLine2 != null)
            adjsign += ref.AddressLine2 + "\\par "
          if(ref.CityStateZip != null)
            adjsign += ref.CityStateZip + "\\par "
          //break the loop...added so that it will not iterate to more than just on mailing address
          //There should only be one mailing address for an ajuster
            break;
        }  //end mailing if
      }  //end iteration  
      // If there is no adjuster's mailing address on file, the default address will be set
      if(adjsign == this.Exposure.Claim.AssignedUser.getUserBusinessUnit() + "\\par "){
        adjsign += "301 East Fourth Street\\par Cincinnati, OH 45202"
      }
    }  //end else
    return adjsign
  }
  
  function adjusterMailingAddress() : Address {
    var adjMailingAddr : Address 
    if (this.Exposure == null) {
      for(addr in this.Claim.AssignedUser.Contact.AllAddresses) {
        if(addr.AddressType == "mailing") {
          adjMailingAddr = addr
          //There should only be one mailing address for an ajuster
          break
        }  //end mailing if
      }  //end iteration
    }  //end if
    else {
      for(addr in this.Exposure.Claim.AssignedUser.Contact.AllAddresses) {
        if(addr.AddressType == "mailing") {
          adjMailingAddr = addr
          //There should only be one mailing address for an ajuster
          break
        }  //end mailing if
      }  //end iteration  
    }  //end else
    // If there is no adjuster's mailing address on file, the default address will be set
    if(adjMailingAddr==null){
      adjMailingAddr = new Address()
      adjMailingAddr.AddressLine1 = "301 East Fourth Street"
      adjMailingAddr.City = "Cincinnati"
      adjMailingAddr.State = "OH"
      adjMailingAddr.PostalCode = "45202"
    }
    return adjMailingAddr
  }
  
  /*  mwissel 01/12/09 Equine 12 Defect # 1249
   Added function returnAdjusterField to determine if document is related to the feature or claim 
   to determine adjuster information. 
  */

  function returnAdjusterField(fieldName : String) : String {

   var adjusterField = "";
  
    if (this.Exposure == null and this.Claim.AssignedUser != null)
    {
      if (fieldName == "DisplayName" and this.Claim.AssignmentStatus != "manual")
      { adjusterField = this.Claim.AssignedUser.Contact.DisplayName;}
      else if (fieldName == "AddressLine1")
      { adjusterField = this.Claim.AssignedUser.Contact.PrimaryAddress.AddressLine1; }
      else if (fieldName == "AddressLine2")
      { adjusterField = this.Claim.AssignedUser.Contact.PrimaryAddress.AddressLine2;  }
      else if (fieldName == "City")
      { adjusterField = this.Claim.AssignedUser.Contact.PrimaryAddress.City;  }
      else if (fieldName == "State")
      { adjusterField = this.Claim.AssignedUser.Contact.PrimaryAddress.State;  }
      else if (fieldName == "PostalCode")
      { adjusterField = this.Claim.AssignedUser.Contact.PrimaryAddress.PostalCode;  }
      else if (fieldName == "FullStreetAddress")
      { adjusterField = getFullStreetAddress(this.Claim.AssignedUser.Contact.PrimaryAddress) }
      else if (fieldName == "CityStateZip")
      { adjusterField = this.Claim.AssignedUser.Contact.PrimaryAddress.CityStateZip; }
      else if (fieldName == "Initials")
      { adjusterField = this.Claim.AssignedUser.Contact.getContactInitials(); }
      else if (fieldName == "TollFreePhone")
      { adjusterField = this.Claim.AssignedUser.ex_TollFreePhone; }
      else if (fieldName == "FaxPhone")
      { adjusterField = this.Claim.AssignedUser.Contact.FaxPhone; }
      else if (fieldName == "Email")
      { adjusterField = this.Claim.AssignedUser.Contact.EmailAddress1; }
      else if (fieldName == "Signature")
      { adjusterField = this.Claim.AssignedUser.ex_Signature; }
      else if (fieldName == "WorkPhone")
      { adjusterField = this.Claim.AssignedUser.Contact.WorkPhone }
      else if (fieldName == "FirstName")
      { adjusterField = this.Claim.AssignedUser.Contact.FirstName }
      else if (fieldName == "LastName")
      { adjusterField = this.Claim.AssignedUser.Contact.LastName }
      else if (fieldName == "FormalName"){ 
        if(this.Claim.AssignedUser.Contact.Prefix!=null)
          adjusterField = this.Claim.AssignedUser.Contact.Prefix.DisplayName + " "+this.Claim.AssignedUser.Contact.DisplayName
        else 
          adjusterField = this.Claim.AssignedUser.Contact.DisplayName
      }
    }
    if (this.Exposure != null and this.Exposure.AssignedUser != null){
      if (fieldName == "DisplayName" and this.Claim.AssignmentStatus != "manual")
      { adjusterField = this.Exposure.AssignedUser.Contact.DisplayName; }
      else if (fieldName == "AddressLine1")
      { adjusterField = this.Exposure.AssignedUser.Contact.PrimaryAddress.AddressLine1; }
      else if (fieldName == "AddressLine2")
      { adjusterField = this.Exposure.AssignedUser.Contact.PrimaryAddress.AddressLine2;  }
       else if (fieldName == "City")
      { adjusterField = this.Exposure.AssignedUser.Contact.PrimaryAddress.City;  }
      else if (fieldName == "State")
      { adjusterField = this.Exposure.AssignedUser.Contact.PrimaryAddress.State;  }
      else if (fieldName == "PostalCode")
      { adjusterField = this.Exposure.AssignedUser.Contact.PrimaryAddress.PostalCode;  }
      else if (fieldName == "FullStreetAddress")
      { adjusterField = getFullStreetAddress(this.Exposure.AssignedUser.Contact.PrimaryAddress) }
      else if (fieldName == "CityStateZip")
      { adjusterField = this.Exposure.AssignedUser.Contact.PrimaryAddress.CityStateZip; }
      else if (fieldName == "Initials")
      { adjusterField = this.Exposure.AssignedUser.Contact.getContactInitials(); }
      else if (fieldName == "TollFreePhone")
      { adjusterField = this.Exposure.AssignedUser.ex_TollFreePhone; }
      else if (fieldName == "FaxPhone")
      { adjusterField = this.Exposure.AssignedUser.Contact.FaxPhone; }
      else if (fieldName == "Email")
      { adjusterField = this.Exposure.AssignedUser.Contact.EmailAddress1; }
      else if (fieldName == "Signature")
      { adjusterField = this.Exposure.AssignedUser.ex_Signature; }
      else if (fieldName == "WorkPhone" )
      { adjusterField = this.Exposure.AssignedUser.Contact.WorkPhone}
      else if (fieldName == "FirstName")
      { adjusterField = this.Exposure.AssignedUser.Contact.FirstName }
      else if (fieldName == "LastName")
      { adjusterField = this.Exposure.AssignedUser.Contact.LastName }
      else if (fieldName == "FormalName"){ 
        if(this.Exposure.AssignedUser.Contact.Prefix!=null)
          adjusterField = this.Exposure.AssignedUser.Contact.Prefix.DisplayName + " "+this.Exposure.AssignedUser.Contact.DisplayName
        else 
          adjusterField = this.Exposure.AssignedUser.Contact.DisplayName
      }
    }
    return adjusterField;
  }

  /* Function for flash notices, cross reference of claim numbers */
  function claimassociation() : String{
    var String = "";
      for(each in this.Claim.ClaimsAssociatedWith){
        for (c in each.ClaimAssociation.ClaimsInAssoc) {
        if(c.Claim.ClaimNumber !=this.Claim.ClaimNumber){
          if(String.indexOf(c.Claim.ClaimNumber) < 0){
           String = String + c.Claim.ClaimNumber+ "   ";  
          }
        }
      }
    }
    if( String.length() == 0)
      return null
    else
    return String.trim();
  }

  /*Enhancement Sprint 14 6/4/08 ER:  Added to Equine and merge forward */
  /*Sprint 11 Agri 2/26/08 ER: function to filter out ECF specific document sub types for security purposes */
  function ecfdocfilter(): boolean { 
    //2/26 from my test the value is Name, not code
    if(this.ex_Type != null && this.ex_Type.compareToIgnoreCase( "Delete" )==0){
      return false;
    }
    else {
      return true;
    }
  }

  /* Agri Sprint 12 3/13/08 ER: Comments field for Documents in ClaimCenter not visible if SCO/SIU/Reins types */
  /* Enhancement sprint 14 6/4/08 ER: Reinsurance documents will not be passed from ECF to ClaimCenter at all, ECF is
  taking care of this. And we are to use ex_Type and not SecurityType to not show comments for SIU and SCO documents
  needed to add this to Equine and merge forward */ 
  function ecfcommentfilter() :boolean {
   if(this.ex_Type != null and (this.ex_Type.compareToIgnoreCase( "SCO Secured" )==0 or this.ex_Type.compareToIgnoreCase( "SIU Secured" )==0))
    {
      return false;
    }
      else
      {
        return true;
      }
  }

  /*
  //3/11/08, Agribusiness, ER
  //function isRecipientt:used in NewTemplateDocumentInputSet.pcf
  //function is used to validate the Recipient in step 2 - Specific object values when creating a document.
  //we call this funtion where the mode=contact to check for the Recipient(field is a string not a contact)
  // where the mode=text.  This is done here because you never step into that text mode. 
  //The validationExpression is used for both Recipient field and To field and we only want the validation 
  //to run against Recipient
  */

  function isRecipientt(name:String,documentContact:Contact):String{
    var validationExpression:String=null
      if(name=="Recipient"and documentContact.AllAddresses.length==0 and this.ex_CentralPrint)
      {
       validationExpression=displaykey.GAIC.Documents.CentralPrint.Validation.NoMailingAdress.cp 
      }
      return validationExpression
  }

  /*This method returns a prefix of Person contacts, if present.
   *def 1052 Kotteson 4/18/08.
  */
  public function getNamePrefix(kontact : Contact) : String{
      if (kontact typeis Person){
         if (kontact.Prefix != null) {
             return kontact.Prefix.DisplayName + " "
         } else {
             return "";
         }
      } else {
        return ""
      }
  }

  function getLossType() : String
  {
     var type = ""
     //var result:List = new ArrayList()
     if( this.Exposure != null)
     {
        if( this.Exposure.Coverage.SublineExt == "920" )
        {
          type = this.Exposure.LossLocationExt.DisplayName + "\n"
        }
      
        /*Agri Business code
        if( this.Exposure.Coverage.SublineExt == "105" || this.Exposure.Coverage.SublineExt == "106" ||  this.Exposure.Coverage.SublineExt == "930" ){
          type = type + this.Exposure.LossAppToExt.Name + "\n"
        }
      
        if( this.Exposure.Coverage.SublineExt == "470" )
        {
          type  = type + this.Exposure.SPP_LossLocationExt.Name + "\n"
        }
      
        if( this.Exposure.setTypeOfLossVisibility())
        {
        
          var iterate = this.Exposure.getTOLValues()
          var code = this.Exposure.TypeOfLossMostExt
        
          for(key in iterate)
          {
            if(key.itype == typekey.TypeOfLoss_Exp)
            {
              if((key as typekey.TypeOfLoss_Exp ).Code == code)         
                type = (key as typekey.TypeOfLoss_Exp).Name
            }
            if(key.itype == typekey.TypeOfLoss_BCT)
            {
              if((key as typekey.TypeOfLoss_BCT ).Code == code)         
                type = (key as typekey.TypeOfLoss_Exp).Name
            }
            if( key.itype == typekey.TypeOfLoss_Exp_Sublimit )
            {
              if((key as typekey.TypeOfLoss_BCT ).Code == code)         
                type = (key as typekey.TypeOfLoss_Exp).Name
            }
            if( key.itype == typekey.TypeOfLoss_Mold )
            {
              if((key as typekey.TypeOfLoss_Mold ).Code == code)         
                type = (key as typekey.TypeOfLoss_Exp).Name
            }
            if( key.itype == typekey.TypeOfLoss_SPP )
            {
              if((key as typekey.TypeOfLoss_SPP ).Code == code)         
                print((key as typekey.TypeOfLoss_Exp).Name)
            }
            if( key.itype == typekey.TypeOfLoss_State )
            {
              if((key as typekey.TypeOfLoss_State ).Code == code)         
                type = (key as typekey.TypeOfLoss_Exp).Name
            }
            if( key.itype == typekey.TypeOfLoss_State_Exp )
            {
              if((key as typekey.TypeOfLoss_State ).Code == code)         
                type = (key as typekey.TypeOfLoss_State).Name
            }  
          
          }  //end for statement
        }  //end if */
     }  //end outer for
   
     if( type == "")
       return null
     return type
  }

  function getClaimsAssignment() : String{
    for(models in this.Claim.ClaimUserModelSet.ClaimUserModels){
      for(role in models.UserRoleAssignments){
        if(role.Role == "scoassist" and (role.Exposure == this.Exposure or role.Exposure == null)){
          return role.User.Contact.DisplayName
        }
      }
    }
    return null;
  }

  function getPolicyString() : String {
    return this.Claim.Policy.PolicyType + " " + this.Claim.Policy.PolicyNumber + " " + this.Claim.Policy.PolicySuffix
  }

  // mwissel - 4/14/09 - added function so that loss month name can be taken from loss date and be added to a document

  function getLossMonth() : String {
  
    var month : int
    var monthName : String
  
    month = gw.api.util.DateUtil.getMonth(this.Claim.LossDate)
    monthName = gw.api.util.DateUtil.getMonthName(month)
  
    return monthName
  
  }


  function getClaimsManager() : Contact{
    var group : Group = this.Claim.AssignedGroup
    if( this.Claim.AssignmentStatus != "manual") {
      do {
            if(group.GroupType == "busunit" or group.GroupType == "nonclaimsbusunit"){
            return group.Supervisor.Contact
          } else if(group.Parent != null) {
            group = group.Parent
          }
       } while(group.Parent != null)  
      return null;
    }
    return null
  }

  function getClaimsManagerContactInfo() : String{
    var group : Group = this.Claim.AssignedGroup
      if( this.ex_Type == "Internal Report") {
      do {
            if(group.GroupType == "busunit" or group.GroupType == "nonclaimsbusunit"){
            return group.Supervisor.Contact.WorkPhone
          } else if(group.Parent != null) {
            group = group.Parent
          }
       } while(group.Parent != null)  
      return null;
    }
    return null
  }

  function getClaimsManagerPhone() : String{
    var group : Group = this.Claim.AssignedGroup
    do {
        if(group.GroupType == "busunit" or group.GroupType == "nonclaimsbusunit"){
          return group.Supervisor.Contact.WorkPhone
        } else if(group.Parent != null) {
          group = group.Parent
        }
     } while(group.Parent != null)  
    return null
  }

  function getTotalExpenses() : String {
    var total : double = 0.0
    for(trans in this.Exposure.TransactionsQuery.iterator()){
      if((trans as TransactionDefaultView).CostType == "expense" and (trans as TransactionDefaultView).TransactionSubtype == "payment"){
        total = total + (trans as TransactionDefaultView).Amount.Amount as double
      }
    }
    return total as java.lang.String
  }

  function setdocDesc() {
  if (this.Description ==Null){
       this.Description = this.Name
      }
  }

  function getDescOfRisk() : String {
    if( this.Claim.LossType == "AGRIAUTO" or this.Claim.LossType == "AGRILIABILITY" or this.Claim.LossType == "AGRIPROPERTY"  ) {
      return this.getExposureValue( "Type" )
    }
    else if( this.Claim.LossType == "EQUINE" ) {
      //if the RelatedTo option is either the Insured name or the Claim number or agency then return 
        //the horse name or even an array of horses name...if there is more than one horse 
        //(for ex. "Black Beauty, Speed Racer, Speedy")
        if(this.getExposureValue( "Type" ) == null ) {
          var desc = ""
          //cycle through all the Horses for this claim
          for( key in this.Claim.FixedPropertyIncidentsOnly) {
            desc = desc + key.Property.LocationNumber + ", "
          }
        
          if( desc.length() > 2 ) {        
            desc = desc.substring( 0, desc.length() - 2 )
            return desc
          }
          return null
        }
      
        //if the RelatedTo option is not the Insured Name or the Claim number then return
        //the only other options are Exposures that relate to a specific horse
        //return the horse name along with the exposure type (for ex. "Black Beauty -  Major Medical)   
        else {
          return this.getExposureValue( "AnimalName" ) + " - " + this.getExposureValue( "Type" )
        }
    }  //end outer if
    return null
  }
  //delete years of age
  function animalDescription(): String {
    var animalDescription : String
    animalDescription = ""
  
//    if( this.getExposureValue("AnimalName") != null )
//      animalDescription = this.getExposureValue("AnimalName")
//    else
//      return null
    
    if( this.getExposureValue("Breed") != null )
      if(animalDescription == ""){
        animalDescription = this.getExposureValue("Breed")
      }else{
        animalDescription = animalDescription + ",  " + this.getExposureValue("Breed")
      }
    if( this.getExposureValue("Sex") != null )
      if(animalDescription == ""){
        animalDescription = this.getExposureValue("Sex")
      }else{
        animalDescription = animalDescription + ",  " + this.getExposureValue("Sex")
      }
    if( this.getExposureValue("Use") != null )
      if(animalDescription == ""){
        animalDescription = this.getExposureValue("Use")
      }else{
        animalDescription = animalDescription + ",  " + this.getExposureValue("Use")
      } 
    if( this.getExposureValue("Use 2") != null)
      if(animalDescription == ""){
        animalDescription = this.getExposureValue("Use 2")
      }else{
        animalDescription = animalDescription + ",  " + this.getExposureValue("Use 2")
      }
    if( this.getExposureValue("Age") != "0" )
      if(animalDescription == ""){
        animalDescription = this.getExposureValue("Age")
      }else{
        animalDescription = animalDescription + ",  " + this.getExposureValue("Age")
      }
  
    return animalDescription 
  }

  function getAnimalNumber(): String {
   var animalNumber : String
   animalNumber = ""

  if (this.Exposure!= null){ 
    for(prop in this.Claim.Policy.Properties) {
      if(prop typeis PropertyRU and prop.Property == this.Exposure.FixedPropertyIncident.Property){
        animalNumber = prop.PropertyNumberExt.toString()
      }
    }
  }
   return animalNumber 
  }

  function vetAddress(): String {
    var vetAddressString : String 
    vetAddressString = ""
  
    if( this.getExposureValue("VetAddr") != null)
      vetAddressString = this.getExposureValue("VetAddr")
    else
      return null
    
    if (this.getExposureValue("VetAddr2") != null )
      vetAddressString = vetAddressString + " " + this.getExposureValue("VetAddr2")
  
    return vetAddressString
  }

  function getExposureAddress(): String {
    var exposureAddressString : String
    exposureAddressString = ""
  
    if( this.getExposureValue("ExposureAddress1") != null )
      exposureAddressString = this.getExposureValue("ExposureAddress1")
    else
      return null
    
    if( this.getExposureValue("ExposureAddress2") != null )
      exposureAddressString = exposureAddressString + " " + this.getExposureValue("ExposureAddress2")
  
    return exposureAddressString
  }
  
  // setting a flag if the Self-Addressed Stamped Envelope should be included when centrally printing
  function setSASE(saseFlag : Boolean){
    this.SASEExt=false
    // for Empower documents, use the SASE flag passed from Exstream
    if(EmpowerDocumentUtil.isUnFinalizedEmpowerDocument(this)){
      if(saseFlag!=null and saseFlag){
        this.SASEExt = true
      }
    }
    // for regular documents
    else{
      if(this.Name == "Request for Accident Report" or this.Name == "Cover Letter Promissory Note" or this.Name == "Motor Truck Cargo Request Letter" or this.Name=="Policy Ending Letter"){
        this.SASEExt = true
      }
    }
  }

  function getInsuredAddress(): String {
    var insuredAddressString : String

    If( this.Claim.Insured.PrimaryAddress.AddressLine1 != null ) {
                insuredAddressString  =  this.Claim.Insured.PrimaryAddress.AddressLine1
                If(this.Claim.Insured.PrimaryAddress.AddressLine2 != null)  {
                                insuredAddressString  =  insuredAddressString + ", " + this.Claim.Insured.PrimaryAddress.AddressLine2
                }
    }
    return insuredAddressString;
  }
                
  //djohnson    
  function getSendToPhone() : String {
    var phoneNumber = ""
    var phoneType = this.MailToExt.PrimaryPhone
    if(phoneType!=null){
      if(phoneType == PrimaryPhoneType.TC_WORK){
        phoneNumber = this.MailToExt.WorkPhone;
      } else if (phoneType == PrimaryPhoneType.TC_HOME){
        phoneNumber = this.MailToExt.HomePhone;
      } else {
        phoneNumber = this.MailToExt.CellPhoneExt;
      } 
    } else {
      if(this.MailToExt.WorkPhone != null){
        phoneNumber = this.MailToExt.WorkPhone;
      }else if(this.MailToExt.HomePhone != null){
        phoneNumber = this.MailToExt.HomePhone;
      }else{
        phoneNumber = this.MailToExt.CellPhoneExt;
      }
    }
    return phoneNumber
  }
  
// sets the default value in SendTo dropdown
  function defaultSendTo(){
    var isEmpower : Boolean = gaic.plugin.cc.document.EmpowerDocumentUtil.isUnFinalizedEmpowerDocument(this)
    // CentralPrintEnabledExt is set in template metadata
    if((!this.CentralPrintEnabledExt && !isEmpower) || (isEmpower && this.DefaultSendToExt==null)){
      this.MailToExt=null
    }
    else{
      // if SendTo value in template metadata is null or Insured
      if((this.DefaultSendToExt == null && !isEmpower) or this.DefaultSendToExt =="insured"){
        this.MailToExt = this.Claim.Insured
      }
      // if Agency
      if(this.Name =="Death Memo" or
        this.Name=="Destroyed for Humane Reasons Memo" or
        this.Name=="Loss of Use Agreement" or 
        this.Name=="Closed Agent Memo" or
        this.Name=="Reopened Claim Agent Memo" or
        this.Name=="Opened Agent Memo" or 
        this.Name == "Acknowledgement Letter - ICC Broker" or //added for Bonds 
        this.DefaultSendToExt == "Agency"){
          this.MailToExt = this.Claim.Policy.ex_Agency
      }
      // if Underwriter
      if(this.Name =="Underwriting Risk Notice" or this.DefaultSendToExt== "underwriter"){
        this.MailToExt = this.Claim.Policy.underwriter
      }
      // if Doctor
      if(this.Name=="Vet Payment Rejection Letter" or this.Name=="Progress Report" or
          this.Name=="Loss of use request Vet report" or this.DefaultSendToExt ==  "doctor"){
        for(cont in this.Claim.Contacts){
          if(cont.hasRole("doctor")){
            this.MailToExt = cont.Contact;
            break
          }
        }
      }
     // Claimant
      if((this.DefaultSendToExt == "claimant" or this.Name == "Acknowledgement and Denial Letter - Bond Cancelled" or
          this.Name == "Acknowledgement Letter - Arizona Denial Prior to Bond Period" or
          this.Name == "Acknowledgement Letter - Claimant ICC Broker" or
          this.Name == "Acknowledgement Letter - Oregon Claimant" or 
          this.Name == "Letter Release to Claimant" or 
          this.Name == "CA Little ACK to Claimant Need Info")
          and this.Claim.Exposures.Count != 0){
        this.MailToExt = this.Claim.Exposures[this.Claim.Exposures.length-1].Claimant
      }
     
     // for Bonds
      if((this.Name == "Engagement Letter" or 
          this.Name == "Florida Bonds Reduction" or 
          this.Name == "GA Denial Not Purchaser" or
          this.Name == "ICC Broker Outside Policy Period" or
          this.Name == "CA BOE - Board of Equal" or
          this.Name == "CA Little Pay All Other" or 
          this.Name == "CA Little Pay Due to NSF Checks" or
          this.Name == "Denial Interpleader Filed Penal Sum Paid") and 
          this.Claim.Contacts.Count != 0){
        this.MailToExt = null
      }
     
     // for Bonds - Obligee
      if((this.Name == "FMCSA Reduction Letter") and this.Claim.Contacts.Count != 0){
        this.MailToExt = this.Claim.getObligee().Contact
      }
      
      //if the document is matter related
      if(this.IsMatterRelated){
        // if the list of legal related send to contacts is not empty 
        // then set mail to as first value in list
        if(!this.LegalActionSendToValues.Empty){
          this.MailToExt = this.LegalActionSendToValues.first()
        }
      }
    }
  } // end defaultSendTo

  function defaultCC(autoCCPartiesSt : String){
    // creating default CC contacts on new Document screen if AutoCCParty metadata is set on the template
    // for Empower documents:
    if(EmpowerDocumentUtil.isUnFinalizedEmpowerDocument(this)){
      var autoCCParties = autoCCPartiesSt.split(",")
      // resetting all CCUsers in case the user picks another template with different AutoCCcontacts in metadata
      for(user in this.ex_CCUsers){
        this.removeFromEx_CCUsers(user)
      }
      for(ccParty in autoCCParties){
        ccParty=ccParty.trim().toLowerCase()
        var ccUser:ex_CCUser = new ex_CCUser()
        switch(ccParty){
          case "insured": 
            if(this.ex_CCUsers.where(\ cont -> cont.Contact == this.Claim.Insured).IsEmpty){
              ccUser.Contact = this.Claim.Insured
              this.addToEx_CCUsers(ccUser)} 
              break 
          case "agency": 
            if(this.ex_CCUsers.where(\ cont -> cont.Contact == this.Claim.Policy.ex_Agency).IsEmpty){
              ccUser.Contact = this.Claim.Policy.ex_Agency 
              this.addToEx_CCUsers(ccUser)
            }
        }
      }
    }
    // for regular documents:
    else{
      if(this.AgentCopyExt and this.ex_CCUsers.where(\ cont -> cont.Contact == this.Claim.Policy.ex_Agency).IsEmpty){
        var ccUser:ex_CCUser = new ex_CCUser()
        ccUser.Contact = this.Claim.Policy.ex_Agency
        this.addToEx_CCUsers( ccUser )
      }
    }
  }

  function getSIUInvestigator(): String {
    if(this.DocInvestigationsExt.length>0){
      return this.getDisplayNameWithoutFormerAndClosed(this.DocInvestigationsExt[0].Investigation.SIUInvestigator.DisplayName)
    } else {
      return null
    }
  }

  function getSIUClaimant(): String {
    if(this.DocInvestigationsExt.length>0){
      return this.getDisplayNameWithoutFormerAndClosed(this.DocInvestigationsExt[0].Investigation.SIUClaimant.DisplayName)
    } else {
      return null
    }
  }

  public function getRelatedInvestigations() : List {
    var relToList = new ArrayList();
  
    for(investigation in this.Claim.SIUInvestigationsExt){
      relToList.add(investigation);
    }
   
    return relToList
  }

  function setInvestigation(investigation : SIUInvestigationExt) {
    if(this.DocInvestigationsExt.length>0){
      this.DocInvestigationsExt[0].Investigation = investigation
    } else {
      this.Claim.linkDocumentToInvestigation( this, investigation )
   }
  }
  
  public function getMoreNamedInsureds() : String {
    var mniString:java.lang.StringBuffer = new java.lang.StringBuffer()
    mniString.append("")
    for(mni in this.Claim.Policy.getMNICoveredParties()){
      if(mni != this.Claim.Policy.getMNICoveredParties().last()){
        this.getDisplayNameWithoutFormerAndClosed(mniString.append(mni.Contact.DisplayName))
        mniString.append("\\par")
                mniString.append("\n") 
      }else{
        this.getDisplayNameWithoutFormerAndClosed(mniString.append(mni.Contact.DisplayName))
      }
    }
    return mniString.toString()
  }
  
  public function getMoreNamedInsuredsEmp() : String {
    var mniString:java.lang.StringBuffer = new java.lang.StringBuffer()
    mniString.append("")
    for(mni in this.Claim.Policy.getMNICoveredParties()){
      if(mni != this.Claim.Policy.getMNICoveredParties().last()){
        this.getDisplayNameWithoutFormerAndClosed(mniString.append(mni.Contact.DisplayName))
          mniString.append("\n") 
      }else{
        this.getDisplayNameWithoutFormerAndClosed(mniString.append(mni.Contact.DisplayName))
      }
    }
    return mniString.toString()
  }
  
  function getLossTypeDivision(): String
  {
    if(this.Claim.LossType == LossType.TC_AGRIPROPERTY)
    {
      return "AgriBusiness® Division"     
    }
    else if(this.Claim.LossType ==LossType.TC_PIMINMARINE)
    {
      return "Property & Inland Marine"
    }  
    return ""
  }
  function getLobDivsionClaims(): String
  {
    if(this.Claim.LossType == LossType.TC_AGRIPROPERTY)
    {
      return "AgriBusiness® Division - Claims"    
    }
    else if(this.Claim.LossType ==LossType.TC_PIMINMARINE)
    {
      return "Property & Inland Marine Division - Claims"
    }  
    return ""
  }
  function getPOAdd(): String
  {
    if(this.Claim.LossType == LossType.TC_AGRIPROPERTY)
    {
      return "PO Box 1239"    
    }
    else if(this.Claim.LossType ==LossType.TC_PIMINMARINE)
    {
      return "P.O. Box 5440"
    }  
    return ""
  }

  function getCityAdd(): String
  {
    if(this.Claim.LossType == LossType.TC_AGRIPROPERTY)
    {
      return "Cincinnati, OH  45201-1239"    
    }
    else if(this.Claim.LossType ==LossType.TC_PIMINMARINE)
    {
      return "Cincinnati, OH  45201-5440"
    }  
    return ""
  }
  function getPrimaryPhone(): String
  {
    if(this.Claim.LossType == LossType.TC_AGRIPROPERTY)
    {
      return "513.763.8550 ph"    
    }
    else if(this.Claim.LossType ==LossType.TC_PIMINMARINE)
    {
      return "513.763.8277 ph"
    }  
    return ""
  }
  function getSecondaryPhone(): String
  {
    if(this.Claim.LossType == LossType.TC_AGRIPROPERTY)
    {
      return "800.567.7359 ph"    
    }
    else if(this.Claim.LossType ==LossType.TC_PIMINMARINE)
    {
      return "800.584.0835 ph"
    }  
    return ""
  }
  function getFaxNum(): String
  {
    if(this.Claim.LossType == LossType.TC_AGRIPROPERTY)
    {
      return "513.345.1361 fax"    
    }
    else if(this.Claim.LossType ==LossType.TC_PIMINMARINE)
    {
       return "800.811.4751 fax"
   }  
    return ""
  }
  function getTrainer() : String   
  {
    var trainer : String = null
    for(riskUnit in this.Claim.Policy.Properties){
  if(riskUnit typeis LocationBasedRU){
   trainer = this.getDisplayNameWithoutFormerAndClosed(riskUnit.Property.ex_PrimaryTrainer.DisplayName)
  }
  
    }
    return trainer
}
function getTrainerPhone() : String   
  {
    var TrainerPhone : String = null
    for(riskUnit in this.Claim.Policy.Properties){
  if(riskUnit typeis LocationBasedRU){
   TrainerPhone = riskUnit.Property.ex_PrimaryTrainer.PrimaryPhoneValue 
  }
  
    }
    return TrainerPhone
  }

  function getInsuredPrimaryPhone() : String{
    
    if(this.Claim.Policy.insured.PrimaryPhone != null){
      if(this.Claim.Policy.insured.PrimaryPhone == "work"){
        return (this.Claim.Policy.insured.WorkPhone + "  W")
      }
      if(this.Claim.Policy.insured.PrimaryPhone == "home"){
        return (this.Claim.Policy.insured.HomePhone + "  H")
      }
      if(this.Claim.Policy.insured.PrimaryPhone == "mobile"){
        return (this.Claim.Policy.insured.CellPhoneExt + "  C")
      }
    }else{
      if(this.Claim.Policy.insured.WorkPhone != null){
        return (this.Claim.Policy.insured.WorkPhone + "  W")
      }
      if(this.Claim.Policy.insured.HomePhone != null){
        return (this.Claim.Policy.insured.HomePhone + "  H")
      }
      if(this.Claim.Policy.insured.CellPhoneExt != null){
        return (this.Claim.Policy.insured.CellPhoneExt + "  C")
      }
    }
    return ""
  }  
  
  function getInsuredAlternatePhone() : String{
    
    if(this.Claim.Policy.insured.PrimaryPhone != null){
      if(this.Claim.Policy.insured.PrimaryPhone == "work"){
        if(this.Claim.Policy.insured.HomePhone != null){
          return (this.Claim.Policy.insured.HomePhone + "  H")
        }
        if(this.Claim.Policy.insured.CellPhoneExt != null){
          return (this.Claim.Policy.insured.CellPhoneExt + "  C")
        }
      }
      if(this.Claim.Policy.insured.PrimaryPhone == "home"){
        if(this.Claim.Policy.insured.WorkPhone != null){
          return (this.Claim.Policy.insured.WorkPhone + "  W")
        }
        if(this.Claim.Policy.insured.CellPhoneExt != null){
          return (this.Claim.Policy.insured.CellPhoneExt + "  C")
        }
      }
      if(this.Claim.Policy.insured.PrimaryPhone == "mobile"){
        if(this.Claim.Policy.insured.WorkPhone != null){
          return (this.Claim.Policy.insured.WorkPhone + "  W")
        }
        if(this.Claim.Policy.insured.HomePhone != null){
          return (this.Claim.Policy.insured.HomePhone + "  H")
        }
      }
    }else{
      if(this.Claim.Policy.insured.WorkPhone != null){
        if(this.Claim.Policy.insured.HomePhone != null){
          return (this.Claim.Policy.insured.HomePhone + "  H")
        }
        if(this.Claim.Policy.insured.CellPhoneExt != null){
          return (this.Claim.Policy.insured.CellPhoneExt + "  C")
        }
      }
      if(this.Claim.Policy.insured.HomePhone != null){
        if(this.Claim.Policy.insured.WorkPhone != null){
          return (this.Claim.Policy.insured.WorkPhone + "  W")
        }
        if(this.Claim.Policy.insured.CellPhoneExt != null){
          return (this.Claim.Policy.insured.CellPhoneExt + "  C")
        }
      }
      if(this.Claim.Policy.insured.CellPhoneExt != null){
        if(this.Claim.Policy.insured.WorkPhone != null){
          return (this.Claim.Policy.insured.WorkPhone + "  W")
        }
        if(this.Claim.Policy.insured.HomePhone != null){
          return (this.Claim.Policy.insured.HomePhone + "  H")
        }
      }
    }
    return ""
  }

  function getRelatedContacts(): List<Contact>{
    
    if(this.IsMatterRelated){
      return this.LegalActionSendToValues
    }else{
    
      return this.Claim.getRelatedContacts() as java.util.List<entity.Contact>
       
    }
  }
  
  function constructECFUrl(): String {
    var cl = this.Claim;
    var dId = this.DocUID;
    var sb : StringBuilder = new StringBuilder("https://");
    var env : String = java.lang.System.getProperty("gw.cc.env")
  
    if(env.toLowerCase().startsWith("dev")){
       //sb.append("myfileecfdev.td.afg/ecf/Home/MainPage")
       sb.append("ecf-dev.td.afg/home/mainpage")
    }else if(env.equalsIgnoreCase("uat")){
        sb.append("ecf-uat.gaic.com/home/mainpage")
    }else{
      if(env.equalsIgnoreCase("prod")){
        sb.append("ecf.gaic.com/home/mainpage")
      }else{
        sb.append("ecf-cert.gaic.com/home/mainpage") 
      }
    } 
 
    sb.append("?ClaimNumber=" + cl)
    sb.append("&docid=")
    sb.append(dId)
    sb.append("&SystemID=CC")
    return sb.toString()
  }

public static function getDisplayNameWithoutFormer(name:String):String{
 
 var displayName= util.StringUtils.getStringValue(name)
  
   if(displayName!="" && displayName.contains("(Former)")){
    return displayName.remove("(Former)")
   } else{
    return displayName;
   }
}

public static function getDisplayNameWithoutFormerAndClosed(name:String):String{
   var displayName= util.StringUtils.getStringValue(name)
  
   if(displayName!="" && displayName.contains("(Closed)")){
    displayName = displayName.remove("(Closed)")
   }
   if(displayName!="" && displayName.contains("(Former)")){
    displayName = displayName.remove("(Former)")
   } 
   return displayName
}

function VehicleMake(): String {
    var VehicleMake : String 
     VehicleMake= ""
  
    if( this.getExposureValue("VehicleMake") != null)
       VehicleMake= this.getExposureValue("VehicleMake")
    else
      return null
    
    
    return VehicleMake
  }
  
  function getDivisionName():String{
    var group:Group = this.Claim.AssignedGroup
    var businessUnit: String=""
    while(group != null && group != group.RootGroup && group.GroupType != GroupType.TC_BUSUNIT) {
      group=group.Parent
    }

    if(group.GroupType == GroupType.TC_BUSUNIT && group.DivisionNameExt.DivisionNameValue != null){
      businessUnit = group.DivisionNameExt.DivisionNameValue
    } else {
      //Use no default
      businessUnit=""
    }       
    return businessUnit
  }

  function getAddressLine1() : String {
    var returnLine = this.MailToExt == null ? null : this.MailToExt.PrimaryAddress.gaic_getmailingaddresslines();
    if (returnLine == null || returnLine == "") {
     returnLine = "301 East Fourth Street";
    }
    return returnLine;
  }

  function getCityStateZip() : String {
    var returnLine = this.MailToExt == null ? null : this.MailToExt.PrimaryAddress.CityStateZip
    if (returnLine == null || returnLine == "") {
     returnLine = "Cincinnati, OH 45202";
    }
    return returnLine;
  }
  
  public function getSimillarPayments(expType:String, costtype:String): String{
    var Value:String=""

    if(this.RelatedTo typeis Exposure){
      var exp = this.RelatedTo as Exposure
      switch(expType){
        case "el_Indemnity":
          Value= exp.getAllSmillarpaidFeaturesPayments(expType,costtype) as java.lang.String
          break;
        case "el_DutyDefWthnLimits":
           Value= exp.getAllSmillarpaidFeaturesPayments(expType, costtype) as java.lang.String
          break;
        case "el_DutyDefOtsdLimits":
        Value= exp.getAllSmillarpaidFeaturesPayments(expType, costtype) as java.lang.String
        break;
        case "el_LossAdjustExp":
        Value= exp.getAllSmillarpaidFeaturesPayments(expType, costtype) as java.lang.String
          break;
        
        default:
          break;
      }
    }
    return Value
  }
  public function getsimillarReserves(expType:String, costtype:String): String{
    var Value:String=""
    
    if(this.RelatedTo typeis Exposure){
      var exp = this.RelatedTo as Exposure;
      switch(expType){
        case "el_Indemnity":
          Value= exp.getAllSimillarFeaturesReserves(expType, costtype) as java.lang.String
          break;
        case "el_DutyDefWthnLimits":
           Value= exp.getAllSimillarFeaturesReserves(expType, costtype) as java.lang.String
          break;
        case "el_DutyDefOtsdLimits":
        Value= exp.getAllSimillarFeaturesReserves(expType, costtype) as java.lang.String
        break;
        case "el_LossAdjustExp":
        Value= exp.getAllSimillarFeaturesReserves(expType, costtype) as java.lang.String
          break;

        default:
          break;
      }
    }
    return Value
  }
 

  /*function getCoverageAndLimits() : String {
    var covArray = new ArrayList<Pair<String,String>>()
    for(covRisk in this.Claim.Policy.RiskUnits*.Coverages){
      var incidentLimit = covRisk.IncidentLimit != null ? covRisk.IncidentLimit : 0
      covArray.add(new Pair<String,String>(covRisk.Type.DisplayName,gw.api.util.StringUtil.formatNumber(incidentLimit, "$#,##0")))
    }
    for(covPol in this.Claim.Policy.Coverages){
      var incidentLimit = covPol.IncidentLimit != null ? covPol.IncidentLimit : 0
      covArray.add(new Pair<String,String>(covPol.Type.DisplayName,gw.api.util.StringUtil.formatNumber(incidentLimit, "$#,##0")))
    }
      
    return covArray.toList().toString()
  }*/
  
  function getCoverageAndLimits() : String {
   var covArray = new ArrayList<Pair<String,String>>()
   
   if(this.Matter != null and this.Matter.MatterAssignmentsExt != null){
     for(mAssign in this.Matter.MatterAssignmentsExt){
       for(aExp in mAssign.AssignmentExposuresExt){
         var cov = aExp.Exposure.Coverage
        var incidentLimit = cov.IncidentLimit != null ? cov.IncidentLimit : 0
        if(!covArray.contains(new Pair<String,String>(cov.Type.DisplayName,gw.api.util.StringUtil.formatNumber(incidentLimit, "$#,##0")))){
          covArray.add(new Pair<String,String>(cov.Type.DisplayName,gw.api.util.StringUtil.formatNumber(incidentLimit, "$#,##0")))
        }
       }
     }
   }
   
   return covArray.toList().toString()
  }


  // WC 2015 dnmiller: Added to change the claimant label to 'Injured Worker' for WC claims.
  function getClaimantLabel(): String{
    if (this.Claim.isWCclaim){
      return "Injured Worker:"
    }
    else {
      if (this.Claim.IncidentClaimant!= null or this.Exposure != null){
        return "Claimant:"
      }else {
        return ""
      }
    }
  }
  // WC 2015 dnmiller: Added to change the insured label to 'Employer' for WC claims.
  function getInsuredLabel(): String{
    if (this.Claim.isWCclaim){
      return "Employer:"
    }
    else {
      return "Insured:"
    }
  }
  // 2015 dnmiller: Added for WC, to return the claim.claimant as the Injured Workers and the Incident.Claimant for all
  //                other lines of business.
  function getIncidentClaimant(): String{
    if (this.Claim.isWCclaim){
      return this.Claim.claimant as java.lang.String
    }
    else {
      if (this.Claim.incidentclaimant != null){
        return this.Claim.incidentclaimant as java.lang.String
      }else {
        return ""
      }
    }
  }
  // 2015 dnmiller: Added to return "Date of Injury" for WC claims, and "Date of Loss" for all other LOB.
  function getDateofLossLabel(): String{
    if (this.Claim.isWCclaim){
      return "Date of Injury:"
    }
    else {
      return "Date of Loss:"
    }
  }
  
  public static function getFullStreetAddress(address:Address):String{
    var fullAddressString : String
    if(address.AddressLine1 != null ){
      fullAddressString = address.AddressLine1
      if(address.AddressLine2 != null){
        fullAddressString  =  fullAddressString + ", " + address.AddressLine2
      }
    }
    return fullAddressString  
  }
  
  function getEvaluationByType(exposureType:String):Evaluation{
    var ev : Evaluation
    if(this.Claim.Evaluations.HasElements)
       ev = this.Claim.Evaluations.firstWhere(\ e -> e.EvaluationTypeExt==exposureType)
    return ev
  }
  // replacing & with it's code &amp; , but preventing replacement of &s in &lt; and &gt;
  public static function replaceAmpSymbol(payload:String):String{
    payload = payload.replaceAll("&amp;", "&")
    payload = payload.replaceAll("&", "&amp;")
    payload = payload.replaceAll("&amp;lt;", "&lt;")
    payload = payload.replaceAll("&amp;gt;", "&gt;")
    return payload
  }
  
  // getting all the dependents on a claim.
  function getDependentsOnClaim():String{
    var allDependents = new ArrayList<ClaimContact>()
    for(contact in this.Claim.Contacts){
      if(contact.Roles!=null && contact.Roles.where(\ c -> c.Role.Code=="claimantdep").Count!=0 && contact.Roles.where(\ c -> c.Role.Code=="formerclaimantdep").Count==0){
        allDependents.add(contact)
      }
    }
    if(allDependents!=null && allDependents.Count!=0){
      return this.Claim.getListOfItemsFromObjectArray(allDependents as java.lang.Object[],"ClaimContact")
    }
    else
      return ""
  } // end getDependentsOnClaim
  
  // function for getting latest Work Status from Indemnity (feature) - Benefits tab screen
  function getLatestWorkStatus():String{
    var workStatusChanges = this.Claim.EmploymentData.WorkStatusChanges
    if(workStatusChanges!=null){
      if(workStatusChanges.Count==1){
        return workStatusChanges.first().Status.UnlocalizedName
      }
      var tempList:List<WorkStatus> = new ArrayList<WorkStatus>()
      if(workStatusChanges.Count>1){
        for(change in workStatusChanges){
          tempList.add(change)
        } 
      }
      if(tempList.HasElements){
        tempList = tempList.sortBy(\ t -> t.StatusDate)
      }
      return tempList.last().Status.UnlocalizedName
    }
    return ""
  } // end getLatestWorkStatus
  
  // 8/24/16 - dnmiller - Added function to get Tail Number label for Aviation. 
  function getTailNumLabel(): String{
    if (this.Claim.TailNumberExt != null){
      return "Tail Number: "
    }
    else {
      return ""
    }
  } // end getTailNumLabel
  
  // 10/05/2016 - ivorobyeva - Function to check the completeness of the address
  // checking if the address is valid (contains AddLine1, City, State and Zip - for domestic addresses
// and country, AddLine1 and a city for international)
  public static function isAddressValid(addr:Address):Boolean{
    // if it's an address with a state (US, Canada)
    if(addr.State!=null){
      if(addr.Country!=null && addr.AddressLine1.length>0 && addr.City.length>0 && addr.PostalCode.length>0){
        return true
      }
      else{ 
        return false
      }
    }
    // if the address doesn't have a state - international as State is required for domestic
    else{
      if(addr.Country!=null && addr.AddressLine1.length>0 && addr.City.length>0){
        return true
      }
      else{ 
        return false
      }
    }
  } // end isAddressComplete
  
  // using an address hierarchy Mailing-Business-Home-Tax-Primary to get the contact's "MailTo" address 
  public static function getAddressToMail(contact:Contact):Address{
    var mainAddr:Address
    if(exists(addr in contact.AllAddresses where addr.AddressType=="mailing")){ 
      mainAddr=contact.AllAddresses.firstWhere(\ a -> a.AddressType=="mailing")
    }
    else{ 
      if(exists(addr in contact.AllAddresses where addr.AddressType=="business")){ 
        mainAddr=contact.AllAddresses.firstWhere(\ a -> a.AddressType=="business")
      }
      else{ 
        if(exists(addr in contact.AllAddresses where addr.AddressType=="home")){ 
          mainAddr=contact.AllAddresses.firstWhere(\ a -> a.AddressType=="home")
        }
        else{
          if(exists(addr in contact.AllAddresses where addr.AddressType=="tax")){ 
            mainAddr=contact.AllAddresses.firstWhere(\ a -> a.AddressType=="tax")
          }
          else{ 
            if(contact.PrimaryAddress!=null){ 
              mainAddr=contact.PrimaryAddress
            }
          }
        }
      }
    }
    return mainAddr
  } // end getAddressToMail
} // end Document_Functions