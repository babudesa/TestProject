package gw.entity

@Export
enhancement GWCheckDeductibleEnhancement : Check
{
  /**
   * Returns true if the given check contains at least one payment with a deductible line item.
   */
  public function containsDeductible() : boolean {
    for (payment in this.Payments) {
      for (tli in payment.LineItems) {
        if (tli.isDeductibleLineItem()) {
          return true
        }
      }
    }
    return false
  }
  
  /**
   * Finds all the deductible line items for payments on this check, and unlinks them from their
   * deductibles, and sets their line categories to "Other". Typically called in preparation for
   * an operation that causes deductibles to be unpaid but requires the line items to be preserved,
   * e.g. deleting or transferring or stop or void a check or recoding a payment. Since this method can change line
   * categories, it should be called AFTER any onset payments are created, if the onsets should
   * retain the old line categories.
   */
  public function unlinkDeductibles() {
    var payments = this.Group == null ? this.Payments : this.Group.PrimaryCheck.Payments
    for (payment in payments) {
      if (payment.hasDeductibleLineItem()) {
        payment.unlinkDeductible()
      }
      if (payment.OffsetPayment) {
        for (tli in payment.LineItems.where( \ t -> t.LineCategory=="Deductible" )) {
          tli.LineCategory = "FormerDeductible"
        }
      }
    }
  }

  /**
   * Links former deductible line items to deductible for resubmit if necessary.  
   * Also changes the line category of those "Former Deductible" being linked to
   * "Deductible."  i.e. line items that have a line category of "Former Deductible" 
   * but are not linked to a deductible. For each such line item,
   * if the deductible that it would be linked to exists, is unpaid, unwaived, and has 
   * the same amount as the line item, then the former deductible is changed to 
   * deductible and two are linked. Otherwise, no link is made. This method should 
   * only be called before resubmit check operation, and none of its line items should be linked to 
   * deductibles prior to this call.
   */
  public function relinkFormerDeductiblesForResubmit() {
    for (payment in this.Payments) {
      if (payment.hasFormerDeductibleLineItem()) {
        payment.relinkFormerDeductibleForResubmit()
      }
    }
  }

  /**
   * Links deductible line items in preparation for a transfer if necessary. This method
   * examines the potential deductible line items on this check, i.e. line items that have a
   * line category of "Deductible" but are not linked to a deductible. For each such line item,
   * if the deductible that it would be linked to exists, is unpaid, has the same currency
   * as the line item's claim currency and has the same amount as (the negative amount of) the
   * line item, then the two are linked. Otherwise, no link is made, and the line item's
   * category is changed to "Former Deductible". This method should only be called on the NEW check in a
   * transfer operation, and none of its line items should be linked to deductibles prior to this
   * call.
   */
  public function linkDeductibles() {
    for (payment in this.Payments) {
      payment.linkDeductible()
    }
  }

  /**
   * Removes line items from payments on this check that have a line category of "Deductible"
   * but are not true deductible line items. This also removes line items that have a line category of
   * "Former Deductible". This should only be called on a check that is a new
   * clone of another.
   */
  public function removeClonedDeductibleLineItems() {
    for (payment in this.Payments) {
      for (tli in payment.LineItems) {
        tli.Deductible = null
        if ( tli.LineCategory=="Deductible" || tli.LineCategory=="FormerDeductible" ) {
          payment.removeFromLineItemsIfEditable(tli)
        }
      }
    }
  }
    
  /**
   * validates all line items on check, ensure there's no "Former Deductible" line
   * items when you are editing the check through UI.  This method should only be
   * used for editCheckWizard as a validation for the payment step.
   */
  function validateNoFormerDeductibleLineItems() {
    for (var payment in this.getPayments()) {
      //check if any payments have former deductible line items.
      if (payment.hasFormerDeductibleLineItem() ) {
        throw new gw.api.util.DisplayableException(displaykey.Web.NewCheckWizard.NewPaymentDetail.FormerDeductibleLineItemNotAllowed)
      }
    }
  }
}
