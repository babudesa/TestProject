<% uses templates.messaging.edw.CoverageClaimsMadeTemplateEDW %>
<% uses templates.messaging.edw.CoverageDeductiblesTemplateEDW %>
<%@ params(thecoverage : Coverage, thecauseofloss : CauseOfLoss, therisktype : String, objStatus : String, theparentpublicid : String) %>
<%
var coveragecode = gw.api.util.TypecodeMapperUtil.getTypecodeMapper().getAliasByInternalCode( "CauseOfLoss", "CoverageRisk", thecauseofloss.Code);
var thebusinesscoveragecode = coveragecode + "." + therisktype;
%>
<% if (coveragecode != null and therisktype != null and not thecoverage.Policy.Verified) { %>
<Coverage>
  <PublicID><%=thecoverage.PublicID%>:<%=thebusinesscoveragecode%></PublicID>
  <ObjectStatus><%=objStatus%></ObjectStatus>
  <UnVerifiedCoverage>
    <% if (thebusinesscoveragecode != null) {%>
    <CoverageCode><%=thebusinesscoveragecode%></CoverageCode>
    <%}%>
    <BusinessCoverage>
    <Code><%=thebusinesscoveragecode%></Code>
    <Description><%=thebusinesscoveragecode%></Description>
    <ListName>EDWCoverageCode</ListName>
    </BusinessCoverage>
    <ExposureInd>false</ExposureInd>
    <% if (thecoverage.EffectiveDate != null) {%>
    <EffectiveDate><%=thecoverage.EffectiveDate%></EffectiveDate> 
    <%} else {%>
    <EffectiveDate><%=thecoverage.Policy.EffectiveDate%></EffectiveDate> 
    <%}%>

    <% if (thecoverage.ExpirationDate != null) {%>
    <ExpirationDate><%=thecoverage.ExpirationDate%></ExpirationDate>  
    <%} else {%>
    <ExpirationDate><%=thecoverage.Policy.ExpirationDate%></ExpirationDate> 
    <%}%>
    <% if (thecoverage.ClassCodeExt != null) {%>
    <ClassCodeExt>
      <Code><%=thecoverage.ClassCodeExt%></Code>
      <Description><%=thecoverage.ClassCodeExt%></Description>
      <ListName>ClassCodeExt</ListName>
    </ClassCodeExt>
    <%} else {%>
    <ClassCodeExt>
      <Code>953</Code>
      <Description>953</Description>
      <ListName>ClassCodeExt</ListName>
    </ClassCodeExt>
    <%}%>

    <CovCat>
      <Code>CL</Code>
      <Description>Coverage</Description>
      <ListName>Coverage Category</ListName>
    </CovCat>
    <CovSubline>
      <Code>0</Code>
      <Description>none</Description>
      <ListName>Subline</ListName>
    </CovSubline>
    <CovDeductCat>
      <Code>0</Code>
      <Description>none</Description>
      <ListName>Deductible Category</ListName>
    </CovDeductCat>

    <DurCat>
      <Code>0</Code>
      <Description>none</Description>
      <ListName>Deductible Duration</ListName>
    </DurCat>
    <Basis>
      <Code>0</Code>
      <Description>none</Description>
      <ListName>Deductible Basis</ListName>
    </Basis>
    <Applies>
      <Code>0</Code>
      <Description>none</Description>
      <ListName>Deductible Applies To</ListName>
    </Applies>
    <LimitDurCat>
      <Code>0</Code>
      <Description>none</Description>
      <ListName>Limit Duration</ListName>
    </LimitDurCat>

    <% if (theparentpublicid != null) {%>
    <RelToCoverage><%=theparentpublicid%></RelToCoverage>
    <%}%>
    
    <%=CoverageClaimsMadeTemplateEDW.renderToString(thecoverage)%>
    <%=CoverageDeductiblesTemplateEDW.renderToString(thecoverage)%>
    
  </UnVerifiedCoverage>
</Coverage>
<%}%>