package gw.entity
uses gw.api.claim.PurgeClaimInfoMethods
uses gw.util.Pair

@Export
class PurgeClaimInfoMethodsImpl implements PurgeClaimInfoMethods {

  var _claimInfo : ClaimInfo

  construct( claimInfo : ClaimInfo ) {
    _claimInfo = claimInfo
  }

  override property get NonGraphBeansToPurge() : List<Pair<IEntityType,List<Key>>> {
    return {
      // put beans to be deleted before ClaimInfo here
      new Pair<IEntityType,List<Key>>(entity.ClaimInfo, {_claimInfo.ID})
      // put beans to be deleted after ClaimInfo here
    }
  }

}
