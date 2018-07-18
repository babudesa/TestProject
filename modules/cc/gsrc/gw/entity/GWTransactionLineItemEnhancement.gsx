package gw.entity
uses gw.api.util.DisplayableException

@Export
enhancement GWTransactionLineItemEnhancement : TransactionLineItem
{
  /**
   * Returns true if this transaction line item is associated with a deductible, false otherwise.
   * A line item is considered a deductible line item if all of the following hold:
   * 1. Its line category is "Deductible".
   * 2. It is part of a payment transaction (as opposed to some other type of transaction).
   * 3. Its payment's deductible's transaction line item is identical to this.
   */
  public function isDeductibleLineItem() : boolean {
    return (this.LineCategory == "Deductible") && (this.Transaction typeis Payment) && ((this.Transaction as Payment).SharedDeductible.TransactionLineItem == this)
  }
  
  /**
   * Unlinks the deductible entity associated with this line item.
   * Sets this line item's line category to "Other".
   * Throws a UserDisplayableException if this line item is not a deductible line item.
   */
  public function unlinkDeductible() {
    if (!isDeductibleLineItem()) {
      throw new DisplayableException(displaykey.Deductible.Error.CannotRemoveDeductibleFromNonDeductibleTLI)
    }
    this.Deductible.unlink()
    this.LineCategory = "FormerDeductible"
  }

  /**
   * Returns a list of valid line categories for this line item.
   * The full list of line categories is first filtered by its categories.
   * If the line item currently has a line category of "Deductible" or "FormerDeductible", no further filtering is done.
   * Otherwise, "Deductible" and "FormerDeductible" are removed from the list.
   */
  property get ValidLineCategories() : java.util.List<LineCategory> {
    var fullList = (LineCategory as ITypeList).getTypeKeysByCategories({this.Transaction.Exposure.PrimaryCoverage, this.Transaction.CostType, this.Transaction.CostCategory})
    return fullList.where( \ t ->
      (this.LineCategory=="Deductible")
      or (this.LineCategory=="FormerDeductible")
      or (t!=LineCategory.TC_DEDUCTIBLE and t!=LineCategory.TC_FORMERDEDUCTIBLE)
    ).cast( LineCategory )
  }
}
