<% uses templates.messaging.LDM.commons.MatterDate %>
<% uses templates.messaging.LDM.commons.MatterString %>
<% uses templates.messaging.LDM.commons.MatterBit %>
<% uses org.apache.commons.lang.StringEscapeUtils %>

<%@ params(matterMediator : MatterMediatorExt, mediator : Contact, actionDescription : String) %>

<LawMediation>
  <ActionDesc><%=actionDescription%></ActionDesc>  
  <MediatorID><%=matterMediator.PublicID%></MediatorID>
  <LegalActionID><%=matterMediator.Matter.PublicID%></LegalActionID>  
  <%=MatterString.renderToString(StringEscapeUtils.escapeXml(mediator.toString()), "MediatorName")%>
  <%=MatterBit.renderToString(matterMediator.RecommendMediatorExt, "RecommendMediator")%>    
  <%=MatterString.renderToString(StringEscapeUtils.escapeXml(matterMediator.AdditionalCommentsExt), "AdditionalComments")%> 
  <%=MatterDate.renderToString(matterMediator.Matter.MediationDate, "MediationDate")%> 
</LawMediation>