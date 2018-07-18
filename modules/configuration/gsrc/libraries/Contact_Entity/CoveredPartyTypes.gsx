package libraries.Contact_Entity

enhancement CoveredPartyTypes : entity.Contact {
  /*  This function determines the legal Covered Party types
  *   for Additional Interests at the policy level
  *   10/29/2008 - zthomas - Defect 1246, Added new policy level covered party types to filter function.
  *   3/1/2009 - kmboyd - Defect 1345, Changed premfinancecomp to financecompany to reflect the typelist change
  *   12/16/09 - gwelch - Defect 1555, Removed "Commercial Auto Driver"; || value =="commautodriver" 
  */
  public function isValidCPTPolicy(value:CoveredPartyType):boolean{
    if(value == "addnlinsured" || value == "agency"
       || value == "busunitprod" || value == "clinician" 
       || value == "driver" || value == "excludedemployee" || value == "financecompany" 
       || value == "lglentity" || value == "namedinsured" || value == "priinsuredcont" 
       || value == "trainer" || value == "printoffice" || value == "processoffice" 
       || value == "producer" || value == "proftcenter" || value == "underwriter" 
       || value == "vehicleoperator" || value ==  "veterinarian"){
      return true;  
    }else{
      return false;
    }
  
  }

  /*  12/3/2009 - zthomas - Defect 2606
  *   This function determines the legal Covered Party types
  *   for Multiple Named Insured and Multiple Named Insured DBA
  */
  public function isValidMNIType(value:CoveredPartyType):boolean{
    if(value == "addnlnameinsured" || value == "morenameinsureddba"){
      return true;  
    }else{
      return false;
    }
  
  }
}
