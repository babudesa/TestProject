package libraries.ScriptToolHistoryExt_Entity

enhancement ScriptToolHistoryExtEnhancement : entity.ScriptToolHistoryExt {
  
  /**
   * Truncate the Bundle string for display in the UI if it is longer than 500k characters. 
   * Strings this large can cause problems loading the page, preventing the script tool from being used.
   */
  property get ShortBundle() : String{
    if(this.BundleAsString.length > 500000){
      return this.BundleAsString.substring(0,500000) 
    }else{
      return this.BundleAsString
    }
  }

  /**
   * Truncate the Standard Error/Output string for display in the UI if it is longer than 500k characters. 
   * Strings this large can cause problems loading the page, preventing the script tool from being used.
   */  
  property get ShortStdErrOut() : String{
    if(this.StdErrOut.length > 500000){
      return this.StdErrOut.substring(0,500000) 
    }else{
      return this.StdErrOut
    }   
  }
}
