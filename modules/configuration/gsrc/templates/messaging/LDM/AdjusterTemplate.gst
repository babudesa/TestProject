<%@ params(contact : Contact, actionDescription : String) %>
<Adjuster>
    <AdjusterID><%=contact.PublicID%></AdjusterID>
    <ActionDesc><%=actionDescription%></ActionDesc>
    <FirstName><![CDATA[<%=contact.Person.FirstName%>]]></FirstName>
    <LastName><![CDATA[<%=contact.Person.LastName%>]]></LastName>
</Adjuster>