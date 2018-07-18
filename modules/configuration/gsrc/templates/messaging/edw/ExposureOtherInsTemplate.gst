<% uses templates.messaging.edw.TypeListTemplate %>
<% uses templates.messaging.edw.UserTemplate %>
<% uses util.StringUtils %>
<%@ params(exposure : Exposure, objStatus : String) %>
<%var partyRelTo = "<PartyRelTo><PublicID>"+exposure.PublicID+"</PublicID><RelToType>Feature</RelToType></PartyRelTo>"%>

<%var obStatus = (exposure.AppliesToCertAggLimitExt == true) ? "D" : objStatus %>

<% if (exposure.SIRsExt != null)  {%>
<OtherInsurance>
<% if ((exposure.Claim.LossType == LossType.TC_SPECIALTYES) and (exposure.ExposureType.Code == "sp_bodily_injury" or exposure.ExposureType.Code == "sp_contractual" 
    or exposure.ExposureType.Code == "sp_identity_theft" or exposure.ExposureType.Code == "sp_medical_payment" or exposure.ExposureType.Code == "sp_personal_injury"
    or exposure.ExposureType.Code == "sp_product_withdrwl" or exposure.ExposureType.Code == "sp_property_damage" 
    or (exposure.ExposureType.Code == "sp_special_form" and (exposure.Claim.Policy.PolicyType.Code != "PRC" and exposure.Claim.Policy.PolicyType.Code != "PRX" )))) {%>
        <PublicID>othes:<%=exposure.PublicID%></PublicID>
<% } else  { %>
        <PublicID>othec:<%=exposure.PublicID%></PublicID>
<%}%>
  <ObjectStatus><%=objStatus%></ObjectStatus> 
  <% if (exposure.CreateTime != null) {%>
  <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(exposure.CreateTime)%></CreateTime> 
  <%}%>
  <% if (exposure.UpdateTime != null) {%>
  <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(exposure.UpdateTime)%></UpdateTime> 
  <%}%>
  <Category>
    <Code>SIR</Code>
    <Description>SIR</Description>
    <ListName>Other Ins Type</ListName>
  </Category>
  <Coverages>
    <Coverage>
    <% if ((exposure.Claim.LossType == LossType.TC_SPECIALTYES) and (exposure.ExposureType.Code == "sp_bodily_injury" or exposure.ExposureType.Code == "sp_contractual" 
        or exposure.ExposureType.Code == "sp_identity_theft" or exposure.ExposureType.Code == "sp_medical_payment" or exposure.ExposureType.Code == "sp_personal_injury"
        or exposure.ExposureType.Code == "sp_product_withdrwl" or exposure.ExposureType.Code == "sp_property_damage" 
        or (exposure.ExposureType.Code == "sp_special_form" and (exposure.Claim.Policy.PolicyType.Code != "PRC" and exposure.Claim.Policy.PolicyType.Code != "PRX" )))) {%>
            <PublicID>cothes:<%=exposure.PublicID%></PublicID>
    <% } else  { %>
            <PublicID>cothec:<%=exposure.PublicID%></PublicID>
    <%}%>
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
    <% if (exposure.SIRsExt.CovPartLimOcc != null) {%>
        <CoverageLimits>
          <% if (exposure.SIRsExt.CovPartLimOcc != null) {%>
              <CoverageLimit><%=exposure.SIRsExt.CovPartLimOcc.Amount%></CoverageLimit>
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
          <%}%>         
        </CoverageLimits>
    <%}%>
    <CovDeductibles>
      <CovDeductible>
        <DeductibleAmt><%=exposure.SIRsExt.SIR.Amount%></DeductibleAmt>
  	  <CovDeductCat>
  	    <Code>0</Code>
  	    <Description>none</Description>
  	    <ListName>Deductible Category</ListName>
  	  </CovDeductCat>
        <Applies>
          <Code>eachloss</Code>
          <Description>Each Loss</Description>
          <ListName>DeductApplicationExt</ListName>
        </Applies>
        <DeductiblePurposeExt>
          <Code>sir</Code>
          <Description>SIR</Description>
          <ListName>DeductiblePurposeExt</ListName>
        </DeductiblePurposeExt>
      </CovDeductible>
      <CovDeductible>
        <DeductibleAmt><%=exposure.SIRsExt.SIRAggregate.Amount%></DeductibleAmt>
  	  <CovDeductCat>
  	    <Code>0</Code>
  	    <Description>none</Description>
  	    <ListName>Deductible Category</ListName>
  	  </CovDeductCat>
        <Applies>
          <Code>aggregatealllosses</Code>
          <Description>Aggregate all Losses</Description>
          <ListName>DeductApplicationExt</ListName>
        </Applies>    	
  	  <DeductiblePurposeExt>
          <Code>sir</Code>
          <Description>SIR</Description>
          <ListName>DeductiblePurposeExt</ListName>
        </DeductiblePurposeExt>
      </CovDeductible>     
      <% if (exposure.SIRsExt.MaintenanceSIR != null) {%>
        <CovDeductible>
          <DeductibleAmt><%=exposure.SIRsExt.MaintenanceSIR.Amount%></DeductibleAmt>
  	    <CovDeductCat>
  	      <Code>0</Code>
  	      <Description>none</Description>
  	      <ListName>Deductible Category</ListName>
  	    </CovDeductCat>
          <Applies>
            <Code>eachloss</Code>
            <Description>Each Loss</Description>
            <ListName>DeductApplicationExt</ListName>
          </Applies>
  	    <DeductiblePurposeExt>
            <Code>maintenancesir</Code>
            <Description>MAINTSIR</Description>
            <ListName>DeductiblePurposeExt</ListName>
          </DeductiblePurposeExt>
        </CovDeductible>             
        <%}%>           
    </CovDeductibles>
      <CoverageTypeExt><%=exposure.SIRsExt.InsuringAgreementExt.Description%></CoverageTypeExt>
      <SubordCoverageIndExt>true</SubordCoverageIndExt>
      </UnVerifiedCoverage>
    </Coverage>		
  </Coverages>
  
  <Parties>
  <% if (exposure.CreateUser != null ) { %>
  <%=UserTemplate.renderToString(exposure.CreateUser, "", objStatus, displaykey.EDW.Templates.CreateUserRole, "", partyRelTo)%>
  <%}%>

  <% if (exposure.UpdateUser != null) {%>
  <%=UserTemplate.renderToString(exposure.UpdateUser, "", objStatus, displaykey.EDW.Templates.UpdateUserRole, "", partyRelTo)%>
  <%}%>
  </Parties>
</OtherInsurance>
<%} %>

<%var origExp = exposure.OriginalVersion as Exposure %>
<% if (exposure.AppliesToCertAggLimitExt == false || (exposure.AppliesToCertAggLimitExt == true and origExp.AppliesToCertAggLimitExt == false)) {%>
<OtherInsurance>
<% if ((exposure.ExposureType.Code == "sp_special_form" and (exposure.Claim.Policy.PolicyType.Code == "PRC" or exposure.Claim.Policy.PolicyType.Code == "PRX" ))) {%>
        <PublicID>othee:<%=exposure.PublicID%></PublicID>
<% } else  { %>
        <PublicID>othec:<%=exposure.PublicID%></PublicID>
<%}%>
  <ObjectStatus><%=obStatus%></ObjectStatus> 
  <% if (exposure.CreateTime != null) {%>
  <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(exposure.CreateTime)%></CreateTime> 
  <%}%>
  <% if (exposure.UpdateTime != null) {%>
  <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(exposure.UpdateTime)%></UpdateTime> 
  <%}%>
  <Category>
    <Code>certificate</Code>
    <Description>Certificate</Description>
    <ListName>Other Ins Type</ListName>
  </Category>
  <Coverages>
    <Coverage>
      <% if ((exposure.ExposureType.Code == "sp_special_form" and (exposure.Claim.Policy.PolicyType.Code == "PRC" or exposure.Claim.Policy.PolicyType.Code == "PRX" ))) {%>
            <PublicID>cothee:<%=exposure.PublicID%></PublicID>
      <%} else  { %>
            <PublicID>cothec:<%=exposure.PublicID%></PublicID>
      <%}%>
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
      <% if (exposure.CertSublimitAggregateExt != null) {%>
          <CoverageLimits>
            <CoverageLimit><%=exposure.CertSublimitAggregateExt%></CoverageLimit>
            <LimitBasis>
              <Code>APL</Code>
              <Description>Aggregate per Policy Term</Description>
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
      <% if (exposure.CertSublimitExt != null) {%>
          <CoverageLimits>
            <CoverageLimit><%=exposure.CertSublimitExt%></CoverageLimit>
            <LimitBasis>
              <Code>POL</Code>
              <Description>Per Policy Term</Description>
              <ListName>LimitBasisExt</ListName>
            </LimitBasis> 
            <% if (exposure.CertSublimitAppExt != null) {%>
                  <%=TypeListTemplate.renderToString(exposure.CertSublimitAppExt, "LimitApplies", exposure.CertSublimitAppExt.ListName)%>
            <%} else {%>
                  <LimitApplies>
                     <Code>--</Code>
                     <Description>none</Description>
                     <ListName>LimitApplicationExt</ListName>
                  </LimitApplies>
            <%}%>
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
      <% if (exposure.CertSublimitDeductibleExt != null) {%>
        <CovDeductibles>
          <CovDeductible>
          <DeductibleAmt><%=exposure.CertSublimitDeductibleExt%></DeductibleAmt>
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
          <% if (exposure.CertSublimitDeductibleAppExt != null) {%>
            <%=TypeListTemplate.renderToString(exposure.CertSublimitDeductibleAppExt, "Applies", exposure.CertSublimitDeductibleAppExt.ListName)%>
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
      <% if (exposure.CertCoverageDescExt != null) {%>
          <CoverageTypeExt><%=exposure.CertCoverageDescExt%></CoverageTypeExt>
      <%} %>
      <SubordCoverageIndExt>true</SubordCoverageIndExt>
      </UnVerifiedCoverage>
    </Coverage>		
  </Coverages>
  
  <Parties>
  <% if (exposure.CreateUser != null ) { %>
  <%=UserTemplate.renderToString(exposure.CreateUser, "", objStatus, displaykey.EDW.Templates.CreateUserRole, "", partyRelTo)%>
  <%}%>

  <% if (exposure.UpdateUser != null) {%>
  <%=UserTemplate.renderToString(exposure.UpdateUser, "", objStatus, displaykey.EDW.Templates.UpdateUserRole, "", partyRelTo)%>
  <%}%>
  </Parties>
</OtherInsurance>
  <%}%>