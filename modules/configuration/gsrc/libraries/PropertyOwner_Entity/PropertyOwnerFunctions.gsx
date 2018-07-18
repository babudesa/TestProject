package libraries.PropertyOwner_Entity

enhancement PropertyOwnerFunctions : entity.PropertyOwner {
  // 10/29/2008 - zthomas - Defect 1246, This function filters the lienholder type drop down at the property/risk level.
  public function isValidLT(value:LienHolderType):boolean{
    if(value == "audiovisuallosspayee"|| value == "financecompany"|| value == "lienholder"
       || value == "losspayee"|| value == "losspayeeintrstappr"|| value == "losspayeecontsale"
       || value == "losspayeelndlosspay"|| value == "primortgagee" || value == "mortgageeassigneerecvr"
       || value == "secmortgagee" || value == "thrdmortgagee" || value == "vehiclelosspayee"){
      return true 
    }else{
      return false;
    }
  
  }

  // 10/29/2008 - zthomas - Defect 1246, This function is used to filter lienholder types at the policy level but isn&apos;t used in Equine.
  // If lienholders are used at policy level in agribusiness or other LOBs it may need to be moved/modified.
  public function isValidLTPolicy(value:LienHolderType):boolean{
    if(value == "financecompany"){
      return true; 
    }else{
      return false;
    }
  
  }
}
