package gw.entity;

@ReadOnly
enhancement GWMatterEnhancement : Matter
{
  //Create a new BudgetLine record for each BudgetLineType typekeys
  
function createAllBudgetLines() : void {

  if (this.MatterType != null) {   
  foreach (code in LineCategory.getTypeKeys(false))
    {
      if (code.hasCategory(this.MatterType))
         {
           var bLine = new BudgetLine(this);
           bLine.BudgetLineType=code;
           bLine.Matter= this;
           bLine.OriginalEstimate = 0
            
         }
    }
  }
}
}