<% uses gw.entity.TypeKey %>
<% uses util.StringUtils %>
<%@ params(aTypeKey : TypeKey, nodeName : String, listName : String) %>
<<%=nodeName%>>
  <Code><%=aTypeKey.Code%></Code>
  <Description><%=StringUtils.getXMLValue(aTypeKey.Description, false)%></Description>
  <ListName><%=listName%></ListName>
</<%=nodeName%>>
