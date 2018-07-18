package libraries

@Export
enhancement InjuryIncidentUI : InjuryIncident {
  
  /**
   * Returns an enhanced version of the InjuryIncident's display name that also contains the name of the
   * injured party
   */
  property get DisplayNameWithInjuredParty() : String {
    var injuredParty = this.injured
    var displayName = this.DisplayName
    if (injuredParty != null && displayName != "") {
      return displaykey.InjuryIncident.DisplayNameWithInjuredParty(this.DisplayName, injuredParty.DisplayName)
    } else if (injuredParty != null) {
      return displaykey.InjuryIncident.DisplayNameWithInjuredPartyNoInjuryDetails(injuredParty.DisplayName)
    } else {
      return displayName
    }
  }

}
