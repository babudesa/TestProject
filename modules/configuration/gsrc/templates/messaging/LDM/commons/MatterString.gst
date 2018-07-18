<%@ params(value : String, TagXML : String) %>
<% if(value != null) { %>
  <<%=TagXML%>><![CDATA[<%=value%>]]></<%=TagXML%>> 
<%}%>