<% uses templates.messaging.edw.PartyTemplate %>
<% uses templates.messaging.edw.ExposureOtherInsTemplate %>
<% uses templates.messaging.edw.UserTemplate %>
<% uses util.StringUtils %>
<%@ params(exposure : Exposure, objStatus : String) %>
<%var partyRelTo = "<PartyRelTo><PublicID>"+exposure.PublicID+"</PublicID><RelToType>Feature</RelToType></PartyRelTo>"%>
<%var origExp = exposure.OriginalVersion as Exposure %>
<% if (gw.api.util.ArrayUtil.count(exposure.OtherCoverageDet) > 0 || (exposure.MethodOfSettlementExt != null && exposure.MethodOfSettlementExt.Code == "structured_settle")
       || (exposure.AppliesToCertAggLimitExt == false || (exposure.AppliesToCertAggLimitExt == true and origExp.AppliesToCertAggLimitExt == false) || (exposure.SIRsExt != null) ) ) {%>
<OtherInsurances>
  <% if (gw.api.util.ArrayUtil.count(exposure.OtherCoverageDet) > 0) { %>
  <%for (otherIns in exposure.OtherCoverageDet) {%>
  <OtherInsurance>
    <PublicID><%=otherIns.PublicID%></PublicID>
    <ObjectStatus><%=objStatus%></ObjectStatus> 
    <% if (otherIns.CreateTime != null) {%>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(otherIns.CreateTime)%></CreateTime> 
    <%}%>
    <% if (otherIns.UpdateTime != null) {%>
    <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(otherIns.UpdateTime)%></UpdateTime> 
    <%}%>
    <Category>
      <Code>Other Coverage</Code>
      <Description>Other Coverage</Description>
      <ListName>Other Ins Type</ListName>
    </Category>
    <% if (otherIns.PolicyNumber != null) {%>
    <PolicyNumber><%=otherIns.PolicyNumber%></PolicyNumber> 
    <%}%>
    <% if (otherIns.Notes != null) {%>
    <Notes><%=otherIns.Notes%></Notes> 
    <%}%>

    <Parties>
    <% if (otherIns.CreateUser != null ) { %>
    <%=UserTemplate.renderToString(otherIns.CreateUser, "", objStatus, displaykey.EDW.Templates.CreateUserRole, "", partyRelTo)%>
    <%}%>

    <% if (otherIns.UpdateUser != null) { %>
    <%=UserTemplate.renderToString(otherIns.UpdateUser, "", objStatus, displaykey.EDW.Templates.UpdateUserRole, "", partyRelTo)%>
    <%}%>
    <% if (otherIns.Insurer != null) { %>
    <Party>
      <PublicID>othi:<%=otherIns.PublicID%></PublicID>
      <ObjectStatus><%=objStatus%></ObjectStatus>
      <% if (otherIns.CreateTime  != null) {%>
      <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(otherIns.CreateTime)%></CreateTime> 
      <%}%>
      <% if (otherIns.UpdateTime  != null) {%>
      <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(otherIns.UpdateTime)%></UpdateTime> 
      <%}%>
      <Role><Code>InsuranceCarrier</Code><Description>Insurance Carrier</Description><ListName>InsuranceCarrier</ListName></Role>
      <Name><%=StringUtils.getXMLValue(otherIns.Insurer, false)%></Name>
      <Organization>
        <PublicID>othi:<%=otherIns.PublicID%></PublicID>
        <ObjectStatus><%=objStatus%></ObjectStatus>
        <Name><%=StringUtils.getXMLValue(otherIns.Insurer, false)%></Name>
      </Organization>
    </Party>
    <%}%>	
    <% if (otherIns.ContactName != null) { %>
    <Party>
      <PublicID>othc:<%=otherIns.PublicID%></PublicID>
      <ObjectStatus><%=objStatus%></ObjectStatus>
      <% if (otherIns.CreateTime  != null) {%>
      <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(otherIns.CreateTime)%></CreateTime> 
      <%}%>
      <% if (otherIns.UpdateTime  != null) {%>
      <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(otherIns.UpdateTime)%></UpdateTime> 
      <%}%>
      <Role><Code>insuranceParty</Code><Description>Contact at Insurance Carrier</Description><ListName>insuranceParty</ListName></Role>
      <Name><%=StringUtils.getXMLValue(otherIns.ContactName, false)%></Name>
      <% if (otherIns.ContactPhone != null) {%>
      <Phones>
        <%
        var ext = 0;
        var cntr = 0;
        %>
        <Phone>
          <%
          ext = otherIns.ContactPhone.indexOf( "x") < 0 ? 0 : otherIns.ContactPhone.indexOf( "x");
          cntr = ext == 0 ? 0 : 1;
          ext = ext == 0 ? otherIns.ContactPhone.length() : ext;
          %>
          <PhoneNumber><%=otherIns.ContactPhone.substring( 0, ext - cntr ).replaceAll("-", "")%></PhoneNumber>
          <PhoneCat>
            <Code>work</Code>
            <Description>Work</Description>
            <ListName>PrimaryPhoneType</ListName>
          </PhoneCat>
          <PrimPhoneInd>true</PrimPhoneInd>
          <% if (cntr != 0) {%> 
          <ExtensionNumber><%=otherIns.ContactPhone.substring( ext + cntr, otherIns.ContactPhone.length() )%></ExtensionNumber>
          <%}%>
        </Phone>
      </Phones>
      <%}%>
      <Person>
        <PublicID>othc:<%=otherIns.PublicID%></PublicID>
        <ObjectStatus><%=objStatus%></ObjectStatus>
        <FirstName><%=StringUtils.getXMLValue(otherIns.ContactName, false)%></FirstName>
      </Person>
    </Party>
    <%}%>		
    </Parties>
  </OtherInsurance>
  <%}%>
  <%}%>
  <%--jeremy--%>
  <% if (exposure.MethodOfSettlementExt != null && exposure.MethodOfSettlementExt.Code == "structured_settle") {%>	 
  <OtherInsurance>
    <PublicID><%=exposure.PublicID%></PublicID>
    <ObjectStatus><%=objStatus%></ObjectStatus>
    <% if (exposure.CreateTime != null) {%>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(exposure.CreateTime)%></CreateTime> 
    <%}%>
    <% if (exposure.UpdateTime != null) {%>
    <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(exposure.UpdateTime)%></UpdateTime> 
    <%}%>
    <Category>
      <Code>Annuity</Code>
      <Description>Annuity</Description>
      <ListName>Other Ins Type</ListName>
    </Category>

    <% if (exposure.PolicyNumberExt != null) {%>
    <PolicyNumber><%=exposure.PolicyNumberExt%></PolicyNumber> 
    <%}%>

    <% if (exposure.AnticFinalPmtDateExt != null) {%>
    <AnticFinalPmtDateExt><%=exposure.AnticFinalPmtDateExt%></AnticFinalPmtDateExt> 
    <%}%>		

    <% if (exposure.AnnuityPurchaseAmtExt != null) {%>
    <AnnuityPurchaseAmtExt><%=exposure.AnnuityPurchaseAmtExt%></AnnuityPurchaseAmtExt> 
    <%}%>	
    
    <Parties>
    <% if (exposure.InsuranceCoExt != null ) { var theinsuranceParty : Contact = exposure.InsuranceCoExt;%>
    <%var iprole = "<Role><Code>InsuranceCarrier</Code><Description>Insurance Carrier</Description><ListName>InsuranceCarrier</ListName></Role>"%>
    <%=PartyTemplate.renderToString(theinsuranceParty, "", objStatus, iprole, "", partyRelTo, exposure.Claim, "", "")%>
    <%}%>

    <% if (exposure.CreateUser != null ) { %>
    <%=UserTemplate.renderToString(exposure.CreateUser, "", objStatus, displaykey.EDW.Templates.CreateUserRole, "", partyRelTo)%>
    <%}%>

    <% if (exposure.UpdateUser != null) { %>
    <%=UserTemplate.renderToString(exposure.UpdateUser, "", objStatus, displaykey.EDW.Templates.UpdateUserRole, "", partyRelTo)%>
    <%}%>
    </Parties>
  </OtherInsurance>
  <%}%>
  <% if (exposure.AppliesToCertAggLimitExt == false || (exposure.AppliesToCertAggLimitExt == true and origExp.AppliesToCertAggLimitExt == false) || exposure.SIRsExt != null) {%>
        <%=ExposureOtherInsTemplate.renderToString(exposure, objStatus)%>
  <%}%> 
</OtherInsurances>
<%}%>