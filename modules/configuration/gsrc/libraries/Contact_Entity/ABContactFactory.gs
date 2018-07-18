package libraries.Contact_Entity
uses soap.CustomABContactSearch.entity.*



/**
* Factory is used to create a new instance of an ABContact of a type equivalent 
* to a ClaimCenter contact type when given a ClaimCenter Contact entity
* 
* @author kepage
* @since 2012-11-07
*/
class ABContactFactory {

  /**
   * Constructor
   * 
   * Creates the ABContactFactory and generates a new ABContact and ABContact subtype typekey.
   * 
   * @param contact The contact you want to use to create a new ABContact with an equivalent subtype
   * or to get the ABContact subtype typekey.
   *         
   */
  construct(contact : Contact) {
      this.createABContact(contact)
  }
  
  
  private var _abContact : ABContact
  private var _abSubtype : soap.CustomABContactSearch.enums.ABContact
   
   
  /**
   * Creates a new ABContact entity with the same subtype of the Contact passed into the constructor.
   * 
   * @return New ABContact with subtype equivalent to the contact passed in when the factory was created.
   */
   public function getABContact() : ABContact{
    
       return _abContact      
   }
   
   
   /**
   * Gets the ABContact subtype typekey of the Contact passed in.
   * 
   * @return New ABContact with subtype equivalent to the contact passed in when the factory was created.
   */
   public function getABContactSubtype() : soap.CustomABContactSearch.enums.ABContact{
     
       return _abSubtype
   }
         
   
   /**
   * Creates the ABContact and subtype typekey
   * 
   * This is called in the constructor when the ABContactFactory is instantiated.
   * 
   * @return New ABContact with subtype equivalent to the contact passed in.
   */
   private function createABContact(contact : Contact) {       
       
       switch(typeof(contact)){
           
           case Company: 
               _abContact = new ABCompany()
               _abSubtype = (soap.CustomABContactSearch.enums.ABContact.TC_ABCompany)               
               break 
           case CompanyVendor:
               _abContact  = new ABCompanyVendor()
               _abSubtype = (soap.CustomABContactSearch.enums.ABContact.TC_ABCompanyVendor)
               break
           case AutoRepairShop:
               _abContact = new ABAutoRepairShop()
               _abSubtype = (soap.CustomABContactSearch.enums.ABContact.TC_ABAutoRepairShop)
               break      
           case FrgnAutoRepairShopExt:
               _abContact = new ABFrgnAutoRepairShopExt()
               _abSubtype = (soap.CustomABContactSearch.enums.ABContact.TC_ABFrgnAutoRepairShopExt)
               break
           case AutoTowingAgcy:
               _abContact = new ABAutoTowingAgcy()
               _abSubtype = (soap.CustomABContactSearch.enums.ABContact.TC_ABAutoTowingAgcy)
               break    
           case Ex_ForeignCoVendor:
               _abContact = new Ex_ABForeignCoVendor()
               _abSubtype = (soap.CustomABContactSearch.enums.ABContact.TC_Ex_ABForeignCoVendor)
               break
           case Ex_GAIVendor:
               _abContact = new Ex_ABGAIVendor()
               _abSubtype = (soap.CustomABContactSearch.enums.ABContact.TC_Ex_ABGAIVendor)
               break
           case LawFirm:
               _abContact = new ABLawFirm()
               _abSubtype = (soap.CustomABContactSearch.enums.ABContact.TC_ABLawFirm)
               break
           case Ex_ForeignCoVenLawFrm:
               _abContact = new Ex_ABForeignCoVenLawFm()
               _abSubtype = (soap.CustomABContactSearch.enums.ABContact.TC_Ex_ABForeignCoVenLawFm)
               break
           case MedicalCareOrg:
               _abContact = new ABMedicalCareOrg()
               _abSubtype = (soap.CustomABContactSearch.enums.ABContact.TC_ABMedicalCareOrg)
               break
           case Ex_ForeignCoVenMedOrg:
               _abContact = new Ex_ABForeignCoVenMedOr()
               _abSubtype = (soap.CustomABContactSearch.enums.ABContact.TC_Ex_ABForeignCoVenMedOr)
               break 
           case Person: 
               _abContact = new ABPerson() 
               _abSubtype = (soap.CustomABContactSearch.enums.ABContact.TC_ABPerson)
               break      
           case Adjudicator: 
               _abContact = new ABAdjudicator()
               _abSubtype = (soap.CustomABContactSearch.enums.ABContact.TC_ABAdjudicator)
               break 
           case PersonVendor: 
               _abContact = new ABPersonVendor()
               _abSubtype = (soap.CustomABContactSearch.enums.ABContact.TC_ABPersonVendor)
               break 
           case Attorney: 
               _abContact = new ABAttorney()
               _abSubtype = (soap.CustomABContactSearch.enums.ABContact.TC_ABAttorney)         
               break
           case Ex_ForeignPerVndrAttny: 
               _abContact = new Ex_ABForeignPerVndrAtt()
              _abSubtype = (soap.CustomABContactSearch.enums.ABContact.TC_Ex_ABForeignPerVndrAtt) 
               break
           case Doctor: 
               _abContact = new ABDoctor()
              _abSubtype = (soap.CustomABContactSearch.enums.ABContact.TC_ABDoctor)
               break
           case Ex_ForeignPersonVndr: 
               _abContact = new Ex_ABForeignPersonVndr() 
               _abSubtype = (soap.CustomABContactSearch.enums.ABContact.TC_Ex_ABForeignPersonVndr) 
               break
           case UserContact: 
               _abContact = new ABUserContact()
               _abSubtype = (soap.CustomABContactSearch.enums.ABContact.TC_ABUserContact)
               break
           case Place: 
               _abContact = new ABPlace()
               _abSubtype = (soap.CustomABContactSearch.enums.ABContact.TC_ABPlace)
               break 
           case LegalVenue: 
               _abContact = new ABLegalVenue()
               _abSubtype = (soap.CustomABContactSearch.enums.ABContact.TC_ABLegalVenue)
               break
           default:
               _abContact = new ABCompany()
               _abSubtype = (soap.CustomABContactSearch.enums.ABContact.TC_ABCompany)         
               break
        }      
                
   }
   
  

}//End ABContactFactory
