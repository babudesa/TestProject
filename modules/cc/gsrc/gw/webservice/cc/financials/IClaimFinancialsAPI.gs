package gw.webservice.cc.financials

uses entity.TransactionSet
uses typekey.CostCategory
uses typekey.CostType
uses typekey.FinancialsCalculationType
uses typekey.TransactionStatus
uses gw.api.webservice.pl.FieldValue
uses gw.api.webservice.exception.DataConversionException
uses gw.api.webservice.exception.EntityStateException
uses gw.api.webservice.exception.PermissionException
uses gw.api.webservice.exception.SOAPException
uses gw.api.webservice.exception.SOAPSenderException
uses gw.api.webservice.exception.SOAPServerException
uses java.math.BigDecimal
uses java.util.Calendar
uses gw.lang.WebService
uses gw.transaction.Transaction
uses gw.api.webservice.exception.BadIdentifierException
uses java.lang.IllegalStateException
uses com.guidewire.pl.system.exception.IllegalTransactionStatusException
uses gw.api.webservice.cc.financials.ClaimFinancialsAPIImpl
uses gw.api.webservice.cc.financials.TransactionSetApprovalResult

/**
 * The Claim Financials API provides methods for importing claim financials
 * data when the system is using the "Financials View" integration mode and
 * for updating the status of a requested check when the system is using the
 * "Financials Entry" integration mode.
 */
@WebService
@ReadOnly
class IClaimFinancialsAPI {

  /**
   * Imports financial data for a single claim. This API should be used only
   * when financials entry happens outside ClaimCenter. Note that this method 
   * executes Validation rules when committing to the database.
   * <p/>
   * Only transaction sets with status "approved" are allowed to be imported.
   * <p/>
   * All transactions in the transaction set must have a status of "submitted",
   * "pendingvoid", "voided", "pendingstop", "stopped", or "recoded".
   * <p/>
   * All checks in the transaction set must have a status of "requested",
   * "pendingvoid", "voided", "pendingstop", "stopped", "issued", or "cleared".
   *
   * @param transactionSet        A set of financial transactions for a single claim; all of the transactions must
   *                              have the same currency
   * @throws IllegalStateException For any transaction, if the claimCurrencyAmount is different from the transactionAmount and the Transaction and Claim Currencies are the same
   *                            Or if the claimCurrencyAmount is different from the reportingCurrencyAmount and the Reporting and Claim Currencies are the same
   *                            Or if the reportingCurrencyAmount is different from the transactionAmount and the Reporting and Transaction Currencies are the same
   * @return An identifier for the imported transaction set.
   */
  @Throws(DataConversionException, "Thrown if there's a problem in the imported data; for example, a bad typecode or missing required field.")
  @Throws(EntityStateException, "Thrown if there's a transaction or check with an invalid status in in the transaction set.")
  public function addClaimFinancials(transactionSet : TransactionSet) : String {
    return getDelegate().addClaimFinancials( transactionSet )
  }

  /**
   * Imports a single TransactionSet for a claim. Unlike addClaimFinancials(TransactionSetData), this method
   * submits the TransactionSet for approval, and fires Transaction Post-Setup rules 
   * after the data is approved. This method runs Validation rules twice: before 
   * submitting for approval, and when committing to the database. 
   * <p/>
   * This method should be used as a means to create financial transactions in an automated way, since it runs the 
   * imported data through the same steps as transactions entered through the UI. 
   *
   * @param transactionSetData  A set of financial transactions for a single claim; all of the transactions must
   *                            have the same currency
   * @param checkForDuplicateChecks If true, this method will check for duplicate checks when importing a checkset.
   * @throws IllegalStateException For any transaction, if the claimCurrencyAmount is different from the transactionAmount and the Transaction and Claim Currencies are the same
   *                            Or if the claimCurrencyAmount is different from the reportingCurrencyAmount and the Reporting and Claim Currencies are the same
   *                            Or if the reportingCurrencyAmount is different from the transactionAmount and the Reporting and Transaction Currencies are the same
   * @return A validation result that holds one of three results:
   *         <ul> ValidationFailed - this result will contain a list of validation errors </ul>
   *         <ul> ValidButUnapproved - this result will contain the String of
   *         the imported TransactionSet and a list of reasons for approval</ul>
   *         <ul> ValidAndApproved - this result will contain the String of
   *         the imported TransactionSet</ul>
   */
  @Throws(DataConversionException, "Thrown if there's a problem in the imported data; Also thrown if the imported transaction fails the parameters  AllowMultilineTransactions and AllowMultiplePayments")
  @Throws(PermissionException, "Thrown if the calling user doesn't have permission to perform the operation.  lso thrown if approval adapter determines that the requesting user has no authority to import the TransactionSet.")
  public function addClaimFinancialsWithValidation(transactionSetData : TransactionSet, checkForDuplicateChecks : boolean) : TransactionSetApprovalResult {
    return getDelegate().addClaimFinancialsWithValidation( transactionSetData, checkForDuplicateChecks )
  }

  /**
   * Updates the status of a check that has been requested by a user in ClaimCenter.
   * For example, this API should be invoked when the status of the check
   * changes from "requested" to "issued".  This should be used only when
   * financials entry happens in ClaimCenter.
   * <p/>
   * Allowed check status are "issued", "cleared", "voided", and "stopped".  The "Issued" and "Cleared" statuses
   * are not legal options if this check is part of a multi-payee check group that has been voided or stopped.
   * <p/>
   * If the check status is changed to "voided" or "stopped", the status on the
   * payments are updated to this, as well.
   * <p/>
   * checkNumber and issueDate is used when updating the check status to "issued".
   * For other updates, these two fields can be left as NULL.
   * <p/>
   * Note that if the check is pending stop or pending void and the new status
   * is issued or cleared, the statuses of the check and its payments are updated
   * and a warning activity is created and assigned to the user who attempted to
   * void or stop the check so that the user knows that the check was not voided.
   *
   * @param checkID     Identifier of the check to be updated.
   * @param checkNumber Number of the check. Optional; use NULL if not updating.
   * @param issueDate   Date the check was issued. Optional, use NULL if not updating.
   * @param status      Status of the check. Required; cannot be NULL.
   * @param extensions  Set of name/value pairs of extension fields to update
   *                    on the check. Can be NULL if no extension fields to update.
   */
  @Throws(EntityStateException, "Thrown if the new check status is invalid")
  public function updateCheckStatus(checkID : String, checkNumber : String, issueDate : Calendar, status : TransactionStatus, extensions : FieldValue[]) {
    getDelegate().updateCheckStatus( checkID, checkNumber, issueDate,  status, extensions )
  }

  /**
   * Voids a check. Creates offsetting payments to offset each payment on the check.
   * Also creates offsetting reserves if a payment on the check is
   * eroding and either of the following is true:
   * - the payment's exposure is closed (open reserves should always be zero for a closed exposure)
   * - open reserves on the payment's ReserveLine would become negative without an offsetting reserve
   * Offsetting reserves are included in this check's CheckSet.
   * <p/>
   * The status of the check and the original payments on the check are set to pending
   * void. The offsetting payments are set to Submitting status. The status of any offsetting
   * reserves is set to submitting.
   * <p/>
   * If this check belongs to a CheckGroup, then all checks in the group are voided.
   * <p/>
   * This action does not require approval.
   *
   * @param checkID  PublicID of the Check to void
   * @param reason  if non-null, the value to store in the Comments field for the voided Check
   */
  @Throws(BadIdentifierException, "If the identified check is not found.")
  @Throws(IllegalStateException, "If check status is not one of TransactionStatus.TC_NOTIFYING, TransactionStatus.TC_REQUESTED, TransactionStatus.TC_REQUESTING, TransactionStatus.TC_ISSUED, or TransactionStatus.TC_CLEARED.")
  @Throws(PermissionException, "If the calling user doesn't have permission to perform the operation.")
  public function voidCheck(checkID : String, reason : String) {
    runWithNewBundleAndCheckFoundByPublicID( checkID, \ c -> {
      if (reason != null) {
        c.Comments = reason
      }
      try {
          c.voidCheck()
      } catch ( e : IllegalTransactionStatusException ) {
        throw new IllegalStateException(e.Message)
      }
    } )
  }

  /**
   * Issues a stop payment on a check.  Offsetting reserves are created only if
   * the payment is not a supplement (since supplement payments never affect
   * open reserves in the first place) and either of the following holds:
   * - the payment's exposure is closed (open reserves should always be zero for a closed exposure)
   * - the open reserves for the payment's exposure's costtype is zero
   * Offsetting reserves are included in this check's CheckSet.
   * <p/>
   * The status of the check and all payments on the check are set to pending
   * stop.  The status of any offsetting reserves is set to pending submission.
   * <p/>
   * If this check belongs to a CheckGroup, then all checks in the group are stopped.
   * <p/>
   * This action does not require approval.
   *
   * @param checkID  PublicID of the Check to stop
   * @param reason  if non-null, the value to store in the Comments field for the stopped Check
   */
  @Throws(BadIdentifierException, "If the identified check is not found.")
  @Throws(IllegalStateException, "If check status is not one of TransactionStatus.TC_NOTIFYING, TransactionStatus.TC_REQUESTED, TransactionStatus.TC_REQUESTING, or TransactionStatus.TC_ISSUED.")
  @Throws(PermissionException, "If the calling user doesn't have permission to perform the operation.")
  public function stopCheck(checkID : String, reason : String) {
    runWithNewBundleAndCheckFoundByPublicID( checkID, \ c -> {
      if (reason != null) {
        c.Comments = reason
      }
      try {
          c.stopCheck()
      } catch ( e : IllegalTransactionStatusException ) {
        throw new IllegalStateException(e.Message)
      }
    } )
  }

  /**
   * Voids and reissues one Check in a CheckGroup. Each Check in a CheckGroup represents one payee (or set of
   * joint payees)--and therefore one physical check--for a multi-payee "check". This method requires that the
   * following criteria are met:
   * <ul>
   *  <li>The user has the "void" permission.
   *  <li>If the Check was cleared, the user has the "voidclearedpmt" permission.
   *  <li>The Check is Reissuable and has one of these statuses:<ul>
   *    <li> {@link TransactionStatus#TC_REQUESTING}
   *    <li> {@link TransactionStatus#TC_REQUESTED}
   *    <li> {@link TransactionStatus#TC_ISSUED}
   *    <li> {@link TransactionStatus#TC_NOTIFYING}
   *    <li> {@link TransactionStatus#TC_CLEARED}
   *   </ul>
   * </ul>
   * A new, replacement Check is created, the status of the original Check is set to
   * {@link TransactionStatus#TC_PENDINGVOID}, and then reissuance proceeds as follows:
   * <ol>
   *  <li>If the original Check was the primary Check for the CheckGroup, the new Check becomes the primary Check
   *      and the original Check is converted to a secondary Check (still in the same CheckGroup), and all of the
   *      Payments and Deductions are moved to the new Check
   *  <li>Regardless of whether the original Check already had a CheckPortion, a new, fixed-amount CheckPortion is
   *      created for it so that, in case it was not already defined by a fixed portion, its amount will not
   *      fluctuate (e.g., if it previously used a percentage portion)
   *  <li>A CheckRpt is created for the new Check
   *  <li>On the new Check, CheckNumber and IssueDate are set to null, ScheduledSendDate is set to today, and Status is
   *      is set to {@link TransactionStatus#TC_AWAITINGSUBMISSION}
   * </ol>
   *
   * @param checkID  PublicID of the Check to void and reissue
   * @param reason  if non-null, the value to store in the Comments field for the new Check
   */
  @Throws(BadIdentifierException, "If the identified check is not found.")
  @Throws(IllegalStateException, "If check status is not one of TransactionStatus.TC_NOTIFYING, TransactionStatus.TC_REQUESTED, TransactionStatus.TC_REQUESTING, TransactionStatus.TC_ISSUED, or TransactionStatus.TC_CLEARED, or if the check is otherwise not reissuable.")
  @Throws(PermissionException, "If the calling user doesn't have permission to perform the operation.")
  public function voidAndReissueCheck(checkID : String, reason : String) {
    runWithNewBundleAndCheckFoundByPublicID( checkID, \ oldCheck -> {
      var newCheck = oldCheck.createCheckForReissue()

      if (reason != null) {
        newCheck.Comments = reason
      }
      //
      // Other modifications to newCheck could be made here, but
      // in another copy of this method in your own @WebService class.
      //

      try {
        newCheck.voidAndReissue( oldCheck )
      } catch ( e : IllegalTransactionStatusException ) {
        throw new IllegalStateException(e.Message)
      }
    } )
  }

  /**
   * Stops and reissues one Check in a CheckGroup. Each Check in a CheckGroup represents one payee (or set of
   * joint payees)--and therefore one physical check--for a multi-payee "check". This method requires that the
   * following criteria are met:
   * <ul>
   *  <li>The user has the "stop" permission.
   *  <li>The original Check is Reissuable and has one of these statuses:<ul>
   *    <li> {@link TransactionStatus#TC_REQUESTING}
   *    <li> {@link TransactionStatus#TC_REQUESTED}
   *    <li> {@link TransactionStatus#TC_ISSUED}
   *    <li> {@link TransactionStatus#TC_NOTIFYING}
   *   </ul>
   * </ul>
   * A new, replacement Check is created, the status of the original Check is set to
   * {@link TransactionStatus#TC_PENDINGSTOP}, and then reissuance proceeds as follows:
   * <ol>
   *  <li>If the original Check was the primary Check for the CheckGroup, the new Check becomes the primary Check
   *      and the original Check is converted to a secondary Check (still in the same CheckGroup), and all of the
   *      Payments and Deductions are moved to the new Check
   *  <li>Regardless of whether the original Check already had a CheckPortion, a new, fixed-amount CheckPortion is
   *      created for it so that, in case it was not already defined by a fixed portion, its amount will not
   *      fluctuate (e.g., if it previously used a percentage portion)
   *  <li>A CheckRpt is created for the new Check
   *  <li>On the new Check, CheckNumber and IssueDate are set to null, ScheduledSendDate is set to today, and Status is
   *      is set to {@link TransactionStatus#TC_AWAITINGSUBMISSION}
   * </ol>
   *
   * @param checkID  PublicID of the Check to stop and reissue
   * @param reason  if non-null, the value to store in the Comments field for the new Check
   */
  @Throws(BadIdentifierException, "If the identified check is not found.")
  @Throws(IllegalStateException, "If check status is not one of TransactionStatus.TC_NOTIFYING, TransactionStatus.TC_REQUESTED, TransactionStatus.TC_REQUESTING, or TransactionStatus.TC_ISSUED, or if the check is otherwise not reissuable.")
  @Throws(PermissionException, "If the calling user doesn't have permission to perform the operation.")
  public function stopAndReissueCheck(checkID : String, reason : String) {
    runWithNewBundleAndCheckFoundByPublicID( checkID, \ oldCheck -> {
      var newCheck = oldCheck.createCheckForReissue()

      if (reason != null) {
        newCheck.Comments = reason
      }
      //
      // Other modifications to newCheck could be made here, but
      // in another copy of this method in your own @WebService class.
      //

      try {
        newCheck.stopAndReissue( oldCheck )
      } catch ( e : IllegalTransactionStatusException ) {
        throw new IllegalStateException(e.Message)
      }
    } )
  }

  /**
   * <p/>
   * If this check belongs to a CheckGroup, then all checks in the group are voided.
   * <p/>
   * This action does not require approval.
   *
   * @throws com.guidewire.pl.system.exception.IllegalTransactionStatusException
   *          if check status is not one of the
   *          following: TransactionStatus.TC_REQUESTING,
   *          TransactionStatus.TC_REQUESTED,
   *          TransactionStatus.TC_ISSUED,
   *          TransactionStatus.TC_NOTIFYING,
   *          TransactionStatus.TC_CLEARED
   */
  public function voidCheck(checkID : String) {
    Transaction.runWithNewBundle( \ bundle -> {
        getDelegate().loadCheckByPublicID( checkID, bundle ).voidCheck()
    } )
  }

  /**
   * Issues a stop payment on a check.  Offsetting reserves are created only if
   * the payment is not a supplement (since supplement payments never affect
   * open reserves in the first place) and either of the following holds:
   * - the payment's exposure is closed (open reserves should always be zero for a closed exposure)
   * - the open reserves for the payment's exposure's costtype is zero
   * Offsetting reserves are included in this check's CheckSet.
   * <p/>
   * The status of the check and all payments on the check are set to pending
   * stop.  The status of any offsetting reserves is set to pending submission.
   * <p/>
   * If this check belongs to a CheckGroup, then all checks in the group are stopped.
   * <p/>
   * This action does not require approval.
   *
   * @throws com.guidewire.pl.system.exception.IllegalTransactionStatusException
   *          if check status is not one of the
   *          following: TransactionStatus.TC_PENDING_REQUEST,
   *          TransactionStatus.TC_REQUESTED,
   *          TransactionStatus.TC_ISSUED
   *
   */
  public function stopCheck(checkID : String) {
    Transaction.runWithNewBundle( \ bundle -> {
        getDelegate().loadCheckByPublicID( checkID, bundle ).stopCheck()
    } )
  }

  // NOTE: One-arg and two-arg variations of this javadoc exist on the applyForEx.. methods in the Payment interface,
  //       the Check interface, ClaimFinancialsAPIImpl, and IClaimFinancialsImpl (twelve variations altogether). If you
  //       change the javadoc, *update all of them to keep them consistent*.
  /**
   * Adjusts this check's claim and/or reporting amounts to the specified values. Such adjustments are intended for
   * cases where better values for the amounts are determined later, after the check is created and escalated. For
   * example, if a check is written from a claim-currency bank account, the amount actually deducted from
   * that account's balance will be determined by exchange rates in effect at the time the check clears. This method
   * allows, for example, the claim amounts of the payments to be adjusted to reflect that amount for which the check
   * actually cleared. Null may be passed for <code>newClaimAmount</code> or <code>newReportingAmount</code>, in which
   * case no adjustment is made to that amount. Adjustments are distributed proportionally among the payment's line
   * items. For example, if the payment has four line items with claim amounts of $40, $20, $10, and $10 (a total of
   * $80), and <code>newClaimAmount</code> is $100, then the claim amounts will be adjused to $50, $25, $12.50, and
   * $12.50. In this example, each claim amount was increased by 25% (equal to the total relative increase), and each
   * new claim amount comprises the same fraction of the total as it did before the adjustment. Adjustments to the claim
   * and reporting amounts are largely independent.
   *
   * When this method is called, the system must be configured in multicurrency mode and the check must:
   * <ul>
   *  <li>have already been escalated and sent downstream but not been canceled or transferred
   *  <li>not be part of a multi-payee (grouped) check
   * </ul>
   *
   * Foreign exchange adjustments only affect total incurred and total paid calculations.  They do not further erode reserves.
   *
   * @param checkId the publicID of the check whose payment(s) are to receive the foreign exchange adjustment
   * @param newClaimAmount the value to which this check's claim amount should be adjusted; if null, the claim amount
   *                       is not adjusted
   * @param newReportingAmount the value to which this check's reporting amount should be adjusted; if null, the
   *                           reporting amount is not adjusted
   * @throws IllegalStateException if there is a conflict between the new, adjusted amounts and the currencies:
   *                            if newClaimAmount is different from the current transaction amount and the transaction and claim currencies are the same,
   *                            or if newClaimAmount is different from newReportingAmount and the reporting and claim currencies are the same,
   *                            or if newReportingAmount is different from the current transaction amount and the reporting and transaction currencies are the same
   */
  @Throws(EntityStateException, "If the check has an invalid status - something other than Requesting, Requested, Issued or Cleared.  Or if the check is not valid for receiving a foreign exchange adjustment (according to the criteria listed above).")
  public function applyForeignExchangeAdjustmentToCheck(checkId : String, newClaimAmount : BigDecimal, newReportingAmount : BigDecimal){
    getDelegate().applyForeignExchangeAdjustmentToCheck( checkId, newClaimAmount, newReportingAmount )
  }

  // NOTE: One-arg and two-arg variations of this javadoc exist on the applyForEx.. methods in the Payment interface,
  //       the Check interface, ClaimFinancialsAPIImpl, and IClaimFinancialsImpl (twelve variations altogether). If you
  //       change the javadoc, *update all of them to keep them consistent*.
  /**
   * Adjusts this check's claim and/or reporting amounts to the specified values. Such adjustments are intended for
   * cases where better values for the amounts are determined later, after the check is created and escalated. For
   * example, if a check is written from a claim-currency bank account, the amount actually deducted from
   * that account's balance will be determined by exchange rates in effect at the time the check clears. This method
   * allows, for example, the claim amounts of the payments to be adjusted to reflect that amount for which the check
   * actually cleared.Adjustments are distributed proportionally among the payment's line
   * items. For example, if the payment has four line items with claim amounts of $40, $20, $10, and $10 (a total of
   * $80), and <code>newClaimAmount</code> is $100, then the claim amounts will be adjused to $50, $25, $12.50, and
   * $12.50. In this example, each claim amount was increased by 25% (equal to the total relative increase), and each
   * new claim amount comprises the same fraction of the total as it did before the adjustment.
   *
   * In this variant of the method, only a claim amount is specified, and an adjustment to the reporting amount is
   * selected automatically. For example, if the reporting currency equals the transaction currency, then the reporting
   * amount is not adjusted. If the payment's claim is in the reporting currency, then the reporting amount is adjusted
   * to <code>newClaimAmount</code>. Otherwise, the adjusted reporting amount is determined by converting
   * <code>newClaimAmount</code> to the reporting currency using this payment's claim-to-reporting exchange rate.
   *
   * When this method is called, the system must be configured in multicurrency mode and the check must:
   * <ul>
   *  <li>have already been escalated and sent downstream but not been canceled or transferred
   *  <li>not be part of a multi-payee (grouped) check
   * </ul>
   *
   * Foreign exchange adjustments only affect total incurred and total paid calculations.  They do not further erode reserves.
   *
   * @param checkId the publicID of the check whose payment(s) are to receive the foreign exchange adjustment
   * @param newClaimAmount the adjusted amount for this payment in the claim currency; cannot be null
   * @throws IllegalStateException if claim amount is being adjusted but the transaction currency equals the claim currency
   */
  @Throws(EntityStateException, "If the check has an invalid status - something other than Requesting, Requested, Issued or Cleared.  Or if the check is not valid for receiving a foreign exchange adjustment (according to the criteria listed above).")
  public function applyForeignExchangeAdjustmentToCheck(checkId : String, newClaimAmount : BigDecimal){
    getDelegate().applyForeignExchangeAdjustmentToCheck( checkId, newClaimAmount)
  }

  // NOTE: One-arg and two-arg variations of this javadoc exist on the applyForEx.. methods in the Payment interface,
  //       the Check interface, ClaimFinancialsAPIImpl, and IClaimFinancialsImpl (twelve variations altogether). If you
  //       change the javadoc, *update all of them to keep them consistent*.
  /**
   * Adjusts this payment's claim and/or reporting amounts to the specified values. Such adjustments are intended for
   * cases where better values for the amounts are determined later, after the check is created and escalated. For
   * example, if a check is written from a claim-currency bank account, the amount actually deducted from
   * that account's balance will be determined by exchange rates in effect at the time the check clears. This method
   * allows, for example, the claim amount of the payment to be adjusted to reflect that amount for which the check
   * actually cleared. Null may be passed for <code>newClaimAmount</code> or <code>newReportingAmount</code>, in which
   * case no adjustment is made to that amount. Adjustments are distributed proportionally among the payment's line
   * items. For example, if the payment has four line items with claim amounts of $40, $20, $10, and $10 (a total of
   * $80), and <code>newClaimAmount</code> is $100, then the claim amounts will be adjused to $50, $25, $12.50, and
   * $12.50. In this example, each claim amount was increased by 25% (equal to the total relative increase), and each
   * new claim amount comprises the same fraction of the total as it did before the adjustment. Adjustments to the claim
   * and reporting amounts are largely independent.
   *
   * When this method is called, the system must be configured in multicurrency mode and the payment must:
   * <ul>
   *  <li>be on a check that has already been escalated and sent downstream but not been canceled or transferred
   *  <li>not have been recoded
   *  <li>not be an offset payment
   *  <li>not be part of a multi-payee (grouped) check
   * </ul>
   *
   * Foreign exchange adjustments only affect total incurred and total paid calculations.  They do not further erode reserves.
   *
   * @param paymentId the PublicID of the payment to receive the foreign exchange adjustment
   * @param newClaimAmount the value to which this payment's claim amount should be adjusted; if null, the claim amount
   *                       is not adjusted
   * @param newReportingAmount the value to which this payment's reporting amount should be adjusted; if null, the
   *                           reporting amount is not adjusted
   * @throws IllegalStateException if there is a conflict between the new, adjusted amounts and the currencies:
   *                            if newClaimAmount is different from the current transaction amount and the transaction and claim currencies are the same,
   *                            or if newClaimAmount is different from newReportingAmount and the reporting and claim currencies are the same,
   *                            or if newReportingAmount is different from the current transaction amount and the reporting and transaction currencies are the same
   */
  @Throws(EntityStateException, "if the payment is not valid for receiving a foreign exchange adjustment (according to the criteria listed above).")
  public function applyForeignExchangeAdjustmentToPayment(paymentId : String, newClaimAmount : BigDecimal, newReportingAmount : BigDecimal){
    getDelegate().applyForeignExchangeAdjustmentToPayment( paymentId, newClaimAmount, newReportingAmount )
  }

  // NOTE: One-arg and two-arg variations of this javadoc exist on the applyForEx.. methods in the Payment interface,
  //       the Check interface, ClaimFinancialsAPIImpl, and IClaimFinancialsImpl (twelve variations altogether). If you
  //       change the javadoc, *update all of them to keep them consistent*.
  /**
   * Adjusts this payment's claim and/or reporting amounts to the specified values. Such adjustments are intended for
   * cases where better values for the amounts are determined later, after the check is created and escalated. For
   * example, if a check is written from a claim-currency bank account, the amount actually deducted from
   * that account's balance will be determined by exchange rates in effect at the time the check clears. This method
   * allows, for example, the claim amount of the payment to be adjusted to reflect that amount for which the check
   * actually cleared.Adjustments are distributed proportionally among the payment's line
   * items. For example, if the payment has four line items with claim amounts of $40, $20, $10, and $10 (a total of
   * $80), and <code>newClaimAmount</code> is $100, then the claim amounts will be adjused to $50, $25, $12.50, and
   * $12.50. In this example, each claim amount was increased by 25% (equal to the total relative increase), and each
   * new claim amount comprises the same fraction of the total as it did before the adjustment.
   *
   * In this variant of the method, only a claim amount is specified, and an adjustment to the reporting amount is
   * selected automatically. For example, if the reporting currency equals the transaction currency, then the reporting
   * amount is not adjusted. If the payment's claim is in the reporting currency, then the reporting amount is adjusted
   * to <code>newClaimAmount</code>. Otherwise, the adjusted reporting amount is determined by converting
   * <code>newClaimAmount</code> to the reporting currency using this payment's claim-to-reporting exchange rate.
   *
   * When this method is called, the system must be configured in multicurrency mode and the payment must:
   * <ul>
   *  <li>be on a check that has already been escalated and sent downstream but not been canceled or transferred
   *  <li>not have been recoded
   *  <li>not be an offset payment
   *  <li>not be part of a multi-payee (grouped) check
   * </ul>
   *
   * Foreign exchange adjustments only affect total incurred and total paid calculations.  They do not further erode reserves.
   *
   * @param paymentId the publicID of the payment to receive the foreign exchange adjustment
   * @param newClaimAmount the adjusted amount for this payment in the claim currency; cannot be null
   * @throws IllegalStateException if claim amount is being adjusted but the transaction currency equals the claim currency
   */
  @Throws(EntityStateException, "if the payment is not valid for receiving a foreign exchange adjustment (according to the criteria listed above).")
  public function applyForeignExchangeAdjustmentToPayment(paymentId : String, newClaimAmount : BigDecimal){
    getDelegate().applyForeignExchangeAdjustmentToPayment( paymentId, newClaimAmount)
  }

  /**
   * API for performing a downstream denial of the recovery transaction.
   * A denied recovery can be resubmitted as is, deleted, or left in denied state.
   *
   * @param recoveryId the publicID of the recovery to be denied
   */
  @Throws(SOAPException, "Thrown if an unexpected error occurs on the server while updating the recovery.")
  public function denyRecovery(recoveryId : String){
    getDelegate().denyRecovery( recoveryId )
  }

  /**
   * API for performing a downstream denial of the checks.
   * A denied check can be resubmitted as is, deleted, or left in denied state.
   * <b>Important Note: Only single payee checks can be denied</b>
   *
   * @param checkId the publicID of the check to be denied
   * @throws EntityStateException if the check status is not one of the following: TransactionStatus.TC_SUBMITTING,
   *                              TransactionStatus.TC_SUBMITTED
   */
  @Throws(SOAPException, "Thrown if an unexpected error occurs on the server while updating the check.")
  public function denyCheck(checkId : String) {
    getDelegate().denyCheck( checkId )
  }

  /**
   * Fetches financials information for a set of claims (designated by claim number) and based on a given financials
   * calculation type, cost type, and cost category.  Note that not all financials values map to a specific cost category
   * or cost type, so if you need the overall information for a claim those parameters should be left null.
   * @param claimNumbers The numbers for all the claims that financials values are being requested for.
   * @param financialsCalculationType The type of the financials calculation for this request.
   * @param costCategory The cost category of the desired financials values.  If this is null, it will be ignored in
   * the request.
   * @param costType The cost type of the desired financials values.  If this is null, it will be ignored in the
   * request.
   * @return The array of requested financials values.  The returned values are in the same order as the claims that
   * were passed in through the claimNumbers parameter.
   * @throws SOAPSenderException If either claimNumbers or FinancialsCalculationType are null.
   * @throws SOAPServerException If the calculation associated with the passed {@link FinancialsCalculationType} cannot be found.
   */
  @Throws(SOAPSenderException,"If either claimNumbers or FinancialsCalculationType are null.")
  @Throws(SOAPServerException,"If the calculation associated with the passed {@link FinancialsCalculationType} cannot be found.")
  public function getClaimAmounts(claimNumbers : String[], financialsCalculationType : FinancialsCalculationType, costCategory : CostCategory, costType : CostType) : BigDecimal[]{
    return getDelegate().getClaimAmounts( claimNumbers, financialsCalculationType, costCategory, costType ).map( \ c -> c.Amount )
  }

  /**
   * Fetches financials information for a set of exposures (designated by public id) and based on a given financials
   * calculation type, cost type, and cost category.  Note that not all financials values map to a specific cost category
   * or cost type, so if you need the overall information for an exposure those parameters should be left null.
   * @param exposureIDs The public ids for all the exposures that financials values are being requested for.
   * @param financialsCalculationType The type of the financials calculation for this request.
   * @param costCategory The cost category of the desired financials values.  If this is null, it will be ignored in
   * the request.
   * @param costType The cost type of the desired financials values.  If this is null, it will be ignored in the
   * request.
   * @return The array of requested financials values.  The returned values are in the same order as the exposures that
   * were passed in through the exposureIDs parameter.
   */
  @Throws(SOAPSenderException,"If either exposureIDs or FinancialsCalculationType are null.")
  @Throws(SOAPServerException,"If the calculation associated with the passed {@link FinancialsCalculationType} cannot be found.")
  public function getExposureAmounts(exposureIDs : String[], financialsCalculationType : FinancialsCalculationType, costCategory : CostCategory, costType : CostType) : BigDecimal[] {
      return getDelegate().getExposureAmounts( exposureIDs, financialsCalculationType, costCategory, costType ).map( \ c -> c.Amount )
  }

  /**
   * Imports financial data for a single claim. This API should  be used only
   * when financials entry happens outside ClaimCenter. Note that this method 
   * executes Validation rules when committing to the database.
   * <p/>
   * Only transaction sets with status "approved" are allowed to be imported.
   * <p/>
   * All transactions in the transaction set must have a status of "submitted",
   * "pendingvoid", "voided", "pendingstop", "stopped", or "recoded".
   * <p/>
   * All checks in the transaction set must have a status of "requested",
   * "pendingvoid", "voided", "pendingstop", "stopped", "issued", or "cleared".
   *
   * @param transactionSet  A set of financial transactions for a single claim; all of the transactions must
   *                        have the same currency
   * @param exchangeRate  exchange rate from the transaction currency to the claim currency, for which a "custom"
   *                      exchange rate entity will be created and set on the Transactions; the ClaimAmount for each
   *                      Transaction is not recalculated using this rate, so it is quite possible to add Transactions
   *                      through this method with amount ratios that do not match the exchange rate (a warning will be
   *                      logged in this case); if this argument is null, no exchange rates will be applied to the
   *                      Transactions
   * @param exchangeRateDescription exchange rate description, can be null
   * @throws IllegalStateException For any transaction, if the claimCurrencyAmount is different from the transactionAmount and the Transaction and Claim Currencies are the same
   *                            Or if the claimCurrencyAmount is different from the reportingCurrencyAmount and the Reporting and Claim Currencies are the same
   *                            Or if the reportingCurrencyAmount is different from the transactionAmount and the Reporting and Transaction Currencies are the same
   * @return An identifier for the imported transaction set.
   */
  @Throws(DataConversionException, "If there's a problem in the imported data; For example, a bad typecode or missing required field.")
  @Throws(EntityStateException, "If there's a transaction or check with an invalid status in in the transaction set.")
  public function addClaimFinancials(transactionSet : TransactionSet, exchangeRate : BigDecimal, exchangeRateDescription : String) : String {
    return getDelegate().addClaimFinancials( transactionSet, exchangeRate, exchangeRateDescription )
  }

  /**
   * Imports a single TransactionSet for a claim. Unlike addClaimFinancials(TransactionSetData), this method
   * submits the TransactionSet for approval, and fires Transaction Post-Setup rules 
   * after the data is approved. This method runs Validation rules twice: before 
   * submitting for approval, and when committing to the database. 
   * <p/>
   * This method should be used as a means to create financial transactions in an automated way, since it runs the 
   * imported data through the same steps as transactions entered through the UI. 
   *
   * @param transactionSetData  A set of financial transactions for a single claim; all of the transactions must
   *                            have the same currency
   * @param checkForDuplicateChecks if true, this method will check for duplicate checks when importing a checkset
   * @param exchangeRate  exchange rate from the transaction currency to the claim currency, for which a "custom"
   *                      exchange rate entity will be created and set on the Transactions; the ClaimAmount for each
   *                      Transaction is not recalculated using this rate, so it is quite possible to add Transactions
   *                      through this method with amount ratios that do not match the exchange rate (a warning will be
   *                      logged in this case); if this argument is null, no exchange rates will be applied to the
   *                      Transactions
   * @param exchangeRateDescription exchange rate description, can be null
   * @throws IllegalStateException For any transaction, if the claimCurrencyAmount is different from the transactionAmount and the Transaction and Claim Currencies are the same
   *                            Or if the claimCurrencyAmount is different from the reportingCurrencyAmount and the Reporting and Claim Currencies are the same
   *                            Or if the reportingCurrencyAmount is different from the transactionAmount and the Reporting and Transaction Currencies are the same
   * @return A validation result that holds one of three results:
   *         <ul> ValidationFailed - this result will contain a list of validation errors </ul>
   *         <ul> ValidButUnapproved - this result will contain the String of
   *         the imported TransactionSet and a list of reasons for approval</ul>
   *         <ul> ValidAndApproved - this result will contain the String of
   *         the imported TransactionSet</ul>
   */
  @Throws(DataConversionException, "If there is a problem in the imported data; Also thrown if the imported transaction fails the parameters AllowMultilineTransactions and AllowMultiplePayments")
  @Throws(PermissionException, "If the calling user doesn't have permission to perform the operation. Also thrown if approval adapter determines that the requesting user has no authority to import the TransactionSet.")
  public function addClaimFinancialsWithValidation (
                   transactionSetData : TransactionSet,
                   checkForDuplicateChecks : boolean,
                   // the exchange rate is provided as a single numerical argument here (as opposed to making the
                   // ExchangeRate entity exportable and requiring callers to create and attach instances to the
                   // Transactions) because:
                   //   a) the currency pair and rate must be the same for every transaction in transactionSetData, so
                   //      this prevents us from having to verify that fact
                   //   b) the currency pair for each exchange rate is implied by the transaction and claim currencies
                   //   c) providing a single number is easier for the caller
                   exchangeRate : BigDecimal,
                   exchangeRateDescription : String) : TransactionSetApprovalResult {
    return getDelegate().addClaimFinancialsWithValidation( transactionSetData, checkForDuplicateChecks, exchangeRate, exchangeRateDescription )
  }
                   
  //----------------------------------------------------------------- private helper methods
  
  @Throws(BadIdentifierException, "If the identified check is not found.")
  private static function runWithNewBundleAndCheckFoundByPublicID(checkID : String, b : block(check:Check) ) {
    Transaction.runWithNewBundle( \ bundle -> {
        var checkQuery = find( c in Check where c.PublicID==checkID )
        if( checkQuery.getCount() == 0 ) {
          throw new BadIdentifierException("No Check exists with PublicID: " + checkID);
        }
        b( bundle.add(checkQuery.getFirstResult()) )
    } )
  }


  private function getDelegate() : ClaimFinancialsAPIImpl {
    return new ClaimFinancialsAPIImpl()
  }

}
