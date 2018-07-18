package gaic.webservice.util
uses gw.api.soap.CallHandler
uses gw.api.soap.InboundHeaders
uses gw.api.soap.OutboundHeaders
uses com.gaic.claims.util.security.SSOSecurityHeader
uses javax.xml.namespace.QName

class SSOCallHandler implements CallHandler {

  override function afterRequest(p0 : String, p1 : Object, p2 : InboundHeaders) {
  }

  override function beforeRequest(p0 : String, p1 : Object[], headers : OutboundHeaders) {
    var h = SSOSecurityHeader.createHeaderElement();
    var n = h.ElementName;
    var qn = new QName(n.URI, n.LocalName, n.Prefix);
    headers.setHeader(qn, h.FirstChild);
  }

}
