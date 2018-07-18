package libraries.Policy_Entity

enhancement CoverageValues : entity.Policy {
  function amountOfCoverage(coverageType : String, animalName : String ) : Number
  {
     for(eachRU in this.RiskUnits){
       if(eachRU.Subtype=="PropertyRU" and (eachRU as PropertyRU).Property.LocationNumber == animalName){
         for(cov in (eachRU as PropertyRU).Coverages){
           if(cov.Type == coverageType){
             return cov.AggregateLimitExt as java.lang.Double
           }
         }
       }
     }
     /*sprzygocki 4/12/11 - updated function to use Risk Units and commented out the old code - kept only for review
     for(each in this.Properties){
       if(each.Property.LocationNumber == animalName){
         for(coverage in each.Property.Coverages){
           if(coverage.Type == coverageType){
             return coverage.AggregateLimitExt
           }
         }
       }
     }*/
     return null;
  }

  function hasCoverageFACReinsurance():Boolean{
    var result:Boolean = false;
  
    for(cov in this.AllCoverages){
      for(rein in cov.ReinsurancesExt){
        if(rein.Type == "0A" or rein.Type == "0B" or rein.Type == "0C" 
        or rein.Type == "0D" or rein.Type == "0E" Or rein.Type == "01"
        or rein.Type == "02" or rein.Type == "03"
        or rein.Type == "04" or rein.Type == "05"
        or rein.Type == "06"  or rein.Type == "07"
        or rein.Type == "08" or rein.Type == "09"
        or rein.Type == "18" or rein.Type == "50"
        or rein.Type == "51"){
          result = true;
          break;
        }
      }
    }
  
    return result;
  }
}
