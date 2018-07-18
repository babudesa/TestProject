package gw.plugin.archiving
uses gw.api.util.DateUtil
uses gw.api.system.CCConfigParameters

/**
 * This subclass of ArchiveSource extends the example IArchiveSource implementation with logic that assumes that the
 * RootInfo is an instance of ClaimInfo, which is always the case in ClaimCenter.
 */
@ReadOnly
class ClaimInfoArchiveSource extends ArchiveSource {

  override function updateInfoOnRetrieve(info : RootInfo) {
    super.updateInfoOnRetrieve(info)
    var claim = (info as entity.ClaimInfo).Claim
    claim.DateEligibleForArchive = DateUtil.addDays(DateUtil.currentDate(), CCConfigParameters.DaysRetrievedBeforeArchive.Value)
  }

}
