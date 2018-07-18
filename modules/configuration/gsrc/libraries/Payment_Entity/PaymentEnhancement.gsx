package libraries.Payment_Entity

enhancement PaymentEnhancement : entity.Payment {
  
  function getPaymentLabel():String{
    var sb = new java.lang.StringBuffer();
    
    sb.append("(").append( this.Exposure.ClaimOrder as Object ).append(") ")
   
    sb.append(this.Exposure.ExposureType)
    sb.append(" - ")
    sb.append(this.CostType)
    sb.append("/")
    sb.append(this.PaymentType)
              
    return sb.toString()
  
  }  
  
}
