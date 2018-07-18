package libraries.Claim_Entity
uses java.util.ArrayList;
uses util.custom_Ext.EmailHelper

enhancement SIUFunctions : entity.Claim {
  /*****************************************************************************************************
   *Populates a list of contacts with those considered to be SIU Investigators - this includes managers
   *Author: Stephanie Przygocki
   *Date: Fall 2010
   *Updated: -
   *****************************************************************************************************/
  function getSIUInvestigators() : List {
    var allUsers : List = new ArrayList()
    try{
      var tempManagers : List = new ArrayList()
      var SIUGroup : Group = util.custom_Ext.finders.getGroupID( "SIU" )
  
      //Adding Investigators to the list and sorting
      for(groupUser in SIUGroup.Users){
        if(groupUser.User.hasUserRole( "SIU Investigator" )){      
          allUsers.add(groupUser.User)
        }
      }
      java.util.Collections.sort( allUsers as java.util.List<User> )
      //Adding Managers to the temporary list and sorting
      for(groupUser in SIUGroup.Users){
      	if(groupUser.User.hasUserRole( "SIU Manager" )){
      	  tempManagers.add(groupUser.User)
      	}
      }
      java.util.Collections.sort( tempManagers as java.util.List<User> )
      //Appending the managers temporary list to the list of all users
      allUsers.addAll(tempManagers)
    } catch(e){
      util.ErrorHandling.GAICErrorHandling.logError( Claim, "Adding SIU Investigators to a list by role", e, null )
    }
    return allUsers
  }

  /*****************************************************************************************************
   *Populates a list of contacts with those considered to be SIU Data Researchers - this includes managers
   *Author: Stephanie Przygocki
   *Date: Fall 2010
   *Updated: -
   *****************************************************************************************************/
  function getSIUDataResearchers() : List {
    var allUsers : List = new ArrayList()
    try{
      var tempManagers : List = new ArrayList()
      var SIUGroup : Group = util.custom_Ext.finders.getGroupID( "SIU" )
  
      //Adding Data Researchers to the list and sorting
      for(groupUser in SIUGroup.Users){
        if(groupUser.User.hasUserRole( "SIU Investigative Analyst" )){      
          allUsers.add(groupUser.User)
        }
      }
      java.util.Collections.sort( allUsers as java.util.List<User> )
      //Adding Managers to the temporary list and sorting
      for(groupUser in SIUGroup.Users){
      	if(groupUser.User.hasUserRole( "SIU Manager" )){
      	  tempManagers.add(groupUser.User)
      	}
      }
      java.util.Collections.sort( tempManagers as java.util.List<User> )
      //Appending the managers temporary list to the list of all users
      allUsers.addAll(tempManagers)
    } catch(e){
      util.ErrorHandling.GAICErrorHandling.logError( Claim, "Adding SIU Data Researchers to a list by role", e, null )
    }
    return allUsers
  }

  /*****************************************************************************************************
   *Populates a list of contacts with those considered to be SIU Investigators, Data Researchers or Managers
   *  sorted by role and then alphabetically by last name
   *Author: Stephanie Przygocki
   *Date: Fall 2010
   *Updated: -
   *****************************************************************************************************/
  function getAllInvestigators() : List {
    var allUsers : List = new ArrayList()
    try{
      var tempManagers : List = new ArrayList()
      var SIUGroup : Group = util.custom_Ext.finders.getGroupID( "SIU" )
  
      //Adding Investigators to the list and sorting
      for(groupUser in SIUGroup.Users){
        if(groupUser.User.hasUserRole( "SIU Investigator" ) || groupUser.User.hasUserRole( "SIU Investigative Analyst" )){      
          allUsers.add(groupUser.User)
        }
      }
      java.util.Collections.sort( allUsers as java.util.List<User> )
      //Adding Managers to the temporary list and sorting
      for(groupUser in SIUGroup.Users){
      	if(groupUser.User.hasUserRole( "SIU Manager" )){
      	  tempManagers.add(groupUser.User)
      	}
      }
      java.util.Collections.sort( tempManagers as java.util.List<User> )
      //Appending the managers temporary list to the list of all users
      allUsers.addAll(tempManagers)
    } catch(e){
      util.ErrorHandling.GAICErrorHandling.logError( Claim, "Adding SIU Investigators to a list by role", e, null )
    }
    return allUsers
  }

  /*****************************************************************************************************
   *Returns a list of users on the claim which have the role Corporate Claims Assist - 
   *  returns them all if more than one exist since CCAs do not get attached to investiations.
   *Author: Stephanie Przygocki
   *Date: Fall 2010
   *Updated: -
   *****************************************************************************************************/
  function getCorpClaimsAssist() : String {
    var users : String = ""
    try{
      for(claimUserModel in this.ClaimUserModelSet.ClaimUserModels){
        if(exists(role in claimUserModel.UserRoleAssignments where role.Role=="scoassist")){
          users = users + claimUserModel.User.DisplayName + ", "
        }
      }
      users = users.trim()
      if(users.endsWith( "," )){
        users = users.substring( 0, users.lastIndexOf( "," ) )
      }
    } catch(e){
      util.ErrorHandling.GAICErrorHandling.logError( Claim, "Adding Corp Claims Assist users to a string", e, null )
    }
  
    return users
  }

  /*****************************************************************************************************
   *Restricts the typelist for SIU Referral Types to those other than "data" for investigations
   *Author: Stephanie Przygocki
   *Date: Fall 2010
   *Updated: -
   *****************************************************************************************************/
  function getInvestigationReferralTypes() : List {
    var types : List = new ArrayList()
    try{
      for(key in SIUReferralTypeExt.getTypeKeys(false)){
        if(key != "data"){
          types.add(key)
        }
      }
    } catch(e){
      util.ErrorHandling.GAICErrorHandling.logError( Claim, "Adding SIU Referral Types to a list, except for type DATA", e, null )
    }
  
    return types
  }

  /*****************************************************************************************************
   *Creates a new SIU activity if a new investigation has been added to ClaimCenter
   *Author: Stephanie Przygocki
   *Date: Fall 2010
   *Updated: -
   *****************************************************************************************************/
  function createNewSIUActivity(referral : SIUInvestigationExt) {
    try{
     // if(!User.util.CurrentUser.hasUserRole( "SIU Investigator" )) and
     //    !User.util.CurrentUser.hasUserRole( "SIU Investigative Analyst" ) and
     //    !User.util.CurrentUser.hasUserRole( "SIU Manager" )){
        if(referral.SIUInvestigator != null){
         var activity = this.createActivityFromPattern( null, util.custom_Ext.finders.findActivityPattern( "new_siu_referral" ))
         var assgdUser = referral.SIUInvestigator
         activity.assignUserAndDefaultGroup(assgdUser)
         activity.Claimant = referral.SIUClaimant
         activity.SIUInvestigationExt = referral
         activity.Description = "The SIU Manager has assigned this claimant " + referral.SIUClaimant + " referral, for your review."
         }
  //    }
   } catch(e){
      util.ErrorHandling.GAICErrorHandling.logError( Claim, "Adding an activity for a new SIU Investigation", e, null )
    }
  }

  /*****************************************************************************************************
   *Creates a new SIU activity if a current investigation has been updated by someone other than an SIU
   *  group member
   *Author: Stephanie Przygocki
   *Date: Fall 2010
   *Updated: -
   *****************************************************************************************************/
  function createUpdateSIUActivity(referral : SIUInvestigationExt) {
    try{
    //  if(!User.util.CurrentUser.hasUserRole( "SIU Investigator" ) and
    //     !User.util.CurrentUser.hasUserRole( "SIU Investigative Analyst" ) and
    //     !User.util.CurrentUser.hasUserRole( "SIU Manager" )){
        if((util.gaic.EDW.EDWSIUFunctions.isSIUChanged( referral ) || 
           this.isArrayElementChanged( "SIUInvestigationsExt" ))){
          var activity = this.createActivityFromPattern( null,  util.custom_Ext.finders.findActivityPattern( "updated_siu_referral" ))
          var assgdUser = referral.SIUInvestigator
          activity.assignUserAndDefaultGroup(assgdUser)
          activity.Claimant = referral.SIUClaimant
          activity.SIUInvestigationExt = referral
          activity.Description = "An existing SIU referral has been updated for " + referral.SIUClaimant + "; please review."
        }
    //  }
    } catch(e) {
      util.ErrorHandling.GAICErrorHandling.logError( Claim, "Adding an activity for an updated SIU Investigation", e, null )
    }
  }
  
  function createReassignmentActivity(referral : SIUInvestigationExt){
    try{
      
      if(referral.isFieldChanged("SIUInvestigator")){
        var activity = this.createActivityFromPattern( null,  util.custom_Ext.finders.findActivityPattern( "review_reassigned_siu" ))
        var assgdUser = referral.SIUInvestigator
        activity.assignUserAndDefaultGroup(assgdUser)
        activity.Claimant = referral.SIUClaimant
        activity.Description = "The SIU Manager has reassigned this claimant " + referral.SIUClaimant + " referral, for your review."
        activity.TargetDate = gw.api.util.DateUtil.currentDate().trimToMidnight()
      }
    } catch(e){
        util.ErrorHandling.GAICErrorHandling.logError( this, "Adding an activity for a referral reassignment", e, null )
    }
  }

  /*****************************************************************************************************
   *Helper functions for linking notes with investigations
   *Author: Stephanie Przygocki
   *Date: Fall 2010
   *Updated: -
   *****************************************************************************************************/
  function addNoteToInvestigation(invest : SIUInvestigationExt, noteToAdd : Note){
    try{
      if(invest!=null){
        invest.addToNotes( noteToAdd )
      }
    } catch(e) {
      util.ErrorHandling.GAICErrorHandling.logError( Claim, "Associating a note with an investigation", e, null )
    }
  }
  function removeNoteFromInvestigation(invest : SIUInvestigationExt, noteToRemove : Note){
    try{
      if(invest!=null){
        invest.removeFromNotes( noteToRemove )
      }
    } catch(e) {
      util.ErrorHandling.GAICErrorHandling.logError( Claim, "Removing the association from a note", e, null )
    }
  }

  /*****************************************************************************************************
   *Grabs the names of all the research types associated with a party and returns them in a display string
   *Author: Stephanie Przygocki
   *Date: Fall 2010
   *Updated: -
   *****************************************************************************************************/
  function getResearchTypes(Party : DataResearchPartyExt) : String {
    var retString : String = ""
    try{
      if(Party.ResearchTypes.length>0){
        for(type in Party.ResearchTypes){
          retString = retString + type.ResearchType.DisplayName + ", "
        }
        retString = retString.trim()
        if(retString.endsWith( "," )){
          retString = retString.substring( 0, retString.lastIndexOf( "," ) )
        }
      } else {
        retString = "(none)"
      }
    } catch(e) {
      util.ErrorHandling.GAICErrorHandling.logError( Claim, "Creating the display name for ResearchTypes", e, null )
    }
    return retString
  }
  


/*  function getDataResearchPartiesTypeError(invest : SIUInvestigationExt) : String {    
      for(Party in invest.DataResearchParties)
      {       
      if(Party.ResearchTypes.length<=0){
          return displaykey.NVV.SIU.ValidationResearchType            
        }    
      }
     return null
}  */


  /*****************************************************************************************************
   *Used on the Data Research Details page, if the user hasn't clicked on the add button yet it returns one error message,
   * otherwise it checks if the research type has been filled in
   *Author: Mark Bendure
   *Date: April 19, 2012
   *Updated: -
   *****************************************************************************************************/
  function getDataResearchParties(invest : SIUInvestigationExt) : String { 
    if(invest.DataResearchParties.IsEmpty)
      return displaykey.NVV.SIU.ValidationResearch
    else
      for(Party in invest.DataResearchParties)
        if(Party.ResearchTypes.length<=0)
          return displaykey.NVV.SIU.ValidationResearchType
    return null
  }



  /*****************************************************************************************************
   *Checked to ensure the Name field has been filled in, returns a error message if the field hasn't been filled in
   *Author: Mark Bendure
   *Date: April 19, 2012
   *Updated: -
   *****************************************************************************************************/
  function getDataResearchPartiesNameError(invest : SIUInvestigationExt) : String {     
      for(Party in invest.DataResearchParties)       
        if(Party.Contact.Name==null)
          return displaykey.NVV.SIU.ValidationResearchName            
     return null
}

  
/*  function geDataResearchParties(invest : SIUInvestigationExt) : boolean {    
    var flag=false;
      for(Party in invest.DataResearchParties)
      {       
      if(Party.ResearchTypes.length<=0){
          flag=false               
        }
      else
      {
       flag=true
      }        
      }  
    return flag
  }
  
  */
  

  /*****************************************************************************************************
   *Sends an email after a new Data Research has been submitted
   *Author: Stephanie Przygocki
   *Date: Fall 2010
   *Updated: -
   *****************************************************************************************************/
  function sendDataResearchEmail(SIUInvestigationExt : SIUInvestigationExt, investigationIsNew : boolean){
    try{
      var subject="Data Research Request"
      var body : String;
      var partiesAddedRemoved : boolean = false;
      var partiesChanged : boolean = false;
      var environment = java.lang.System.getProperty("gw.cc.env")
      var emailHelper=new EmailHelper()
      //Will only check to see if parties have been removed, added or changed if the Data Research is not new
      if(!investigationIsNew){
        partiesAddedRemoved = SIUInvestigationExt.isArrayElementAddedOrRemoved( "DataResearchParties" )
        partiesChanged = SIUInvestigationExt.isArrayElementChanged( "DataResearchParties" )
        //Will only check to see if research types have been added, changed or deleted if the parties have either
        //  not been changed or not been removed. If both have been, there is no reason to go through the loop.
        if(!partiesChanged || !partiesAddedRemoved){
          for(party in SIUInvestigationExt.DataResearchParties){
            if(party.isArrayElementChanged( "ResearchTypes" )){
              partiesChanged = true
            }
            if(party.isArrayElementAddedOrRemoved( "ResearchTypes" )){
              partiesAddedRemoved = true
            }
          }
        }
        if(partiesChanged || partiesAddedRemoved){
          body = templates.email.NewSIUReferral.renderToString(SIUInvestigationExt, partiesChanged, partiesAddedRemoved)
          if(environment == "prod"){
            emailHelper.sendEmailWithBodyEcf( this, ScriptParameters.SIUInvestigatorEmail, 
              SIUInvestigationExt.SIUInvestigator.DisplayName, "ClaimCenterSupport@gaig.com",  
              "ClaimCenter Support", subject, body)
          } else {
            emailHelper.sendEmailWithBodyEcf( this, "ClaimCenterTesting@gaig.com", 
              SIUInvestigationExt.SIUInvestigator.DisplayName, "ClaimCenterTesting@gaig.com", 
              "ClaimCenter Testing", subject, body)
          }
        }
      } else {
        body = templates.email.NewSIUReferral.renderToString(SIUInvestigationExt, partiesChanged, partiesAddedRemoved)
        if(environment == "prod"){
          emailHelper.sendEmailWithBodyEcf( this, ScriptParameters.SIUInvestigatorEmail, 
              SIUInvestigationExt.SIUInvestigator.DisplayName, "ClaimCenterSupport@gaig.com",  
              "ClaimCenter Support", subject, body)
        } else {
          emailHelper.sendEmailWithBodyEcf( this, "ClaimCenterTesting@gaig.com", 
              SIUInvestigationExt.SIUInvestigator.DisplayName, "ClaimCenterTesting@gaig.com", 
              "ClaimCenter Testing", subject, body)
        }
      }
    } catch(e){
      util.ErrorHandling.GAICErrorHandling.logError( SIUInvestigationExt, "Sending Data Research Email", e, null )
    }
  }
  
  function sendInvestigationEmail(SIUInvestigationExt : SIUInvestigationExt) {
    try{
      var subject="SIU Investigation Referral"
      var body : String;
      var environment = java.lang.System.getProperty("gw.cc.env")
      var emailHelper=new EmailHelper()
      
      body = templates.email.NewSIUInvestigation.renderToString(SIUInvestigationExt)
      if(environment == "prod"){
          emailHelper.sendEmailWithBodyEcf( this, ScriptParameters.SIUInvestigatorEmail, 
              SIUInvestigationExt.SIUInvestigator.DisplayName, "ClaimCenterSupport@gaig.com",  
              "ClaimCenter Support", subject, body)
        } else {
            emailHelper.sendEmailWithBodyEcf( this, "ClaimCenterTesting@gaig.com", 
              SIUInvestigationExt.SIUInvestigator.DisplayName, "ClaimCenterTesting@gaig.com", 
              "ClaimCenter Testing", subject, body)
             
        }
      
    } catch(e){
      util.ErrorHandling.GAICErrorHandling.logError( SIUInvestigationExt, "Sending Investigation Email", e, null )
    }
  }

  /*****************************************************************************************************
   *Helper functions for linking documents to investigations
   *Author: Stephanie Przygocki
   *Date: Fall 2010
   *Updated: -
   *****************************************************************************************************/
  public function linkDocumentToInvestigation(pickedValue : Document, investigation : SIUInvestigationExt)
  {
    try{
      var DocInvestigationLink : DocInvestigationLinkExt = new DocInvestigationLinkExt()
      DocInvestigationLink.Document = pickedValue
      DocInvestigationLink.Investigation = investigation
    
      investigation.addToInvestigationDocs( DocInvestigationLink )
      pickedValue.addToDocInvestigationsExt( DocInvestigationLink )
    } catch(e) {
      util.ErrorHandling.GAICErrorHandling.logError( Claim, "Linking a document to an investigation", e, null )
    }
  }

  function removeLinkedInvestigationDocument(document : Document, investigation : SIUInvestigationExt){
    try{
      var DocInvestigationLink : DocInvestigationLinkExt
      for(docLink in investigation.InvestigationDocs){
        if(docLink.Document==document){
          DocInvestigationLink = docLink
        }
      }
      document.removeFromDocInvestigationsExt( DocInvestigationLink )
      investigation.removeFromInvestigationDocs( DocInvestigationLink )
      DocInvestigationLink.remove()
    } catch(e) {
      util.ErrorHandling.GAICErrorHandling.logError( Claim, "Unlinking a document from an investigation", e, null )
    }
  }

  /*****************************************************************************************************
   *Adds a new note to ClaimCenter if a data research is submitted.
   *Author: Stephanie Przygocki
   *Date: Fall 2010
   *Updated: -
   *****************************************************************************************************/
  function createDataResearchNote(passedInInvestigation : SIUInvestigationExt) {
    try{
      var note : Note
      var strBody : String = "SIU Data Research request was submitted"
      note = this.addNote( "siu", strBody )
      note.Subject = "SIU Data Research"
      note.Claimant = passedInInvestigation.SIUClaimant
      this.addNoteToInvestigation( passedInInvestigation, note )
    } catch(e) {
      util.ErrorHandling.GAICErrorHandling.logError( Claim, "Adding a note upon the creation of a new data research.", e, null )
    }
  }
  
  function createInvestigationNote(passedInInvestigation : SIUInvestigationExt) {
   try{
     var note : Note
     var strBody : String = "SIU Investigation Referral was submitted"
     note = this.addNote("siu", strBody)
     note.Subject = "SIU Investigation Referral"
     note.Claimant = passedInInvestigation.SIUClaimant
     this.addNoteToInvestigation(passedInInvestigation, note)
    } catch(e) {
      util.ErrorHandling.GAICErrorHandling.logError( Claim, "Adding a note upon the creation of a new siu investigation referral.", e, null )
    }
  }
  
  function validateSIUCloseDate(vendor: SIUVendorExt) : String {
    var returnMessage :java.lang.StringBuilder = new java.lang.StringBuilder()
    if (vendor.CompleteDate !=null){
       if (vendor.AssignedDate != null and gw.api.util.DateUtil.compareIgnoreTime( vendor.CompleteDate, vendor.AssignedDate)<0){
        returnMessage.append(displaykey.NVV.SIU.DateComplete.Warning + "\n")
       }
         if(gw.api.util.DateUtil.compareIgnoreTime(vendor.CompleteDate, gw.api.util.DateUtil.currentDate())>0){ 
           returnMessage.append( displaykey.Java.Validation.Date.ForbidFuture + "\n")
         }
         if (vendor.AssignedDate == null){
           returnMessage.append(displaykey.NVV.SIU.DateAssigned.Warning + "\n")
         }
    }
   return returnMessage.toString() == "" ? null : returnMessage.toString()
  }

  //Close date validation for SIU main portion of the screen
  function validateSIUCloseDateMain(investigation: SIUInvestigationExt) : String {
    if (investigation.SIUCloseDate !=null){
       if (investigation.SIUOpenDate != null and gw.api.util.DateUtil.compareIgnoreTime( investigation.SIUCloseDate, investigation.SIUOpenDate)<0){
        return displaykey.NVV.SIU.DateSIUOpen.Warning
       }else{
         if(gw.api.util.DateUtil.compareIgnoreTime(investigation.SIUCloseDate, gw.api.util.DateUtil.currentDate())>0){ 
         return displaykey.Java.Validation.Date.ForbidFuture
         }else{
         return null
         }
       }
    }else{
      return null    
    }
  }
}
