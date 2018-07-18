package libraries.PolicyLocation_Entity
uses java.lang.Integer

enhancement EquineFunctions : entity.PolicyLocation {
  /*
   * Used by the ...PropertyRU.Property
   * Subract the horse date of bith(year) from the current date, to get the age of the horse.
    * 
   */

  //if (DOB ^= null\ getAge
  function getAge(): Integer{
    if(this.ex_DateofBirth!=null and this.ex_DateofBirth < gw.api.util.DateUtil.getYear( gw.api.util.DateUtil.currentDate())){
      var age = gw.api.util.DateUtil.getYear( gw.api.util.DateUtil.currentDate()) - this.ex_DateofBirth;
      if(age > 0){
        return age;
      }
    }
      return 0
  }
}
