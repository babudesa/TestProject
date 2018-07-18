package libraries.Address_Entity

enhancement MailMerge : entity.Address {
  public function gaic_getmailingaddresslines():String
  {
    var mystring:String
    //This function assumes that address line 2 is not used unless line 1 is used and line 3 isn't used unless line 2 is.
    //  the \\par inserts a carriage return line feed or paragraph mark into a RTF document.
    If (this.AddressLine1!=Null){
      mystring=this.AddressLine1
      If (this.AddressLine2!=Null){
        mystring = mystring + "\\par " +  this.AddressLine2
        If (this.AddressLine3!=Null){
          mystring = mystring + "\\par " +  this.AddressLine3
        }
      }
    }
    return mystring
  }
 
  public function gaic_getfullmailingaddress():String
  {
    var mystring:String
    //This function assumes that address line 2 is not used unless line 1 is used and line 3 isn't used unless line 2 is.
    //  the \\par inserts a carriage return line feed or paragraph mark into a RTF document.
    If (this.AddressLine1!=Null){
      mystring=this.AddressLine1
      If (this.AddressLine2!=Null){
        mystring = mystring + "\\par " + this.AddressLine2
        If (this.AddressLine3!=Null){
          mystring = mystring + "\\par " + this.AddressLine3
        }
      }
    }
    If (this.City!= Null){
      mystring = mystring + "\\par " + this.City + ", "
    } else {
      mystring = mystring + "\\par  " + "          " + ", "
    }
    If (this.State!= Null){
      mystring = mystring + this.State.DisplayName + "  "
    } else {
      mystring = mystring + "    "
    }
    If (this.PostalCode!= Null){
      mystring = mystring +  this.PostalCode
    } else {
      mystring = mystring +  "          "
    }
    If (this.Country!= Null and this.Country!="US"){
      mystring = mystring + "\\par " + this.Country.DisplayName
    }
 
    return mystring
  }
}
