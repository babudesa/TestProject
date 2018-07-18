<%@ params(contact : Contact, actionDescription : String) %>
<% uses org.apache.commons.lang.StringEscapeUtils %>
<% uses templates.messaging.LDM.commons.MatterString %>
<LawFirm>  
  <ID><%=contact.PublicID%></ID>
  <ActionDesc><%=actionDescription%></ActionDesc>
  <Name><%=StringEscapeUtils.escapeXml(contact.DisplayName)%></Name>
  <% if(contact.TaxID != null){%>
      <%=MatterString.renderToString(contact.TaxID.toString(), "TaxID")%>
  <%}%>
  <% if (contact typeis LawFirm and contact.PanelIndicatorExt != null)
      if(contact.PanelIndicatorExt == "panel"){%>
    <PanelIND>true</PanelIND>
  <%} else {%>
    <PanelIND>false</PanelIND>
  <%}%>
</LawFirm> 