package libraries.Document_Entity
uses java.util.ArrayList
uses java.util.HashSet
uses java.math.BigDecimal


/*
* Functions in this enchancement are used for functionality
* related to creating matters documents.
*/
enhancement MattersDocumentFunctions : entity.Document {

   
    
    //Property indicates whether or not the document is related
   //to matters
   property get IsMatterRelated():boolean{
  //Defect:8303 - cprakash - 2222016 Modified Condition to check for Initial Assignment Letter
     if (this.Name!=null && (this.Name.contains("Initial Assignment Letter") or this.Name.contains("Trial Notice"))){    
      return true
    }else {
      return false
    }
  }  
  
  
  /*
  * Property gets the valid values for the Related To drop down on the document
  */
  property get LegalActionRelatedToValues(): Matter[]{
     var list = new ArrayList()
        list.addAll(this.Claim.Matters*.MatterAssignmentsExt
                      .where(\ m -> m.CounselLawFirmExt == this.MailToExt)*.Matter as java.util.Collection<java.lang.Object>)
        
        //remove any duplicates
        var newSet = new HashSet(list)
        list.clear()
        list.addAll(newSet)    
        return (list as java.util.List<entity.Matter>).toTypedArray()
  }
  
  /*
  * Property gets the first lead counsel associated with the selected law firms assignments
  */
  property get LeadCounsel(): Contact {
    if(exists( ma in this.Claim.Matters*.MatterAssignmentsExt where
       ma.CounselLawFirmExt == this.MailToExt && ma.LeadCounselExt != null)){
         return this.Claim.Matters*.MatterAssignmentsExt
                          .where(\ m -> m.CounselLawFirmExt == this.MailToExt && 
                                 m.LeadCounselExt != null)*.LeadCounselExt.first()
       }else{
         return null
       }
  }
  
  /*
  * Property gets the first lead law firm associated with the selected law firm assignments
  */
  property get LeadLawFirm(): Contact {
   
    if(exists( ma in this.Claim.Matters*.MatterAssignmentsExt where
       ma.CounselLawFirmExt == this.MailToExt && ma.CounselLawFirmExt != null)){
                      
          return this.Claim.Matters*.MatterAssignmentsExt
                          .where(\ m -> m.CounselLawFirmExt == this.MailToExt && 
                                 m.CounselLawFirmExt != null)*.CounselLawFirmExt.first()
       }else{
         return null
       }
  }
  
  
  /*
  * Property gets the valid values for the Send To drop down on the document
  */
  property get LegalActionSendToValues(): List<Contact> {
     var list = new ArrayList();
           list.addAll(this.Claim.Matters*.MatterAssignmentsExt*.CounselLawFirmExt as java.util.Collection<java.lang.Object>)
                 
        //remove any duplicates
        var newSet = new HashSet(list)
        list.clear()
        list.addAll(newSet)
        
        return list as java.util.List<entity.Contact>
  
  } 

  
  /*
  * Property gets all claimants associated with legal actions on the selected matter.
  */
  function getLegalActionClaimantsTemplateDisplay(): String{
    
      var claimantList = new ArrayList()
      var displayString = new String()
    
      //Add each primary claimant to a list 
      if(this.Matter !=null){
        for(claimant in this.Matter.MatterAssignmentsExt*.AssignmentExposuresExt
            .where(\ a -> a.PrimaryClaimantExt==true &&
                          a.Assignment.CounselLawFirmExt == this.MailToExt)*.ClaimantExt)
        {
          claimantList.add(claimant)
        }
      }
        
      //remove any duplicates
      var newSet = new HashSet(claimantList)
      claimantList.clear()
      claimantList.addAll(newSet)
     
      //create claimant display string for single claimant
      if(claimantList.Count == 1){
      
          displayString = claimantList.first().toString()
          
      //create claimant display string for multiple claimants
      }else{
   
        for(claimant in claimantList){      
          if(claimantList.indexOf(claimant) != claimantList.Count - 1){
            displayString = displayString + claimant + ", "
          }else{
            displayString = displayString + "and " + claimant
          }          
        }
      }
        return this.getDisplayNameWithoutFormerAndClosed(displayString)
  }
  
  
  function getLossTypes() : String {
   var LOB : String = ""
    if(this.Claim.NCWOnlyBusinessUnitExt == "ab")
      LOB = "AgriBusiness"
    else if(this.Claim.NCWOnlyBusinessUnitExt == "eq")
      LOB = "Equine"    
    else if (this.Claim.NCWOnlyBusinessUnitExt == "im"){
      LOB = "Property & Inland Marine"
    }else
     LOB = this.Claim.LossType.Description   
    return LOB    
  }
  
  /*
  * Property gets the first opposing law firm associated with the selected law firm assignments
  */
  property get OpposingLawFirm(): Contact {
    
    if(exists( ma in this.Claim.Matters*.MatterAssignmentsExt where
       ma.CounselLawFirmExt == this.MailToExt && ma.AssignmentExposuresExt*.OpposingCounselFirmExt != null)){
                      
          return this.Claim.Matters*.MatterAssignmentsExt
                          .where(\ m -> m.CounselLawFirmExt == this.MailToExt && 
                                 m.AssignmentExposuresExt*.OpposingCounselFirmExt.first() != null)*.AssignmentExposuresExt*.OpposingCounselFirmExt.first()
       }else{
         return null
       }
  }
  
  /*
  * Property gets the first opposing counsel associated with the selected law firms assignments
  */
  property get OpposingCounsel(): Contact {
    
    if(exists( ma in this.Claim.Matters*.MatterAssignmentsExt where
       ma.CounselLawFirmExt == this.MailToExt && ma.AssignmentExposuresExt*.OpposingCounselFirmExt != null)){
                      
          return this.Claim.Matters*.MatterAssignmentsExt
                          .where(\ m -> m.CounselLawFirmExt == this.MailToExt && 
                                 m.AssignmentExposuresExt*.OpposingLeadCounselExt.first() != null)*.AssignmentExposuresExt*.OpposingLeadCounselExt.first()
       }else{
         return null
       }
  }
  
  property get TrialDate() :String {
     if(this.Matter.TrialDate!= null){
       return gw.api.util.StringUtil.formatDate(this.Matter.TrialDate, "MM/dd/yyyy")
     }else{
       return ""
     }     
   }

  property get Court() :String {
    if(exists(ma in this.Claim.Matters*.MatterAssignmentsExt where
      ma.Matter.CourtType != null and ma.Matter.CourtType == typekey.MatterCourtType.TC_FEDERAL and this.Matter == ma.Matter)){
        return this.Matter.FederalDistrictExt.DisplayName + ", " + this.Matter.CourtExt
      }else if(exists(ma in this.Claim.Matters*.MatterAssignmentsExt where
        ma.Matter.CourtType != null and ma.Matter.CourtType != typekey.MatterCourtType.TC_FEDERAL and this.Matter == ma.Matter)){
          return this.Matter.CourtExt
        }else{
          return null
        }
  }
  
  property get County() :String {
    if(exists(ma in this.Claim.Matters*.MatterAssignmentsExt where
      ma.Matter.CourtType != null and ma.Matter.CourtType == typekey.MatterCourtType.TC_STATE2 and this.Matter == ma.Matter)){
        return this.Matter.CourtCounty + ", " + this.Matter.StateExt.DisplayName
      }
      if(exists(ma in this.Claim.Matters*.MatterAssignmentsExt where
        ma.Matter.CourtType != null and ma.Matter.CourtType == typekey.MatterCourtType.TC_ARBITRATION or 
        ma.Matter.CourtType != null and ma.Matter.CourtType == typekey.MatterCourtType.TC_FEDERAL and this.Matter == ma.Matter)){
          return this.Matter.StateExt.DisplayName
        }else{
          return null
        }
  }
  
  property get Federal() :String {
    if(exists(ma in this.Claim.Matters*.MatterAssignmentsExt where
      ma.Matter.CourtType != null and ma.Matter.CourtType == typekey.MatterCourtType.TC_FEDERAL and this.Matter == ma.Matter)){
        return "Y"
      }else{
          return "N"
        }
  }

  property get BudgetFinalInvoice(): BigDecimal {
    if(this.Matter.MatterAssignmentsExt*.BudgetExt*.MatterBudgetTotalsLineItemExt != null){
     return this.Matter.MatterAssignmentsExt*.BudgetExt*.MatterBudgetTotalsLineItemExt.sum(\ m -> gw.api.util.StringUtil.formatNumber(m.FinalizedInvoices, "$#,##0"))
    }else{
      return null
    }
  }

}