<%@ params(theCheck:Check, thePayee:CheckPayee, theNetAmount:java.math.BigDecimal, theAddress:Address, theExpenseCode:String, thePaymentBox:String) %>
<tax:Taxport1099Input xmlns:tax="http://www.greatamericaninsurance.com/guidewire/taxport1099">
  <tax:TaxPort1099>
  	<% if (theCheck.IssueDate != null) { %>
	    <ReportingYr><%=(new java.text.SimpleDateFormat("yyyy")).format(theCheck.IssueDate)%></ReportingYr>
    <% } else { %>
	    <ReportingYr/>
    <% } %>
    <TaxId><%=thePayee.Payee.TaxID.replaceAll("-", "")%></TaxId>
    <TaxIdType><% if (thePayee.Payee.Ex_TaxStatusCode.Code == 3) { %>2<% } 
    else if (thePayee.Payee.Ex_TaxStatusCode.Code == 2) { %>1<% }
    else if (thePayee.Payee.Ex_TaxStatusCode.Code == "B") { %>1<% }
    else if (thePayee.Payee.Ex_TaxStatusCode.Code == "T") { %>1<% }
    else if (thePayee.Payee.Ex_TaxStatusCode.Code == 9) { %>9<% }
    else { %>1<% } %></TaxIdType>     
    <% if(thePayee.Payee.DisplayName.length() <= 40) { %>
    <NameLine1><![CDATA[<%=thePayee.Payee.DisplayName.replaceAll("[^a-zA-Z0-9\\&\\-\\s]", "")%>]]></NameLine1>
    <NameLine2/>
    <% } else { %> 
    <NameLine1><![CDATA[<%=org.apache.commons.lang.StringUtils.substringBeforeLast(thePayee.Payee.DisplayName.substring(0, 40), " ").replaceAll("[^a-zA-Z0-9\\&\\-\\s]", "") %>]]></NameLine1>
    <NameLine2><![CDATA[<%=org.apache.commons.lang.StringUtils.strip(org.apache.commons.lang.StringUtils.substringAfter(thePayee.Payee.DisplayName, org.apache.commons.lang.StringUtils.substringBeforeLast(thePayee.Payee.DisplayName.substring(0, 40), " "))).replaceAll("[^a-zA-Z0-9\\&\\-\\s]", "")%>]]></NameLine2>
    <% } %>
    <AddrLine1><![CDATA[<%=theAddress.AddressLine1%>]]></AddrLine1>
    <AddrLine2><![CDATA[<%=theAddress.AddressLine2 == null ? "" : theAddress.AddressLine2%>]]></AddrLine2>
    <City><%=theAddress.City%></City>
    
    <% if (theAddress.State != null) { %>
    	<State><%=theAddress.State.Code%></State>
    <% } else { %>
    	<State/>
    <% } %>
    
    <% if (theAddress.PostalCode != null) { %>    
    <Zip5><% if(theAddress.Country.Code != "CA" and theAddress.PostalCode.length() <= 5) { %><%=theAddress.PostalCode%><% } else if(theAddress.Country.Code == "CA"){%><%=theAddress.PostalCode.subString(0,3)%><% } else { %><%=theAddress.PostalCode.substring(0, 5)%><% } %></Zip5>
    <Zip4><% if(theAddress.Country.Code != "CA" and theAddress.PostalCode.length() <= 5) { %><% } else if(theAddress.Country.Code == "CA"){%><%=theAddress.PostalCode.subString(3)%><% } else if(theAddress.PostalCode.substring(5).length() > 4) { %><%=theAddress.PostalCode.substring(6,10)%><% } else { %><%=theAddress.PostalCode.substring(5)%><% } %></Zip4>
    <% } else { %>
    <Zip5/>
    <Zip4/>
    <% } %>
     
    <PaymentBox><%=thePaymentBox.toString()%></PaymentBox>
         
    <PaymentAmount><%=(new java.text.DecimalFormat("########0.00")).format( theNetAmount )%></PaymentAmount>
  	<% if (theCheck.IssueDate != null) { %>
	    <CheckDate><%=(new java.text.SimpleDateFormat("yyyy-MM-dd")).format(theCheck.IssueDate)%></CheckDate>
    <% } else { %>
	    <CheckDate/>
    <% } %>
    <CheckNumber><%=theCheck.CheckNumber%></CheckNumber>
    <% if (theCheck.Claim.Policy.ProducerCode == null) { %><Producer/><% } else { %><Producer><%=theCheck.Claim.Policy.ProducerCode%></Producer><% } %>
    <OriginCode>CP</OriginCode>
    <ReturnType>M</ReturnType>
    <PaymentDescription><% if (thePayee.Payee.Ex_TaxStatusCode.Code == "9") { %>C<% } else { %>I<% } %></PaymentDescription>
    <TaxIdFlag>N</TaxIdFlag>
    <ClaimNumber><%=theCheck.Claim.ClaimNumber%></ClaimNumber>
  </tax:TaxPort1099>
</tax:Taxport1099Input> 