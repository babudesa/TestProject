package libraries.Check_Entity

enhancement TemplateAddressFunctions : entity.Check {
  //10/1/09 erawe - commented out mailToString() in order to do merge.  This will probably get created in
  //Equine and merged forward or done in both places.  In the meantime it uses mailToString() below this one
  //public function mailToString() : String{
  //    var st : java.util.StringTokenizer = new java.util.StringTokenizer(this.MailToAddress, "|");
  //    var addy:String = ""
  //    var j = 0
  //    //First 10 tokens are business address.  While loop traverses through tokens to mailing address
  //    // 9/9/09 defect 2376 erawe: Added issuing company to add to mail to address on hold checks
  //    while(j <10 and st.hasMoreTokens()){
  //      j = j + 1;
  //      st.nextToken()  
  //    }
  //    if(this.DeliveryMethod == "hold"){
  //      if(this.claim.AssignedGroup.CompanyNameExt !=null){
  //        addy = this.claim.AssignedGroup.CompanyNameExt.Name + ", "
  //      }else
  //      addy = "Great American Insurance Company, "
  //    }
  //    if(st.hasMoreTokens()){
  //      addy = addy + st.nextToken();
  //    }
  //      return addy;
  //}

  public function mailToString() : String{
      var st : java.util.StringTokenizer = /*this.Bulked ? new java.util.StringTokenizer(this.ex_MailToAddress, "|") : */new java.util.StringTokenizer(this.MailToAddress, "|");
      var addyLine1 : String = ""
      var addyLine2 : String = ""
      var city : String = ""
      var state : String = ""
      var zip : String = ""
      
      var addy:String = ""
      var j = 0
      // 10/20/09 defect 2376 erawe: Added issuing company to add to mail to address on hold checks
      while(j <10 and st.hasMoreTokens()){
        switch(j){
          case 1:
            addyLine1 = st.nextToken() + ", "
            break
          case 2:
            var temp = st.nextToken()
            if(temp != "null")
              addyLine2 = temp + ", "
            break
          case 4:
            city = st.nextToken() + ", "
            break
          case 5:
            var stat = st.nextToken()
            if(stat != "null")
            state =  stat + ", "
            break
          case 6:
           var  zip1=st.nextToken()
           if(zip1 != "null")
            zip = zip1 + " "
            break
          default:
            st.nextToken()
            break
        }
        j++  
      }
      var attentionMailToString=(this.AttentionMailToExt!=null)?"Attn: "+this.AttentionMailToExt+", ":""
     var divisionName : String =(this.Claim.AssignedGroup.DivisionNameExt.DivisionNameValue==null?"":this.Claim.AssignedGroup.DivisionNameExt.DivisionNameValue+", ")
      if(this.DeliveryMethod == "hold"){
       // if(this.Claim.AssignedGroup.CompanyNameExt !=null){
       //addy = this.Claim.AssignedGroup.CompanyNameExt.DisplayName + ", "
       //}else
        addy =  displayKey.GAIC.Check.ReturnToOffice.DefaultCompany + ", "
        addy = addy + divisionName + attentionMailToString+ addyLine1 + addyLine2 + city + state + zip
      }else{
        addy = addy + attentionMailToString+  addyLine1 + addyLine2 + city + state + zip
      }
      
      return addy;
  }

  ////10/20/09 erawe - defect 2376, commented out below function and replaced with above.
  //public function mailToString() : String{
  //    var st : java.util.StringTokenizer = new java.util.StringTokenizer(this.MailToAddress, "|");
  //    var addy:String = ""
  //    var j = 0
  //    while(j <10 and st.hasMoreTokens()){
  //      j = j + 1;
  //      st.nextToken()  
  //    }
  //    if(st.hasMoreTokens()){
  //      addy = st.nextToken();
  //    }
  //      return addy;
  //}

  public function getAddressHistoryAddressType(addressHistoryString : String) : AddressType {
    var retAddressType : AddressType = null;
    if(addressHistoryString != null) {
      var st : java.util.StringTokenizer = new java.util.StringTokenizer(addressHistoryString, "|");
      var token : String = ""
  
      // AddressType
      if(st.hasMoreTokens()) {
        token = st.nextToken()
        for(typeKey in AddressType.getTypeKeys(false)) {
          if(typeKey.Code == token) {
            retAddressType = typeKey;
          }
        }
      }
    }
    return retAddressType;
  }

  public function getAddressHistoryAddressLine1(addressHistoryString : String) : String {
    var addressLine1 : String = null; 
    if(addressHistoryString != null){
      var st : java.util.StringTokenizer = new java.util.StringTokenizer(addressHistoryString, "|");
      var token : String = ""
      var counter = 0;
  
      while (st.hasMoreTokens()) {
        token = st.nextToken();
        counter = counter + 1;
        if (counter == 2) {
          addressLine1 = token
        }
      }
    }
    return addressLine1;
  }

  public function getAddressHistoryAddressLine2(addressHistoryString : String) : String {
    var addressLine2 : String = null; 
    if(addressHistoryString != null){
      var st : java.util.StringTokenizer = new java.util.StringTokenizer(addressHistoryString, "|");
      var token : String = ""
      var counter = 0;
  
      while (st.hasMoreTokens()) {
        token = st.nextToken();
        counter = counter + 1;
        if (counter == 3) {
          addressLine2 = token
        }
      }
    }
    return addressLine2;
  }

  public function getAddressHistoryCountry(addressHistoryString : String) : Country {
    var retCountry : Country = null; 
    if(addressHistoryString != null){
      var st : java.util.StringTokenizer = new java.util.StringTokenizer(addressHistoryString, "|");
      var token : String = ""
      var counter = 0;
  
      while (st.hasMoreTokens()) {
        token = st.nextToken();
        counter = counter + 1;
        if (counter == 4) {
          for (typeKey in Country.getTypeKeys(false)) {
            if (typeKey.Code == token) {
              retCountry = typeKey;
            }
          }
        }
      }
    }
    return retCountry;
  }

  public function getAddressHistoryCity(addressHistoryString : String) : String {
    var city : String = null; 
    if(addressHistoryString != null){
      var st : java.util.StringTokenizer = new java.util.StringTokenizer(addressHistoryString, "|");
      var token : String = ""
      var counter = 0;
  
      while (st.hasMoreTokens()) {
        token = st.nextToken();
        counter = counter + 1;
        if (counter == 5) {
          city = token;
        }
      }
    }
    return city;
  }

  public function getAddressHistoryState(addressHistoryString : String) : State {
    var retState : State = null; 
    if(addressHistoryString != null){
      var st : java.util.StringTokenizer = new java.util.StringTokenizer(addressHistoryString, "|");
      var token : String = ""
      var counter = 0;
  
      while (st.hasMoreTokens()) {
        token = st.nextToken();
        counter = counter + 1;
        if (counter == 6) {
          for (typeKey in State.getTypeKeys(false)) {
            if (typeKey.Code == token) {
              retState = typeKey;
            }
          }
        }
      }
    }
    return retState;
  }

  //Returns a concatinated postal code for use in EDW - kmboyd - 6/24/2009
  public function getAddressHistoryPostalCode(addressHistoryString : String) : String {
    var postalcode : String = null; 
    if(addressHistoryString != null){
      var st : java.util.StringTokenizer = new java.util.StringTokenizer(addressHistoryString, "|");
      var token : String = ""
      var counter = 0;
  
      while (st.hasMoreTokens()) {
        token = st.nextToken();
        counter = counter + 1;
        if (counter == 7) {
          postalcode = token;
        }
      }
    }
    if(postalcode.length >= 11){
      postalcode = postalcode.substring( 0, 10 )
    }
    return postalcode;
  }

  public function getAddressHistoryPublicID(addressHistoryString : String) : String {
    var publicid : String = null; 
    if(addressHistoryString != null){
      var st : java.util.StringTokenizer = new java.util.StringTokenizer(addressHistoryString, "|");
      var token : String = ""
      var counter = 0;
  
      while (st.hasMoreTokens()) {
        token = st.nextToken();
        counter = counter + 1;
        if (counter == 8) {
          publicid = token;
        }
      }
    }
    return publicid;
  }

  public function getAddressHistoryCounty(addressHistoryString : String) : String {
    var county : String = null; 
    if(addressHistoryString != null){
      var st : java.util.StringTokenizer = new java.util.StringTokenizer(addressHistoryString, "|");
      var token : String = ""
      var counter = 0;
  
      while (st.hasMoreTokens()) {
        token = st.nextToken();
        counter = counter + 1;
        if (counter == 9) {
          county = token;
        }
      }
    }
    return county;
  }

  public function getAddressHistoryCityStateZip(addressHistoryString : String) : String {
    var cityStateZip = new java.lang.StringBuffer();
    var city : String = getAddressHistoryCity(addressHistoryString)
    var state : State = getAddressHistoryState(addressHistoryString)
    var postalCode : String = getAddressHistoryPostalCode(addressHistoryString)
    
    if (city != null and city.length() > 0) {
      if (cityStateZip.length() > 0) cityStateZip.append(", ");
      cityStateZip.append(city);
    }
    if (state != null) {
      if (cityStateZip.length() > 0) cityStateZip.append(", ");
      cityStateZip.append(state.Code);
    }
    if (postalCode != null and postalCode.length() > 0) {
      if (cityStateZip.length() > 0) cityStateZip.append(" ");
      cityStateZip.append(postalCode);
    }
    
    return cityStateZip.toString();
  }

  public function getAddressHistoryDisplayName(addressHistoryString : String) : String {
    var displayName : java.lang.StringBuffer = new java.lang.StringBuffer();
    var addressLine1 : String = getAddressHistoryAddressLine1(addressHistoryString)
    var addressLine2 : String = getAddressHistoryAddressLine2(addressHistoryString)
    var city : String = getAddressHistoryCity(addressHistoryString)
    var state : State = getAddressHistoryState(addressHistoryString)
    var postalCode : String = getAddressHistoryPostalCode(addressHistoryString)
    var country : Country = getAddressHistoryCountry(addressHistoryString)
    
    if (addressLine1 != null and addressLine1.length() > 0) {
      displayName.append(addressLine1);
    }
    if (addressLine2 != null and addressLine2.length() > 0) {
      if (displayName.length() > 0) displayName.append(", ");
      displayName.append(addressLine2);
    }
    if (city != null and city.length() > 0) {
      if (displayName.length() > 0) displayName.append(", ");
      displayName.append(city);
    }
    if (state != null) {
      if (displayName.length() > 0) displayName.append(", ");
      displayName.append(state.Code);
    }
    if(country != null and country.Code != "US"){
      if (displayName.length() > 0) displayName.append(", ");
      displayName.append(country);
    }
    if (postalCode != null and postalCode.length() > 0) {
      if (displayName.length() > 0) displayName.append(" ");
      displayName.append(postalCode);
    }
    return displayName.toString();
  }

  public function getAddressHistoryDescription(addressHistoryString : String) : String {
    var description : String = null; 
    if(addressHistoryString != null){
      var st : java.util.StringTokenizer = new java.util.StringTokenizer(addressHistoryString, "|");
      var token : String = ""
      var counter = 0;
  
      while (st.hasMoreTokens()) {
        token = st.nextToken();
        counter = counter + 1;
        if (counter == 10) {
          description = token;
        }
      }
    }
    return description;
  }
  //used on NewCheckPayeeDV.pcf
  function defaultUserCompany():String {
    var addy:String = ""
    if(this.DeliveryMethod == "hold"){
       // if(this.Claim.AssignedGroup.CompanyNameExt !=null){
        //addy = this.Claim.AssignedGroup.CompanyNameExt.DisplayName
      //}else
        addy = displaykey.GAIC.Check.ReturnToOffice.DefaultCompany
    }
    return addy;
  }
}
