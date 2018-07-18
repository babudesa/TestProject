package libraries.PolicyLocation_Entity

enhancement PropertyValue : entity.PolicyLocation {
  //**/
  function RoundUpThePropertyValue(): String
  {
    var amt="$0"
    if(this.ex_AmountofInsurance < 1000000 and this.ex_AmountofInsurance >=1000)
    {
      amt = "$" + java.lang.Math.round( this.ex_AmountofInsurance / 1000 as float ) + "K"
    }
     else if (this.ex_AmountofInsurance >=1000000){
      amt =   "$" + this.ex_AmountofInsurance.divide( 1000000, java.math.BigDecimal.ROUND_UP ) + " MIL"
    }
     else if (this.ex_AmountofInsurance !=null) 
    { 
     amt =  "$" + this.ex_AmountofInsurance
    }
  return amt
  }
}
