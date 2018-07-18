package util.IndependentAdjusters;
//uses java.util.Collections
uses java.util.ArrayList

class IndependentAdjustersMenuUtils
{
  construct()
  {
  }
  
  public static function getIndependentAdjustersMenu(c : Claim) : IndependentAdjustersMenuItem[]{
    var adjusterMenu = new ArrayList();
    var expChildren = new ArrayList();
    //var lobType = c.LOBCode;
    
    for(exp in c.Exposures){
      if(exists(iaReport in c.IndepAdjustersExt where iaReport.Exposure==exp)){
        continue;
      }
      for(adjType in IndependentAdjusters.getTypeKeys(false)){
        expChildren.add(new IndependentAdjustersMenuItem(exp, adjType.toString()))
      }
      adjusterMenu.add( new IndependentAdjustersMenuItem(exp, (expChildren as util.IndependentAdjusters.IndependentAdjustersMenuItem[])) )
      expChildren.clear()
    }
    
    return adjusterMenu as util.IndependentAdjusters.IndependentAdjustersMenuItem[]
  }
  
}
