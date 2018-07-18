package gw.fnolmapper.acord.ext
uses java.lang.String
uses java.util.Set
uses java.util.HashSet

/**
 * Enhancement for the ACORD's ClaimsParty_Type.
 */
enhancement ClaimsPartyEnhancement : xsd.acord.ClaimsParty_Type {
  /**
   * Checks to see if this ClaimsParty has the given role (corresponding to the
   * ACORD ClaimsPartyRoleCd).
   */
  function hasRole(roleName:String) : boolean {
    return this.RoleCodes.contains(roleName)
  }
  
  /**
   * Returns the role codes (ClaimsPartyRoleCd) for this ClaimsParty.
   */
  property get RoleCodes() : Set<String> {
    var names = new HashSet<String>()
    this.ClaimsPartyInfo.ClaimsPartyRoleCds.each(\ c -> {
      names.add(c.Text)
    })
    return names
  }
}
