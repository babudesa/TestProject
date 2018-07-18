package util.lvwrapper
uses gw.lang.reflect.IType
uses gw.api.util.Logger //Added for logging in Debug - SR

@Export
class ClaimContactContactLVWrapper
{
    private var _contactContact : ContactContact;
    private var _claim : Claim;
    private var _primaryContact : Contact;
    
    
       construct(contactContact : ContactContact, primaryContact : Contact, claim : Claim)  
    {
      _contactContact = contactContact
      _primaryContact = primaryContact
      _claim = claim
      
      //_conCon = new ContactContact()
      
    }
    
    property get OtherContact(): Contact{
      return _contactContact.getOtherContact(_primaryContact)
 
    }
  
    property get OtherContactType(): IType {
        
        return _contactContact.getOtherCommonContactType(_primaryContact)
    }
  
    property set OtherContact(contact : Contact) {
        _claim.resolveAndSetContactContact(_contactContact, _primaryContact, contact)
        
    }
  
    property get BidiRel(): ContactBidiRel{

        return _contactContact.getBidiRel(_primaryContact)
    }
  
    property set BidiRel(newBidiRel : ContactBidiRel) {
        _contactContact.setBidiRel(_primaryContact, newBidiRel)
      
       
    }
    
    property get RelatedBidiRel():ContactBidiRel{
      var rel = _contactContact.getBidiRel(_primaryContact)
      var relationship : ContactBidiRel
      
      if(rel == "estateheir" or rel == "familyheir" or rel == "otherheir")
        rel = "beneficiary"
      if(rel == "estatetestator" or rel == "familytestator" or rel == "othertestator")
        rel = "decedent"
      if(rel == "medicareguardian" or rel == "other" or rel == "conservator")
        rel = "representative"
      if(rel == "medicareward" or rel == "otherto" or rel == "conservatorward")
        rel = "repClient"
 
     return rel
    }
    property set RelatedBidiRel(newBidiREl : ContactBidiRel){
     _contactContact.setBidiRel(_primaryContact, newBidiRel) 
    }
    
    property get BeneficiaryRep() : Contact{
      
      if(_contactContact.RelatedContact.TargetRelatedContacts.Count > 0){
        if(_contactContact.RelatedContact.TargetRelatedContacts.where(\ c -> c.ClaimantAddRepFlagExt ).Count > 0){
          return _contactContact.RelatedContact.TargetRelatedContacts.where(\ c -> c.ClaimantAddRepFlagExt ).last().RelatedContact
        }
      }
      
      return null
      
    }
    
    property set BeneficiaryRep(contact : Contact){
      //changed to logging in Debug - SR
      Logger.logDebug(contact.DisplayName.length)
      if(contact != null){
       _contactContact.RelatedContact.TargetRelatedContacts.where(\ c -> c.ClaimantAddRepFlagExt ).last().RelatedContact = contact
      }
    }
    
    
    property get BeneficiaryRel() : ContactRel{
      
      if(_contactContact.RelatedContact.TargetRelatedContacts.Count > 0){
        if(_contactContact.RelatedContact.TargetRelatedContacts.where(\ c -> c.ClaimantAddRepFlagExt ).Count > 0){
          return _contactContact.RelatedContact.TargetRelatedContacts.where(\ c -> c.ClaimantAddRepFlagExt ).last().Relationship
        }
      }
      
      return null
    }
    
    property set BeneficiaryRel(rel : ContactRel){
      
      _contactContact.RelatedContact.TargetRelatedContacts.where(\ c -> c.ClaimantAddRepFlagExt ).last().Relationship=rel
      
    }
   
   //Added code to populate the values for Beneficiary Dependency code and Beneficiary Relationship code on Wcomp Claims
   //Developer : ASAIKUMAR  Date: 06/02/2015
   
    property get BeneficiaryRelCd() : BeneficiaryRelatnExt{
      
     // if(_contactContact.getBidiRel(_primaryContact)=="beneficiary"){
        return _contactContact.BeneficiaryRelatnExt
     // }
     // return null
    }
    
    property set BeneficiaryRelCd(benrel : BeneficiaryRelatnExt){
      
      _contactContact.BeneficiaryRelatnExt=benrel 
    }
    
    property get BeneficiaryDepnd() : BeneficiaryDepndExt{
      
     // if(_contactContact.getBidiRel(_primaryContact)=="beneficiary"){
        return _contactContact.BeneficiaryDepndExt
     // }
     // return null
    }
    
    property set BeneficiaryDepnd(bendpnd : BeneficiaryDepndExt){
      
      _contactContact.BeneficiaryDepndExt=bendpnd
     
    }
}
