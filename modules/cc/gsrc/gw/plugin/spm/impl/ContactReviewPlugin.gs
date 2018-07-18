package gw.plugin.spm.impl;
uses java.lang.Integer;
uses java.rmi.RemoteException;
uses java.util.Calendar;
uses gw.api.soap.GWAuthenticationHandler;
uses soap.ABReviewSummary.api.IReviewSummaryAPI;
uses java.lang.RuntimeException;
uses java.util.Map

class ContactReviewPlugin implements gw.plugin.contact.IContactReviewPlugin, gw.plugin.InitializablePlugin 
{

  var _api : IReviewSummaryAPI = null;
  var _username = "";
  var _password = "";

  construct()
  {
  }

  /**
   * Scores the review for a given set of answers.
   * NOTE: If using category scores, this should create/update those scores on the
   *       Review object as necessary.
   *
   * @param review
   * @return the overall score for the review
   */
  override function scoreReview(review: Review): Integer {
    // By default, we simply call the internal "default" scoring mechanism.
    return review.updateAndGetSimpleScores();
  }

  /**
   * Submits a summary of the completed Review to ContactCenter.
   *
   * @param review
   * @return the addressBookUID for the submitted ReviewSummary
   * @throws java.rmi.RemoteException if there is a problem connecting to the ContactCenter server.
   */
  override function submitReview(review: Review) : String {
    var reviewCategoryScores = review.SortedCategoryScores;
    var numCatScores = reviewCategoryScores.length;
    var reviewCategories = new soap.ABReviewSummary.enums.ReviewCategory[numCatScores];
    var categoryScores = new int[numCatScores];
    var reviewScore = review.Score;
    if (reviewScore == null) {
      reviewScore = Integer.MIN_VALUE;
    }
    for (var i in numCatScores) {
      var catType = soap.ABReviewSummary.enums.ReviewCategory;
      // var reviewCategory = catType[gw.api.util.TypeCodeEscapeUtil.convertTypeCodeToSafeString(review.CategoryScores[i].ReviewCategory)] as soap.ABReviewSummary.enums.ReviewCategory;
      var reviewCategory = catType["tc_"+(reviewCategoryScores[i].ReviewCategory as java.lang.String)] as soap.ABReviewSummary.enums.ReviewCategory;
      var catScore = reviewCategoryScores[i].Score;
      reviewCategories[i] = reviewCategory;
      categoryScores[i] = catScore;
    }

    var catType2 = soap.ABReviewSummary.enums.ReviewServiceType;
    var serviceType : soap.ABReviewSummary.enums.ReviewServiceType;
    if (review.ServiceType != null) {
     serviceType = catType2["tc_"+(review.ServiceType as java.lang.String)] as soap.ABReviewSummary.enums.ReviewServiceType;
    }

    var calendar : Calendar;

    if (review.ServiceDate != null) {
      calendar = Calendar.getInstance()
      calendar.Time = review.ServiceDate;
    }

    var api = getContactAPI();
    var rs = api.addNewReviewSummary(
                review.Name, review.RelatedTo,
                review.Claim.ClaimNumber, review.ReviewType.Name,
                review.ReviewedBy.DisplayName, review.Subcontact,
                calendar, serviceType,
                reviewScore, review.Contact.AddressBookUID,
                review.Comments, review.PublicID,
                reviewCategories, categoryScores);
    return rs.LinkID;
  }

  /**
   * Deletes the summary corresponding to a completed Review from ContactCenter.
   *
   * @param review
   * @throws RemoteException if there is a problem connecting to the ContactCenter server.
   */
  override function deleteReview(review: Review ) {
    //Below should be an assert.
    if (review.AddressBookUID == null) {
      throw new RemoteException("Shouldn't call plugin if not linked.");
    }
    var api = getContactAPI();
    api.deleteReviewSummary( review.AddressBookUID );
  }

  /** Indicated to ContactCenter that it should update the scores for a given Contact.
   *
   * @param contact - a contact, which must be linked to ContactCenter
   * @throws RemoteException if there is a problem connecting to the ContactCenter server.
   */
  override function updateScores(contact : Contact ) {
    if (!contact.Linked) return;
    var abUID = contact.AddressBookUID;
    var api = getContactAPI();
    api.updateReviewScores( abUID );
  }

  private function getContactAPI() : IReviewSummaryAPI {
    if (_api == null) {
      try {
        _api = new soap.ABReviewSummary.api.IReviewSummaryAPI();
        _api.addHandler(new GWAuthenticationHandler( _username, _password ));
      } catch (e) {
        throw new RuntimeException(e.getCause())
      }
    }
    return _api
  }

  override function setParameters( params: Map ) : void
  {
    _username = params.get("username") as String
    _password = params.get("password") as String   
  }

}
