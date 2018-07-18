package libraries.LocationBasedRU_Entity

enhancement LocationBasedRUEnhancement : entity.LocationBasedRU {
  function setRiskCoverageDates() {
  
    if(this.Subtype == "PropertyRU"){
      if(!this.Policy.Verified && this.Property.PhyPropEffDateExt == null){
        this.Property.PhyPropEffDateExt = this.Policy.EffectiveDate
      }
      if(!this.Policy.Verified && this.Property.PhyPropExpDateExt == null){
        this.Property.PhyPropExpDateExt = this.Policy.ExpirationDate
      }
    }
  }
  
  function expDateError() : boolean{
    if(this.Subtype == "PropertyRU"){
      if(util.custom_Ext.DateTime.isDateBefore(this.Property.PhyPropExpDateExt, this.Policy.EffectiveDate) or util.custom_Ext.DateTime.isDateAfter(this.Property.PhyPropExpDateExt, this.Policy.ExpirationDate)){
        return true;
      }else{
        return false;
    }
    }else{
      return false;
    }
  }

  function effDateError() : boolean{
    if(this.Subtype == "PropertyRU"){
      if(util.custom_Ext.DateTime.isDateBefore(this.Property.PhyPropEffDateExt, this.Policy.EffectiveDate) or util.custom_Ext.DateTime.isDateAfter(this.Property.PhyPropEffDateExt, this.Policy.ExpirationDate)){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    } 
  }
}
