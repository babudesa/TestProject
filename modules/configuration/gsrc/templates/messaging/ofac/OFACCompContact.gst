<%@ params(theContact : Contact) %>
<% uses util.StringUtils %>
<% if (theContact typeis Company) {%>
<tns:OFACRequest xmlns:tns="http://eam.gaic.com/OFAC">
<tns:OFACRequestRecord>  
<tns:Customer>G016</tns:Customer>
  <tns:RegionOffice>00001</tns:RegionOffice>
  <tns:Application>GWIR</tns:Application>
 <tns:ClaimNumber></tns:ClaimNumber> 
 <tns:ClaimInfo></tns:ClaimInfo>
  <tns:FutureUse/>
  <tns:NameType>B</tns:NameType>
  <tns:Name><%=theContact.DisplayName%></tns:Name>
  <tns:DateOfBirth></tns:DateOfBirth>
  
  <% // c.mcdonald,  6-20-13,  em52,  defect 6175,  OFAC only accepts 50 char input Address 25 City %>
 <%if (theContact.PrimaryAddress.AddressLine1.length > 50){%>
    <%theContact.PrimaryAddress.AddressLine1=theContact.PrimaryAddress.AddressLine1.substring(0,49)}%>
 <%if (theContact.PrimaryAddress.AddressLine2.length > 50){%>
    <%theContact.PrimaryAddress.AddressLine2=theContact.PrimaryAddress.AddressLine2.substring(0,49)}%>
  <%if (theContact.PrimaryAddress.City.length > 25){%>
    <%theContact.PrimaryAddress.City=theContact.PrimaryAddress.City.substring(0,24)}%>
       
   <% if (theContact.PrimaryAddress.AddressLine1 != null) {%> 
  <tns:Address1><%=theContact.PrimaryAddress.AddressLine1%></tns:Address1>
	<% } else { %>
  <tns:Address1></tns:Address1>
  <% } %>  
  <% if (theContact.PrimaryAddress.AddressLine2 != null) {%> 
  <tns:Address2><%=theContact.PrimaryAddress.AddressLine2%></tns:Address2>
	<% } else { %>
  <tns:Address2></tns:Address2>
  <% } %>  
  <% if (theContact.PrimaryAddress.City != null) {%> 
  <tns:City><%=theContact.PrimaryAddress.City%></tns:City>
	<% } else { %>
  <tns:City></tns:City>
  <% } %>    
  <% if (theContact.PrimaryAddress.State != null && (theContact.PrimaryAddress.Country == Country.TC_US || theContact.PrimaryAddress.Country == Country.TC_CA)) {%>   
  <tns:State><%=theContact.PrimaryAddress.State%></tns:State>
	<% } else { %>
  <tns:State></tns:State>
  <% } %>  
  <% if (theContact.PrimaryAddress.PostalCode != null) {%>  
  <tns:ZipCode><%=theContact.PrimaryAddress.PostalCode%></tns:ZipCode>
	<% } else { %>
  <tns:ZipCode></tns:ZipCode>
  <% } %>   
  <% if (theContact.PrimaryAddress.Country != null) {%>  
  <tns:Country><%=theContact.PrimaryAddress.Country%></tns:Country>
	<% } else { %>
  <tns:Country></tns:Country>
  <% } %>   
  <tns:Passport/>
  <% if (theContact.TaxID != null) {%>    
  <tns:SocialSecurityNumber><%=util.gaic.OFAC.OFACFunctions.formatEIN(theContact.TaxID)%></tns:SocialSecurityNumber>
	<% } else { %>
  <tns:SocialSecurityNumber></tns:SocialSecurityNumber>
  <% } %>
  </tns:OFACRequestRecord>
</tns:OFACRequest>
<%}%>