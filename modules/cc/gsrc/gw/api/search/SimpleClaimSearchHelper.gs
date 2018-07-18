package gw.api.search
uses gw.api.claim.ClaimUtil
uses gw.api.util.LocationUtil
uses java.io.Serializable

/**
 * Manages the searches on the simple claim search screen. Most of the complication is around archived claims. If
 * archiving is enabled when we do a simple claim search then we also check the ClaimInfos for archived claims that
 * match the current search criteria. If there are any matches we display an "archive search link" which takes the
 * user to the advanced search screen to see those matches.
 * <p>
 * The search to find matching ClaimInfos is potentially very expensive so we do a limited count query which will
 * stop as soon as it finds even one match.
 */
@Export
class SimpleClaimSearchHelper implements Serializable {

  final var _criteriaWrapper = ClaimUtil.getClaimSearchCriteria()
  final var _maxResults = MaxSearchResults.forClaims()
  var _archivedClaimsExist = false
  
  construct() {
  }

  /**
   * The maximum number of results that should be returned. If the search returns more than this many results
   * a message will be shown explaining that there are too many results and the user should use a more specific
   * set of search criteria.
   */
  property get MaxResults() : int {
    return _maxResults
  }

  /**
   * The underlying search critera object
   */
  property get Criteria() : ClaimSearchCriteria {
    return _criteriaWrapper.Criteria
  }

  /**
   * Search active claims, using the current search criteria. If archiving is available then also do a limited
   * count query looking for matching archived claims. If any archived claims are found, add an informational
   * message at the top of the screen.
   */
  function search() : gw.api.database.IQueryBeanResult {
    var searchResults = Criteria.performSimpleSearchWithoutSummary(); 
    if (Criteria.canSearchArchive()) {
      _archivedClaimsExist = Criteria.hasArchivedClaims()
      if (_archivedClaimsExist) {
        LocationUtil.addRequestScopedInfoMessage(displaykey.JSP.ClaimSearch.Search.ThereAreArchivedClaims);
      }
    } else {
      _archivedClaimsExist = false
    }
    return searchResults;
  }

  /**
   * Should we ever show the "archive search" link? True if archiving is available, false otherwise
   */
  function archiveSearchLinkVisible() : boolean {
    return ClaimUtil.isArchivingAvailable()
  }
  
  /**
   * Should the user be able to click on the "archive search" link? True if archiving is available, the current
   * search criteria are valid for archived claims and matching archived claims exist. Note that some search
   * criteria are not valid for archived claims. For example even if archiving is available you can't do an
   * "any party involved" search for archived claims because we only keep claimant and insured information in
   * the live database for archived claims (of course the actual archived claims contain full details of all the
   * contacts, but they aren't searchable).
   */
  function archiveSearchLinkAvailable() : boolean {
    return Criteria.canSearchArchive() and _archivedClaimsExist
  }

  /**
   * Label to show on the "archive search" link
   */
  function archiveSearchLinkLabel() : String {
    if (Criteria.canSearchArchive()) {
      return _archivedClaimsExist
              ? displaykey.JSP.ClaimSearch.Search.Results.ArchiveLink
              : displaykey.JSP.ClaimSearch.Search.Results.ArchiveNoMatches
    } else {
      return displaykey.JSP.ClaimSearch.Search.Results.ArchiveSearchDisabled
    }
  }

  /**
   * Utility function called from the action attribute of the "archive search" link, to prepare the search criteria
   * for an archive search
   */
  function modifySearchCriteriaForAdvanceArchive() {
    Criteria.ClaimSearchType = ClaimSearchType.TC_ARCHIVED;
    Criteria.ArchiveDateCriterionChoice.ChosenOption = null;
  }
}
