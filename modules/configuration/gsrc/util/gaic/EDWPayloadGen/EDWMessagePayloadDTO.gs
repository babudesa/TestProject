package util.gaic.EDWPayloadGen
uses java.lang.String

class EDWMessagePayloadDTO {
var payload_xml:String=""
var event_Name:String=""
var publicId:String = ""
  construct() {

  }
 property set payload(payloadxml:String) {
   this.payload_xml=payloadxml
 }
  property set eventName(eName:String) {
   this.event_Name=eName
 }
 property set publicIdVal(pubId:String)
 {
   this.publicId = pubId
 }
 property get payload():String{
   return payload_xml
 }
 property get eventName():String{
   return event_Name
 }
 property get publicIdVal():String
 {
   return publicId
 }
}
