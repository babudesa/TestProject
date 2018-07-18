<% uses gw.entity.TypeKey %>
<% uses util.StringUtils %>
<%@ params(aTypeKey : TypeKey, nodeName : String) %>
 <% if (aTypeKey != null) {%>
<<%=nodeName%>><%=aTypeKey.Code%></<%=nodeName%>>
<% } %>
