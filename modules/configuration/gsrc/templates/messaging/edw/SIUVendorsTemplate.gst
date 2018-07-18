<% uses util.StringUtils %>
<% uses templates.messaging.edw.TypeListTemplate %>
<% uses templates.messaging.edw.PartyTemplate %>
<%@ params(thesiuvendor : SIUVendorExt, objStatus : String) %>
<SIUVendors>
  <PublicID><%=thesiuvendor.PublicID%></PublicID>
  <ObjectStatus><%=objStatus%></ObjectStatus>
  <% if (thesiuvendor.VendReason != null) {%>
  <%=TypeListTemplate.renderToString(thesiuvendor.VendReason, "VendReason", thesiuvendor.VendReason.ListName)%>
  <%} else {%>
  <VendReason>
    <Code>other</Code>
    <Description>Other - See SIU Claim Note</Description>
    <ListName>SIUVendReasonExt</ListName>
  </VendReason>
  <%}%>
  <% if (thesiuvendor.AssignedDate != null) {%>
  <AssignedDate><%=thesiuvendor.AssignedDate%></AssignedDate> 
  <%}%>
  <% if (thesiuvendor.CompleteDate != null) {%>
  <CompleteDate><%=thesiuvendor.CompleteDate%></CompleteDate>
  <%}%> 
  <% if (thesiuvendor.VendorCost != null) {%>
  <VendorCost><%=thesiuvendor.VendorCost%></VendorCost> 
  <%}%>
  <% if (thesiuvendor.Contact != null) { var thevendor = thesiuvendor.Contact;%>
  <Parties>
    <%=PartyTemplate.renderToString(thevendor, "", objStatus, "", "", "", null, "", "")%>
  </Parties>
  <%}%>
</SIUVendors>
