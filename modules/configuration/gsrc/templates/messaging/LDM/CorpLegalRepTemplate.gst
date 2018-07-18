<%@ params(matter : Matter, actionDescription : String) %>
<% uses org.apache.commons.lang.StringEscapeUtils %>

<CorporateLegalRep>  
  <ActionDesc><%=actionDescription%></ActionDesc>
  <ID><%=StringEscapeUtils.escapeXml(matter.CorporateLegalRepresentative.replaceAll(" ", "."))%></ID>
  <Name><%=StringEscapeUtils.escapeXml(matter.CorporateLegalRepresentative)%></Name>
</CorporateLegalRep> 