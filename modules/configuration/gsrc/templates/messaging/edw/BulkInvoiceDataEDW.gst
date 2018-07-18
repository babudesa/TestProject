<% uses util.UniqueNumberGenerators %>
<% uses util.StringUtils %>
<% uses templates.messaging.edw.TypeListTemplate %>
<% uses templates.messaging.edw.PartyTemplate %>
<% uses templates.messaging.edw.UserTemplate %>
<%@ params(bi : BulkInvoice, objStatus : String) %>
<Transaction>
  <CCTransactionTime>
  <%=util.custom_Ext.DateTime.getTimeStamp()%>
  </CCTransactionTime>
  <uniqueID><%=UniqueNumberGenerators.generateEDWUniqueID()%></uniqueID>
  <BulkInvoice>
    <PublicID><%=bi.PublicID%></PublicID>
    <ObjectStatus><%=objStatus%></ObjectStatus>
    <% if (bi.CreateTime != null) {%>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(bi.CreateTime)%></CreateTime>
    <%}%>
    <% if (bi.UpdateTime != null) {%>
    <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(bi.UpdateTime)%></UpdateTime>
    <%}%>
    <% if (bi.ApprovalDate != null) {%>
    <ApprovalDate><%=bi.ApprovalDate%></ApprovalDate>
    <%}%>
    <% if (bi.ReceivedDate != null) {%>
    <ReceivedDate><%=bi.ReceivedDate%></ReceivedDate>
    <%}%>
    <% if (bi.Memo != null) {%>
    <Memo><%=StringUtils.getXMLValue(bi.Memo,false)%></Memo> 
    <%}%>
    <% if (bi.SplitEqually != null) {%>
    <SplitEqually><%=StringUtils.getXMLValue(bi.SplitEqually as java.lang.String,false)%></SplitEqually> 
    <%}%>
    <% if (bi.InvoiceNumber != null) {%>
    <InvoiceNumber><%=StringUtils.getXMLValue(bi.InvoiceNumber,false)%></InvoiceNumber> 
    <%}%>
    <% if (bi.BulkInvoiceIDExt != null) {%>
    <BulkInvoiceIDExt><%=StringUtils.getXMLValue(bi.BulkInvoiceIDExt,false)%></BulkInvoiceIDExt> 
    <%}%>
    <% if (bi.BulkInvoiceTypeExt != null) {%>
    <%=TypeListTemplate.renderToString(bi.BulkInvoiceTypeExt, "BulkInvoiceTypeExt", bi.BulkInvoiceTypeExt.ListName)%>
    <%}%>
    <% if (bi.Status != null) {%>
    <%=TypeListTemplate.renderToString(bi.Status, "Status", bi.Status.ListName)%>
    <%}%>
    <% if (bi.InvoiceDateExt != null) {%>
    <BulkInvoiceDate><%=bi.InvoiceDateExt%></BulkInvoiceDate>
    <%}%>
    <% var claimlist : java.util.Set = new java.util.HashSet();  %>
    <% if ( bi.InvoiceItems != null && (bi.Status != "voided" || bi.Status != "pendingvoid" )) {%>
    <BulkInvoiceLineItems>
      <% for ( lineItem in bi.InvoiceItems) {%>
      <% claimlist.add(lineItem.Claim.PublicID); %>
      <LineItem>			    
        <PublicID><%=lineItem.PublicID%></PublicID>
        <ObjectStatus><%=objStatus%></ObjectStatus>
        <% if (lineItem.CreateTime != null) {%>
        <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(bi.CreateTime)%></CreateTime>
        <%}%>
        <% if (lineItem.UpdateTime != null) {%>
        <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(lineItem.UpdateTime)%></UpdateTime>
        <%}%>
        <% if (lineItem.AssociatedPayment != null) {%>
        <RelToPayment><%=lineItem.AssociatedPayment.PublicID%></RelToPayment>
        <%}%>
        <% if (lineItem.Explanation != null) {%>
        <Explanation><%=lineItem.Explanation%></Explanation>
        <%}%>
        <% if (lineItem.Description != null) {%>
        <Description><%=lineItem.Description%></Description>
        <%}%>
        <% if (lineItem.Status != null) {%>
        <%=TypeListTemplate.renderToString(lineItem.Status, "Status", lineItem.Status.ListName)%>
        <%}%>
      </LineItem>
      <%}%>
    </BulkInvoiceLineItems>
    <%}%>

    <% var partyRelTo = "<PartyRelTo><PublicID>"+bi.PublicID+"</PublicID><RelToType>BulkInvoice</RelToType></PartyRelTo>"%>
    <Parties>
      <% if (bi.CreateUser != null) { %>
	      <%=UserTemplate.renderToString(bi.CreateUser, "", objStatus, displaykey.EDW.Templates.CreateUserRole, "", partyRelTo)%>
      <%}%>
      <% if (bi.UpdateUser != null) { %>
	      <%=UserTemplate.renderToString(bi.UpdateUser, "", objStatus, displaykey.EDW.Templates.UpdateUserRole, "", partyRelTo)%>
      <%}%>
      <% if ((bi.Payee != null) ) { var thePayeeUser = bi.Payee;%>
      <%var prole = "<Role><Code>PrimaryPayee</Code><Description>PrimaryPayee</Description><ListName>PrimaryPayee</ListName></Role>"%>
      <%=PartyTemplate.renderToString(thePayeeUser, "", objStatus, prole, "", partyRelTo, null, "", "")%>
      <%}%>
    </Parties>
    <%-- BESTOR 20100909 - FIX FOR DEFECT 3528 --%>
    <% if ( bi.InvoiceItems != null) {%>
    <%for (cPublicID in claimlist) {%>
    <RelatedClaim>
      <PublicID><%=cPublicID%></PublicID>
    </RelatedClaim>
    <%}%>
    <%}%> 
  </BulkInvoice>
</Transaction>
