package util.financials;

class RecoverySummaryList
{
  private var retFeature : String;
  private var retCostCategory : String;
  private var retCostType : String;
  private var retEstimate : double;
  private var retReceipt : double;
  
  construct(costCat : String, feat : String, type : String, est : double, rec : double)
  {
    retCostCategory = costCat;
    retFeature = feat;
    retCostType = type;
    retEstimate = est;
    retReceipt = rec;  
  }
  
  public property get costCategory() : String{
    return retCostCategory;
  }
  
  public property get costType() : String{
    return retCostType;
  }
  
  public property get feature() : String{
    return retFeature;
  }
  
  public property get estimate() : double{
    return retEstimate;
  }
  
  public property get receipt() : double{
    return retReceipt;
  }
    
}
