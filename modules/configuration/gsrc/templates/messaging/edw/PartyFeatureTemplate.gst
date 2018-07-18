<% uses templates.messaging.edw.TypeListTemplate %>
<% uses util.WCHelper %>

<%@ params(theContact : Contact, theclaim : Claim) %>
<%  var medexposure : Exposure
    var indemexposure : Exposure 
    var vocabexposure : Exposure 
    var eliabexposure : Exposure %>

<% if(theclaim.Exposures.HasElements){

  var mexposures = theclaim.Exposures.where(\ m -> m.ExposureType == "wc_medical_details" )
  medexposure = mexposures.first();

  var iexposures = theclaim.Exposures.where(\ i -> i.ExposureType == "wc_indemnity_timeloss" )
  indemexposure = iexposures.first();
  
  var vexposures = theclaim.Exposures.where(\ v -> v.ExposureType == "wc_vocational_rehab" )
  vocabexposure = vexposures.first();
  
  var eexposures = theclaim.Exposures.where(\ e -> e.ExposureType == "wc_employers_liability" )
  eliabexposure = eexposures.first();
%>
<%
  var contactProhibited = theclaim.getClaimContact(theclaim.claimant).ContactProhibited;
  if (contactProhibited != null) { %>
        <ContactProhibited><%=contactProhibited%></ContactProhibited> 
  <%}%>
  <% if (theclaim.InjuredWorker.MinorWorkerExt != null) {%>
    <MinorChildExt><%=theclaim.InjuredWorker.MinorWorkerExt%></MinorChildExt> 
  <%}%>  
  
  <% if(medexposure != null and medexposure.InjuryNatureDescExt != null) { %>
     <Description><%=medexposure.InjuryNatureDescExt%></Description>
  <%} else if (eliabexposure != null and eliabexposure.InjuryNatureDescExt != null) { %>
        <Description><%=eliabexposure.InjuryNatureDescExt%></Description>
  <%}%>
    
  <% if(indemexposure != null and indemexposure.WCImpairmentExt != null) { %>
     <Impairment><%=indemexposure.WCImpairmentExt%></Impairment>
  <%}%>
  
  <% if (indemexposure != null and indemexposure.ImpairPercBasisExt != null) {%>
    <%=TypeListTemplate.renderToString(indemexposure.ImpairPercBasisExt, "ImpairPercBasisExt", indemexposure.ImpairPercBasisExt.ListName)%>
  <%}%>
  
<%}%>