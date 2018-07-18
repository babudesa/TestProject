package gw.entity;
uses gw.api.financials.CurrencyAmount
uses java.lang.IllegalStateException

@Export
enhancement GWAssessmentContentItemEnhancement : entity.AssessmentContentItem
{
  function getItemValue(): CurrencyAmount {
    var ItemValue = this.PurchaseCost-this.Salvage-this.Depreciation;
    return ItemValue;
  }

  function denyAssessmentItem() {
    this.Action = "Deny"
  }

  function approveAssessmentItem() {
    this.Action = "approve"
  }

  function associateAssessmentItem(selectedsource: AssessmentSource) {
    this.AssessmentSource = selectedsource;
  }


  function contentItemValue() : CurrencyAmount
  {
    var total : CurrencyAmount = 0;
    if (this.PurchaseCost != Null) {
      total = this.PurchaseCost ;
    }
    if (this.Salvage != Null) {
      total = total - this.Salvage;
    }
    if (this.Depreciation != Null) {
      total = total - this.Depreciation;
    }
    if (total < 0) {
      total = 0;
    }
   
    return total;
  }

  function updateAssessmentSource(myAssessmentSource : AssessmentSource) {    
    if (this.AssessmentSource <> myAssessmentSource) {
      this.AssessmentSource = myAssessmentSource;                
    }
  }
}
