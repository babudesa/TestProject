package util.custom_Ext;
uses java.util.ArrayList

class getContactList{
  
  construct(){
  }

//******************************************************************************************  

  
static function getContactTypeList() : List
{
  var contactType: List=new ArrayList ()
  //SearchCriteria.getAvailableSubtypes(requiredContactType)
  //this.AllContactContacts
    contactType.add("Person")
    contactType.add("Company")
    contactType.add("Attorney")
    contactType.add("CompanyVendor")
    contactType.add("LawFirm")
    contactType.add("MedicalCareOrg")
    contactType.add("PersonVendor")
    contactType.add("Doctor")
    contactType.add("Ex_GAIVendor")
    contactType.add("Ex_ForeignPerVndrAttny")
    contactType.add("Ex_ForeignCoVendor")
    contactType.add("Ex_ForeignPerVndrDoc")
    contactType.add("Ex_ForeignCoVenLawFrm")
    contactType.add("Ex_ForeignCoVenMedOrg")
    contactType.add("Ex_ForeignPersonVndr")
   return contactType
    
}
//  public function reOrderContactTypeList () : Contact[]
//{
//  var contactType: List=new List ()/
//  contactType.add("Person")
//  ...
//  contactType.add("Ex_ForeignPersonVndr")
//   
//  return (contactArray.toArray() as Contact[])
//    
//}
//

}
