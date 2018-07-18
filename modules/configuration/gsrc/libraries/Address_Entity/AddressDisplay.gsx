package libraries.Address_Entity

enhancement AddressDisplay : entity.Address {
  function showAddressName():String{
    var addy:String
    if(this.AddressType != null){
      addy = this.DisplayName + " ("+ this.AddressType.DisplayName + ")"
    }
    else{
      addy = this.DisplayName + " (Unknown)" 
    }
    return addy;
  }
}
