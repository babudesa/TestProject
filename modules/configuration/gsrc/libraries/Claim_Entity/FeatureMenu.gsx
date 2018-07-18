package libraries.Claim_Entity

enhancement FeatureMenu : entity.Claim {
  function containsReducedItem(menuItems : util.exposures.ExposureMenuItem[]) : boolean {
    return util.exposures.ExposureMenuUtils.containsReducedItem( menuItems )
  }
}
