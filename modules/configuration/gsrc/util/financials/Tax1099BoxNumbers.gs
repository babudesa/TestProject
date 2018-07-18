package util.financials;

class Tax1099BoxNumbers
{
  construct()
  {
  }
  
  //***************************************************************************************
  // This routine uses the reflect functionality built in to typelists 
  // 
  //***************************************************************************************
  static function setBoxNumbers(theCheck:Check){
    gw.api.util.Logger.logDebug( "Entering function util.financials.Tax1099BoxNumbers.setBoxNumbers(Check)")
    try{
      for (p in theCheck.Payments){
        for (l in p.LineItems){
          if (l.LineCategory != null){ // if line category is not null (not specified)
            for (bn in IRS1099BoxNumber.getTypeKeys(false)){ // loop through all 1099 Box Numbers 
              if(bn.hasCategory( l.LineCategory )){ // if this box number has the line category as a category
                l.IRS1099BoxNumberExt=bn // set the box number
              }
            }
          }
        }
      }
    }catch(e){
      gw.api.util.Logger.logError( "Caught exception: " +e+" in function util.custom_Ext.setBoxNumbers(NormalCreateCheckWizardInfo)")
    }
  }
}
