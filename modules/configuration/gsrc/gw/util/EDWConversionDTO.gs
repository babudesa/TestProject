package gw.util
uses java.lang.Integer


 class EDWConversionDTO {
  
 private var loadId:int = 0
 private static var Loadcomandid:String= "0"
 private static  var _noofthreads:Integer=0

construct(id:int)
{
  loadId = id

}

 static property  set  Loadcommandid(lid:String) {
 
   Loadcomandid=lid
 }
  static property set Noofthreads(nthreads:Integer) {
  _noofthreads=nthreads
 }
 
static property get Loadcommandid():String{
   return Loadcomandid
 }
 static property get Noofthreads():Integer{
   return  _noofthreads
 }

 
}
