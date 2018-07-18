<%@ params(theclaim : Claim, thepolicy : Policy, objStatus : String, eventName : String) %>
<%
uses java.util.SortedMap;
uses java.util.TreeMap;
uses java.util.List;
uses java.util.ArrayList;
uses java.lang.Integer;
uses templates.messaging.edw.RiskFarmLocPropertyTemplate

var thefarmlocrisk : SortedMap<Integer, LocationBasedRU> = new TreeMap<Integer, LocationBasedRU>();
var riskType = "FRMLOC";
var thecoverages : List<Coverage> = null;

if (thepolicy.Properties != null) {
  for (thepolicyproperty in thepolicy.Properties) {
    if (thepolicyproperty typeis PropertyRU) {
      thefarmlocrisk.put(thepolicyproperty.PropertyNumberExt, thepolicyproperty);
    }
  }
}

if (thefarmlocrisk != null) {
  for (thelocationnumber in thefarmlocrisk.keySet().iterator()) {
    var therisk = thefarmlocrisk.get(thelocationnumber);

    for (prop in thepolicy.Properties) {
      if (prop typeis PropertyRU) {
        if (thelocationnumber == prop.PropertyNumberExt and prop.Property.RiskTypeExt == "FRMLOC") {
          thecoverages = new ArrayList<Coverage>();
          for (thecoverage in prop.Coverages) {
            thecoverages.add(thecoverage);
          }
          therisk = prop;
        }
      }
    }

    var riskCat = "<RiskCat><Code>"+riskType+"</Code><Description>"+riskType+"</Description><ListName>EDWRiskType</ListName></RiskCat>"
    if (!(therisk.Property.RiskTypeExt != null && therisk.Property.RiskTypeExt == "FRMLOC")) {
      thecoverages = null;
    }
%>
<%=RiskFarmLocPropertyTemplate.renderToString(theclaim, therisk, objStatus, riskCat, displaykey.EDW.Templates.CVRG, riskType, eventName, thelocationnumber as java.lang.String, thecoverages)%>
<%}%>
<%}%>
