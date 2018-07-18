package gw.webservice.cc.financials.bulkpay;


uses entity.BulkInvoice
uses entity.BulkInvoiceItem
uses typekey.BulkInvoiceStatus
uses entity.Contact
uses gw.api.webservice.pl.FieldValue
uses gw.api.webservice.exception.EntityStateException
uses gw.api.webservice.exception.SOAPException
uses java.math.BigDecimal
uses java.util.Calendar

/**
 * <p>
 * <code>IBulkInvoiceAPI</code> provides methods for creating <code>BulkInvoice</code> objects and adding/updating/deleting
 * <code>BulkInvoiceItem</code> objects.
 * </p><p>
 * Unless otherwise indicated, callers of this API should assume that returned entities contain foreign key
 * IDs for associated entities, rather than the entity itself.  For example, a call to <code>getItems()</code> returns an
 * array of <code>BulkInvoiceItem</code> beans, each bean contains a foreign key to the containing <code>BulkInvoice.</code>
 * However, the API returns only the ID of the <code>BulkInvoice</code> and so you must make a separate call to
 * <code>getBulkInvoice()</code> to actually get the <code>Invoice</code>.  This separate call is more efficient for
 * constructing the API's SOAP response.
 * </p><p>
 * In practice, this also means that a caller of the <code>IBulkInvoiceAPI</code>, must set the <code>Exposure</code>
 * and <code>Claim</code> on a <code>BulkInvoiceItem</code> using the <code>PublicID</code> of the <code>Claim</code> or
 * <code>Exposure</code>. Both the <code>setClaim()</code> and <code>setExposure()</code> methods take a
 * <code>String</code> argument which must be a <code>PublicId</code>.
 * </p>
 * See {@link IBulkInvoiceAPISoapBindingStub#createContactByLinkId(String)} for example code.
 *
 * @see gw.api.webservice.IDataObjectAPI
 *
 * @author chsu
 */
@WebService
@ReadOnly
class IBulkInvoiceAPI {

  /**
   * <p>
   * Creates a new unapproved <code>BulkInvoice</code> entity with a <code>BulkInvoiceStatus</code> of
   * <code>TC_draft</code> and commits it. The caller must supply the following <code>BulkInvoice</code> fields:
   * </P>
   * <ul>
   * <li><code>publicID</code></li>
   * <li><code>payee</code></li>
   * <li><code>requestingUser</code></li>
   * <li><code>status</code></li>
   * <li><code>bulkInvoiceTotal</code></li>
   * </ul>
   *
   * If the server is configured in multicurrency mode, a market rate will be selected for
   * <code>TransToReportingExchangeRate</code>.
   *
   * @param invoice the <code>BulkInvoice</code> object to create.
   * @return The committed <code>BulkInvoice</code> object.
   */
  @Throws(EntityStateException, "")
  @Throws(SOAPException, "if the invoice to be created has a public ID already in use or if it has a null public ID")
  public function createBulkInvoice(invoice : BulkInvoice) : BulkInvoice{
    return getDelegate().createBulkInvoice( invoice ) 
  }

  /**
   * <p>
   * Creates a new unapproved <code>BulkInvoice</code> entity with a status of {@link BulkInvoiceStatus#TC_DRAFT} and
   *
   * commits it. The caller must supply the following <code>BulkInvoice</code> fields:
   * </P>
   * <ul>
   * <li><code>publicID</code></li>
   * <li><code>payee</code></li>
   * <li><code>requestingUser</code></li>
   * <li><code>status</code></li>
   * <li><code>bulkInvoiceTotal</code></li>
   * </ul>
   *
   * If the server is configured in multicurrency mode, a market rate will be selected for
   * <code>TransToReportingExchangeRate</code>.
   *
   * @param invoice the <code>BulkInvoice</code> object to create
   * @param customExchangeRate the <code>TransToReportingExchangeRate</code> to set on the <code>BulkInvoice</code>;
   *                           must be null if the server is configured in single-currency mode; if null and server is
   *                           in multicurrency mode, a current market rate will be used
   * @param customExchangeRateDescription the description to be used for the TransToReportingExchangeRate; must
   *                                      be null or empty if customExchangeRate is null; if null and customExchangeRate
   *                                      is non-null, a standard string including the current date is used
   * @return The committed <code>BulkInvoice</code> object.
   */
  @Throws(EntityStateException, "")
  @Throws(SOAPException, "if the invoice to be created has a public ID already in use or if it has a null public ID")
  public function createBulkInvoice(invoice : BulkInvoice, customExchangeRate : BigDecimal, customExchangeRateDescription : String) : BulkInvoice{
    return getDelegate().createBulkInvoice( invoice, customExchangeRate, customExchangeRateDescription )
  }

  /**
   *<p>
   * Searches for a specific <code>BulkInvoice</code>.
   * </p>
   * @param publicId the ID of the invoice to search for.
   * @return The <code>BulkInvoice</code> with the given ID.
   */
  @Throws(SOAPException, "if an invalid public ID is given")
  public function getBulkInvoice(publicId : String) : BulkInvoice {
    return getDelegate().getBulkInvoice( publicId ) 
  }

  /**
   *<p>
   * Submits the specified <code>BulkInvoice</code> for approval. If this succeeds, <code>getStatus()</code> should return
   * <code>AWAITINGSUBMISSION</code> and all the <code>BulkInvoiceItem</code> objects with a status of <code>APPROVED</code>
   * should have an associated check.
   * </p><p>
   * For this API to succed, the invoice must valid with at least one invoice item. The <code>BulkInvoiceStatus</code>
   * must be one of the following:
   * </p>
   * <ul>
   * <li><code>TC_DRAFT</code></li>
   * <li><code>TC_REJECTED</code></li>
   * <li><code>TC_ONHOLD</code></li>
   * <li><code>TC_PENDINGITEMVALIDATION</code></li>
   * </ul>
   *
   * @param publicId ID of the <code>BulkInvoice</code> to submit.
   */
  @Throws(SOAPException, "if an invalid public ID is given")
  public function submitBulkInvoice(publicId : String){
    getDelegate().submitBulkInvoice( publicId )  
  }

  /**
   *<p>
   * Requests that the specified <code>BulkInvoice</code> be escalated for submission to the downstream system. You can
   * only call this method on a <code>BulkdInvoice</code> with a stauts of <code>TC_AWAITINGSUBMISSION</code>.
   * </p><p>
   * Ordinarily, the system handles escalation automatically using the scheduled <code>bulkinvoicesescalation</code>
   * batch process, but it is possible a <code>BulkInvoice</code> must be escalated prior to the running of this process.
   * If a <code>BulkInvoice</code> has a scheduled send date on the current day, calling <code>requestBulkInvoice()</code>
   * causes the <code>BulkInvoice</code> and its associated checks to move to the <code>BulkInvoiceStatus</code> of
   * <code>TC_requesting</code> and then to the <code>TC_requested</code> status.  If the scheduled send date is not
   * today, then the invoice is unaffected.
   * </p>
   *
   * @param publicId ID of the <code>BulkInvoice</code> to request for submission to the downstream system
   */
  @Throws(SOAPException, "if an invalid public ID is given")
  public function requestBulkInvoice(publicId : String){
    getDelegate().requestBulkInvoice( publicId )
  }

  /**
   * Validates the specified <code>BulkInvoice</code>. If method succeeds, calling <code>isValid() on the <code>BulkInvoice</code>
   * will return true.  If this fails, calling <code>isValid()</code> will return false and <code>getValidationAlerts()</code>
   * will return an array of <code>BIValidationAlerts</code>.
   * @param publicId ID of the <code>BulkInvoice</code> to validate
   */
  @Throws(SOAPException, "if an invalid public ID is given")
  public function validateBulkInvoice(publicId : String){
    getDelegate().validateBulkInvoice( publicId )  
  }

  /**
   * <p>
   * Voids the specified <code>BulkInvoice</code>. You can only call this method on a <code>BulkInvoice</code> with a
   * status of:
   * </p>
   * <ul>
   * <li><code>TC_REQUESTING</code></li>
   * <li><code>TC_REQUESTED</code></li>
   * <li><code>TC_ISSUED</code></li>
   * <li><code>TC_CLEARED</code></li>
   * </ul>
   *<p>
   * After the method completes, the <code>BulkInvoice</code>'s status and that of all its invoides will be
   * <code>TC_PENDINGVOID</code>
   * @param publicId ID of the <code>BulkInvoice</code> to void.
   */
  @Throws(EntityStateException, "if the status of the BulkInvoice does not allow for it to be voided.")
  @Throws(SOAPException, "if an invalid public ID is given")
  public function voidBulkInvoice(publicId : String){
    getDelegate().voidBulkInvoice( publicId )
  }

  /**
   *<p>
   * Stops the specified <code>BulkInvoice</code>. You should only stop a <code>BulkInvoice</code> with a status of
   * <code>TC_REQUESTING</code>, <code>TC_REQUESTED</code>, or <code>TC_ISSUED</code>.  After this method completes,
   * the status of the <code>BulkInvoice</code> and all its items will be <code>TC_PENDINGSTOP</code>.
   * </p>
   *
   * @param publicId ID of the <code>BulkInvoice</code> to stop.
   */
  @Throws(EntityStateException, "if the status of the BulkInvoice does not allow for it to be stopped")
  @Throws(SOAPException, "if an invalid public ID is given")
  public function stopBulkInvoice(publicId : String){
    getDelegate().stopBulkInvoice( publicId )
  }

  /**
   * Sets the status of the <code>BulkInvoice</code> to be <code>TC_ONHOLD</code>.
   * @param publicId ID of the <code>BulkInvoice</code> to put on hold.
   */
  @Throws(EntityStateException, "if the invoice status was not requesting or requested")
  @Throws(SOAPException, "if an invalid public ID is given")
  public function placeDownstreamHoldOnInvoice(publicId : String){
    getDelegate().placeDownstreamHoldOnInvoice( publicId )  
  }

  /**
   * Updates the status of the <code>BulkInvoice</code> and/or sets the check number or issue date of the associated
   * bulk check.  This method can set the <code>BulkInvoiceStatus</code> to one of the following:
   * <ul>
   * <li><code>TC_ISSUED</code></li>
   * <li><code>TC_CLEARED</code></li>
   * <li><code>TC_VOIDED</code></li>
   * <li><code>TC_STOPPED</code></li>
   * </ul>
   *
   * @param publicId ID of the <code>BulkInvoice</code> to update.
   * @param checkNumber Check number to update, optional.
   * @param issueDate Date the check was issued.
   * @param status Status to update.
   * @param extensions Set of name/value pairs of extension fields to update on the check. Can be <code>null</code> if
   * there are no extension fields to update.
   */
  @Throws(EntityStateException, "If the new check status is invalid")
  @Throws(SOAPException, "If an invalid public ID is given")
  public function updateBulkInvoiceStatus(publicId : String, checkNumber : String, issueDate : Calendar, status : BulkInvoiceStatus, extensions : FieldValue[]){
    getDelegate().updateBulkInvoiceStatus( publicId, checkNumber, issueDate, status, extensions )
  }

  /**
   *<p>
   * Adds <code>BulkInvoiceItem</code> objects to a <code>BulkInvoice</code>.  The <code>BulkInvoiceIntimes</code> must
   * contain the following values: public ID, claim, payment type, amount, status, and bulk invoice ID.
   * </p>
   * @param publicId the ID of the <code>BulkInvoice</code> to which to add <code>BulkInvoiceItem</code> objects.
   * @param items array of <code>BulkInvoiceItem</code> objects to add.
   * @return Array of added <code>BulkInvoiceItem</code> objects, empty array if <code>items</code> is null or empty.
   */
  @Throws(SOAPException, "If an invalid public ID is given")
  public function addItems(publicId : String, items : BulkInvoiceItem[]) : BulkInvoiceItem[]{
    return getDelegate().addItems( publicId, items )
  }
    
  /**
   * Gets all <code>BulkInvoiceItem</code> objects linked to the specified <code>BulkInvoice</code>.
   *
   * @param publicId ID of the <code>BulkInvoice</code> for which to search for <code>BulkInvoiceItem</code> objects.
   * @return Array of <code>BulkInvoiceItem</code> objects linked to the given <code>BulkInvoice</code>
   */
  @Throws(SOAPException, "If an invalid public ID is given")
  public function getItems(publicId : String) : BulkInvoiceItem[]{
    return getDelegate().getItems( publicId )
  }

  /**
   * Gets all the <code>BulkInvoiceItem</code> entities with the specified claim ID linked to the specified
   * <code>BulkInvoice</code>.
   *
   * @param publicId ID of the <code>BulkInvoice</code> for which to search for <code>BulkInvoiceItem</code> objects.
   * @param claimId ID of the <code>Claim</code> that result <code>BulkInvoiceItem</code> objects should reference.
   * @return Array of <code>BulkInvoiceItem</code> objects with the given <code>Claim</code> and linked to the given <code>BulkInvoice</code>.
   */
  @Throws(SOAPException, "If an invalid public ID is given")
  public function getItems(publicId : String, claimId : String) : BulkInvoiceItem[]{
    return getDelegate().getItems( publicId, claimId )
  }

  /**
   * Gets all <code>BulkInvoiceItem</code> objects with the specified claim ID and payment amount linked to the specified
   * <code>BulkInvoice</code>.
   *
   * @param publicId ID of the <code>BulkInvoice</code> for which to search for <code>BulkInvoiceItem</code> objects.
   * @param claimId ID of the <code>Claim</code> that result <code>BulkInvoiceItem</code> objects should reference.
   * @param amount payment amount that result <code>BulkInvoiceItem</code> objects should have.
   * @return Array of <code>BulkInvoiceItem</code> objects with the given <code>Claim</code> and amount and linked to the given
   * <code>BulkInvoice</code>.
   */
  @Throws(SOAPException, "If an invalid public ID is given")
  public function getItems(publicId : String, claimId : String, amount : BigDecimal) : BulkInvoiceItem[]{
    return getDelegate().getItems( publicId, claimId, amount )
  }

  /**
   * Updates <code>BulkInvoiceItem</code> objects for a given <code>BulkInvoice</code>. All <code>BulkInvoiceItem</code> objects must
   * refer to the correct <code>BulkInvoice</code>. If any invalid <code>BulkInvoiceItem</code> IDs are specified to be
   * updated, this method will throw an exception and not update ANY items. The invoice items must contain the following
   * fields: public ID, claim, payment type, amount, status, and bulk invoice ID.
   * </p><p>
   * <b>Important Usage Note:</b> You must be sure that the <code>BulkInvoiceItem</code> objects you pass are fully populated,
   * as any <code>null</code> values overwrite non-null values on existing items.  Similarly, if you added an array
   * extension field to the <code>BulkInvoiceItem</code> entity, a call to this method must ensure that the array is
   * fully populated or the elements of are lost during the update.
   * <p/>
   *
   *
   * The status of each element of updatedItems will be set to Draft, and the BulkInvoice will be invalidated.
   *
   * @param publicId the ID of the <code>BulkInovoice</code> the given items should refer to.
   * @param updatedItems array of <code>BulkInvoiceItem</code> objects to update.
   * @return Array of updated <code>BulkInvoiceItem</code> objects.
   */
  @Throws(SOAPException, "If an invalid public ID is given")
  public function updateItems(publicId : String, updatedItems : BulkInvoiceItem[]) : BulkInvoiceItem[]{
    return getDelegate().updateItems( publicId, updatedItems )
  }

  /**
   * Deletes <code>BulkInvoiceItems</code> from a <code>BulkInvoice</code>. If any invalid <code>BulkInvoiceItem</code>
   * IDs are specified to be deleted, this method will throw an exception and not delete ANY items.
   *
   * @param publicId the ID of the <code>BulkInvoice</code> from which to remove items.
   * @param itemIds array of IDs of <code>BulkInvoiceItem</code> objects to remove.
   * @return Array of deleted IDs.
   */
  @Throws(SOAPException, "If an invalid public ID is given")
  public function deleteItems(publicId : String, itemIds : String[]) : String[]{
    return getDelegate().deleteItems( publicId, itemIds )
  }

  /**
   * <p>
   * Create a <code>Contact</code> in ClaimCenter by importing from and linking it to ContactCenter.
   * </p><p>
   * <b>Note:</b> Use the <code>PublicID</code> of the new contact as a <code>Payee</code> ID when creating a new
   * <code>BulkInvoice</code>. When using the <code>IDataObjectAPI</code> to update a <code>BulkInvoice</code>,
   * prepend "Contact:" (its (super)entity name) to the front of the contact <code>PublicID</code>.
   * </p>
   * <p><code>
   * <pre>
   *     Contact newPayee = iBulkInvoiceApiClient.createContactByLinkId(contactCenterLinkID);<br>
   *     String newPayeeId = newPayee.getPublicID();<br>
   *     <br>
   *     BulkInvoice bi = new BulkInvoice();<br>
   *     bi.setPayee(newPayeeId);<br>
   *     [...]<br>
   *     bi = iBulkInvoiceApiClient.createBulkInvoice(bi);<br>
   *     <br>
   *     PathValue pv = new PathValue("payee", "Contact:" + newPayeeId);<br>
   *     iDataObjectApiClient.setPathValues("BulkInvoice", bi.getPublicID(), new PathValue[] {pv});<br>
   * </pre>
   * </code>
   * <p>
   * @param contactLinkID the linkID of the <code>Contact</code> in ContactCenter to link to in ClaimCenter.
   * @return The newly created <code>Contact</code> in ClaimCenter.
   */
  @Throws(SOAPException, "If a communication error occurs")
  //@Throws(AddressBookContactNotFoundException, "If an invalid Link ID is given")
  public function createContactByLinkId(contactLinkID : String) : Contact {
    return getDelegate().createContactByLinkId( contactLinkID )
  }
  
  //----------------------------------------------------------------- private helper methods
  
  private function getDelegate() : gw.api.webservice.cc.financials.bulkpay.BulkInvoiceAPIImpl {
    return new gw.api.webservice.cc.financials.bulkpay.BulkInvoiceAPIImpl()
  }
}
