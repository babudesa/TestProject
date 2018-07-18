package util.gaic.claimexport

class ClaimExportValidator {

  construct() {

  }
  
  
  /**
   * Check all conditions for the claim.  If a false condition is triggered
   * the check will stop and return the export status.
   */
  static public function isClaimReadyForExport(claim : Claim) : boolean {
       //require claim number
       if(claim.ClaimNumber == null){
         gw.api.util.Logger.logInfo("claim.ClaimNumber is null.. WC Claim Export not exporting claim: " + claim.ClaimNumber)
         return false
       }
       //require claim public id
       if(claim.PublicID == null){
         gw.api.util.Logger.logInfo("claim.PublicID is null..WC Claim Export not exporting claim: " + claim.ClaimNumber)
         return false
       }
       //require claimant public id
       if(claim.claimant.PublicID == null){
         gw.api.util.Logger.logInfo("claim.claimant.PublicID is null..WC Claim Export not exporting claim: " + claim.ClaimNumber)
         return false
       }
       //require claim status
       if(claim.State == null) {
         gw.api.util.Logger.logInfo("claim.State is null.. is null..WC Claim Export not exporting claim: " + claim.ClaimNumber)
         return false
       }
       //require create/open date
       if(claim.CreateTime == null){
         gw.api.util.Logger.logInfo("claim.CreateTime is null.. is null..WC Claim Export not exporting claim: " + claim.ClaimNumber)
         return false
       }
       // require jurisdiction state 
       if(claim.JurisdictionState == null){
         gw.api.util.Logger.logInfo("claim.JurisdictionState is null..WC Claim Export not exporting claim: " + claim.ClaimNumber)
         return false
       }
       //require branch id
       if(claim.AssignedGroup.PublicID == null){
         gw.api.util.Logger.logInfo("claim.AssignedGroup.PublicID.. is null..WC Claim Export not exporting claim: " + claim.ClaimNumber)
         return false
       }
       //require branch name
       if(claim.AssignedGroup.DisplayName == null){
         gw.api.util.Logger.logInfo("claim.AssignedGroup.DisplayName.. is null..WC Claim Export not exporting claim: " + claim.ClaimNumber)
         return false
       }
       //require first name
       if(claim.claimant.LastName == null){
         gw.api.util.Logger.logInfo("claim.claimant.LastName.. is null..WC Claim Export not exporting claim: " + claim.ClaimNumber)
         return false
       }
       //require last name
       if(claim.claimant.LastName == null){
         gw.api.util.Logger.logInfo("claim.claimant.LastName.. is null..WC Claim Export not exporting claim: " + claim.ClaimNumber)
         return false
       }
       //require address line 1
       if(claim.claimant.PrimaryAddress.AddressLine1 == null){
         gw.api.util.Logger.logInfo("claim.claimant.PrimaryAddress.AddressLine1.. is null.. WC Claim Export not exporting claim: " + claim.ClaimNumber)
         return false
       }
       //require claimant city
       if(claim.claimant.PrimaryAddress.City == null){
         gw.api.util.Logger.logInfo("claim.claimant.PrimaryAddress.City .. is null.. WC Claim Export not exporting claim: " + claim.ClaimNumber)
         return false
       }
       //require claimant state 
       if(claim.claimant.PrimaryAddress.State.Code == null){
         gw.api.util.Logger.logInfo("claim.claimant.PrimaryAddress.State.Code.. is null.. WC Claim Export not exporting claim: " + claim.ClaimNumber)
         return false
       }
       //require claimant postal code
       if(claim.claimant.PrimaryAddress.PostalCode == null){
         gw.api.util.Logger.logInfo("claim.claimant.PrimaryAddress.PostalCode.. is null.. WC Claim Export not exporting claim: " + claim.ClaimNumber) 
         return false
       }
       //require claimant gender
       if(claim.claimant.Gender == null){
         gw.api.util.Logger.logInfo("claim.claimant.Gender.. is null.. WC Claim Export not exporting claim: " + claim.ClaimNumber)
         return false
       }
       //require claimant Date of birth
       if(claim.claimant.DateOfBirth == null){
         gw.api.util.Logger.logInfo("claim.claimant.DateOfBirth.. is null.. WC Claim Export not exporting claim: " + claim.ClaimNumber)
         return false
       }
       //require date of loss / injury
       if(claim.LossDate == null){
         gw.api.util.Logger.logInfo("claim.LossDate.. is null.. WC Claim Export not exporting claim: " + claim.ClaimNumber)
         return false
       }
       //require business unit
       if(claim.NCWOnlyBusinessUnitExt == null){
         gw.api.util.Logger.logInfo("claim.NCWOnlyBusinessUnitExt.. is null.. WC Claim Export not exporting claim: " + claim.ClaimNumber)
         return false
       }
       //require profit center
       if(claim.Policy.ex_Agency.ex_AgencyProfitCenter == null){
         gw.api.util.Logger.logInfo("claim.Policy.ex_Agency.ex_AgencyProfitCenter.. is null.. WC Claim Export not exporting claim: " + claim.ClaimNumber)
         return false
       }
       //require adjuster id
       if(claim.AssignedUser.PublicID == null){
         gw.api.util.Logger.logInfo("claim.AssignedUser.PublicID.. is null.. WC Claim Export not exporting claim: " + claim.ClaimNumber)
         return false
       }
       //require adjuster first name
       if(claim.AssignedUser.Contact.FirstName == null){
         gw.api.util.Logger.logInfo("claim.AssignedUser.Contact.FirstName.. is null.. WC Claim Export not exporting claim: " + claim.ClaimNumber)
         return false
       }
       //require adjuster last name
       if(claim.AssignedUser.Contact.LastName == null){
         gw.api.util.Logger.logInfo("claim.AssignedUser.Contact.LastName.. is null.. WC Claim Export not exporting claim: " + claim.ClaimNumber)
         return false
       }
       //require adjuster email
       if(claim.AssignedUser.Contact.EmailAddress1 == null){
         gw.api.util.Logger.logInfo("claim.AssignedUser.Contact.EmailAddress1.. is null.. WC Claim Export not exporting claim: " + claim.ClaimNumber)
         return false
       }
       //require adjuster phone
       if(claim.AssignedUser.Contact.PrimaryPhoneValue == null){
         gw.api.util.Logger.logInfo("claim.AssignedUser.Contact.PrimaryPhoneValue.. is null.. WC Claim Export not exporting claim: " + claim.ClaimNumber)
         return false
       }
       //require adjuster supervisor id
       if(claim.AssignedGroup.Supervisor.PublicID == null){ 
         gw.api.util.Logger.logInfo("claim.AssignedGroup.Supervisor.PublicID.. is null.. WC Claim Export not exporting claim: " + claim.ClaimNumber)
         return false
       }
       //require policy effective date
       if(claim.Policy.EffectiveDate == null){
         gw.api.util.Logger.logInfo("claim.Policy.EffectiveDate.. is null.. WC Claim Export not exporting claim: " + claim.ClaimNumber)
         return false
       }
       //require policy expiration date
       if(claim.Policy.ExpirationDate ==  null){
         gw.api.util.Logger.logInfo("claim.Policy.ExpirationDate.. is null.. WC Claim Export not exporting claim: " + claim.ClaimNumber)
         return false
       }
       //require carrier code
       if(claim.Policy.IssuingCompanyExt == null){
         gw.api.util.Logger.logInfo("claim.Policy.IssuingCompanyExt.. is null.. WC Claim Export not exporting claim: " + claim.ClaimNumber)
         return false
       }
       //require carrier name
       if(claim.Policy.IssuingCompanyExt.DisplayName == null){
         gw.api.util.Logger.logInfo("claim.Policy.IssuingCompanyExt.DisplayName.. is null.. WC Claim Export not exporting claim: " + claim.ClaimNumber)
         return false
       }
       if(claim.ClaimInjuryIncident == null){
         gw.api.util.Logger.logInfo("claim.ClaimInjuryIncident.. is null.. WC Claim Export not exporting claim: " + claim.ClaimNumber)
         return false
       }
       if(claim.ClaimInjuryIncident.BodyParts == null){
         gw.api.util.Logger.logInfo("claim.ClaimInjuryIncident.BodyParts.. is null.. WC Claim Export not exporting claim: " + claim.ClaimNumber)
         return false
       }
       //require at least one injured body part.
       if(claim.ClaimInjuryIncident.BodyParts.firstWhere(\ b -> b.PrimaryExt) == null){
         gw.api.util.Logger.logInfo("claim.ClaimInjuryIncident.BodyParts.firstWhere(\ b -> b.PrimaryExt).. is null..  WC Claim Export not exporting claim: " + claim.ClaimNumber)
         return false
       }
       if(claim.ClaimInjuryIncident.BodyParts.first() == null){
         gw.api.util.Logger.logInfo("claim.ClaimInjuryIncident.BodyParts.first().. is null.. WC Claim Export not exporting claim: " + claim.ClaimNumber)
         return false
       }
              
     //claim is valid
     return true
  }

}
