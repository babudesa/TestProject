<%@ params(value : Boolean, TagXML : String) %>
<% if(value != null) { %>
  <<%=TagXML%>><%=value%></<%=TagXML%>> 
<%}%>