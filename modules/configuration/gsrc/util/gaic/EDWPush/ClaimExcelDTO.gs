package util.gaic.EDWPush

class ClaimExcelDTO {

var _claimNumber:String="" 
var _claimOrder:String=""
var _claimPublicID:String = ""
var _featurePublicID:String = ""


  construct() {

  }

property set ClaimNumber(clmNo:String) {
   this._claimNumber=clmNo
 }
 property get ClaimNumber():String{
   return _claimNumber
 }
 property set ClaimOrder(clmOrder:String) {
   this._claimOrder=clmOrder
 }
 property get ClaimOrder():String{
   return _claimOrder
 }
  property set ClaimPublicID(clmPublicid:String) {
   this._claimPublicID=clmPublicid
 }
 property get ClaimPublicID():String{
   return _claimPublicID
 }
 
 property set FeaturePublicID(feaPublicid:String) {
   this._featurePublicID=feaPublicid
 }
 property get FeaturePublicID():String{
   return _featurePublicID
 }
}
