package libraries.Ex_CatOccurance_Entity
//uses com.guidewire.pl.web.controller.UserDisplayableException;
  
enhancement Ex_CatOccuranceUI : entity.Ex_CatOccurance {
  /*
   * Initialize any standard default values on a newly created Catastrophe occurrences.
   */
    
  //Defect 1352 KOtteson, 3/11/09 - Set the country to US on a new Catastrophe occurrence if null
  function setDefaultOccCountryValue(){

    if (this.Catastrophe.Type == "iso"){
       if (this.CatCountryExt == null) {
           this.CatCountryExt = Country.TC_US
       }
    }
  }
}
