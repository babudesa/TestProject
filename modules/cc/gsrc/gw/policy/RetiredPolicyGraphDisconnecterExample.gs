package gw.policy
uses gw.api.database.Query
uses gw.transaction.Transaction

uses com.guidewire.pl.system.database.query.DeleteBuilder
uses com.guidewire.pl.system.dependency.ServerDependencies
uses com.guidewire.pl.system.transaction.ActiveUserTransaction
uses gw.entity.IColumnPropertyInfo

/**
 * This example class is provided to assist ClaimCenter 6.0.x customers who
 * use the policy refresh feature AND archiving. It helps address the following problem:
 *
 * (Note: this problem is also described in Knowledge Base article #1555; this example implementation
 *        supercedes the file attached to that article)
 *
 * When a policy refresh is performed, the old policy graph (the Policy itself and beans that belong
 * to it) is removed, and a new one -- based on information received from the policy system -- is
 * attached to the claim. Beans in the old graph that are retireable get retired, not
 * deleted, in the database. However, the policy refresh algorithm in ClaimCenter 6.0.x does not
 * detect and sever all connections between the old policy graph and the claim, and those lingering
 * connections to the retired policy graph can interfere with the archiving process.
 *
 * In the base ClaimCenter 6.0.x data model, there are several known links that can survive a policy
 * refresh and thereby pose a problem for subsequent archiving. This class is intended as a starting
 * point, since it only handles links in the base data model, and cannot handle potentially-problematic
 * extension properties. For extension properties on (non-retired) entities on the Claim that refer to
 * retired entities in the Policy graph, follow the pattern of the "unlink" methods below, which query
 * for the bean, null out the reference, and commit the changes. For extension properties on
 * retired entities in the Policy graph, follow the pattern of {link #deleteClaimContactRoles(Key)},
 * which actually deletes the retired entity; using a bundle to just clear the reference is not
 * recommended since editing retired beans in a bundle is generally not supported.
 *
 * Whether or not you make changes to this example, if you intend to use this class or one based on it,
 * please test running policy refresh followed by archiving for a variety of Claims and Policies.
 *
 * This class is written to be called in two ways:
 * <ul>
 * <li>After each policy refresh operation, call {@link #runForPolicy(Key)} and pass it the Claim's old,
 *     now-retired Policy, which will cut problematic links to and from that Policy.
 * <li>After upgrading to 6.0.5 or a later version of 6.0.x, call {@link #runForAllPolicies} once,
 *     which will query the database for problematic links (produced by policy refresh in the pre-upgrade
 *     version) from the Claim to a retired Policy and cut those links.
 * </ul>
 *
 * See the documentation for {@link #runForAllPolicies} and {@link #runForPolicy(Key)} for more information.
 *
 * Note: ClaimCenter 7.0.x and later perform a more comprehensive analysis of the graph during policy
 * refresh and do not leave lingering links to the claim, so this class is only expected to be
 * useful for ClaimCenter 6.0.x.
 */
@ReadOnly
class RetiredPolicyGraphDisconnecterExample {

  private construct() {
  }

  /**
   * This method is intended to sever problematic links to a particular Policy graph
   * immediately after it has been retired as part of a policy refresh operation. In the base
   * configuration, policy refresh is invoked when the "ClaimPolicyGeneral_RefreshPolicyButton"
   * ToolbarButton is clicked on the ClaimPolicyGeneral page. That button has this "action" attribute:<br>
   * <code>gw.api.policy.ClaimPolicySetPolicyUtil.refreshClaimPolicy(CurrentLocation, Claim)</code>
   * <br>
   * To call this method on the old Policy after every policy refresh, edit that attribute to look
   * like this:<br>
   * <code>var policyId=Claim.Policy.ID; gw.api.policy.ClaimPolicySetPolicyUtil.refreshClaimPolicy(CurrentLocation, Claim); gw.policy.RetiredPolicyGraphDisconnecterExample.runForPolicy(policyId)</code>
   */
  static function runForPolicy(policyId : Key) {
    deleteClaimContactRoles(policyId)
    unlinkPropertyContentsScheduledItemsFromPropertyItems(policyId)
    unlinkPolicyLocationsFromAddresses(policyId)
    unlinkDeductiblesFromCoverages(policyId)
    unlinkFixedPropertyIncidentsFromPolicyLocations(policyId)
    unlinkTripIncidentsFromTripRUs(policyId)
    unlinkBaggageIncidentsFromTripRUs(policyId)
  }

  /**
   * Configuring policy refresh to always call {@link #runForPolicy(Key)} (see the documentation for that
   * method) should prevent new problematic Claim-Policy links from being left behind that would
   * interfere with archiving. However, that method cannot address any links created before it was called,
   * which are the focus of this method. This method is intended to cut all of the problematic links at once.
   * Depending on the size of the database, this operation may be time-consuming, and so should normally
   * only be run a single time, possibly as part of an upgrade.
   */
  static function runForAllPolicies() {
    deleteClaimContactRoles(null)
    unlinkPropertyContentsScheduledItemsFromPropertyItems(null)
    unlinkPolicyLocationsFromAddresses(null)
    unlinkDeductiblesFromCoverages(null)
    unlinkFixedPropertyIncidentsFromPolicyLocations(null)
    unlinkTripIncidentsFromTripRUs(null)
    unlinkBaggageIncidentsFromTripRUs(null)
  }

  private static function checkPolicyIsOrphaned(table : gw.api.database.Table) {
    // check that no Claim refers to this Policy
    var qClaim = Query.make(Claim)
    qClaim.FindRetired = true
    table.subselect("ID", CompareNotIn, qClaim, "Policy")
  }

  /**
   * Deletes retired ClaimContactRoles on retired Policies. The ClaimContactRole cannot simply be severed
   * from the Claim because its foreign key to ClaimContact is non-nullable, and the ClaimContact may
   * still be in active use on the Claim.
   */
  private static function deleteClaimContactRoles(policyId : Key) {
    var qClaimContactRole = Query.make(ClaimContactRole)
    qClaimContactRole.FindRetired = true
    qClaimContactRole.compare("RetiredValue", NotEquals, 0)
    var qPolicy = qClaimContactRole.join("Policy")
    qPolicy.FindRetired = true
    qPolicy.compare("RetiredValue", NotEquals, 0)
    if (policyId != null) {
      qPolicy.compare("ID", Equals, policyId)
    }
    checkPolicyIsOrphaned(qPolicy)
    // don't bother looking at the ClaimContact, since we know it's there, and we want to delete the CCR whether or not the CC is retired
    var ccrIDsToDelete = qClaimContactRole.select(\ c -> c.ID).toList()

    if (!ccrIDsToDelete.Empty) {
      // Note that this code uses internal APIs that are not supported or documented and should NOT
      // be used elsewhere, since they may be removed in future releases without notice.
      ServerDependencies.getTransactionManager().execute(new ActiveUserTransaction() {
        override public function run() {
          var db = new DeleteBuilder(ClaimContactRole)
          db.where().addIn(ClaimContactRole.Type.TypeInfo.getProperty("ID") as IColumnPropertyInfo, ccrIDsToDelete)
          db.execute()
        }
      })
    }
  }

  private static function unlinkPropertyContentsScheduledItemsFromPropertyItems(policyId : Key) {
    var qPropertyContentsSchedueldItem = Query.make(PropertyContentsScheduledItem)
    qPropertyContentsSchedueldItem.FindRetired = false  // the PCSI should not be retired
    var qPropertyItem = qPropertyContentsSchedueldItem.join("PropertyItem")
    qPropertyItem.FindRetired = true
    qPropertyItem.compare("RetiredValue", NotEquals, 0)
    var qPolicyLocation = qPropertyItem.join("Property")
    qPolicyLocation.FindRetired = true
    qPolicyLocation.compare("RetiredValue", NotEquals, 0)
    var qPolicy = qPolicyLocation.join("Policy")
    qPolicy.FindRetired = true
    qPolicy.compare("RetiredValue", NotEquals, 0)
    if (policyId != null) {
      qPolicy.compare("ID", Equals, policyId)
    }
    checkPolicyIsOrphaned(qPolicy)
    var pcsisToUnlink = qPropertyContentsSchedueldItem.select().toList()

    if (!pcsisToUnlink.Empty) {
      Transaction.runWithNewBundle(\ bundle -> {
        for (pcsi in pcsisToUnlink) {
          pcsi = bundle.add(pcsi)
          pcsi.PropertyItem = null
        }
      })
    }
  }

  private static function unlinkPolicyLocationsFromAddresses(policyId : Key) {
    var qPolicyLocation = Query.make(PolicyLocation)
    qPolicyLocation.FindRetired = true
    qPolicyLocation.compare("RetiredValue", NotEquals, 0)
    var qAddress = qPolicyLocation.join("Address")
    qAddress.FindRetired = false  // the Address should not be retired
    var qPolicy = qPolicyLocation.join("Policy")
    qPolicy.FindRetired = true
    qPolicy.compare("RetiredValue", NotEquals, 0)
    if (policyId != null) {
      qPolicy.compare("ID", Equals, policyId)
    }
    checkPolicyIsOrphaned(qPolicy)
    var plsToUnlink = qPolicyLocation.select().toList()

    if (!plsToUnlink.Empty) {
      Transaction.runWithNewBundle(\ bundle -> {
        for (pl in plsToUnlink) {
          pl = bundle.add(pl)
          pl.Address = null
        }
      })
    }
  }

  /**
   * This handles a common pattern of an entity on the Claim with a nullable foreign key to an
   * entity on the Policy. The entity on the Policy is retired and has a foreign key to the
   * Policy (which is also retired and is no longer linked from any Claims). This method nulls
   * out the foreign key on the Claim entity.
   */
  private static function unlinkThreeLinkChain( mainType : Type, mainTypesPropertyToMiddleType : String, policyId : Key ) {
    var mainQuery = Query.make(mainType)
    mainQuery.FindRetired = false  // the Deductible should not be retired
    var middleQuery = mainQuery.join(mainTypesPropertyToMiddleType)
    middleQuery.FindRetired = true
    middleQuery.compare("RetiredValue", NotEquals, 0)
    var policyQuery = middleQuery.join("Policy")
    policyQuery.FindRetired = true
    policyQuery.compare("RetiredValue", NotEquals, 0)
    if (policyId != null) {
      policyQuery.compare("ID", Equals, policyId)
    }
    checkPolicyIsOrphaned(policyQuery)
    var mainEntitiesToUnlink = mainQuery.select().toList()

    if (!mainEntitiesToUnlink.Empty) {
      Transaction.runWithNewBundle(\ bundle -> {
        for (e in mainEntitiesToUnlink) {
          e = bundle.add(e)
          e.setFieldValue(mainTypesPropertyToMiddleType, null)
        }
      })
    }
  }

  private static function unlinkDeductiblesFromCoverages(policyId : Key) {
    unlinkThreeLinkChain( Deductible, "Coverage", policyId )
  }

  private static function unlinkFixedPropertyIncidentsFromPolicyLocations(policyId : Key) {
    unlinkThreeLinkChain( FixedPropertyIncident, "Property", policyId )
  }

  private static function unlinkTripIncidentsFromTripRUs(policyId : Key) {
    unlinkThreeLinkChain( TripIncident, "TripRU", policyId )
  }

  private static function unlinkBaggageIncidentsFromTripRUs(policyId : Key) {
    unlinkThreeLinkChain( BaggageIncident, "RelatedTripRU", policyId )
  }

}
