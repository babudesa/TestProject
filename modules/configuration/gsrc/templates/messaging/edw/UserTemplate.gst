<% uses util.StringUtils %>
<% uses templates.messaging.edw.PersonTemplate %>
<% uses templates.messaging.edw.TypeListTemplate %>
<% uses templates.messaging.edw.AddressTemplate %>
<% uses templates.messaging.edw.UpdateCreateUserTemplate %>
<%@ params(user : User, additionalInfo : String, objStatus : String, role : String, assignmentStatus : String,  partyRelTo : String) %>
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
  
  <%=role%>
  
  <%=assignmentStatus%>
  <%-- ko def 7090   BESTOR 04032009 - Defect 1669: Use DisplayName for Vendors --%>
  <% if (theUser.DisplayName != null) {%>
    <Name><%=StringUtils.getXMLValue(theUser.DisplayName, false)%></Name>
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
  <%=AddressTemplate.renderToString(theaddress, true, objStatus, "")%>
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