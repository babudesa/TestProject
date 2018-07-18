<% uses util.UniqueNumberGenerators %>
<% uses util.StringUtils %>
<% uses templates.messaging.edw.TypeListTemplate %>
<% uses org.apache.commons.lang.StringEscapeUtils %>
<%uses templates.messaging.edw.PartyTemplate%>
<% uses gaic.conversion.util.ConversionStatusChecker %>

<%@ params(invoice : SIRInvoiceExt, objStatus : String, exposure : Exposure) %>
<%--  var sir = exposure.SIRsExt --%>

    <%var partyRelTo = "<PartyRelTo><PublicID>"+invoice.PublicID+"</PublicID><RelToType>Invoice</RelToType></PartyRelTo>"%>

    <PublicID><%=invoice.PublicID%></PublicID>
    <ObjectStatus><%=objStatus%></ObjectStatus>
    
    <% if (exposure.LoadCommandID != null and ConversionStatusChecker.isCurrentlyConverting(exposure.LoadCommandID, exposure.CreateUser, exposure.UpdateUser) and exposure.HospitalDate != null) { %>
      <AssignmentDate><%=exposure.HospitalDate%></AssignmentDate>
    <% } else if (exposure.AssignmentDate != null) { %>
      <AssignmentDate><%=exposure.AssignmentDate%></AssignmentDate>   
    <%}%>
    <InvoiceType>
      <Code>SIR</Code>
      <Description>SIRInvoiceExt</Description>
      <ListName>SIRInvoiceExt</ListName>
    </InvoiceType> 
				  
    <% if (invoice.CostTypeExt != null) {%> 
      <%=TypeListTemplate.renderToString(invoice.CostTypeExt, "InvoiceCostType", invoice.CostTypeExt.ListName)%>
    <%}%>    
    
    <InvoiceAmount><%=invoice.InvoiceAmount.Amount%></InvoiceAmount>
    <DisputedAmount><%=invoice.DisputedAmount.Amount%></DisputedAmount>
    <CreditedAmount><%=invoice.CreditSIR.Amount%></CreditedAmount>

    <% if(invoice.LineCategoryExt != null) { %>
      <%=TypeListTemplate.renderToString(invoice.LineCategoryExt, "InvoicePaymentCode", invoice.LineCategoryExt.ListName)%>
    <% } %>
	
    <% if(invoice.InvoiceDate != null) { %>
      <InvoiceDate><%=invoice.InvoiceDate%></InvoiceDate>
    <% } %>	
    <% if(invoice.InvoiceNumber != null) { %>
      <InvoiceNum><%=invoice.InvoiceNumber%></InvoiceNum>
    <% } %>		
	
    <Parties>
      <% var vendor = invoice.VendorExt %>
      <% var iprole = "<Role><Code>sirinvoicepayee</Code><Description>SIRINVPAY</Description><ListName>ContactRole</ListName></Role>"%>
    
      <%=PartyTemplate.renderToString(vendor, "", objStatus, iprole, "", partyRelTo, exposure.Claim, "", "")%>
    </Parties>