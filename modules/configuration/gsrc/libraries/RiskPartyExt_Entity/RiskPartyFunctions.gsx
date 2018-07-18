package libraries.RiskPartyExt_Entity

enhancement RiskPartyFunctions : entity.RiskPartyExt {
  /*  This function determines the legal Covered Party types
  *   for Additional Interests at the risk level
  *   10/29/2008 - zthomas - Defect 1246, Added new risk level covered party types to filter function.
  *   3/1/2009 - kmboyd - Defect 1345, changed premfinancecomp to financecompany
  *   12/17/2009 - gwelch - Defect 1555, Altered so addnlintlessee, addnlintlessor and addnltrainer only appear in EQUINE
  */
  public function isValidCPT(value:CoveredPartyType,lossType:String):boolean{
    if(value == "addnlinsured" || value == "audiovisuallosspayee" || value == "boatshowauto"
       || value ==  "charinst" || value == "churchoffcrvolun" || value == "clubmember"
       || value == "concession" || value == "condounitowner" || value == "controlintrst"
       || value == "coowninsprem" || value == "despersorg" || value == "elctvexectvofcr"
       || value == "engarchtnotengagd" || value == "engarchtsurvrcgl" || value == "engarchtsurvrocp"
       || value == "eventlessee" || value == "exctradmntrstbenf" || value == "fidinterest"
       || value == "financecompany" || value == "fundsrcs" || value == "grntrfranch"
       || value == "grntrlicns" || value == "grntrlicnsauto" || value == "lessorequipauto"
       || value == "lessorequip" || value == "lienholder" || value == "losspayee"
       || value == "losspayeeintrstappr" || value == "losspayeecontsale" || value == "losspayeelndlosspay"
       || value == "mngrlessorprem" || value == "mngrlessorpremauto" || value == "primortgagee"
       || value == "mortgageeassigneerecvr" || value == "nonoprtngwrkint" || value == "oilgasoprtnint"
       || value == "olcautoconst" || value == "other" || value == "ownerotherint"
       || value == "ownerlesseecontcomp" || value == "ownerlesseecontfrma" || value == "ownerlesseecontfrmb"
       || value == "ownerlesseecontauto" || value == "ownerlesseecontnonauto" || value == "pubagncyowner"
       || value == "secmortgagee" || value == "stpoltclsubdvsnrltng" || value == "stpolsubdvsnprmtscgl"
       || value == "stpolsubdvsnprmtsocp" || value == "syndicate" || value == "telcom"
       || value == "thrdmortgagee" || value == "twnhouseassc" || value == "trainerinst"
       || value == "usergolfmobiles" || value == "userteamdrftsddlanmls" || value == "vehiclelosspayee"
       || value == "vendor" || value ==  "veterinarian" || value == "watercraftoprtr"
       || ((value == "addnlintlessee" || value == "addnlintlessor" || value == "addnltrainer") && lossType == "EQUINE")){
      return true 
    }else{
      return false;
    }
  
  }
}
