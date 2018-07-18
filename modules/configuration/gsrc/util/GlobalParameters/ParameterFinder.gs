package util.GlobalParameters;

class ParameterFinder
{
  construct()
  {
  }
  static function getUserParameter(fieldName: GlobalParamNameExt, lossType:LossType):User{
    var resultVal:GlobalParameterExt;
    var returnVal:User;
    var result = find(val in GlobalParameterExt where val.LossTypeExt == lossType and val.FieldNameExt == fieldName )
    if(result.getCount() > 0){
      resultVal = result.getAtMostOneRow();
      if(resultVal.UserExt != null){
        returnVal = resultVal.UserExt; 
      }
    }
    if(returnVal == null){
      result = find(val in GlobalParameterExt where val.LossTypeExt == null and val.FieldNameExt == fieldName) 
      if(result.getCount() > 0){
        resultVal = result.getAtMostOneRow();
        if(resultVal.UserExt != null){
          returnVal = resultVal.UserExt; 
        }
      } 
    }
    return returnVal;

  }//end getParameter()
  
    static function getGroupParameter(fieldName: GlobalParamNameExt, lossType:LossType):Group{
  var resultVal:GlobalParameterExt;
  var returnVal:Group;
  var result = find(val in GlobalParameterExt where val.LossTypeExt == lossType and val.FieldNameExt == fieldName )
  if(result.getCount() > 0){
    resultVal = result.getAtMostOneRow();
    if(resultVal.GroupExt != null){
      returnVal = resultVal.GroupExt; 
    }
  }
  if(returnVal == null){
    result = find(val in GlobalParameterExt where val.LossTypeExt == null and val.FieldNameExt == fieldName) 
    if(result.getCount() > 0){
      resultVal = result.getAtMostOneRow();
      if(resultVal.GroupExt != null){
        returnVal = resultVal.GroupExt; 
      }
    } 
  }
  return returnVal;
  }//end getParameter()
}//end Class


