package gw.entity

enhancement GWBusinessWeekZoneEnhancement : entity.BusinessWeekZone {
  property get ShortDescription() : String {
    return "BusinessWeek=" + this.BusinessWeek.Name + ", Country=" + this.Country.DisplayName + ", Zone Type=" + this.ZoneType.DisplayName + ", Zone=" + this.Code
  }
}
