<% uses util.StringUtils %>
<% uses java.util.Date %>
<%@ params(date : Date, nodeName : String) %>
 <% if (date != null) {%>
<<%=nodeName%>><%=date%></<%=nodeName%>>
<% } %>