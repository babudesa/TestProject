<% uses util.StringUtils %>
<% uses templates.messaging.edw.PartyWithoutGuardianTemplate %>
<%@ params(theContact : Contact, objStatus : String, additionalInfo : String) %>
<%
var parentPublicID = "";
if ((theContact typeis CompanyVendor || theContact typeis PersonVendor || theContact typeis NonVendorPayeeCompanyExt || theContact typeis NonVendorPayeePersonExt) && theContact.AddressBookUID != null) {
  parentPublicID = additionalInfo + theContact.AddressBookUID;
} else {
  parentPublicID = additionalInfo + theContact.PublicID;
}
var role = "<Role><Code>guardian</Code><Description>Guardian</Description><ListName>ContactBidiRel</ListName></Role>"
var partyRelTo = "<PartyRelTo><PublicID>"+parentPublicID+"</PublicID><RelToType>Party</RelToType></PartyRelTo>"
%>
<% if ((theContact typeis Person && theContact.Guardian != null) || (theContact.DoingBusinessAsExt != null)) { %>	
<Parties>
  <% if (theContact typeis Person && theContact.Guardian != null) { var theguardian = theContact.Guardian; %>
  <%-- call different template to avoid stackoverflow on studio --%>
  <%=PartyWithoutGuardianTemplate.renderToString(theguardian, "", objStatus, role, "", partyRelTo)%>
  <%}%>
  <% if (theContact.DoingBusinessAsExt != null) { %>
  <Party>
    <% if ((theContact typeis CompanyVendor || theContact typeis PersonVendor || theContact typeis NonVendorPayeeCompanyExt || theContact typeis NonVendorPayeePersonExt) && theContact.AddressBookUID != null) {%>
    <PublicID>dba:<%=theContact.AddressBookUID%></PublicID>
    <%} else { %>
    <PublicID>dba:<%=theContact.PublicID%></PublicID>
    <%} %>
    <ObjectStatus><%=objStatus%></ObjectStatus>
    <% if (theContact.CreateTime  != null) {%>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(theContact.CreateTime)%></CreateTime> 
    <%}%>
    <% if (theContact.UpdateTime  != null) {%>
    <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(theContact.UpdateTime)%></UpdateTime> 
    <%}%>
    <Role><Code>doingbusinessas</Code><Description>Doing business as</Description><ListName>ContactRole</ListName></Role>
    <Name><%=StringUtils.getXMLValue(theContact.DoingBusinessAsExt, false)%></Name>
    <Organization>
      <% if ((theContact typeis CompanyVendor || theContact typeis PersonVendor || theContact typeis NonVendorPayeeCompanyExt || theContact typeis NonVendorPayeePersonExt) && theContact.AddressBookUID != null) {%>
      <PublicID>dba:<%=theContact.AddressBookUID%></PublicID>
      <%} else { %>
      <PublicID>dba:<%=theContact.PublicID%></PublicID>
      <%} %>
      <ObjectStatus><%=objStatus%></ObjectStatus>
      <Name><%=StringUtils.getXMLValue(theContact.DoingBusinessAsExt, false)%></Name>
    </Organization>
  </Party>
<%}%>		
</Parties>
<%}%>
