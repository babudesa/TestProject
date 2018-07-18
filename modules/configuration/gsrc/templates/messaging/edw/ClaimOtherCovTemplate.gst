<% uses util.StringUtils %>
<% uses templates.messaging.edw.TypeListTemplate %>
<% uses templates.messaging.edw.UserTemplate %>
<%@ params(theclaim : Claim, otherCvrg : UnderlyingCoverageExt, objStatus : String, origStatus : String) %>
<%var partyRelTo = "<PartyRelTo><PublicID>"+theclaim.PublicID+"</PublicID><RelToType>Claim</RelToType></PartyRelTo>"%>
<%var othrcatg = "underlying" %>
<OtherCoverage>
  <PublicID>cothp:<%=otherCvrg.PublicID%></PublicID>
  <ObjectStatus><%=objStatus%></ObjectStatus> 
  <% if (otherCvrg.CreateTime != null) {%>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(otherCvrg.CreateTime)%></CreateTime> 
  <%}%>
  <% if (otherCvrg.UpdateTime != null) {%>
    <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(otherCvrg.UpdateTime)%></UpdateTime> 
  <%}%>
  
  <% if (otherCvrg.EffDateExt != null) {%>
    <EffectiveDate><%=otherCvrg.EffDateExt%></EffectiveDate> 
  <%}%>
  <% if (otherCvrg.ExpDateExt != null) {%>
    <ExpirationDate><%=otherCvrg.ExpDateExt%></ExpirationDate> 
  <%}%>
  <% if (otherCvrg.UnderLayerTypeExt != null) {  
       if (otherCvrg.UnderLayerTypeExt.substring( 0, 2 ) == "XS") { 
          othrcatg= "excess"
       } else if (otherCvrg.PartTypeIndExt != null or otherCvrg.PartPctExt != null )  { 
          othrcatg= "quotashare"
       }
     } else if (otherCvrg.PartTypeIndExt != null or otherCvrg.PartPctExt != null )  {
          othrcatg= "quotashare"
     }%>
  <OtherCovCategory>
    <Code><%=othrcatg%></Code>
    <Description><%=othrcatg%></Description>
    <ListName>ClaimOtherInsuranceType</ListName>
  </OtherCovCategory>
  <% if (otherCvrg.PolicyNumberExt != null) {%>
    <PolicyNumberExt><%=otherCvrg.PolicyNumberExt%></PolicyNumberExt> 
  <%}%>
  <% if (otherCvrg.PolicyTypeExt != null) {%>
    <PolicyTypeExt><%=otherCvrg.PolicyTypeExt.Description%></PolicyTypeExt> 
  <%}%>

  <Coverages>
  <Coverage>
    <PublicID>cothc:<%=otherCvrg.PublicID%></PublicID>
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
    <% if (otherCvrg.DeductAttExt != null) {%>
        <CovDeductCat>
          <Code>AMT</Code>
          <Description>AMT</Description>
          <ListName>Deductible Category</ListName>
        </CovDeductCat>
        <CovDeductAmt><%=otherCvrg.DeductAttExt%></CovDeductAmt>
    <%}%> 
    <% if (otherCvrg.OccLimitExt != null) {%>
        <CoverageLimits>
          <CoverageLimit><%=otherCvrg.OccLimitExt%></CoverageLimit>
          <LimitBasis>
            <Code>PEROCC</Code>
            <Description>Per Occurrence</Description>
            <ListName>LimitBasisExt</ListName>
          </LimitBasis> 
          <LimitApplies>
            <Code>EACHOCC</Code>
            <Description>Each Occurrence</Description>
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
    <% if (otherCvrg.AggregateLimitExt != null) {%>
        <CoverageLimits>
          <CoverageLimit><%=otherCvrg.AggregateLimitExt%></CoverageLimit>
          <LimitBasis>
            <Code>APL</Code>
            <Description>Aggregate per Policy Term</Description>
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
    <% if (otherCvrg.PartPctExt != null) {%>
        <CoverageLimits>
          <LimitBasis>
            <Code>qsparticipantpercent</Code>
            <Description>QS Participant Percent</Description>
            <ListName>LimitBasisExt</ListName>
          </LimitBasis> 
          <LimitApplies>
            <Code>EACHLOSS</Code>
            <Description>Each Loss</Description>
            <ListName>LimitApplicationExt</ListName>
          </LimitApplies> 	
          <LimitCat>
            <Code>PCNT</Code>
            <Description>PCNT</Description>
            <ListName>Limit Category</ListName>
          </LimitCat> 	
          <LimitValuation>
            <Code>agreed</Code>
            <Description>agreed</Description>
            <ListName>CoverageBasis</ListName>
          </LimitValuation>
          <CoverageLimitPcnt><%=otherCvrg.PartPctExt%></CoverageLimitPcnt> 	
        </CoverageLimits>
    <%}%>
    <% if (otherCvrg.DeductAttExt != null) {%>
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
      <% if (otherCvrg.UnderLayerTypeExt != null) {%> 
          <% if (otherCvrg.UnderLayerTypeExt == "Prim") {%>
              <DeductiblePurposeExt>
                  <Code>standard</Code>
                  <Description>Standard</Description>
                  <ListName>DeductiblePurposeExt</ListName>
              </DeductiblePurposeExt>
          <%} else  {%>
                <DeductiblePurposeExt>
                  <Code>attpoint</Code>
                  <Description>Attpoint</Description>
                  <ListName>DeductiblePurposeExt</ListName>
                </DeductiblePurposeExt>
          <%}%>
      <%} else  {%>
            <DeductiblePurposeExt>
               <Code>attpoint</Code>
               <Description>Attpoint</Description>
               <ListName>DeductiblePurposeExt</ListName>
            </DeductiblePurposeExt>
      <%}%>
    <%}%>

    <% if (otherCvrg.UnderLayerTypeExt != null) {%> 
      <% if (otherCvrg.UnderLayerTypeExt == "Prim") {%>
          <PrimaryIndExt>true</PrimaryIndExt>
      <%} else if (otherCvrg.UnderLayerTypeExt.substring( 0, 2 ) == "XS")  {%>
          <PrimaryIndExt>false</PrimaryIndExt>
          <ExcessLayerNumberExt><%=otherCvrg.UnderLayerTypeExt.substring( 2, 5 )%></ExcessLayerNumberExt>
      <%}%>
    <%}%>
    <% if (otherCvrg.PartTypeIndExt != null) {%>
      <%=TypeListTemplate.renderToString(otherCvrg.PartTypeIndExt, "QuotaShareIndExt", otherCvrg.PartTypeIndExt.ListName)%>
    <%}%>
    <% if (otherCvrg.UnderCvgDescExt != null) {%>
      <CoverageTypeExt><%=otherCvrg.UnderCvgDescExt.Description%></CoverageTypeExt> 
    <%}%>
    <SubordCoverageIndExt>true</SubordCoverageIndExt>
    </UnVerifiedCoverage>
  </Coverage>		
  </Coverages>
  
  <Parties>
  <% if (otherCvrg.CreateUser != null ) { %>
    <%=UserTemplate.renderToString(otherCvrg.CreateUser, "", objStatus, displaykey.EDW.Templates.CreateUserRole, "", partyRelTo)%>
  <%}%>

  <% if (otherCvrg.UpdateUser != null) { %>
    <%=UserTemplate.renderToString(otherCvrg.UpdateUser, "", objStatus, displaykey.EDW.Templates.UpdateUserRole, "", partyRelTo)%>
  <%}%>
  <% if (otherCvrg.CompanyExt != null) { %>
    <Party>
      <PublicID>cothi:<%=otherCvrg.PublicID%></PublicID>
      <ObjectStatus><%=objStatus%></ObjectStatus>
      <% if (otherCvrg.CreateTime  != null) {%>
      <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(otherCvrg.CreateTime)%></CreateTime> 
      <%}%>
      <% if (otherCvrg.UpdateTime  != null) {%>
      <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(otherCvrg.UpdateTime)%></UpdateTime> 
      <%}%>
      <Role><Code>InsuranceCarrier</Code><Description>Insurance Carrier</Description><ListName>InsuranceCarrier</ListName></Role>
      <Name><%=StringUtils.getXMLValue(otherCvrg.CompanyExt, false)%></Name>
      <Organization>
        <PublicID>cothi:<%=otherCvrg.PublicID%></PublicID>
        <ObjectStatus><%=objStatus%></ObjectStatus>
        <Name><%=StringUtils.getXMLValue(otherCvrg.CompanyExt, false)%></Name>
      </Organization>
    </Party>
  <%}%>			
  </Parties>
  </OtherCoverage>