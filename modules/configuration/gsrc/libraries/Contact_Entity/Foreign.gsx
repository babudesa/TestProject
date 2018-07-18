package libraries.Contact_Entity

enhancement Foreign : entity.Contact {
  function isForeign() : boolean{
    if((this.Subtype == "Ex_ForeignCoVendor") || (this.Subtype == "Ex_ForeignPersonVndr") || (this.Subtype == "FrgnAutoRepairShopExt") ||
       (this.Subtype == "Ex_ForeignCoVenMedOrg") || (this.Subtype == "Ex_ForeignCoVenLawFrm") || 
       (this.Subtype == "Ex_ForeignPerVndrAttny") || (this.Subtype == "Ex_ForeignPerVndrDoc") || 
       ("AutoTowingAgcy")) {
      return true; 
    }
    return false;
  }
}
