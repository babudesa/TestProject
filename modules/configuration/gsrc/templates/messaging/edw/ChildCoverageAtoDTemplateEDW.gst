<% uses templates.messaging.edw.CoverageAtoDLimitsTemplate %>
<% uses templates.messaging.edw.CoverageClaimsMadeTemplateEDW %>
<% uses templates.messaging.edw.CoverageDeductiblesTemplateEDW %>
<%@ params(thecoveragesublimit : CoverageBasisLimitExt, objStatus : String, theparentpublicid : String) %>
<%
var thecoverage = thecoveragesublimit.CoverageExt;
var coveragecode = gw.api.util.TypecodeMapperUtil.getTypecodeMapper().getAliasByInternalCode( "CoverageLimitTypeExt", "CoverageRisk", thecoveragesublimit.CoverageLimitTypeExt.Code);
var businesscoveragecode = gw.api.util.TypecodeMapperUtil.getTypecodeMapper().getAliasByInternalCode( "CoverageLimitTypeExt", "EDWChildBusinessCoverageCode", thecoveragesublimit.CoverageLimitTypeExt.Code);
%>
<% if (businesscoveragecode != null and not thecoverage.Policy.Verified) {%>
<Coverage>
  <PublicID><%=thecoveragesublimit.PublicID%>:<%=businesscoveragecode%></PublicID>
  <ObjectStatus><%=objStatus%></ObjectStatus>
  <UnVerifiedCoverage>
    <% if (coveragecode != null) {%>
    <CoverageCode><%=coveragecode%></CoverageCode>
    <%}%>
    <BusinessCoverage>
    <Code><%=businesscoveragecode%></Code>
    <Description><%=coveragecode%></Description>
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
      <Code>SUBLIMIT</Code>
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

    <%=CoverageAtoDLimitsTemplate.renderToString(thecoveragesublimit)%>

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