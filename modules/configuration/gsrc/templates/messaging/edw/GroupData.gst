<% uses util.UniqueNumberGenerators %>
<% uses util.StringUtils %>
<% uses templates.messaging.edw.TypeListTemplate %>
<% uses templates.messaging.edw.UpdateCreateUserTemplate %>
<%@ params(objStatus : String, thegroup : Group, date : String) %>
<Transaction>
  <CCTransactionTime>
  <%=util.custom_Ext.DateTime.getTimeStamp()%>
  </CCTransactionTime>
  <uniqueID><%=UniqueNumberGenerators.generateEDWUniqueID()%></uniqueID>
  <%if (thegroup.Parent != null) {%>
  <Party>
    <PublicID>grp:<%=thegroup.Parent.PublicID%></PublicID>
    <ObjectStatus><%=objStatus%></ObjectStatus>
    <% if (thegroup.Parent.CreateTime  != null) {%>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(thegroup.Parent.CreateTime)%></CreateTime> 
    <%}%>
    <% if (thegroup.Parent.UpdateTime  != null) {%>
    <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(thegroup.Parent.UpdateTime)%></UpdateTime> 
    <%}%>

    <%=date%>

    <Role>
      <Code>claimorg</Code>
      <Description>Claim Organization</Description>
      <ListName>ClaimOrg</ListName>
    </Role>
    <Management>  
    <% if (thegroup.Parent.Name != null) {%>
    <Name><%=StringUtils.getXMLValue(thegroup.Parent.Name.replaceAll("\\xae", ""), false)%></Name>
    <%}%>
    <%=TypeListTemplate.renderToString(thegroup.Parent.GroupType, "GroupType", thegroup.Parent.GroupType.ListName)%>
    </Management>
    <Parties>
      <Party>
      <PublicID>grp:<%=thegroup.PublicID%></PublicID>
      <ObjectStatus><%=objStatus%></ObjectStatus>
      <% if (thegroup.CreateTime  != null) {%>
      <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(thegroup.CreateTime)%></CreateTime> 
      <%}%>
      <% if (thegroup.UpdateTime  != null) {%>
      <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(thegroup.UpdateTime)%></UpdateTime> 
      <%}%>
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
      <%=UpdateCreateUserTemplate.renderToString(thegroup.CreateUser, displaykey.EDW.Templates.CreateUserRole, objStatus, "<PartyRelTo><PublicID>grp:"+thegroup.PublicID+"</PublicID><RelToType>Party</RelToType></PartyRelTo>", date)%>
      <%}%>
      <%if ( thegroup.UpdateUser != null) {%>
      <%=UpdateCreateUserTemplate.renderToString(thegroup.UpdateUser, displaykey.EDW.Templates.UpdateUserRole, objStatus, "<PartyRelTo><PublicID>grp:"+thegroup.PublicID+"</PublicID><RelToType>Party</RelToType></PartyRelTo>", date)%>
      <%}%>
      </Parties>
      <% if (thegroup.SecurityZone  != null) {%>
        <SecurityZone><%=thegroup.SecurityZone%></SecurityZone> 
      <%}%>
      <% function printSecureReferenceValues(dagroup:Group) {
        if (dagroup.SecurityZone.SecurityFilters  != null and dagroup.SecurityZone.SecurityFilters.length > 0) {%>
        <SecureReferenceValues>
          <%for (secref in dagroup.SecurityZone.SecurityFilters){
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
      <%}}
      printSecureReferenceValues(thegroup);
      %>
    </Party>
    </Parties>
    <% if (thegroup.Parent.SecurityZone  != null) {%>
        <SecurityZone><%=thegroup.Parent.SecurityZone%></SecurityZone> 
      <%}%>
      <%printSecureReferenceValues(thegroup.Parent) %>
    </Party>
    <%} else {%>
    <Party>
    <PublicID>grp:<%=thegroup.PublicID%></PublicID>
    <ObjectStatus><%=objStatus%></ObjectStatus>
    <% if (thegroup.CreateTime  != null) {%>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(thegroup.CreateTime)%></CreateTime> 
    <%}%>
    <% if (thegroup.UpdateTime  != null) {%>
    <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(thegroup.UpdateTime)%></UpdateTime> 
    <%}%>
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
    <%if(thegroup.CreateUser != null || thegroup.UpdateUser != null) {%>
    <Parties>
      <%if ( thegroup.CreateUser != null) {%>
      <%=UpdateCreateUserTemplate.renderToString(thegroup.CreateUser, displaykey.EDW.Templates.CreateUserRole, objStatus, "<PartyRelTo><PublicID>grp:"+thegroup.PublicID+"</PublicID><RelToType>Party</RelToType></PartyRelTo>", date)%>
      <%}%>
      <%if ( thegroup.UpdateUser != null) {%>
      <%=UpdateCreateUserTemplate.renderToString(thegroup.UpdateUser, displaykey.EDW.Templates.UpdateUserRole, objStatus, "<PartyRelTo><PublicID>grp:"+thegroup.PublicID+"</PublicID><RelToType>Party</RelToType></PartyRelTo>", date)%>
      <%}%>
    </Parties>
    <%}%>
    <% if (thegroup.SecurityZone  != null) {%>
      <SecurityZone><%=thegroup.SecurityZone%></SecurityZone> 
    <%}%>
    <% printSecureReferenceValues(thegroup) %>
  </Party>
  <%}%>
</Transaction>
