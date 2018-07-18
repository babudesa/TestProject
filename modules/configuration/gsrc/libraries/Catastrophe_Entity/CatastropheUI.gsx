package libraries.Catastrophe_Entity
uses java.util.ArrayList;

enhancement CatastropheUI : entity.Catastrophe {
  /*
   * Initialize any standard default values on a newly created Catastrophes.
   */
  function setInitialValues() {
    if (this.BusinessCatNameExt !=null){
    this.CatastropheNumber = this.BusinessCatNameExt + "-" + this.Ex_Year + "-" + this.Ex_ISOCatNumber
    }
    else if (this.Type == "internal") { 
      this.CatastropheNumber = "INT" + this.Ex_Year + "-" + this.Ex_ISOCatNumber
      }
      else {
      this.CatastropheNumber = this.Ex_Year + "-" + this.Ex_ISOCatNumber
      }
    this.Name = this.CatastropheNumber + "-" + this.Ex_Name
    populateEarliestStartAndEndDates()
  }

  function populateEarliestStartAndEndDates() {
    this.Ex_EarliestStartDate = null
    this.Ex_LatestEndDate = null    

    for (var occ in this.Ex_CatOccurances) {
      if (this.Ex_EarliestStartDate == null) {
        this.Ex_EarliestStartDate = occ.StartDate
      }
      if (this.Ex_LatestEndDate == null) {
        this.Ex_LatestEndDate = occ.EndDate
      }
      if (this.Ex_EarliestStartDate > occ.StartDate) {
        this.Ex_EarliestStartDate = occ.StartDate
      }
      if (this.Ex_LatestEndDate < occ.EndDate) {
       this.Ex_LatestEndDate = occ.EndDate
      }
    }
  }

  function visiblebusinesscat() : List{
      var  busunit = new ArrayList()
      var buscatscriptparm : String = ScriptParameters.Business_Cat
    
        if (buscatscriptparm != null) {
         busunit = buscatscriptparm.split( "," ) as java.util.ArrayList<java.lang.Object>
        }
    
      return busunit
    }
  
  /*
  * Function prevents ISO catastrophes from being added or edited if the user doesn't have the catisooverride permission.
  */
  function canManageISOCatastrophe(catTypeCode : String) : Boolean{
    var result : Boolean;
  
    if(catTypeCode == "iso"){
      if(exists(role in User.util.getCurrentUser().Roles where exists(perm in role.Role.Privileges where perm.Permission == "catisooveride"))){
        result = true;
      }else{
        result = false;
      }
    }else{
      result = true
    }
  
    return result;
  }
    
  //Defect 1352 erawe, 2/20/09 - Set the country to US on a new Catastrophe if type has not changed
  function setDefaultValue(){
    if(this.Type =="iso" and 
       exists(role in User.util.getCurrentUser().Roles where exists(perm in role.Role.Privileges where perm.Permission == "catmanage"))){
      this.CountryExt = "US"
    }
  }

  //Defect 1352 KOtteson, 3/11/09 - Set the country to US for ISO Catastrophes
  function setDefaultCountryValue(){

    if (this.Type =="iso"){
       if (this.CountryExt == null) {
          this.CountryExt = Country.TC_US
       }
    }
  }
  //Defect 1352 erawe, 2/20/09 - check for a foreign state on an ISO catastrophe
  function manageOccurrences(): boolean{
    if(this.Ex_CatOccurances.length > 0 and this.Type=="iso" and
      exists(occ in this.Ex_CatOccurances where occ.CatCountryExt != "US")){
        return true
      //throw new UserDisplayableException("Remove the foreign states to switch to ISO or continue with Internal or Business")
    }
    return false
  }

  //Defect 1352 erawe, 2/21/09 - to change the country if an occurrance exist and not ISO
  public function manageType(){
     if(this.Ex_CatOccurances.length > 0 and this.Type !="iso"){
       if(this.New or this.Changed){
         this.CountryExt = this.Ex_CatOccurances[0].CatCountryExt
         //throw new UserDisplayableException("If you want to change the country first remove the state(s) from the occurrences")
       }
    }
  }
}
