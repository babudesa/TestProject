<%@ params(theBulkInvoice : BulkInvoice) %>
<% uses org.apache.commons.lang.StringUtils %>
<% uses java.text.SimpleDateFormat %>
<% uses java.text.DateFormat %>
<% uses java.text.NumberFormat %>
<% uses java.text.DecimalFormat %>
<% uses java.util.Calendar %>
<% uses java.lang.Math %>
<% uses java.lang.Double %>
<% uses java.lang.StringBuffer %>
<% var payToString = util.StringUtils.splitName(theBulkInvoice.PayTo)%>
<% var payeeHistAddy:Address = theBulkInvoice.PayToAddressOwner.Address %>
<% var mailToString = util.StringUtils.splitName(theBulkInvoice.MailTo)%>
<% var mailToHistAddyString = util.StringUtils.splitAddressLine3(theBulkInvoice.MailToAddressExt.AddressLine1,theBulkInvoice.MailToAddressExt.AddressLine2)%>
<% var mailToCityStateZip=util.StringUtils.getCityStateZip(theBulkInvoice.MailToAddressExt.City, theBulkInvoice.MailToAddressExt.State.Code, theBulkInvoice.MailToAddressExt.PostalCode)%>


<PrintableCheck xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <referenceNumber>
    <systemCode>CP</systemCode>
    <companyCode>01</companyCode>
    <refJulianDate><%=(new java.text.SimpleDateFormat("yyDDD")).format(java.util.Calendar.getInstance().Time)%></refJulianDate>
    <refSequenceNumber><%=theBulkInvoice.generateRefrenceSequenceNumber()%></refSequenceNumber>
  </referenceNumber>
  
  <transactionCode><% if ((theBulkInvoice.Status == "pendingvoid")|| (theBulkInvoice.Status == "pendingstop")) { %>VP<% } else { %>IC<% } %></transactionCode>
  <paymentMethod>CHK</paymentMethod>
  <taxID><%=theBulkInvoice.Payee.TaxID%></taxID>
  <taxType>2</taxType>
  <% if (payeeHistAddy == null or payeeHistAddy.State == null) { %> <stateCode>--</stateCode> <% }else{ %> <stateCode><%=payeeHistAddy.State%></stateCode> <% } %>
  <formNumber/>
  <producerCopy>N</producerCopy>
  
  <% if(theBulkInvoice.DeliveryMethod == "send" or theBulkInvoice.DeliveryMethod == null){ %><addressIndicator/><% } else { %> <addressIndicator><% if (theBulkInvoice.DeliveryMethod == "agent") { %>a<% } else if (theBulkInvoice.DeliveryMethod == "hold") { %>o<% }%></addressIndicator><% } %>
  <returnToOffice><% if (theBulkInvoice.DeliveryMethod=="hold") { %>Y<% } else { %>N<% } %></returnToOffice>
  <mailToAgent><% if(theBulkInvoice.DeliveryMethod=="agent") { %>Y<% } else { %>N<% } %></mailToAgent>  
  <%
                var theMailingAddress : Address = null;
                var thePayeeAddress : Address = null;
                var theBusinessAddress : Address = null;
                for (anAddress in theBulkInvoice.Payee.AllAddresses) {
                   if (anAddress.AddressType == "mailing") {
                     theMailingAddress = anAddress;
                   }
                   if (anAddress.AddressType == "business") {
                     theBusinessAddress = anAddress;
                   }
                }
                thePayeeAddress = theMailingAddress;
            
   
  %>
  
  <checkData>
    <printCheckInd>Y</printCheckInd>
    <payeeNameAndAddress>
       
         <%if (theBulkInvoice.BulkInvoiceTypeExt == BulkInvoiceType.TC_LIT_ADVISOR) { %> 
              <name><%=util.StringUtils.getXMLValue(theBulkInvoice.PayTo, true)%></name> 
         <%}else {%>              
             <name><%=util.StringUtils.getXMLValue(util.StringUtils.getDisplayNameWithoutFormerAndClosed(theBulkInvoice.PayToLine1Ext), true)%></name>
         <% } %>
      
      <% if (theBulkInvoice.PayToLine2Ext != null and theBulkInvoice.PayToLine2Ext.length() != 0) { %><addressLine><%=util.StringUtils.getXMLValue(util.StringUtils.getDisplayNameWithoutFormerAndClosed(theBulkInvoice.PayToLine2Ext), true)%></addressLine><% } %>
      <addressLine><% if (theBulkInvoice.PayToLine3Ext != null and theBulkInvoice.PayToLine3Ext.length() != 0) { %><%=util.StringUtils.getXMLValue(util.StringUtils.getDisplayNameWithoutFormerAndClosed(theBulkInvoice.PayToLine3Ext), true)%><% } %></addressLine>
      <addressLine><% if (theBulkInvoice.PayToLine4Ext != null and theBulkInvoice.PayToLine4Ext.length() != 0) { %><%=util.StringUtils.getXMLValue(util.StringUtils.getDisplayNameWithoutFormerAndClosed(theBulkInvoice.PayToLine4Ext), true)%><% } %></addressLine>
      <% if (theBulkInvoice.PayToLine5Ext != null and theBulkInvoice.PayToLine5Ext.length() != 0) { %><addressLine><%=util.StringUtils.getXMLValue(util.StringUtils.getDisplayNameWithoutFormerAndClosed(theBulkInvoice.PayToLine5Ext), true)%></addressLine><% } %>
      <% if (theBulkInvoice.PayToLine6Ext != null and theBulkInvoice.PayToLine6Ext.length() != 0) { %><addressLine><%=util.StringUtils.getXMLValue(util.StringUtils.getDisplayNameWithoutFormerAndClosed(theBulkInvoice.PayToLine6Ext), true)%></addressLine><% } %>
      <% if (thePayeeAddress.Country == "US") { %><addressType>D</addressType><% } else { %><addressType>F</addressType><% } %>
    
    </payeeNameAndAddress>
         
    <amount><%=(new java.text.DecimalFormat("########0.00")).format(theBulkInvoice.BulkInvoiceTotal.Amount)%></amount>
    <dateIssued><%=(new java.text.SimpleDateFormat("yyyy-MM-dd")).format(gw.api.util.DateUtil.currentDate())%></dateIssued>
    <bankName>National City</bankName>
    <checkNumber><%=theBulkInvoice.CheckNumber%></checkNumber>
    <micrLine/>
    
    <claimNumber><%=theBulkInvoice.InvoiceItems[0].Claim.ClaimNumber%></claimNumber>
    <companyName/>
                                
    <userCode/>
  </checkData>
  <stubData>
<mailToNameAndAddress>
    
    <%  if(theBulkInvoice.DeliveryMethod==typekey.DeliveryMethod.TC_HOLD){ %>
       
       <name><%=util.StringUtils.getXMLValue("Great American Insurance Company", true)%></name>    
       <% if(theBulkInvoice.CreateUser.GroupUsers[0].Group.DivisionNameExt.DivisionNameValue != null){ %><addressLine><%=util.StringUtils.getXMLValue(theBulkInvoice.CreateUser.GroupUsers[0].Group.DivisionNameExt.DivisionNameValue, true)%></addressLine> <% } %>  
       <% if(theBulkInvoice.AttentionMailToExt != null){%><addressLine><%=util.StringUtils.getXMLValue("ATTN: " + theBulkInvoice.AttentionMailToExt,true)%></addressLine> <% } %> 
       <% if (mailToString[1].length() != 0) { %><addressLine><%=util.StringUtils.getXMLValue(mailToString[1], true)%></addressLine> <% } %>
       <addressLine><% if(mailToHistAddyString[0].length!=0){ %><%=util.StringUtils.getXMLValue(mailToHistAddyString[0], true)%><% } %></addressLine>
       <% if (mailToHistAddyString[1].length!=0) { %><addressLine><%=util.StringUtils.getXMLValue(mailToHistAddyString[1], true)%></addressLine><% } %>
       <addressLine><% if(mailToCityStateZip != null){ %><%=util.StringUtils.getXMLValue(mailToCityStateZip, true)%><% } %></addressLine>
       <% if (theMailingAddress.Country == "US") { %><addressType>D</addressType><% } else { %><addressType>F</addressType><% } %>
     
   <% } else if(theBulkInvoice.MailTo.length<=40){ %>
       
      <name><%=util.StringUtils.getXMLValue(util.StringUtils.getDisplayNameWithoutFormerAndClosed(theBulkInvoice.MailTo), true)%></name>
      <% if(theBulkInvoice.AttentionMailToExt != null){%><addressLine><%=util.StringUtils.getXMLValue("ATTN: " + theBulkInvoice.AttentionMailToExt,true)%></addressLine> <% } %> 
      <addressLine><% if(mailToHistAddyString[0].length!=0){ %><%=util.StringUtils.getXMLValue(mailToHistAddyString[0], true)%><% } %></addressLine>
      <% if (mailToHistAddyString[1].length!=0) { %><addressLine><%=util.StringUtils.getXMLValue(mailToHistAddyString[1], true)%></addressLine><% } %>
      <% if (mailToHistAddyString[2].length!=0) { %><addressLine><%=util.StringUtils.getXMLValue(mailToHistAddyString[2], true)%></addressLine><% } %>
      <addressLine><% if(mailToCityStateZip != null){ %><%=util.StringUtils.getXMLValue(mailToCityStateZip, true)%><% } %></addressLine>
      <% if (theMailingAddress.Country == "US") { %><addressType>D</addressType><% } else { %><addressType>F</addressType><% } %>
      
   <% } else if(theBulkInvoice.MailTo.length>40 && (theBulkInvoice.AttentionMailToExt == null || theBulkInvoice.AttentionMailToExt=="")) { %> 
       
       <name><%=util.StringUtils.getXMLValue(util.StringUtils.getDisplayNameWithoutFormerAndClosed(mailToString[0]), true)%></name>
       <% if (mailToString[1].length() != 0) { %><addressLine><%=util.StringUtils.getXMLValue(mailToString[1], true)%></addressLine> <% } %>
       <addressLine><% if(mailToHistAddyString[0].length!=0){ %><%=util.StringUtils.getXMLValue(mailToHistAddyString[0], true)%><% } %></addressLine>
       <% if (mailToHistAddyString[1].length!=0) { %><addressLine><%=util.StringUtils.getXMLValue(mailToHistAddyString[1], true)%></addressLine><% } %>
       <% if (mailToHistAddyString[2].length!=0) { %><addressLine><%=util.StringUtils.getXMLValue(mailToHistAddyString[2], true)%></addressLine><% } %>
       <addressLine><% if(mailToCityStateZip != null){ %><%=util.StringUtils.getXMLValue(mailToCityStateZip, true)%><% } %></addressLine>
       <% if (theMailingAddress.Country == "US") { %><addressType>D</addressType><% } else { %><addressType>F</addressType><% } %>
      
      
      <% } else { %>
      <name><%=util.StringUtils.getXMLValue(util.StringUtils.getDisplayNameWithoutFormerAndClosed(mailToString[0]), true)%></name>
      <% if (mailToString[1].length() != 0) { %><addressLine><%=util.StringUtils.getXMLValue(mailToString[1], true)%></addressLine> <% } %>
      <% if(theBulkInvoice.AttentionMailToExt != null){%><addressLine><%=util.StringUtils.getXMLValue("ATTN: " + theBulkInvoice.AttentionMailToExt,true)%></addressLine> <% } %> 
      <addressLine><% if(mailToHistAddyString[0].length!=0){ %><%=util.StringUtils.getXMLValue(mailToHistAddyString[0], true)%><% } %></addressLine>
      <% if (mailToHistAddyString[1].length!=0) { %><addressLine><%=util.StringUtils.getXMLValue(mailToHistAddyString[1], true)%></addressLine><% } %>
      <addressLine><% if(mailToCityStateZip != null){ %><%=util.StringUtils.getXMLValue(mailToCityStateZip, true)%><% } %></addressLine>
      <% if (theMailingAddress.Country == "US") { %><addressType>D</addressType><% } else { %><addressType>F</addressType><% } %>
      <% } %>
      
    </mailToNameAndAddress>
    <verbageLines>
    
    <stubProducer/>
    
      <% var checkNumPart = "CHECK # " + theBulkInvoice.CheckNumber;
         var amountPart = "AMT " + java.text.NumberFormat.getCurrencyInstance().format(theBulkInvoice.BulkInvoiceTotal.Amount);
         var issuedDate = "ISSUED " + java.text.DateFormat.getDateInstance(java.text.DateFormat.SHORT).format(theBulkInvoice.ScheduledSendDate);
         var fillerCount : java.lang.Double = (90 - checkNumPart.length() - amountPart.length() - issuedDate.length()) / 2;
         var fillerCount1 = java.lang.Math.ceil(fillerCount);
         var fillerCount2 = java.lang.Math.floor(fillerCount);
         var combinedLine = new java.lang.StringBuffer().append(checkNumPart).append(org.apache.commons.lang.StringUtils.leftPad(amountPart, amountPart.length() + fillerCount1 as int)).append(org.apache.commons.lang.StringUtils.leftPad(issuedDate, issuedDate.length() + fillerCount2 as int));
      %>
      <verbageLine><%=combinedLine%></verbageLine>
      <% var memoLine1 = "";
         var memoLine2 = "";
        if (theBulkInvoice.Memo == null) { %>
        <% } else if (theBulkInvoice.Memo.length() < 75) {
             memoLine1 = theBulkInvoice.Memo; %>
        <% } else {
          var lastIndex = theBulkInvoice.Memo.lastIndexOf(" ", 75);
          %><%
          if (lastIndex < 0) {
          	memoLine1 = theBulkInvoice.Memo.substring(0, 75);
          	memoLine2 = theBulkInvoice.Memo.substring(76, theBulkInvoice.Memo.length());
          }
          else {
          	memoLine1 = theBulkInvoice.Memo.substring(0, lastIndex);
          	memoLine2 = theBulkInvoice.Memo.substring(lastIndex + 1, theBulkInvoice.Memo.length());
          	if (memoLine2.length() > 75) {
          		memoLine2 = memoLine2.substring(0, 75);
          	}
          }
        } %>
        
       <%var forString = new StringBuffer().append("FOR:  " + memoLine1)%>
      <verbageLine><%=util.StringUtils.getXMLValue(forString as java.lang.String, true)%></verbageLine>
      
      <%if(memoLine2 != null && !memoLine2.trim().equals("")){%>
      <verbageLine>               <%=util.StringUtils.getXMLValue(memoLine2, true)%></verbageLine>
     <%}else{%><verbageLine/><%}%>
      
      <verbageLine>INSURED:  MULTIPLE INSUREDS</verbageLine>
      <verbageLine>CLAIMANT: MULTIPLE CLAIMANTS</verbageLine>
     
       <% var policyPart = "POLICY # " + theBulkInvoice.InvoiceItems[0].Claim.Policy.PolicyNumber;
	     var claimNumPart = "CLAIM # " + theBulkInvoice.InvoiceItems[0].Claim.ClaimNumber;
	     var dolPart = "DATE OF LOSS " + DateFormat.getDateInstance(DateFormat.SHORT).format(theBulkInvoice.InvoiceItems[0].Claim.LossDate);
	     fillerCount = (90 - policyPart.length() - claimNumPart.length() - dolPart.length()) / 2;
             fillerCount1 = Math.ceil(fillerCount);
             fillerCount2 = Math.floor(fillerCount);
	     combinedLine = new StringBuffer().append(policyPart);
	     combinedLine.append(StringUtils.leftPad(claimNumPart, claimNumPart.length() + fillerCount1 as int));
	     combinedLine.append(StringUtils.leftPad(dolPart, dolPart.length() + fillerCount2 as int));
      %>
      <verbageLine><%=combinedLine%></verbageLine>
      <verbageLine/>
      <verbageLine/>
      <verbageLine>IMPORTANT: WHEN CORRESPONDING WITH THE CLAIM OFFICE, PLEASE REFER TO YOUR CLAIM NUMBER</verbageLine>
      <verbageLine>                      AND CONTACT THE ADJUSTER SHOWN BELOW:</verbageLine>
      <verbageLine>                                <%=util.StringUtils.getXMLValue(theBulkInvoice.InvoiceItems[0].Claim.AssignedUser.Contact.DisplayName, true)%></verbageLine>
      <verbageLine>                                <%=util.StringUtils.getXMLValue(theBulkInvoice.InvoiceItems[0].Claim.Policy.IssuingCompanyExt.DisplayName, true)%></verbageLine>

	<% var mailingAddress : Address = null;
         var businessAddress : Address = null;
         for (anAddress in theBulkInvoice.InvoiceItems[0].Claim.AssignedUser.Contact.AllAddresses) {
           if (anAddress.AddressType == "mailing") {
             mailingAddress = anAddress;
           }
           if (anAddress.AddressType == "business") {
             businessAddress = anAddress;
           }
         }
         if (mailingAddress != null) { %>
      <verbageLine>                                <%=util.StringUtils.getXMLValue(mailingAddress.AddressLine1, true)%></verbageLine>
      		<% if (mailingAddress.AddressLine2 != null) { %>
      <verbageLine>                                <%=util.StringUtils.getXMLValue(mailingAddress.AddressLine2, true)%></verbageLine>
      <verbageLine>                                <%=util.StringUtils.getXMLValue(mailingAddress.CityStateZip, true)%></verbageLine>
      		<% } else { %>
      <verbageLine>                                <%=util.StringUtils.getXMLValue(mailingAddress.CityStateZip, true)%></verbageLine>
      <verbageLine/>
      		<% } %>
      	<% } else if (businessAddress != null) { %>
      	<verbageLine>                                <%=util.StringUtils.getXMLValue(businessAddress.AddressLine1, true)%></verbageLine>
      		<% if (businessAddress.AddressLine2 != null) { %>
      <verbageLine>                                <%=util.StringUtils.getXMLValue(businessAddress.AddressLine2, true)%></verbageLine>
      <verbageLine>                                <%=util.StringUtils.getXMLValue(businessAddress.CityStateZip, true)%></verbageLine>
      		<% } else { %>
      <verbageLine>                                <%=util.StringUtils.getXMLValue(businessAddress.CityStateZip, true)%></verbageLine>
      <verbageLine/>
      		<% } %>
      	<% } else {
           if (theBulkInvoice.InvoiceItems[0].Claim.LOBCode.Code == "equine") { %>
      <verbageLine>                                EQUINE CLAIMS</verbageLine>
      <verbageLine>                                P.O. BOX 2428</verbageLine>
      <verbageLine>                                CINCINNATI, OH 45201-2438</verbageLine>
          <% } else {
                 if ((theBulkInvoice.InvoiceItems[0].Claim.LOBCode.Code == "agriproperty" ) || (theBulkInvoice.InvoiceItems[0].Claim.LOBCode.Code == "agriliability" ) || (theBulkInvoice.InvoiceItems[0].Claim.LOBCode.Code == "agriauto" )) { %>
      <verbageLine>                                AGRIBUSINESS CLAIMS</verbageLine>
      <verbageLine>                                P.O. BOX 1239</verbageLine>
      <verbageLine>                                CINCINNATI, OH 45201-1239</verbageLine>
      	<% }
             } 
         } %>
      <verbageLine>                                <%=util.StringUtils.getXMLValue(theBulkInvoice.InvoiceItems[0].Claim.AssignedUser.Contact.WorkPhone, true)%></verbageLine>
      <verbageLine/>
      <verbageLine/>
      <verbageLine/>
      <verbageLine/>
      <verbageLine/>
      <verbageLine/>
      <verbageLine>GREAT AMERICAN INSURANCE COMPANY, AS AGENT FOR:</verbageLine>
      <verbageLine><%=util.StringUtils.getXMLValue(theBulkInvoice.InvoiceItems[0].Claim.Policy.IssuingCompanyExt.DisplayName, true)%></verbageLine>
      <% var businessUnitAddress : Address = theBulkInvoice.InvoiceItems[0].Claim.getClaimBusinessUnitGroup().GroupAddressExt%>
      <% if ( businessUnitAddress != null) { %>
        <verbageLine><%=util.StringUtils.getXMLValue(businessUnitAddress.AddressLine1, true)%></verbageLine>
        <verbageLine><%=util.StringUtils.getXMLValue(businessUnitAddress.CityStateZip, true)%></verbageLine>
	  <% } else { %>
        <verbageLine>  </verbageLine>
        <verbageLine>  </verbageLine>
      <% } %>
      <verbageLine><% var claimNo = "CLAIM  NO.: " + theBulkInvoice.InvoiceItems[0].Claim.ClaimNumber; if (claimNo.length() > 50) { %><%=claimNo.substring(0, 49) %><% } else { %><%=claimNo%><% } %></verbageLine>
      <verbageLine><% var policyNo = "POLICY NO.: " + theBulkInvoice.InvoiceItems[0].Claim.Policy.PolicyType + " " + theBulkInvoice.InvoiceItems[0].Claim.Policy.PolicyNumber; if (policyNo.length() > 50) { %><%=policyNo.substring(0, 49) %><% } else { %><%=policyNo%><% } %></verbageLine>
      <verbageLine><% var dol = "DATE/LOSS: " + DateFormat.getDateInstance(DateFormat.SHORT).format(theBulkInvoice.InvoiceItems[0].Claim.LossDate); if (dol.length() > 50) { %><%=dol.substring(0, 49) %><% } else { %><%=dol%><% } %></verbageLine>
      <verbageLine>STMT. OF ACCT: <%=util.StringUtils.getXMLValue(memoLine1, true)%></verbageLine>
      <verbageLine/>  
      <verbageLine>MULTIPLE AGENTS</verbageLine>
      <verbageLine/>  
    </verbageLines>
  </stubData>
  <EscheatName><% if (util.StringUtils.getXMLValue(util.StringUtils.getDisplayNameWithoutFormerAndClosed(theBulkInvoice.Payee.DisplayName), true).length() > 40) {%><%=util.StringUtils.getXMLValue(util.StringUtils.getDisplayNameWithoutFormerAndClosed(theBulkInvoice.Payee.DisplayName), true).substring(0, 39)%><% } else { %><%=util.StringUtils.getXMLValue(util.StringUtils.getDisplayNameWithoutFormerAndClosed(theBulkInvoice.Payee.DisplayName), true)%><%}%></EscheatName>  
  <EscheatAddress1><% if (theBulkInvoice.PayToAddressOwner != null and theBulkInvoice.PayToAddressOwner.Address.AddressLine1 != Null) {%><% if (util.StringUtils.getXMLValue(util.StringUtils.getDisplayNameWithoutFormerAndClosed(theBulkInvoice.PayToAddressOwner.Address.AddressLine1), true).length() > 40) { %><%=util.StringUtils.getXMLValue(util.StringUtils.getDisplayNameWithoutFormerAndClosed(theBulkInvoice.PayToAddressOwner.Address.AddressLine1), true).substring(0, 39)%><% } else {%><%=util.StringUtils.getXMLValue(util.StringUtils.getDisplayNameWithoutFormerAndClosed(theBulkInvoice.PayToAddressOwner.Address.AddressLine1), true)%><% } }%></EscheatAddress1>
  <EscheatAddress2><% if (theBulkInvoice.PayToAddressOwner != null and theBulkInvoice.PayToAddressOwner.Address.AddressLine2 != Null) {%><% if (util.StringUtils.getXMLValue(util.StringUtils.getDisplayNameWithoutFormerAndClosed(theBulkInvoice.PayToAddressOwner.Address.AddressLine2), true).length() > 40) { %><%=util.StringUtils.getXMLValue(util.StringUtils.getDisplayNameWithoutFormerAndClosed(theBulkInvoice.PayToAddressOwner.Address.AddressLine2), true).substring(0, 39)%><% } else {%><%=util.StringUtils.getXMLValue(util.StringUtils.getDisplayNameWithoutFormerAndClosed(theBulkInvoice.PayToAddressOwner.Address.AddressLine2), true)%><% } }%></EscheatAddress2>
  <EscheatCity><% if (theBulkInvoice.PayToAddressOwner != null and theBulkInvoice.PayToAddressOwner.Address.City != null) { %><%=util.StringUtils.getXMLValue(util.StringUtils.getDisplayNameWithoutFormerAndClosed(theBulkInvoice.PayToAddressOwner.Address.City), true)%><% } %></EscheatCity>
  <EscheatState><% if (theBulkInvoice.PayToAddressOwner != null and theBulkInvoice.PayToAddressOwner.Address.State.Code != null) { %><%=util.StringUtils.getXMLValue(util.StringUtils.getDisplayNameWithoutFormerAndClosed(theBulkInvoice.PayToAddressOwner.Address.State.Code), true)%><% } %></EscheatState>
  <EscheatZipCode><% if (theBulkInvoice.PayToAddressOwner != null and theBulkInvoice.PayToAddressOwner.Address != null) { %><%=theBulkInvoice.replacePostalCode(theBulkInvoice.PayToAddressOwner.Address)%><% } %></EscheatZipCode>
  <JurisdictionState></JurisdictionState>
  <BackCheckInd><%=theBulkInvoice.getBackOfCheckIndicator()%></BackCheckInd>
</PrintableCheck>