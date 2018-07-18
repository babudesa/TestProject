<% uses util.StringUtils %>
<% uses java.lang.Object %>
<%@ params(theClaimContact : ClaimContact) %>
<tns:OFACRequest xmlns:tns="http://eam.gaic.com/OFAC">
<tns:OFACRequestRecord>
  <tns:Customer>G016</tns:Customer>
  <tns:RegionOffice>00001</tns:RegionOffice>
  <tns:Application>GWIR</tns:Application>
  <tns:ClaimNumber><%=theClaimContact.Claim.ClaimNumber%></tns:ClaimNumber>
  <tns:ClaimInfo></tns:ClaimInfo>
  <tns:FutureUse/>
  <tns:NameType>I</tns:NameType>
  <tns:Name><%=StringUtils.getXMLValue(theClaimContact.DisplayName, false)%></tns:Name>
  <% if (theClaimContact.Person.DateOfBirth != null) {%> 
  <tns:DateOfBirth><%=(new java.text.SimpleDateFormat("MMddyyyy")).format(theClaimContact.Person.DateOfBirth)%></tns:DateOfBirth>
	<% } else { %>
  <tns:DateOfBirth></tns:DateOfBirth>
  <% } %>
  
    <% // c.mcdonald,  6-11-13,  em52,  defect 6175,  OFAC only accepts 50 char input,  lines 19-21 and 24-25 and 28-29 %>
  <%if (theClaimContact.Contact.PrimaryAddress.AddressLine1.length > 50){%>
    <%theClaimContact.Contact.PrimaryAddress.AddressLine1=theClaimContact.Contact.PrimaryAddress.AddressLine1.substring(0,49)}%>
  <tns:Address1><%=StringUtils.getXMLValue(theClaimContact.Contact.PrimaryAddress.AddressLine1, false)%></tns:Address1>
 
  <%if (theClaimContact.Contact.PrimaryAddress.AddressLine2.length > 50){%>
    <%theClaimContact.Contact.PrimaryAddress.AddressLine2=theClaimContact.Contact.PrimaryAddress.AddressLine2.substring(0,49)}%>
  <tns:Address2><%=StringUtils.getXMLValue(theClaimContact.Contact.PrimaryAddress.AddressLine2, false)%></tns:Address2>
 
  <%if (theClaimContact.Contact.PrimaryAddress.City.length > 25){%>
    <%theClaimContact.Contact.PrimaryAddress.City=theClaimContact.Contact.PrimaryAddress.City.substring(0,24)}%>
  <% if (theClaimContact.Contact.PrimaryAddress.City != null) {%>
  <tns:City><%=theClaimContact.Contact.PrimaryAddress.City%></tns:City>
  <% } else { %>
  <tns:City></tns:City>
  <% } %>
  <% if (theClaimContact.Contact.PrimaryAddress.State != null && (theClaimContact.Contact.PrimaryAddress.Country == Country.TC_US || theClaimContact.Contact.PrimaryAddress.Country == Country.TC_CA)) {%>
  <tns:State><%=theClaimContact.Contact.PrimaryAddress.State%></tns:State>
  <% } else { %>
  <tns:State></tns:State>
  <% } %>
  <% if (theClaimContact.Contact.PrimaryAddress.PostalCode != null) {%>
  <tns:ZipCode><%=util.gaic.OFAC.OFACFunctions.formatZipCode(theClaimContact.Contact.PrimaryAddress.PostalCode)%></tns:ZipCode>
  <% } else { %>
  <tns:ZipCode></tns:ZipCode>
  <% } %>
  <% if (theClaimContact.Contact.PrimaryAddress.Country != null) {%>
  <tns:Country><%=theClaimContact.Contact.PrimaryAddress.Country%></tns:Country>
  <% } else { %>
  <tns:Country></tns:Country>
  <% } %>
  <tns:Passport/>
 <tns:SocialSecurityNumber><%=util.gaic.OFAC.OFACFunctions.formatEIN(StringUtils.getXMLValue(theClaimContact.Contact.TaxID, false))%></tns:SocialSecurityNumber>     
</tns:OFACRequestRecord>
</tns:OFACRequest>
