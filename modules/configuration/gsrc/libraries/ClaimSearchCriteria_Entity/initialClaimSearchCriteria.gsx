package libraries.ClaimSearchCriteria_Entity

enhancement initialClaimSearchCriteria : entity.ClaimSearchCriteria {
  //Defect 519 Search-Claims, Search For should default to none selected - not Claimant 
  public function initialSearchValues(claimSearchCriteria : ClaimSearchCriteria) : Boolean {
    var result : Boolean = true;
    
    claimSearchCriteria.NameSearchType = null;
  
    return result;
  }
}
