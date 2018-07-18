<%@ params(matter : Matter, actionDescription : String) %>
<% uses org.apache.commons.lang.StringEscapeUtils %>

<Judge>  
  <ActionDesc><%=actionDescription%></ActionDesc>
  <% if(matter.JudgeFirstNameExt != null && matter.JudgeLastNameExt != null){ %>
    <ID><%=StringEscapeUtils.escapeXml(matter.JudgeFirstNameExt.replace(" ", "."))%>.<%=StringEscapeUtils.escapeXml(matter.JudgeLastNameExt.replace(" ", "."))%></ID>
  <%} else if(matter.JudgeLastNameExt != null){%>
    <ID>0.<%=StringEscapeUtils.escapeXml(matter.JudgeLastNameExt.replace(" ", "."))%></ID>
  <%} else if(matter.JudgeFirstNameExt != null){%>
    <ID><%=StringEscapeUtils.escapeXml(matter.JudgeFirstNameExt.replace(" ", "."))%>.0</ID>
  <%}%>
  <FirstName><%=StringEscapeUtils.escapeXml(matter.JudgeFirstNameExt)%></FirstName>
  <LastName><%=StringEscapeUtils.escapeXml(matter.JudgeLastNameExt)%></LastName>
</Judge> 