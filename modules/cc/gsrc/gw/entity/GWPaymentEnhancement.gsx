package gw.entity
uses gw.api.util.DisplayableException

@Export
enhancement GWPaymentEnhancement : Payment
{
  
  /**
   * Returns true if this payment contains a line item associated with a deductible,
   * false otherwise.
   */
  public function hasDeductibleLineItem() : Boolean {
    return SharedDeductible.TransactionLineItem.Transaction == this
  }

  /**
   * Returns true if this payment has a line item with former deductible line 
   * category, false otherwise
   */
  public function hasFormerDeductibleLineItem() : boolean {
    return this.LineItems.hasMatch( \ t -> t.LineCategory == LineCategory.TC_FORMERDEDUCTIBLE )
  }
  
  /**
   * Returns this payment's exposure's coverage's deductible
   * (which will be identical for all payments that have the same exposure)
   * if it exists. Note that the deductible returned, if paid,
   * may not necessarily be paid by this payment. The returned value may be null.
   */
  property get SharedDeductible() : Deductible {
    return this.Exposure.Coverage.ClaimDeductible
  }
  
  /**
   * Returns the deductible applied to a line item on this payment, if one exists.
   * If a value would be returned, it is the same as SharedDeductible.
   * If no such deductible exists, a UserDisplayableException is thrown.
   */
  property get AppliedDeductible() : Deductible {
    if (!hasDeductibleLineItem()) {
      throw new DisplayableException(displaykey.Deductible.Error.PaymentDoesNotHaveDeductible)
    }
    return SharedDeductible
  }
  
  /**
   * Applies a deductible to the this payment. If the payment's exposure's coverage has no deductible,
   * or if the deductible has already been paid, this method throws an exception. Otherwise, 
   * a new line item in the negative amount of the deductible and with line category "deductible"
   * is created and added to the payment. Returns the newly created line item.
   */
  function addDeductibleLineItem() : TransactionLineItem {
    if (hasDeductibleLineItem()) {
      throw new DisplayableException(displaykey.Deductible.Error.DeductibleTLIAlreadyExists)
    }
    if (SharedDeductible == null) {
      throw new DisplayableException(displaykey.Deductible.Error.NoApplicableDeductible)
    }
    if (SharedDeductible.Paid) {
      throw new DisplayableException(displaykey.Deductible.Error.DeductibleAlreadyPaid)
    }
    var tli = new TransactionLineItem()
    this.addToLineItems(tli)
    tli.updateAmountsFromClaimAmount(-SharedDeductible.Amount)
    tli.LineCategory = "Deductible"
    SharedDeductible.linkItem(tli)
    return SharedDeductible.TransactionLineItem
  }
  
  /**
   * Unlinks a deductible entity from a transaction line item on this payment, if one exists.
   * This does NOT remove the line item from the payment.
   */
  public function unlinkDeductible() {
    if (!hasDeductibleLineItem()) {
      throw new DisplayableException("This payment has no deductible applied to it to unlink.")
    }
    AppliedDeductible.TransactionLineItem.unlinkDeductible()
  }
  
  /**
   * Unlinks the given deductible entity from a transaction line item on this payment, if one exists.
   * Removes that line item from this payment. If the given deductible is null, or its linked
   * transaction line item does not belong to this payment, this method does nothing.
   */
  public function unapplyAndRemoveDeductibleLineItem(d : Deductible) {
    if (d == null) {
      return
    }
    var tli = d.TransactionLineItem
    if (tli.Transaction != this) {
      return
    }
    tli.unlinkDeductible()
    this.removeFromLineItemsIfEditable(tli)
  }

  /**
   * Unlinks the deductible pointing to the given line item. The given line item
   * must be a valid deductible line item, or an exception is thrown.
   * Removes the line item from this payment.
   */
  function removeDeductibleLineItem(tli : TransactionLineItem) {
    if (!tli.isDeductibleLineItem()) {
      throw new DisplayableException("Cannot call this method with a TransactionLineItem that is not a deductible line item.")
    }
    tli.unlinkDeductible()
    this.removeFromLineItemsIfEditable(tli)
  }

  /**
   * Links deductible line items in preparation for a transfer or recode if necessary. This method
   * examines the potential deductible line items on this payment, i.e. line items that have a
   * line category of "Deductible" but are not linked to a deductible. For each such line item,
   * if the deductible that it would be linked to exists, is unpaid, unwaived, and has the same currency
   * and claim currency amount as the line item, then the two are linked. Otherwise, no link is made, 
   * and the line item's category is changed to "Former Deductible". This method should only be called 
   * on the onset payment in a recode operation or on the NEW check in a transfer operation, and
   * none of its line items should be linked to deductibles prior to this call.
   */
  public function linkDeductible() {
    for (tli in this.LineItems.where( \ t -> t.LineCategory=="Deductible" && !t.isDeductibleLineItem() )) {
      var deductible = SharedDeductible
      if (deductible != null && !deductible.Paid && !deductible.Waived && deductible.ClaimCurrency == tli.ClaimCurrency && deductible.Amount == -tli.ClaimCurrencyAmount && gw.api.financials.FinancialsUtil.isUseDeductibleHandling()) {
        deductible.linkItem(tli)
      } else {
        tli.LineCategory = "FormerDeductible"
      }
    }
  }
  
  /** 
   * Links former deductible line items in preparation for resubmit if necessary. This method
   * examines the former deductible line items on this payment, i.e. line items that have a
   * line category of "Former Deductible". For each such line item,
   * if the deductible that it would be linked to exists, is unpaid, unwaived, 
   * and has the same amount as the line item, then the former deductible is changed to 
   * deductible and two are linked. Otherwise, no link is made. This method should only 
   * be called before resubmit check operation, and none of its line items should be linked to 
   * deductibles prior to this call.
   */
  public function relinkFormerDeductibleForResubmit() {
    for (tli in this.LineItems.where( \ t -> t.LineCategory == LineCategory.TC_FORMERDEDUCTIBLE )) {
      var deductible = SharedDeductible
      if (deductible != null && !deductible.Paid && !deductible.Waived && deductible.Amount == -tli.Amount && gw.api.financials.FinancialsUtil.isUseDeductibleHandling()) {
        tli.LineCategory = LineCategory.TC_DEDUCTIBLE
        deductible.linkItem( tli )
      } 
    }
  }
        
  /**
   * Gets the validation messages for payments on the check wizard and quick check wizard
   * if payment is not valid, return displaykey.Java.Financials.CheckWizard.Error.Payment.PaymentExceedsReserves
   * if payment line item has deductibles and the amount of deductibles is greater than the amount of
   *    other line items, return displaykey.Deductible.DeductibleAmountExceedsOtherLineItems
   */
  function getCheckWizardPaymentValidationExpression() : String {
    if (!this.Valid) {
      return displaykey.Java.Financials.CheckWizard.Error.Payment.PaymentExceedsReserves
    } else if (this.LineItems.hasMatch( \ t -> t.LineCategory=="Deductible")) {
      if (this.LineItems.where( \ t -> t.LineCategory=="Deductible" ).sum( \ t -> t.TransactionCurrencyAmount.Amount ).abs() > this.LineItems.where( \ t -> t.LineCategory!="Deductible" ).sum( \ t -> t.Amount)) {
        return displaykey.Deductible.DeductibleAmountExceedsOtherLineItems
      }
    }
    return null
  }
}
