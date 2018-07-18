<% uses util.StringUtils %>
<% uses templates.messaging.edw.TypeListTemplate %>
<% uses templates.messaging.edw.ClaimOtherCovTemplate %>
<% uses templates.messaging.edw.ClaimOthCovTPATemplate %>
<% uses templates.messaging.edw.ClaimOthCovCertificateTemplate %>
<% uses templates.messaging.edw.ClaimOthCovBrokerTemplate %>
<% uses templates.messaging.edw.UserTemplate %>
<%@ params(theclaim : Claim, objStatus : String) %>
<%var partyRelTo = "<PartyRelTo><PublicID>"+theclaim.PublicID+"</PublicID><RelToType>Claim</RelToType></PartyRelTo>"%>
<%var origClaim = theclaim.OriginalVersion as Claim %>
<% if (gw.api.util.ArrayUtil.count(theclaim.UnderlyingCoveragesExt) > 0 or gw.api.util.ArrayUtil.count(theclaim.getRemovedArrayElements("UnderlyingCoveragesExt")) > 0
 or theclaim.AttachmentPointExt > 0 or theclaim.LimitsInsuranceExt > 0 or theclaim.TotAggLimitExt > 0 or (origClaim.AttachmentPointExt > 0 and (theclaim.AttachmentPointExt == 0 or theclaim.AttachmentPointExt == null)) 
 or (origClaim.LimitsInsuranceExt > 0 and (theclaim.LimitsInsuranceExt == 0 or theclaim.LimitsInsuranceExt == null)) or (origClaim.TotAggLimitExt > 0 and (theclaim.TotAggLimitExt == 0 or theclaim.TotAggLimitExt == null))
 or  gw.api.util.ArrayUtil.count(theclaim.ThirdPartyAdminsExt) or gw.api.util.ArrayUtil.count(theclaim.getRemovedArrayElements("ThirdPartyAdminsExt")) > 0
 or  theclaim.CertNumberExt != Null or (origClaim.CertNumberExt != Null and theclaim.CertNumberExt == Null)
 or  theclaim.BrokerPolicyNumberExt != null or (origClaim.BrokerPolicyNumberExt != null and theclaim.BrokerPolicyNumberExt == null)) {%>
<OtherCoverages>
  <% if (theclaim.AttachmentPointExt > 0 or theclaim.LimitsInsuranceExt > 0 or theclaim.TotAggLimitExt > 0 or (origClaim.AttachmentPointExt > 0 and (theclaim.AttachmentPointExt == 0 or theclaim.AttachmentPointExt == null)) or (origClaim.LimitsInsuranceExt > 0 and (theclaim.LimitsInsuranceExt == 0 or theclaim.LimitsInsuranceExt == null)) or (origClaim.TotAggLimitExt > 0 and (theclaim.TotAggLimitExt == 0 or theclaim.TotAggLimitExt == null))  ) {%>
  <OtherCoverage>
    <PublicID>cothd:<%=theclaim.PublicID%></PublicID>
    <ObjectStatus><%=objStatus%></ObjectStatus> 
    <% if (theclaim.CreateTime != null) {%>
      <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(theclaim.CreateTime)%></CreateTime> 
    <%}%>
    <% if (theclaim.UpdateTime != null) {%>
      <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(theclaim.UpdateTime)%></UpdateTime> 
    <%}%>
    <OtherCovCategory>
      <Code>underlying</Code>
      <Description>underlying</Description>
      <ListName>ClaimOtherInsuranceType</ListName>
    </OtherCovCategory>

    <Coverages>
    <Coverage>
      <PublicID>cothdc:<%=theclaim.PublicID%></PublicID>
      <ObjectStatus><%=objStatus%></ObjectStatus>
      <UnVerifiedCoverage>
      <ExposureInd>false</ExposureInd>
      <ClassCodeExt>
        <Code>0</Code>
        <Description>0</Description>
        <ListName>ClassCodeExt</ListName>
      </ClassCodeExt>
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
      <% if (theclaim.AttachmentPointExt != null) {%>
        <CovDeductCat>
          <Code>AMT</Code>
          <Description>AMT</Description>
          <ListName>Deductible Category</ListName>
        </CovDeductCat>
        <CovDeductAmt><%=theclaim.AttachmentPointExt%></CovDeductAmt>
      <%}%> 
      <% if (theclaim.LimitsInsuranceExt != null) {%>
          <CoverageLimits>
            <CoverageLimit><%=theclaim.LimitsInsuranceExt%></CoverageLimit>
            <LimitBasis>
              <Code>qstotallimit</Code>
              <Description>QS Total Limit</Description>
              <ListName>LimitBasisExt</ListName>
            </LimitBasis> 
            <LimitApplies>
              <Code>EACHLOSS</Code>
              <Description>Each Loss</Description>
              <ListName>LimitApplicationExt</ListName>
            </LimitApplies> 	
            <LimitCat>
              <Code>AMT</Code>
              <Description>AMT</Description>
              <ListName>Limit Category</ListName>
            </LimitCat> 	
            <LimitValuation>
              <Code>agreed</Code>
              <Description>agreed</Description>
              <ListName>CoverageBasis</ListName>
            </LimitValuation> 	
          </CoverageLimits>
      <%}%>
      <% if (theclaim.TotAggLimitExt != null) {%>
          <CoverageLimits>
            <CoverageLimit><%=theclaim.TotAggLimitExt%></CoverageLimit>
            <LimitBasis>
              <Code>qstotagg</Code>
              <Description>Quota Share Total Aggregate Limit</Description>
              <ListName>LimitBasisExt</ListName>
            </LimitBasis> 
            <LimitApplies>
              <Code>ALLOSS</Code>
              <Description>All Losses</Description>
              <ListName>LimitApplicationExt</ListName>
            </LimitApplies> 	
            <LimitCat>
              <Code>AMT</Code>
              <Description>AMT</Description>
              <ListName>Limit Category</ListName>
            </LimitCat> 	
            <LimitValuation>
              <Code>--</Code>
              <Description>none</Description>
              <ListName>CoverageBasis</ListName>
            </LimitValuation>               
	  </CoverageLimits>
      <%}%>
      <% if (theclaim.AttachmentPointExt != null) {%>
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
        <DeductiblePurposeExt>
          <Code>attpoint</Code>
          <Description>Attpoint</Description>
          <ListName>DeductiblePurposeExt</ListName>
        </DeductiblePurposeExt>
        <%}%>
        <SubordCoverageIndExt>true</SubordCoverageIndExt>
        </UnVerifiedCoverage>
    </Coverage>		
    </Coverages>
    
    <Parties>
    <% if (theclaim.CreateUser != null ) { %>
      <%=UserTemplate.renderToString(theclaim.CreateUser, "", objStatus, displaykey.EDW.Templates.CreateUserRole, "", partyRelTo)%>
    <%}%>

    <% if (theclaim.UpdateUser != null) { %>
      <%=UserTemplate.renderToString(theclaim.UpdateUser, "", objStatus, displaykey.EDW.Templates.UpdateUserRole, "", partyRelTo)%>
    <%}%>

      <Party>
        <PublicID>cothdi:<%=theclaim.PublicID%></PublicID>
        <ObjectStatus><%=objStatus%></ObjectStatus>
        <% if (theclaim.CreateTime  != null) {%>
        <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(theclaim.CreateTime)%></CreateTime> 
        <%}%>
        <% if (theclaim.UpdateTime  != null) {%>
        <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(theclaim.UpdateTime)%></UpdateTime> 
        <%}%>
        <Role><Code>InsuranceCarrier</Code><Description>Insurance Carrier</Description><ListName>InsuranceCarrier</ListName></Role>
        <Name>default insurance carrier</Name>
        <Organization>
          <PublicID>cothdi:<%=theclaim.PublicID%></PublicID>
          <ObjectStatus><%=objStatus%></ObjectStatus>
          <Name>default insurance carrier</Name>
        </Organization>
      </Party>
			
    </Parties>
  </OtherCoverage>
  <%}%>
  <% if (gw.api.util.ArrayUtil.count(theclaim.UnderlyingCoveragesExt) > 0 ) {%>
    <%for (otherCvrg in theclaim.UnderlyingCoveragesExt) {%>
        <%var oStatus = objStatus;
        if (objStatus == "C" && otherCvrg.New) {
          oStatus = "A"; 
        }%>
        <%=ClaimOtherCovTemplate.renderToString(theclaim, otherCvrg, oStatus, objStatus)%>
    <%}%>  
  <%}%>  
  <% if (gw.api.util.ArrayUtil.count(theclaim.getRemovedArrayElements("UnderlyingCoveragesExt")) > 0 ) {%>
    <%for (delOtherCvrg in theclaim.getRemovedArrayElements("UnderlyingCoveragesExt")) {%>
        <%=ClaimOtherCovTemplate.renderToString(theclaim, delOtherCvrg as UnderlyingCoverageExt, "D", objStatus)%>
    <%}%>  
  <%}%>  
  <% if (gw.api.util.ArrayUtil.count(theclaim.ThirdPartyAdminsExt) > 0 ) {%>
    <%for (tpaCvrg in theclaim.ThirdPartyAdminsExt) {%>
        <%var oiStatus = objStatus;
        if (objStatus == "C" && tpaCvrg.New) {
          oiStatus = "A"; 
        }%>
        <%=ClaimOthCovTPATemplate.renderToString(theclaim, tpaCvrg, oiStatus, objStatus)%>
    <%}%>  
  <%}%>  
  <% if (gw.api.util.ArrayUtil.count(theclaim.getRemovedArrayElements("ThirdPartyAdminsExt")) > 0 ) {%>
    <%for (delTPACvrg in theclaim.getRemovedArrayElements("ThirdPartyAdminsExt")) {%>
        <%=ClaimOthCovTPATemplate.renderToString(theclaim, delTPACvrg as ThirdPartyAdminExt, "D", objStatus)%>
    <%}%>  
  <%}%>  
  <% if (theclaim.CertNumberExt != Null or (origClaim.CertNumberExt != Null and theclaim.CertNumberExt == Null)) {%>
        <%=ClaimOthCovCertificateTemplate.renderToString(theclaim, objStatus)%>
  <%}%> 
  <% if (theclaim.BrokerPolicyNumberExt != null or (origClaim.BrokerPolicyNumberExt != null and theclaim.BrokerPolicyNumberExt == null)) {%>
        <%=ClaimOthCovBrokerTemplate.renderToString(theclaim, objStatus)%>
  <%}%>   
</OtherCoverages>
<%}%>