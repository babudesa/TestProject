<%@ params(theclaim : Claim, objStatus : String, eventName : String) %>
<%
var thepolicy = theclaim.Policy;
if (objStatus != "D" && theclaim.Policy.Verified) {
    objStatus = "E";
}
var partyRelTo = "<PartyRelTo><PublicID>"+thepolicy.PublicID+"</PublicID><RelToType>Policy</RelToType></PartyRelTo>";
%>
<Policy>
  <PublicID><%=thepolicy.PublicID%></PublicID>
  <ObjectStatus><%=objStatus%></ObjectStatus>
  <% var verified = thepolicy.Verified; %>
  <Verified><%=verified%></Verified>

  <% if (verified) {%>
  <VerifiedPolicy>
    <PolicyEBIInstExt><%=thepolicy.PolicyEBIInstExt%></PolicyEBIInstExt>
    <PolicyEBIExt><%=thepolicy.PolicyEBIExt%></PolicyEBIExt>
    <%if (thepolicy.PolicyType != null and (thepolicy.PolicyType.Code == PolicyType.TC_AMP or thepolicy.PolicyType.Code == PolicyType.TC_AMO)) {%>
    <%=PolicyInjAnimalTemplate.renderToString(theclaim, thepolicy, objStatus)%>
    <%}%>
  </VerifiedPolicy>
  <%} else {%>
  <UnVerifiedPolicy>
    <% if (thepolicy.PolicyNumber != null) {%> 
    <PolicyNumber><%=thepolicy.PolicyNumber%></PolicyNumber>
    <%}%>
    <% if (thepolicy.ex_PolicyVersion != null) {%>
    <ex_PolicyVersion><%=thepolicy.ex_PolicyVersion%></ex_PolicyVersion>
    <%}%>
    <% if (thepolicy.PolicySuffix != null) {%>
    <PolicySuffix><%=thepolicy.PolicySuffix%></PolicySuffix>
    <%}%>
    <% if (thepolicy.PolicyType != null) {%>
    <%=TypeListTemplate.renderToString(thepolicy.PolicyType, "PolicyType", thepolicy.PolicyType.ListName)%>
    <%}%>
    <% if (thepolicy.UnverifiedRsnExt != null) {%>
    <%=TypeListTemplate.renderToString(thepolicy.UnverifiedRsnExt, "UnverifiedRsnExt", thepolicy.UnverifiedRsnExt.ListName)%>
    <%}%>
    <% if (thepolicy.ProducerCode != null) {%> 
    <% if (thepolicy.ProducerCode.length() == 10) {%>
    <ProducerCode><%=thepolicy.ProducerCode.substring(4,10)%></ProducerCode>
    <%} else { %>
    <ProducerCode><%=thepolicy.ProducerCode.substring(0,6)%></ProducerCode>
    <%}%>
    <%}%>
    <% if (thepolicy.EffectiveDate != null) {%>
    <EffectiveDate><%=thepolicy.EffectiveDate%></EffectiveDate> 
    <%}%>
    <% if (thepolicy.ExpirationDate != null) {%>
    <ExpirationDate><%=thepolicy.ExpirationDate%></ExpirationDate> 
    <%}%>
    <% if (thepolicy.CancellationDate != null) {%>
    <CancellationDate><%=thepolicy.CancellationDate%></CancellationDate> 
    <%}%>
    <% if (thepolicy.IssuingCompanyExt != null) {%>
    <%=TypeListTemplate.renderToString(thepolicy.IssuingCompanyExt, "IssuingCompany", thepolicy.IssuingCompanyExt.ListName)%>
    <%}%>
    <%=TypeListTemplate.renderToString(thepolicy.CurrencyTypeExt, "CurrCat", thepolicy.CurrencyTypeExt.ListName)%>
    <NewBusin>false</NewBusin>
    <% if (thepolicy.NAICSCodeExt != null) {%>
    <%=TypeListTemplate.renderToString(thepolicy.NAICSCodeExt, "NAICSCodeExt", thepolicy.NAICSCodeExt.ListName)%>
    <%}%>

    <%var riskTemplateData = RiskHandler.renderToString(theclaim, thepolicy, objStatus, eventName)%>
    <% if (org.apache.commons.lang.StringUtils.deleteSpaces( riskTemplateData ) != "") {%>
    <Risks>
      <%=riskTemplateData%>
    </Risks>
    <%}%>

    <Parties>
      <%
      uses java.util.Map ;
      uses java.util.HashMap ;
      uses templates.messaging.edw.PolicyInjAnimalTemplate
      uses templates.messaging.edw.TypeListTemplate
      uses templates.messaging.edw.RiskHandler
      uses templates.messaging.edw.PartyTemplate
      uses templates.messaging.edw.UserTemplate
      var contacts : Map = new HashMap() ;

      for ( cc in thepolicy.Claim.Contacts ) {
        for (ccr in cc.Roles) {
          if (ccr.Owner == thepolicy.PolicyNumber) {
            var key : String = ccr.PublicID + ccr.Role.Code ;
            var isDuplicateContact = false ;
            if (ccr.Contact.AddressBookUID != null) {
              for (objkey in contacts.keySet().iterator()) {
                var listccr = contacts.get(objkey) as ClaimContactRole ;
                if (listccr.Contact.AddressBookUID == ccr.Contact.AddressBookUID and listccr.Role.Code == ccr.Role.Code) {
                  isDuplicateContact = true ;
                  break ;
                }
              }
            }
            if (!isDuplicateContact) {
              contacts.put(key, ccr) ;
            }
          }
        }
      }
      %>
      <% for( contactkey in contacts.keySet().iterator()) { %>
      <%
      var thepartiesinvolved = contacts.get(contactkey) as ClaimContactRole;
      var pirole = "<Role><Code>"+thepartiesinvolved.Role.Code+"</Code><Description>"+thepartiesinvolved.Role.Description+"</Description><ListName>"+thepartiesinvolved.Role.ListName+"</ListName></Role>";
      if (thepartiesinvolved.Role.Code == "lienholder" ) { 
        pirole = "<Role><Code>"+thepartiesinvolved.CoveredPartyType.Code+"</Code><Description>"+thepartiesinvolved.CoveredPartyType.Code+"</Description><ListName>LienHolderType</ListName></Role>";
      } else if (thepartiesinvolved.Role.Code == "coveredparty" || thepartiesinvolved.Role.Code == "AdditionalInterestRisk") { 
        pirole = "<Role><Code>"+thepartiesinvolved.CoveredPartyType.Code+"</Code><Description>"+thepartiesinvolved.CoveredPartyType.Code+"</Description><ListName>"+thepartiesinvolved.CoveredPartyType.ListName+"</ListName></Role>";
      }
      %>
      <%=PartyTemplate.renderToString(thepartiesinvolved.Contact, "", (objStatus == "D" ? "E" : objStatus), pirole, "", partyRelTo, theclaim, "", "")%>
      <%}%>

      <% if (thepolicy.CreateUser != null) { %>
      <%=UserTemplate.renderToString(thepolicy.CreateUser, "", (objStatus == "D" ? "E" : objStatus), displaykey.EDW.Templates.CreateUserRole, "", partyRelTo)%>
      <%}%>

      <% if (thepolicy.UpdateUser != null) { %>
      <%=UserTemplate.renderToString(thepolicy.UpdateUser, "", (objStatus == "D" ? "E" : objStatus), displaykey.EDW.Templates.UpdateUserRole, "", partyRelTo)%>
      <%}%>
    </Parties>

    <% if (thepolicy.Account != null) {%>
    <% if (thepolicy.Account.length() > 20) {%>
    <PolCustomerCode><%=thepolicy.Account.substring(0,20)%></PolCustomerCode>
    <%} else {%>
    <PolCustomerCode><%=thepolicy.Account%></PolCustomerCode>
    <%}%>
    <%}%>
    <% if (thepolicy.ObligeeBondNumExt != null) {%>
      <ObligeeBondNumExt><%=thepolicy.ObligeeBondNumExt%></ObligeeBondNumExt> 
    <%}%>
  </UnVerifiedPolicy>
  <%}%>
</Policy>