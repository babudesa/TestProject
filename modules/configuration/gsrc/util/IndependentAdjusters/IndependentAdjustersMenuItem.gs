package util.IndependentAdjusters;

class IndependentAdjustersMenuItem
{
  
  private var _exposure : Exposure
  private var _adjusterType : String
  private var _children : IndependentAdjustersMenuItem[]
  
  construct()
  {
  }
  
  construct(exp : Exposure, cn : IndependentAdjustersMenuItem[]){
    _exposure = exp
    _children = cn
  }
  
  construct(exp: Exposure, adjType : String){
    _exposure = exp
    _adjusterType = adjType
  }
  
  public property get Exposure() : Exposure{
    return _exposure
  }
  
  public property get AdjusterType() : String{
    return _adjusterType
  }
  
  public property get Children() : IndependentAdjustersMenuItem[]{
    return _children
  }
  
  public property get DisplayLabel() : String{
    var name:String
    if(_adjusterType != null){
      for(adj in IndependentAdjusters.getTypeKeys(false)){
        if(adj.Code==_adjusterType){
          name = adj.DisplayName
        }
      }
    } else{
      name = _exposure.DisplayName
    }
    return name
  }
}
