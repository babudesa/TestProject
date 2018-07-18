<% uses util.StringUtils %>
<% uses templates.messaging.edw.TypeListTemplate %>
<% uses templates.messaging.edw.PersonTemplate %>
<% uses templates.dataextraction.edw.MockUserTemplate %>
<%@ params(user : User, objStatus : String, date : String, role : String) %>
<Party>
  <%var theUser = user.Contact%>
  <PublicID><%=theUser.PublicID%></PublicID>
  <ObjectStatus><%=objStatus%></ObjectStatus>
  <% if (theUser.CreateTime  != null) {%>
  <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(theUser.CreateTime)%></CreateTime> 
  <%}%>
  <% if (theUser.UpdateTime  != null) {%>
  <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(theUser.UpdateTime)%></UpdateTime> 
  <%}%>

  <%=date%>

  <%=role%>
  
  <%-- ko def 7090   BESTOR 04032009 - Defect 1669: Use DisplayName for Vendors --%>
  <% if (theUser.DisplayName != null) {%>
    <Name><%=theUser.DisplayName%></Name>
  <%}%>
  
  <% if (theUser.PrimaryPhoneValue != null) {%>
  <Phones>
    <%
    var ext = 0;
    var cntr = 0;
    %>
    <Phone>
    <%
    ext = theUser.PrimaryPhoneValue.indexOf( "x") < 0 ? 0 : theUser.PrimaryPhoneValue.indexOf( "x");
    cntr = ext == 0 ? 0 : 1;
    ext = ext == 0 ? theUser.PrimaryPhoneValue.length() : ext;
    %>
    <PhoneNumber><%=theUser.PrimaryPhoneValue.substring( 0, ext - cntr ).replaceAll("-", "")%></PhoneNumber>
    <% if (theUser.PrimaryPhone != null) {%>
    <%=TypeListTemplate.renderToString(theUser.PrimaryPhone, "PhoneCat", theUser.PrimaryPhone.ListName)%>
    <PrimPhoneInd>true</PrimPhoneInd>
    <%} else {%>
    <PhoneCat>
      <Code>0</Code>
      <Description>none</Description>
      <ListName>Phone Category</ListName>
    </PhoneCat>
    <PrimPhoneInd>false</PrimPhoneInd>
    <%}%>
    <% if (cntr != 0) {%> 
    <ExtensionNumber><%=theUser.PrimaryPhoneValue.substring( ext + cntr, theUser.PrimaryPhoneValue.length() )%></ExtensionNumber>
    <%}%>
    </Phone>
  </Phones>
  <%}%>

  <% if (theUser.FaxPhone != null) {%>
   <%
        var ext = 0;
        var cntr = 0;
	ext = theUser.FaxPhone.indexOf( "x") < 0 ? 0 : theUser.FaxPhone.indexOf( "x");
	cntr = ext == 0 ? 0 : 1;
	ext = ext == 0 ? theUser.FaxPhone.length() : ext;
    %>
	<FaxPhone><%=theUser.FaxPhone.substring( 0, ext - cntr ).replaceAll("-", "")%></FaxPhone>
	<% if (cntr != 0) {%>    
		<FaxPhoneExtension><%=theUser.FaxPhone.substring( ext + cntr, theUser.FaxPhone.length() )%></FaxPhoneExtension>
	<%}%>
  <%}%>
  <% if (theUser.EmailAddress1 != null) {%>
  <EmailAddress1><%=StringUtils.getXMLValue(theUser.EmailAddress1, false)%></EmailAddress1>
  <%}%>
  <% if (theUser.EmailAddress2 != null) {%>
  <EmailAddress2><%=StringUtils.getXMLValue(theUser.EmailAddress2, false)%></EmailAddress2>
  <%}%>
  <InternetCatType>
    <Code>0</Code>
    <Description>none</Description>
    <ListName>Internet Category</ListName>
  </InternetCatType>

  <% if (theUser.Subtype != null) {%>
  <%=TypeListTemplate.renderToString(theUser.Subtype, "BusinessCategory", theUser.Subtype.ListName)%>
  <%}%>
  
  <% if (theUser typeis Person) {%>
    <%=PersonTemplate.renderToString(theUser, null, null, "", objStatus)%>
  <%}%>

  <% if (theUser.PrimaryAddress != null) { var theaddress = theUser.PrimaryAddress;%>
  <PrimaryAddress>
    <PublicID><%=theaddress.PublicID%></PublicID>
    <ObjectStatus><%=objStatus%></ObjectStatus>
    <%if (theaddress.AddressLine1 != null) {%>
    <AddressLine1><%=StringUtils.getXMLValue(theaddress.AddressLine1, false)%></AddressLine1>
    <%}%>
    <% if (theaddress.AddressLine2 != null) {%>
    <AddressLine2><%=StringUtils.getXMLValue(theaddress.AddressLine2, false)%></AddressLine2>
    <%}%>
    <% if (theaddress.AddressLine3 != null) {%>
    <AddressLine3><%=StringUtils.getXMLValue(theaddress.AddressLine3, false)%></AddressLine3>
    <%}%>
    <% if (theaddress.Longitude != null) {%>
    <Longitude><%=StringUtils.getXMLValue(theaddress.Longitude as java.lang.String, false)%></Longitude>
    <%}%>
    <% if (theaddress.Latitude != null) {%>
    <Latitude><%=StringUtils.getXMLValue(theaddress.Latitude as java.lang.String, false)%></Latitude>
    <%}%>
    <% if (theaddress.AddressType != null) {%>
    <%=TypeListTemplate.renderToString(theaddress.AddressType, "AddressType", theaddress.AddressType.ListName)%>
    <%}%>
    <% if (theaddress.City != null) {%>
    <City><%=StringUtils.getXMLValue(theaddress.City, false)%></City>
    <%}%>
    <% if (theaddress.State != null) {%>
    <%=TypeListTemplate.renderToString(theaddress.State, "State", theaddress.State.ListName)%>
    <%} else {%>
    <State>
      <Code>--</Code>
      <Description>Other</Description>
      <ListName>Other</ListName>
    </State>
    <%}%>
    <% if (theaddress.Country != null) {%>
    <%=TypeListTemplate.renderToString(theaddress.Country, "Country", theaddress.Country.ListName)%>
    <%}%>
    <% if (theaddress.County != null and theaddress.State != null) {%>
    <% var countycd = util.gaic.CommonFunctions.getStateCounty( theaddress.State, theaddress.County );  %>
    <% if (countycd != "")  { %> 
    <County>
      <Code><%=countycd%></Code>
      <Description><%=StringUtils.getXMLValue(theaddress.County, false)%></Description>
      <ListName>County</ListName>
    </County>
    <%}%>
    <%}%>
    <% if (theaddress.PostalCode != null) {%>
    <PostalCode><%=theaddress.PostalCode%></PostalCode>
    <%}%>
    <PrimInd>true</PrimInd>
    <% if (theaddress.Description != null) {%>
      <Description><%=theaddress.Description%></Description>
    <%}%>
    <% if (theaddress.DisplayName != null) {%>
      <DisplayName><%=theaddress.DisplayName%></DisplayName>
    <%}%>   
  </PrimaryAddress>
  <%}%>

  <%if ( user.UpdateUser != null or user.CreateUser != null ){%>
  <Parties>
  <%if ( user.UpdateUser != null) {%>
  <%=MockUserTemplate.renderToString(user.UpdateUser, objStatus, date, displaykey.EDW.Templates.UpdateUserRole)%>
  <%}%>	       
  <%if ( user.CreateUser != null) {%>
  <%=MockUserTemplate.renderToString(user.UpdateUser, objStatus, date, displaykey.EDW.Templates.CreateUserRole)%>
  <%}%>
  </Parties>
  <%}%>
  <% if (user.Credential.UserName != null) {%>	        
    <UserName><%=user.Credential.UserName%></UserName>
  <%}%>
  <% if (user.ignoreACLDenormIndExt != null) {%>	        
    <IgnoreACLDenormIndExt><%=user.ignoreACLDenormIndExt%></IgnoreACLDenormIndExt>
  <%}%>
  <% if (user.ExternalUser != null) {%>	        
    <ExternalUser><%=user.ExternalUser%></ExternalUser>
  <%}%>
</Party>
