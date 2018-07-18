package gaic.webservice
uses gw.util.EDWConversionDTO
@WebService
class EnvironmentParamSetAPI {

  construct() {

  }
  public static var threadCount:String = null
  public static var loadComandId:String = null
  
 public function setParameter(loadComdId:String, threadCnt:String):void{
  EDWConversionDTO.Loadcommandid = loadComdId
  EDWConversionDTO.Noofthreads = threadCnt as java.lang.Integer
 
}


}
