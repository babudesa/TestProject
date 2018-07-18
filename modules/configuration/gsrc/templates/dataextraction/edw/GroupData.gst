<% uses util.StringUtils %>
<% uses templates.messaging.edw.UpdateCreateUserTemplate %>
<% uses templates.dataextraction.edw.UserData %>
<% uses templates.dataextraction.edw.GroupData %>
<% uses templates.messaging.edw.TypeListTemplate %>
<%@ params(thegroup : Group, objStatus : String, date : String) %>
<Party>
  <PublicID>grp:<%=thegroup.PublicID%></PublicID>
  <ObjectStatus><%=objStatus%></ObjectStatus>
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
  <GroupType>
  <Code><%=thegroup.GroupType%></Code>
  <Description><%=thegroup.GroupType%></Description>
  <ListName>groupType</ListName>
  </GroupType>
  </Management>
  <Parties>
  <% for (group in thegroup.ChildGroups) {%>
    <%=GroupData.renderToString(group, objStatus, date)%>
  <%}%> 
  <%var partyRelTo = "<PartyRelTo><PublicID>grp:"+thegroup.PublicID+"</PublicID><RelToType>Party</RelToType></PartyRelTo>"%>
  <%if ( thegroup.CreateUser != null) {%>
    <%=UpdateCreateUserTemplate.renderToString(thegroup.CreateUser, displaykey.EDW.Templates.CreateUserRole, objStatus, partyRelTo, date)%>
  <%}%>
  <%if ( thegroup.UpdateUser != null) {%>
    <%=UpdateCreateUserTemplate.renderToString(thegroup.UpdateUser, displaykey.EDW.Templates.UpdateUserRole, objStatus, partyRelTo, date)%>
  <%}%>
  <%for (member in thegroup.Members){%>
  <%
  var role = "<Role><Code>claimorg</Code><Description>Claim Organization</Description><ListName>ClaimOrg</ListName></Role>" ;
  if ( thegroup.Supervisor.PublicID == member.User.PublicID) {
    role = "<Role><Code>claimorg</Code><Description>Claim Organization</Description><ListName>ClaimOrg</ListName></Role><SubRole><Code>supervisor</Code><Description>Supervisor</Description><ListName>ClaimOrg</ListName></SubRole>";
  }
  %>
  <%=UserData.renderToString(member.User, objStatus, date, role)%>
  <%}%>
  </Parties>
  <% if (thegroup.SecurityZone  != null) {%>
    <SecurityZone><%=thegroup.SecurityZone%></SecurityZone> 
  <%}%>
  <% if (thegroup.SecurityZone.SecurityFilters  != null and thegroup.SecurityZone.SecurityFilters.length > 0) {%>
        <SecureReferenceValues>
          <%for (secref in thegroup.SecurityZone.SecurityFilters){
              if (secref typeis ProfitCenterSecurityFilterExt) {
                if (secref.ProfitCenterGrouping != null) {
                  for (var bu in secref.ProfitCenterGrouping.BusinessUnitItemExt) {
                    if (bu.BusinessUnit != null) {
                      for (var prmid in util.admin.SecurityUtil.convertBusinessUnitToPRMName(bu.BusinessUnit)) {
                  %>
                    <SecureReferenceValuesExt>
                      <%=TypeListTemplate.renderToString(typekey.AccessTypeExt.TC_PRODUCINGBUSINESSUNIT, "AccessTypeExt", typekey.AccessTypeExt.TC_PRODUCINGBUSINESSUNIT.ListName)%>
                        <AccessValue><%=prmid%></AccessValue> 
                    </SecureReferenceValuesExt>
                  <%}}}
                  for (var pc in secref.ProfitCenterGrouping.ProfitCenterItemExt) {
                  %>
                    <SecureReferenceValuesExt>
                      <%=TypeListTemplate.renderToString(typekey.AccessTypeExt.TC_PROFITCENTER, "AccessTypeExt", typekey.AccessTypeExt.TC_PROFITCENTER.ListName)%>
                      <%if (pc.ProfitCenter != null) {%>
                        <AccessValue><%=pc.ProfitCenter%></AccessValue> 
                      <%}%>
                    </SecureReferenceValuesExt>
                  <%}
                }
              } else if (secref typeis ClaimsBusinessUnitSecurityFilterExt) {%>
                <SecureReferenceValuesExt>
                  <%=TypeListTemplate.renderToString(typekey.AccessTypeExt.TC_PARENTGROUP, "AccessTypeExt", typekey.AccessTypeExt.TC_PARENTGROUP.ListName)%>
                  <%if (secref.ClaimsBusinessUnit != null) {%>
                    <AccessValue><%=secref.ClaimsBusinessUnit.PublicID%></AccessValue> 
                  <%}%>
                </SecureReferenceValuesExt>
              <%}%>
          <%}%>
        </SecureReferenceValues>
      <%}%>
</Party>
