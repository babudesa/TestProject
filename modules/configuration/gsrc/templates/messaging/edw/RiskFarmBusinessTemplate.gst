<% uses templates.messaging.edw.TypeListTemplate %>
<%@ params(thepolicy : Policy, objStatus : String, riskCat : String, cvrg : String, riskType : String, eventName : String) %>
<Risk>
  <PublicID><%=thepolicy.PublicID%>.<%=riskType%></PublicID>
  <ObjectStatus><%=objStatus%></ObjectStatus>
  <UnVerifiedRisk>
    <CreateTime><%=util.custom_Ext.DateTime.getTimeStamp()%></CreateTime>
    <FarmBusiness>
      <% if (thepolicy.PrimaryFarmTypeExt != null) {%>
      <%=TypeListTemplate.renderToString(thepolicy.PrimaryFarmTypeExt, "PrimaryFarmType", thepolicy.PrimaryFarmTypeExt.ListName)%>
      <%}%>
      <% if (thepolicy.OtherFarmTypeExt != null) {%>
      <%=TypeListTemplate.renderToString(thepolicy.OtherFarmTypeExt, "OtherFarmType", thepolicy.OtherFarmTypeExt.ListName)%>
      <%}%>
    </FarmBusiness>
  </UnVerifiedRisk>

  <%=riskCat%>

  <% if (thepolicy.PublicID != null) {%>
  <RelToPolicy><%=thepolicy.PublicID%></RelToPolicy>
  <%}%>
</Risk>
