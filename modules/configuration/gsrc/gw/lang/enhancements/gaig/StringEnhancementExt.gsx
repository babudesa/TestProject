package gw.lang.enhancements.gaig

uses java.lang.Integer


//Enhancment of java.lang.String outside the gw.lang.enhancement namespace caused a variety of errors,
//do not put normal enhancments inside here
@Export
enhancement StringEnhancementExt : java.lang.String {
  /**
   * Determines whether a String is a valid integer between or equal to a Minimum and Maximum value.
   * 
   * @param min Minimum integer value allowed. Supports negative values.
   * @param max Maxmimum integer value allowed. Supports negative values.
   * @returns True if the String is an integer value between min and max.
   */
  public function integerBetween(min : Number, max : Number) : boolean {
    if (this.length == 0){
      return false
    }
    if (this.Numeric or (this.charAt(0) == "-" as char and this.substring(1).Numeric)){ 
      return Integer.parseInt(this) >= min and Integer.parseInt(this) <= max
    }  else {
      return false
    }
  }
}