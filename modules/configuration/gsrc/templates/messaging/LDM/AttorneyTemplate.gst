<% uses templates.messaging.LDM.commons.MatterString %>
<%@ params(contact : Contact, actionDescription : String) %>
<Attorney>  
    <ID><%=contact.PublicID%></ID>
    <ActionDesc><%=actionDescription%></ActionDesc>
    <FirstName><![CDATA[<%=contact.Person.FirstName%>]]></FirstName>
    <LastName><![CDATA[<%=contact.Person.LastName%>]]></LastName>
  <% if(contact.Person.TaxID != null){%>
      <%=MatterString.renderToString(contact.Person.TaxID.toString(), "TaxID")%>
  <%}%>
  <% if (contact typeis Attorney and contact.PanelIndicatorExt != null)
    if(contact.PanelIndicatorExt == "panel"){%>
    <PanelIND>true</PanelIND>
  <%} else {%>
    <PanelIND>false</PanelIND>
  <%}%>       
</Attorney> 