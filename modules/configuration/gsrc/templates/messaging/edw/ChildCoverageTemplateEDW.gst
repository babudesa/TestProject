<% uses util.StringUtils %>
<% uses templates.messaging.edw.CoverageLimitsEquineTemplate %>
<% uses templates.messaging.edw.CoverageLimitsAgriTemplate %>
<% uses templates.messaging.edw.TypeListTemplate %>
<% uses templates.messaging.edw.CoverageClaimsMadeTemplateEDW %>
<% uses templates.messaging.edw.CoverageDeductiblesTemplateEDW %>
<%@ params(thecoverage : Coverage, objStatus : String, cvrg : String) %>
<%
var parentCode = gw.api.util.TypecodeMapperUtil.getTypecodeMapper().getAliasByInternalCode( "CoverageType", "EDWParentBusinessCoverageCode", thecoverage.Type.Code);
var businessCoverageCode = gw.api.util.TypecodeMapperUtil.getTypecodeMapper().getAliasByInternalCode( "CoverageType", "EDWChildBusinessCoverageCode", thecoverage.Type.Code);

if (parentCode != null and businessCoverageCode != null) {
%>
<Coverage>
  <PublicID><%=thecoverage.PublicID%>:<%=businessCoverageCode%></PublicID>
  <ObjectStatus><%=objStatus%></ObjectStatus>
  <% var verified = thecoverage.Policy.Verified; %>
  <% if (verified) {%>
  <VerifiedCoverage>
    <CoverageEBIInstExt><%=thecoverage.CoverageEBIInstExt%></CoverageEBIInstExt>
    <CoverageEBIExt><%=thecoverage.CoverageEBIExt%></CoverageEBIExt>
    <ClassCodeEBIInstExt><%=thecoverage.ClassCodeEBIInstExt%></ClassCodeEBIInstExt>
    <ClassCodeEBIExt><%=thecoverage.ClassCodeEBIExt%></ClassCodeEBIExt>
  </VerifiedCoverage>
  <%} else {%>
  <UnVerifiedCoverage>
    <CoverageCode><%=StringUtils.getXMLValue(thecoverage.Type.Code, false)%></CoverageCode>
    <BusinessCoverage>
      <Code><%=businessCoverageCode%></Code>
      <Description><%=StringUtils.getXMLValue(businessCoverageCode.toUpperCase(), false)%></Description>
      <ListName>EDWCoverageCode</ListName>
    </BusinessCoverage>
    <ExposureInd>true</ExposureInd>
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
    <% if (thecoverage.Policy.PolicyType.Code == PolicyType.TC_AMP or thecoverage.Policy.PolicyType.Code == PolicyType.TC_AMO) {%>
    <ClassCodeExt>
      <Code>953</Code>
      <Description>953</Description>
      <ListName>ClassCodeExt</ListName>
    </ClassCodeExt>
    <%} else {%>
    <ClassCodeExt>
      <Code><%=thecoverage.ClassCodeExt%></Code>
      <Description><%=thecoverage.ClassCodeExt%></Description>
      <ListName>ClassCodeExt</ListName>
    </ClassCodeExt>
    <%}%>

    <CovCat>
      <Code>CVRG</Code>
      <Description>Coverage</Description>
      <ListName>Coverage Category</ListName>
    </CovCat>
    <CovSubline>
      <Code>0</Code>
      <Description>none</Description>
      <ListName>Subline</ListName>
    </CovSubline>
    <% if (thecoverage.ExcessIndExt != null and thecoverage.ExcessIndExt.Code == "excess" ) {%>     
        <% if (thecoverage.CovAttachmentPointExt != null ) {%>  
            <CovDeductCat>
              <Code>AMT</Code>
              <Description>AMT</Description>
              <ListName>Deductible Category</ListName>
            </CovDeductCat>
            <CovDeductAmt><%=thecoverage.CovAttachmentPointExt%></CovDeductAmt>
        <%}%> 
    <%} else {%>
        <CovDeductCat>
          <Code>0</Code>
          <Description>none</Description>
          <ListName>Deductible Category</ListName>
        </CovDeductCat>    
        <% if (thecoverage.Deductible != null) {%>   
          <CovDeductAmt><%=thecoverage.Deductible.Amount%></CovDeductAmt>
        <%}%>
    <%}%> 

    <% if (thecoverage.Policy.PolicyType.Code == PolicyType.TC_AMP or thecoverage.Policy.PolicyType.Code == PolicyType.TC_AMO) {%>
    <%=CoverageLimitsEquineTemplate.renderToString(thecoverage)%>
    <%} else {%>
    <%=CoverageLimitsAgriTemplate.renderToString(thecoverage)%>
    <%}%>

    <% if (thecoverage.ExcessIndExt != null and thecoverage.ExcessIndExt.Code == "excess" ) {%>     
        <% if (thecoverage.CovAttachmentPointExt != null ) {%>  
            <DurCat>
              <Code>0</Code>
              <Description>none</Description>
              <ListName>Deductible Duration</ListName>
            </DurCat>
            <Basis>
              <Code>occur</Code>
              <Description>Occurrence</Description>
              <ListName>DeductibleBasisExt</ListName>
            </Basis>
            <Applies>
              <Code>eachloss</Code>
              <Description>Each Loss</Description>
              <ListName>DeductApplicationExt</ListName>
            </Applies>
        <%}%>
    <%} else {%>
          <DurCat>
            <Code>0</Code>
            <Description>none</Description>
            <ListName>Deductible Duration</ListName>
          </DurCat>       
         <% if (thecoverage.DeductLimitBasisExt != null) {%>
              <%=TypeListTemplate.renderToString(thecoverage.DeductLimitBasisExt, "Basis", thecoverage.DeductLimitBasisExt.ListName)%>
           <%} else {%>
              <Basis>
                <Code>0</Code>
                <Description>none</Description>
                <ListName>Deductible Basis</ListName>
              </Basis>
           <%}%>
           <% if (thecoverage.DeductLimitAppExt != null) {%>
              <%=TypeListTemplate.renderToString(thecoverage.DeductLimitAppExt, "Applies", thecoverage.DeductLimitAppExt.ListName)%>
           <%} else {%>
              <Applies>
                <Code>0</Code>
                <Description>none</Description>
                <ListName>Deductible Applies To</ListName>
              </Applies>
           <%}%>
    <%}%>
    
    <LimitDurCat>
      <Code>0</Code>
      <Description>none</Description>
      <ListName>Limit Duration</ListName>
    </LimitDurCat>
    
    <%=CoverageClaimsMadeTemplateEDW.renderToString(thecoverage)%>
    <%=CoverageDeductiblesTemplateEDW.renderToString(thecoverage)%>

    <% if (thecoverage.ExcessIndExt != null and thecoverage.ExcessIndExt.Code == "excess" ) {%>     
        <% if (thecoverage.CovAttachmentPointExt != null ) {%> 
            <DeductiblePurposeExt>
              <Code>attpoint</Code>
              <Description>Attpoint</Description>
              <ListName>DeductiblePurposeExt</ListName>
            </DeductiblePurposeExt>
        <%}%>
    <%}%>       
    <% if (thecoverage.ExcessIndExt != null) {%> 
        <% if (thecoverage.ExcessIndExt.Code == "primary") {%>
            <PrimaryIndExt>true</PrimaryIndExt>
        <%} else {%>
            <PrimaryIndExt>false</PrimaryIndExt>
        <%}%>
    <%}%>
    <% if (thecoverage.CoverageLayerTypeExt != null) {%> 
        <% if (thecoverage.CoverageLayerTypeExt.substring( 0, 2 ) == "XS")  {%>
              <ExcessLayerNumberExt><%=thecoverage.CoverageLayerTypeExt.substring( 2, 5 )%></ExcessLayerNumberExt>
        <%}%>
    <%}%>
    <% if (thecoverage.QuotaShareIndExt != null) {%> 
         <%=TypeListTemplate.renderToString(thecoverage.QuotaShareIndExt, "QuotaShareIndExt", thecoverage.QuotaShareIndExt.ListName)%>
    <%}%>
    <% if (thecoverage.CoverageFollowFormExt != null) {%> 
         <CoverageFollowFormExt><%=thecoverage.CoverageFollowFormExt%></CoverageFollowFormExt>
    <%}%>    
  </UnVerifiedCoverage>
  <%}%>
</Coverage>
<%}%>