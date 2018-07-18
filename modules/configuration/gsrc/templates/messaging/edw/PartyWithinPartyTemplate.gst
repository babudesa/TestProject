<% uses util.StringUtils %>
<%@ params(theContact : Contact, objStatus : String, additionalInfo : String) %>
<%
var parentPublicID = "";
if ((theContact typeis CompanyVendor || theContact typeis PersonVendor || theContact typeis NonVendorPayeeCompanyExt || theContact typeis NonVendorPayeePersonExt) && theContact.AddressBookUID != null) {
  parentPublicID = additionalInfo + theContact.AddressBookUID;
} else {
  parentPublicID = additionalInfo + theContact.PublicID;
}
%>
<% if (theContact.DoingBusinessAsExt != null) { %>	
<Parties>
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
      <% if ((theContact typeis CompanyVendor || theContact typeis PersonVendor ||theContact typeis NonVendorPayeeCompanyExt || theContact typeis NonVendorPayeePersonExt) && theContact.AddressBookUID != null) {%>
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