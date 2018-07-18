package util.catastrophes;
uses java.lang.Integer;
//uses Type;
//uses com.guidewire.pl.web.controller.UserDisplayableException;

class GAICCatastrophes
{
  construct()
  {
  }
  
  public static function setIntialValues(cat:Catastrophe) {

  if (cat.BusinessCatNameExt !=null and cat.Type =="businesscat"){
    cat.CatastropheNumber = cat.BusinessCatNameExt + "-" + cat.Ex_Year + "-" + cat.Ex_ISOCatNumber
  }
  else if (cat.Type == "internal") { 
    cat.CatastropheNumber = "INT" + cat.Ex_Year + "-" + cat.Ex_ISOCatNumber
    }
    else {
    cat.CatastropheNumber = cat.Ex_Year + "-" + cat.Ex_ISOCatNumber
    }
  cat.Name = cat.CatastropheNumber + "-" + cat.Ex_Name
  }

  public static function getDisplayName(cat:Catastrophe):String {
    return cat.CatastropheNumber + "-" + cat.Name;
  }
  
  public static function validate(cat:Catastrophe):String {
    if(cat.Ex_CatOccurances.length == 0){
      return "Please enter an Occurrence"
    }else
    if(cat.CountryExt !="US" and cat.CountryExt !="CA" and cat.Ex_CatOccurances.length > 1){
      return "Only one occurrence allowed for countries other than US and Canada"
    }
    for (var occ in cat.Ex_CatOccurances) {
      if(occ.StartDate!=null and occ.EndDate!=null){
        if (gw.api.util.DateUtil.compareIgnoreTime(occ.StartDate,occ.EndDate)>0) {
          return occ.State.DisplayName+" has a start date after its end date. Please correct."
        }
        if (gw.api.util.DateUtil.compareIgnoreTime(occ.EndDate,gw.api.util.DateUtil.currentDate())>0) {
          return " End Date of Catastrophe cannot be greater than Current Date"
        }  
      }
    }
   return null;
  }
          
  public static function validateyear(cat:Catastrophe):String {
      if (cat.Ex_Year > gw.api.util.DateUtil.getYear(gw.api.util.DateUtil.currentDate())) {
        return "Year of Catastrophe cannot be greater than Current Year"
      }
  return null;
  }
  
  public static function setCatCode(cat:Catastrophe) {
      if (cat.Ex_Year !=null && cat.Ex_ISOCatNumber != null) {
        cat.CatastropheNumber = cat.Ex_Year + "-" + cat.Ex_ISOCatNumber 
         }
  }   
  
//added validatecode Agri sprint 6 ER 
  public static function validatecode(cat:Catastrophe):String {
    if(cat.Ex_ISOCatNumber != null){
      if (!cat.Ex_ISOCatNumber.matches("[0-9]{2,2}")) {
        return "Catastrophe Code must be a 2 digit number"
      }
      var num = Integer.parseInt(cat.Ex_ISOCatNumber)
    
        switch (cat.Type)
        {        
          case "Internal":
            if (num < 01 || num > 99 || num ==00) {
              return "Internal Catastrophe Code must be between 01 - 99"
             }
            break;
          case "ISO":
           if (num < 10 || num == 00) {
             return "ISO Catastrophe Code must be greater than 10 "
           }
            break;
          case "businesscat":
           if (num < 01 || num > 99 || num ==00) {
             return "Business Catastrophe Code must be between 01 - 99 "
           }
            break;
        
        }
    }
    
  return null;
  }
  


  /**
  * We need to keep the dates on cat up to date, so we scan each occurance
  * If it matches, we have to find new dates to go by
  **/
  public static function recalculate(cat:Catastrophe) {
    cat.Ex_EarliestStartDate = null
    cat.Ex_LatestEndDate = null    
    
    for (var occ in cat.Ex_CatOccurances) {
      if (cat.Ex_EarliestStartDate == null) {
        cat.Ex_EarliestStartDate = occ.StartDate
      }
      if(occ.StartDate!=null){
        if (gw.api.util.DateUtil.compareIgnoreTime(cat.Ex_EarliestStartDate,occ.StartDate)>0) {
          cat.Ex_EarliestStartDate = occ.StartDate
        }
      }
      if (cat.Ex_LatestEndDate == null) {
        cat.Ex_LatestEndDate = occ.EndDate
      }
      if(occ.EndDate!=null){
        if (gw.api.util.DateUtil.compareIgnoreTime(cat.Ex_LatestEndDate,occ.EndDate)<0) {
          cat.Ex_LatestEndDate = occ.EndDate
        }
      }
    }
  }
  

//Defect 1352 erawe 2/21/09 validationt for catastrophe type/occurrences
  public static function validateOccurrences(cat:Catastrophe):String {
      if(cat.Ex_CatOccurances.length > 0 and cat.Type=="iso" and 
        exists(occ in cat.Ex_CatOccurances where occ.CatCountryExt != "us")){
          return "An ISO catastrophe cannot have foreign states"
        }
      return null;
  }
}
