<% uses templates.messaging.edw.PartyTemplate %>
<% uses util.StringUtils %>
<% uses templates.messaging.edw.TypeListTemplate %>
<% uses templates.messaging.edw.ClaimOtherCovTemplate %>
<% uses templates.messaging.edw.UserTemplate %>
<%@ params(theclaim : Claim, objStatus : String) %>
<%var partyRelTo = "<PartyRelTo><PublicID>"+theclaim.PublicID+"</PublicID><RelToType>Claim</RelToType></PartyRelTo>"%>
<%var origClaim = theclaim.OriginalVersion as Claim %>
<%var obStatus = (origClaim.CertNumberExt != null and theclaim.CertNumberExt == null) ? "D" : objStatus %>
<% if (theclaim.CertNumberExt != Null or (origClaim.CertNumberExt != Null and theclaim.CertNumberExt == Null)) {%>
  <OtherCoverage>
    <PublicID>cothcp:<%=theclaim.PublicID%></PublicID>
    <ObjectStatus><%=obStatus%></ObjectStatus> 
    <% if (theclaim.CreateTime != null) {%>
      <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(theclaim.CreateTime)%></CreateTime> 
    <%}%>
    <% if (theclaim.UpdateTime != null) {%>
      <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(theclaim.UpdateTime)%></UpdateTime> 
    <%}%>
    <% if (theclaim.CertEffectiveDateExt != null) {%>
      <EffectiveDate><%=theclaim.CertEffectiveDateExt%></EffectiveDate> 
    <%}%>
    <% if (theclaim.CertExpirationDateExt != null) {%>
      <ExpirationDate><%=theclaim.CertExpirationDateExt%></ExpirationDate> 
    <%}%>
    <OtherCovCategory>
      <Code>certificate</Code>
      <Description>certificate</Description>
      <ListName>ClaimOtherInsuranceType</ListName>
    </OtherCovCategory>
    <% if (theclaim.CertNumberExt != null) {%>
      <PolicyNumberExt><%=theclaim.CertNumberExt%></PolicyNumberExt> 
    <%}%>
    <PolicyTypeExt>Certificate</PolicyTypeExt> 

    <Coverages>
    <Coverage>
      <PublicID>cothcc:<%=theclaim.PublicID%></PublicID>
      <ObjectStatus><%=obStatus%></ObjectStatus>
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
      <% if (theclaim.CertGenAggregateLimitExt != null) {%>
          <CoverageLimits>
            <CoverageLimit><%=theclaim.CertGenAggregateLimitExt%></CoverageLimit>
            <LimitBasis>
              <Code>APL</Code>
              <Description>Aggregate Per Policy Term</Description>
              <ListName>LimitBasisExt</ListName>
            </LimitBasis> 
            <LimitApplies>
              <Code>GENAGG</Code>
              <Description>General Aggregate Limit</Description>
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
      <% if (theclaim.CertProdCompAggLimitExt != null) {%>
          <CoverageLimits>
            <CoverageLimit><%=theclaim.CertProdCompAggLimitExt%></CoverageLimit>
            <LimitBasis>
              <Code>AGGPOLIPCO</Code>
              <Description>Aggregate Per Pol Term Including Products and Completed Operations</Description>
              <ListName>LimitBasisExt</ListName>
            </LimitBasis> 
            <LimitApplies>
              <Code>BIANDORPD</Code>
              <Description>Bodily Injury And Or Property Damage</Description>
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
      <% if (theclaim.CertPersAdInjuryAggLimitExt != null) {%>
          <CoverageLimits>
            <CoverageLimit><%=theclaim.CertPersAdInjuryAggLimitExt%></CoverageLimit>
            <LimitBasis>
              <Code>PEROCC</Code>
              <Description>Per Occurrence</Description>
              <ListName>LimitBasisExt</ListName>
            </LimitBasis> 
            <LimitApplies>
              <Code>PERADVINJ</Code>
              <Description>Personal and Advertising Injury</Description>
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
      <% if (theclaim.CertEachOccLimitExt != null) {%>
          <CoverageLimits>
            <CoverageLimit><%=theclaim.CertEachOccLimitExt%></CoverageLimit>
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
      <% if (theclaim.CertDeductibleExt != null) {%>
          <CovDeductibles>
                <CovDeductible>
                    <DeductibleAmt><%=theclaim.CertDeductibleExt%></DeductibleAmt>
      		    <CovDeductCat>
      		      <Code>0</Code>
      		      <Description>none</Description>
      		      <ListName>Deductible Category</ListName>
      		    </CovDeductCat>
      		    <Basis>
      		      <Code>pol</Code>
      		      <Description>Per Policy Term</Description>
      		      <ListName>DeductibleBasisExt</ListName>
      		    </Basis>
                    <% if (theclaim.CertDeductibleAppExt != null) {%>
                         <%=TypeListTemplate.renderToString(theclaim.CertDeductibleAppExt, "Applies", theclaim.CertDeductibleAppExt.ListName)%>
                    <%} else {%>
                       <Applies>
                         <Code>0</Code>
                         <Description>none</Description>
                         <ListName>Deductible Applies To</ListName>
                       </Applies>
                    <%}%>
      		    <DurCat>
      		      <Code>0</Code>
      		      <Description>none</Description>
      		      <ListName>Deductible Duration</ListName>
      		    </DurCat>
      		 </CovDeductible>
          </CovDeductibles>
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

    <% if (theclaim.CertHolderExt != null) { %>
      <% var oirole = "<Role><Code>InsuranceCarrier</Code><Description>Insurance Carrier</Description><ListName>InsuranceCarrier</ListName></Role>"%>
      <%=PartyTemplate.renderToString(theclaim.CertHolderExt, "", objStatus, oirole, "", partyRelTo, theclaim, "", "")%>
    <%}%>
			
    </Parties>
    <% if (theclaim.CertLocationIDExt != null) {%>
      <CertLocationIDExt><%=theclaim.CertLocationIDExt%></CertLocationIDExt> 
    <%}%>
  </OtherCoverage>
<%}%>