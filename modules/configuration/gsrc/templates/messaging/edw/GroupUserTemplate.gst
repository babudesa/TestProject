<% uses util.StringUtils %>
<% uses util.UniqueNumberGenerators %>
<% uses templates.messaging.edw.TypeListTemplate %>
<% uses templates.dataextraction.edw.UserData %>
<%@ params(groupUser : GroupUser, objStatus : String, date : String) %>
<Transaction>
  <% var thegroup = groupUser.Group %>
  <CCTransactionTime>
  <%=util.custom_Ext.DateTime.getTimeStamp()%>
  </CCTransactionTime>
  <uniqueID><%=UniqueNumberGenerators.generateEDWUniqueID()%></uniqueID>
  <Party>
  <PublicID>grp:<%=thegroup.PublicID%></PublicID>
  <ObjectStatus>E</ObjectStatus>
  <% if (thegroup.CreateTime  != null) {%>
  <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(thegroup.CreateTime)%></CreateTime> 
  <%}%>
  <% if (thegroup.UpdateTime  != null) {%>
  <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(thegroup.UpdateTime)%></UpdateTime> 
  <%}%>

  <%=date%>

  <Role>
    <Code>claimorg</Code>
    <Description>Claim Organization</Description>
    <ListName>ClaimOrg</ListName>
  </Role>
  <Management>  
    <% if (thegroup.Name != null) {%>
    <Name><%=StringUtils.getXMLValue(thegroup.Name.replaceAll("\\xae", ""), false)%></Name>
    <%}%>
    <%=TypeListTemplate.renderToString(thegroup.GroupType, "GroupType", thegroup.GroupType.ListName)%>
  </Management>

  <Parties>
    <%if ( thegroup.CreateUser != null) {%>
    <%=UserData.renderToString(thegroup.CreateUser, objStatus, date, displaykey.EDW.Templates.CreateUserRole)%>
    <%}%>
    <%if ( thegroup.UpdateUser != null) { %>
    <%=UserData.renderToString(thegroup.UpdateUser, objStatus, date, displaykey.EDW.Templates.UpdateUserRole)%>
    <%}%>
    <%
    var role = "<Role><Code>claimorg</Code><Description>Claim Organization</Description><ListName>ClaimOrg</ListName></Role>" ;
    if ( thegroup.Supervisor.PublicID == groupUser.PublicID){ 
      role = "<Role><Code>claimorg</Code><Description>Claim Organization</Description><ListName>ClaimOrg</ListName></Role><SubRole><Code>supervisor</Code><Description>Supervisor</Description><ListName>ClaimOrg</ListName></SubRole>";
    }
    %>
    <%=UserData.renderToString(groupUser.User, objStatus, date, role)%>
  </Parties>
  </Party>
</Transaction>
