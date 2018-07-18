<% uses util.StringUtils %>
<% uses templates.messaging.edw.TypeListTemplate %>
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
      <PhoneNumber><%=theUser.PrimaryPhoneValue.substring( 0, ext - cntr).replaceAll("-", "")%></PhoneNumber>
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

  <% if (theUser typeis Person != null) {%>
  <Person>
    <PublicID><%=theUser.PublicID%></PublicID>
    <ObjectStatus>A</ObjectStatus>
    <% if (theUser.LastName != null) {%>
    <LastName><%=StringUtils.getXMLValue(theUser.LastName, false)%></LastName>
    <%}%>
    <% if (theUser.FirstName != null) {%>
    <FirstName><%=StringUtils.getXMLValue(theUser.FirstName, false)%></FirstName>
    <%}%>
    <% if (theUser.MiddleName != null) {%>
    <MiddleName><%=StringUtils.getXMLValue(theUser.MiddleName, false)%></MiddleName>
    <%}%>
    <% if (theUser.Suffix != null) {%>
    <%=TypeListTemplate.renderToString(theUser.Suffix, "Suffix", theUser.Suffix.ListName)%>
    <%}%>
    <% if (theUser.DateOfBirth != null) {%>	        
    <DateOfBirth><%=theUser.DateOfBirth%></DateOfBirth>
    <%}%>
    <% if (theUser.Gender != null) {%>
    <%=TypeListTemplate.renderToString(theUser.Gender, "Gender", theUser.Gender.ListName)%>
    <%}%>
    <% if (theUser.MaritalStatus != null) {%>
    <%=TypeListTemplate.renderToString(theUser.MaritalStatus, "MaritalStatus", theUser.MaritalStatus.ListName)%>
    <%}%>
    <% if (theUser.FormerName != null) {%>
    <FormerName><%=StringUtils.getXMLValue(theUser.FormerName, false)%></FormerName>
    <%}%>
    <% if (theUser.Occupation != null) {%>
    <Occupation><%=StringUtils.getXMLValue(theUser.Occupation, false)%></Occupation>
    <%}%>
  </Person> 
  <%}%>

  <% if (theUser.PrimaryAddress != null) { var theaddress = theUser.PrimaryAddress;%>
  <PrimaryAddress>
  <PublicID><%=theaddress.PublicID%></PublicID>
  <ObjectStatus>A</ObjectStatus>
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
  <AddressType>
  <Code><%=theaddress.AddressType.Code%></Code>
  <Description><%=theaddress.AddressType.Description%></Description>
  <ListName><%=theaddress.AddressType.ListName%></ListName>
  </AddressType>
  <%}%>
  <% if (theaddress.City != null) {%>
  <City><%=StringUtils.getXMLValue(theaddress.City, false)%></City>
  <%}%>
  <% if (theaddress.State != null) {%>
  <State>
  <Code><%=theaddress.State.Code%></Code>
  <Description><%=theaddress.State.Description%></Description>
  <ListName><%=theaddress.State.ListName%></ListName>
  </State>
  <%} else {%>
  <State>
  <Code>--</Code>
  <Description>Other</Description>
  <ListName>Other</ListName>
  </State>
  <%}%>
  <% if (theaddress.Country != null) {%>
  <Country>
  <Code><%=StringUtils.getXMLValue(theaddress.Country.Code, false)%></Code>
  <Description><%=StringUtils.getXMLValue(theaddress.Country.Description, false)%></Description>
  <ListName><%=StringUtils.getXMLValue(theaddress.Country.ListName, false)%></ListName>
  </Country>
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