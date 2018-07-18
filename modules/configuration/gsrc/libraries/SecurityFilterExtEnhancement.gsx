package libraries

enhancement SecurityFilterExtEnhancement : entity.SecurityFilterExt {
  public property get Value():String {
    if (this typeis entity.ProfitCenterSecurityFilterExt) {
      return (this as entity.ProfitCenterSecurityFilterExt).ProfitCenterGrouping.DisplayName;
    } else if (this typeis entity.ClaimsBusinessUnitSecurityFilterExt) {
      return (this as entity.ClaimsBusinessUnitSecurityFilterExt).ClaimsBusinessUnit.DisplayName;
    } else {
      return "Unknown";
    }
  }
}
