<% uses org.apache.commons.lang.StringEscapeUtils %>
<%@ params(value : String, element : String) %>
<% if(value != null) { %>
  <<%=element%>><![CDATA[<%=value%>]]></<%=element%>> 
<%}%>