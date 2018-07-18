package libraries.ClaimSearchCriteria_Entity

enhancement PendingAssignmentSearchCriteria : entity.ClaimSearchCriteria {
  function setPendingAssignmentSearchCriteria(){
    this.pendingAssignment = true;
  }

  function filterSearchFor(searchForCode : String) : Boolean{
    var filterResult : Boolean = true;
  
    if(searchForCode == "addinsured" or searchForCode == "any"){
      filterResult = false;
    }

    return filterResult;
  }
}
