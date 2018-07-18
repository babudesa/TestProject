<% uses java.util.Date %>
<%@ params(date : Date, TagXML : String) %>
<% if(date != null) { %>
  <<%=TagXML%>><%=date%></<%=TagXML%>> 
<%}%>