<% uses java.util.SortedMap %>
<%@ params(theclaim : Claim, thepolicy : Policy, objStatus : String, polCoverageTypes : SortedMap<String, String>, eventName : String) %>
<%
uses java.util.SortedMap;
uses java.util.TreeMap;
uses templates.messaging.edw.RiskOpsTemplate
uses templates.messaging.edw.RiskFarmPropertyTemplate
uses templates.messaging.edw.RiskFGLTemplate
uses templates.messaging.edw.RiskAutoTemplate
uses templates.messaging.edw.RiskFarmBusinessTemplate
uses templates.messaging.edw.RiskPropertyTemplate
uses templates.messaging.edw.RiskPIMProcessor
uses templates.messaging.edw.RiskPIMPropertyTemplate
uses templates.messaging.edw.RiskPIMPropJobsTemplate

if (polCoverageTypes != null and polCoverageTypes.size() > 0) {
  for (cvrg in polCoverageTypes.keySet().iterator()) {
    var riskOpsType = polCoverageTypes.get(cvrg);
    var riskCatCode = riskOpsType;
    if (thepolicy.PolicyType.Code == PolicyType.TC_AMP or thepolicy.PolicyType.Code == PolicyType.TC_AMO) {
      riskOpsType = "POL" ;
    }
    var riskCat = "<RiskCat><Code>"
                  + riskCatCode
                  + "</Code><Description>"
                  + riskOpsType
                  + "</Description><ListName>EDWRiskType</ListName></RiskCat>";
%>
<%=RiskOpsTemplate.renderToString(theclaim, thepolicy, objStatus, riskCat, riskOpsType, cvrg, eventName)%>
<%}%>
<%}%>

<% if ((thepolicy.PolicyType.Code != PolicyType.TC_AMP and thepolicy.PolicyType.Code != PolicyType.TC_AMO) and thepolicy.Claim.LossType == LossType.TC_AGRIPROPERTY) {%>
<%=RiskFarmPropertyTemplate.renderToString(theclaim, thepolicy, objStatus, eventName)%>
<%}%>

<%
if ((thepolicy.PolicyType.Code != PolicyType.TC_AMP and thepolicy.PolicyType.Code != PolicyType.TC_AMO) and thepolicy.Claim.LossType == LossType.TC_AGRIPROPERTY) {
  if (thepolicy.Properties != null) {
    for (polprop in thepolicy.Properties) {
      if (polprop != null && polprop typeis PropertyRU
      && polprop.Property != null && polprop.Property.RiskTypeExt.Code != "FRMLOC") {
        var riskCat = "<RiskCat><Code>"
                      + polprop.Property.RiskTypeExt
                      + "</Code><Description>"
                      + polprop.Property.RiskTypeExt
                      + "</Description><ListName>EDWRiskType</ListName></RiskCat>";
        var thelocationnumber : String = polprop.PropertyNumberExt as java.lang.String;
        var actualfrmloc = "";
        for (pp in thepolicy.Properties) {
          if (pp typeis PropertyRU && pp.PropertyNumberExt == polprop.PropertyNumberExt
          && pp.Property.RiskTypeExt != null && pp.Property.RiskTypeExt == "FRMLOC") {
            thelocationnumber = null;
            actualfrmloc = pp.PublicID;
          }
        }
%>
        <%=RiskPropertyTemplate.renderToString(theclaim, thepolicy, polprop, null, objStatus, riskCat, displaykey.EDW.Templates.CVRG, polprop.Property.RiskTypeExt.Code, eventName, actualfrmloc, thelocationnumber)%>
      <%}%>
    <%}%>
  <%}%>
<%}%>

<%
if (thepolicy.PrimaryFarmTypeExt != null or thepolicy.OtherFarmTypeExt != null) {
  var riskCat = "<RiskCat><Code>FRMBUSN</Code><Description>FRMBUSN</Description><ListName>EDWRiskType</ListName></RiskCat>";
%>
<%=RiskFarmBusinessTemplate.renderToString(thepolicy, objStatus, riskCat, displaykey.EDW.Templates.CVRG, "FRMBUSN", eventName)%>
<%}%>

<%=RiskFGLTemplate.renderToString(theclaim, thepolicy, objStatus, eventName)%>

<%=RiskAutoTemplate.renderToString(theclaim, thepolicy, objStatus, eventName)%>

<% if ((thepolicy.PolicyType.Code != PolicyType.TC_AMP and thepolicy.PolicyType.Code != PolicyType.TC_AMO) and thepolicy.Claim.LossType == LossType.TC_PIMINMARINE) {%>
<%=RiskPIMProcessor.renderToString(theclaim, thepolicy, objStatus, eventName)%>
<%}%>

<%
if ((thepolicy.PolicyType.Code != PolicyType.TC_AMP and thepolicy.PolicyType.Code != PolicyType.TC_AMO) and thepolicy.Claim.LossType == LossType.TC_PIMINMARINE) {
  if (thepolicy.Properties != null) {
    for (pimpolprop in thepolicy.Properties) {
      if (pimpolprop != null && pimpolprop typeis PropertyRU
      && pimpolprop.Property != null && pimpolprop.Property.RiskTypeExt.Code != "PRM" && pimpolprop.Property.RiskTypeExt.Code != "BLDG" ) {
        var riskCat = "<RiskCat><Code>"
                      + pimpolprop.Property.RiskTypeExt
                      + "</Code><Description>"
                      + pimpolprop.Property.RiskTypeExt
                      + "</Description><ListName>EDWRiskType</ListName></RiskCat>";
        var thebuildingnumber : String = pimpolprop.Property.BuildingNumberExt;
        var thepremisesnumber : String = pimpolprop.PropertyNumberExt as java.lang.String;
        var actualpremises = "";
        for (pp in thepolicy.Properties) {
          if (pp typeis PropertyRU && pp.PropertyNumberExt == pimpolprop.PropertyNumberExt 
          && pp.Property.RiskTypeExt != null && pp.Property.RiskTypeExt == "PRM") {
            thepremisesnumber = null;
            actualpremises = pp.PublicID;
          }
        }
        var actualbuilding = "";
        for (pp in thepolicy.Properties) {
          if (pp typeis PropertyRU && pp.PropertyNumberExt == pimpolprop.PropertyNumberExt && pp.Property.BuildingNumberExt == thebuildingnumber 
          && pp.Property.RiskTypeExt != null && pp.Property.RiskTypeExt == "BLDG") {
            thebuildingnumber = null;
            actualbuilding = pp.PublicID;
          }
        }
%>
        <%=RiskPIMPropertyTemplate.renderToString(theclaim, thepolicy, pimpolprop, null, objStatus, riskCat, displaykey.EDW.Templates.CVRG, pimpolprop.Property.RiskTypeExt.Code, eventName, actualbuilding, thebuildingnumber, actualpremises, thepremisesnumber)%>
      <%}%>
    <%}%>
  <%}%>
<%}%>
<%
if (thepolicy.Claim.LossType == LossType.TC_PIMINMARINE  and thepolicy.PolicyType.Code == "IMP") {
  if (thepolicy.Properties != null) {
    for (pimpolprop in thepolicy.Properties) {
      if (pimpolprop != null && pimpolprop typeis JobsiteRUExt
      && pimpolprop.Property != null && pimpolprop.Property.RiskTypeExt.Code != "JOBSITE") {
        var riskCat = "<RiskCat><Code>"
                      + pimpolprop.Property.RiskTypeExt
                      + "</Code><Description>"
                      + pimpolprop.Property.RiskTypeExt
                      + "</Description><ListName>EDWRiskType</ListName></RiskCat>";
        var thejobsitenumber: String = pimpolprop.JobsiteNumberExt  as java.lang.String;
        var actualjobsite = "";
        for (pp in thepolicy.Properties) {
          if (pp typeis JobsiteRUExt && pp.JobsiteNumberExt == pimpolprop.JobsiteNumberExt 
          && pp.Property.RiskTypeExt != null && pp.Property.RiskTypeExt == "JOBSITE") {
            thejobsitenumber= null;
            actualjobsite = pp.PublicID;
          }
        }
%>
        <%=RiskPIMPropJobsTemplate.renderToString(theclaim, thepolicy, pimpolprop, null, objStatus, riskCat, displaykey.EDW.Templates.CVRG, pimpolprop.Property.RiskTypeExt.Code, eventName, actualjobsite, thejobsitenumber)%>
      <%}%>
    <%}%>
  <%}%>
<%}%>
