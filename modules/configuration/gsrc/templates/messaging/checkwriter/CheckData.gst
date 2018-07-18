<%@ params(theCheck:Check) %>
<% uses org.apache.commons.lang.StringUtils %>
<% uses java.text.SimpleDateFormat %>
<% uses java.text.DateFormat %>
<% uses java.text.NumberFormat %>
<% uses java.text.DecimalFormat %>
<% uses java.util.Calendar %>
<% uses java.lang.Math %>
<% uses java.lang.Double %>
<% uses java.lang.StringBuffer %>
<% uses templates.messaging.checkwriter.CheckDataUtil %>
<% var payToString = util.StringUtils.splitName(theCheck.PayTo)%>
<% var mailToString = util.StringUtils.splitName(theCheck.MailTo)%>
<% var mailToCityStateZip = util.StringUtils.getCityStateZip(theCheck.MailToAddressOwner.Address.City, theCheck.MailToAddressOwner.Address.State.Code, theCheck.MailToAddressOwner.Address.PostalCode)%>
<% var mailToHistAddyString = util.StringUtils.splitAddressLine3(theCheck.MailToAddressOwner.Address.AddressLine1,theCheck.MailToAddressOwner.Address.AddressLine2)%>
<% var payeeHistAddy:Address = theCheck.getPrimaryPayeeHistoryAddress() %>
<% var mailToHistAddy:Address = theCheck.getMailToHistoryAddress() %>

<PrintableCheck xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <referenceNumber>
  
    <systemCode><% if (theCheck.BankAccount.Code == "national_city") { %>CP<% } else { %>GC<% } %></systemCode>
   
    <companyCode>01</companyCode>
    <refJulianDate><%=(new SimpleDateFormat("yyDDD")).format(Calendar.getInstance().Time)%></refJulianDate>
    <refSequenceNumber><%=theCheck.generateRefrenceSequenceNumber()%></refSequenceNumber>
  </referenceNumber>
  <transactionCode><% if ((theCheck.Status == "pendingvoid")|| (theCheck.Status == "pendingstop")) { %>VP<% } else { %>IC<% } %></transactionCode>
  <paymentMethod>CHK</paymentMethod>
  <% if (theCheck.Vendor == null) { if (theCheck.getFirstTaxID() == null) { %> <taxID/> <% } else { %> <taxID><%=CheckDataUtil.fixTaxID(theCheck.getFirstTaxID())%></taxID> <% } %>
  <taxType>1</taxType>
 <% } else { %> <taxID><%=CheckDataUtil.fixTaxID(theCheck.Vendor.TaxID)%></taxID>
  <taxType>2</taxType> <% } %>
  <% if (payeeHistAddy == null or payeeHistAddy.State == null) { %> <stateCode>--</stateCode> <% }else{ %> <stateCode><%=payeeHistAddy.State%></stateCode> <% } %>
  <formNumber/>
  <producerCopy><% if (theCheck.ex_ProducerCopy == "Yes") { %>Y<% } else { %>N<% } %></producerCopy>
  
  <% if(theCheck.DeliveryMethod == "send" or theCheck.DeliveryMethod == null){ %><addressIndicator/><% } else { %> <addressIndicator><% if (theCheck.DeliveryMethod == "agent") { %>a<% } else if (theCheck.DeliveryMethod == "hold") { %>o<% }%></addressIndicator> <% } %>
  <returnToOffice><% if (theCheck.DeliveryMethod=="hold") { %>Y<% } else { %>N<% } %></returnToOffice>
  <mailToAgent><% if(theCheck.DeliveryMethod=="agent") { %>Y<% } else { %>N<% } %></mailToAgent> 
  <zipCode><%=theCheck.replacePostalCode(theCheck.ex_MailToAddress)%></zipCode>
  <checkData>
    <printCheckInd>Y</printCheckInd>
    <payeeNameAndAddress>
   <% if (theCheck.getDisplayNameWithoutFormerAndClosed(theCheck.PayToLine1Ext).length() > 40) { %>
	  <name><![CDATA[<%=theCheck.getDisplayNameWithoutFormerAndClosed(theCheck.PayToLine1Ext).substring(0, 40)%>]]></name>
   <% } else { %> 
	 <name><![CDATA[<%=theCheck.getDisplayNameWithoutFormerAndClosed(theCheck.PayToLine1Ext)%>]]></name>
   <% } %>
         
   <addressLine><%=CheckDataUtil.getAddressLineForPayToLine(theCheck.PayToLine2Ext, theCheck)%></addressLine>
   <addressLine><%=CheckDataUtil.getAddressLineForPayToLine(theCheck.PayToLine3Ext, theCheck)%></addressLine>
   <addressLine><%=CheckDataUtil.getAddressLineForPayToLine(theCheck.PayToLine4Ext, theCheck)%></addressLine>   
   <addressLine><%=CheckDataUtil.getAddressLineForPayToLine(theCheck.PayToLine5Ext, theCheck)%></addressLine>   
   <addressLine><%=CheckDataUtil.getAddressLineForPayToLine(theCheck.PayToLine6Ext, theCheck)%></addressLine>   
	 
      <% if (payeeHistAddy != null and payeeHistAddy.Country != null and payeeHistAddy.Country == "US") { %><addressType>D</addressType><% } else { %><addressType>F</addressType><% } %>
      
    </payeeNameAndAddress>
    
    
    
    
    
    
       
    <amount><%=(new DecimalFormat("########0.00")).format(theCheck.NetAmount.Amount)%></amount>
    <dateIssued><%=(new SimpleDateFormat("yyyy-MM-dd")).format(gw.api.util.DateUtil.currentDate())%></dateIssued>
    <% if (theCheck.BankAccount == null) { %><bankName>National City</bankName><% } else { %><bankName><%=util.StringUtils.getXMLValue(theCheck.BankAccount.DisplayName, false)%></bankName><% } %>
    <checkNumber><%=theCheck.CheckNumber%></checkNumber>
    <micrLine/>
    <claimNumber><%=theCheck.Claim.ClaimNumber%></claimNumber>
    
    
    
    <companyName><![CDATA[<%=theCheck.Claim.Policy.IssuingCompanyExt.DisplayName%>]]></companyName>
    
    
    
    <userCode/>
  </checkData>
  <stubData>
  <mailToNameAndAddress>   
      
  <% if (theCheck.DeliveryMethod== typekey.DeliveryMethod.TC_HOLD) {  %>    
       
       <name><%=util.StringUtils.getXMLValue("Great American Insurance Company", true)%></name>    
       <% if(theCheck.Claim.AssignedGroup.DivisionNameExt.DivisionNameValue != null){ %><addressLine><%=util.StringUtils.getXMLValue(theCheck.Claim.AssignedGroup.DivisionNameExt.DivisionNameValue, true)%></addressLine>  <% } %>           
       <% if(theCheck.AttentionMailToExt != null){%> <addressLine><%=util.StringUtils.getXMLValue("ATTN: " + theCheck.AttentionMailToExt,true)%></addressLine> <% } %> 
       <% if (mailToString[1].length() != 0) { %><addressLine><%=util.StringUtils.getXMLValue(mailToString[1], true)%></addressLine> <% } %>
       <addressLine><% if(mailToHistAddyString[0].length!=0){ %><%=util.StringUtils.getXMLValue(mailToHistAddyString[0], true)%><% } %></addressLine>
       <% if (mailToHistAddyString[1].length!=0) { %><addressLine><%=util.StringUtils.getXMLValue(mailToHistAddyString[1], true)%></addressLine><% } %>
       <addressLine><% if(mailToHistAddy != null and mailToHistAddy.CityStateZip != null){ %><%=util.StringUtils.getXMLValue(mailToHistAddy.CityStateZip, true)%><% } %></addressLine>      
       <% if (mailToHistAddy != null and mailToHistAddy.Country == "US") { %><addressType>D</addressType><% } else { %><addressType>F</addressType><% } %>
   
    <% } else if(theCheck.MailTo.length<=40){ %>
      
      <name><%=util.StringUtils.getXMLValue(theCheck.getDisplayNameWithoutFormerAndClosed(theCheck.MailTo), true)%></name>
      <% if(theCheck.AttentionMailToExt != null){%><addressLine><%=util.StringUtils.getXMLValue("ATTN: " + theCheck.AttentionMailToExt,true)%></addressLine> <% } %> 
      <addressLine><% if(mailToHistAddyString[0].length!=0){ %><%=util.StringUtils.getXMLValue(mailToHistAddyString[0], true)%><% } %></addressLine>
      <% if (mailToHistAddyString[1].length!=0) { %><addressLine><%=util.StringUtils.getXMLValue(mailToHistAddyString[1], true)%></addressLine><% } %>
      <% if (mailToHistAddyString[2].length!=0) { %><addressLine><%=util.StringUtils.getXMLValue(mailToHistAddyString[2], true)%></addressLine><% } %>
      <addressLine><% if(mailToHistAddy != null and mailToCityStateZip != null){ %><%=util.StringUtils.getXMLValue(mailToCityStateZip, true)%><% } %></addressLine>
      <% if (mailToHistAddy != null and mailToHistAddy.Country == "US") { %><addressType>D</addressType><% } else { %><addressType>F</addressType><% } %>
      
      <% } else if(theCheck.MailTo.length>40 && (theCheck.AttentionMailToExt == null || theCheck.AttentionMailToExt=="")) { %> 
      
      <name><%=util.StringUtils.getXMLValue(theCheck.getDisplayNameWithoutFormerAndClosed(mailToString[0]), true)%></name>
      <% if (mailToString[1].length() != 0) { %><addressLine><%=util.StringUtils.getXMLValue(mailToString[1], true)%></addressLine> <% } %>
      <addressLine><% if(mailToHistAddyString[0].length!=0){ %><%=util.StringUtils.getXMLValue(mailToHistAddyString[0], true)%><% } %></addressLine>
      <% if (mailToHistAddyString[1].length!=0) { %><addressLine><%=util.StringUtils.getXMLValue(mailToHistAddyString[1], true)%></addressLine><% } %>
      <% if (mailToHistAddyString[2].length!=0) { %><addressLine><%=util.StringUtils.getXMLValue(mailToHistAddyString[2], true)%></addressLine><% } %>
      <addressLine><% if(mailToHistAddy != null and mailToCityStateZip != null){ %><%=util.StringUtils.getXMLValue(mailToCityStateZip, true)%><% } %></addressLine>
      <% if (mailToHistAddy != null and mailToHistAddy.Country == "US") { %><addressType>D</addressType><% } else { %><addressType>F</addressType><% } %>
      
      <% } else { %>
      <name><%=util.StringUtils.getXMLValue(theCheck.getDisplayNameWithoutFormerAndClosed(mailToString[0]), true)%></name>
      <% if (mailToString[1].length() != 0) { %><addressLine><%=util.StringUtils.getXMLValue(mailToString[1], true)%></addressLine> <% } %>
      <% if(theCheck.AttentionMailToExt != null){%><addressLine><%=util.StringUtils.getXMLValue("ATTN: " + theCheck.AttentionMailToExt,true)%></addressLine> <% } %> 
      <addressLine><% if(mailToHistAddyString[0].length!=0){ %><%=util.StringUtils.getXMLValue(mailToHistAddyString[0], true)%><% } %></addressLine>
      <% if (mailToHistAddyString[1].length!=0) { %><addressLine><%=util.StringUtils.getXMLValue(mailToHistAddyString[1], true)%></addressLine><% } %>
      <addressLine><% if(mailToHistAddy != null and mailToCityStateZip != null){ %><%=util.StringUtils.getXMLValue(mailToCityStateZip, true)%><% } %></addressLine>
      <% if (mailToHistAddy != null and mailToHistAddy.Country == "US") { %><addressType>D</addressType><% } else { %><addressType>F</addressType><% } %>
      <% } %>
      
    </mailToNameAndAddress>
   
    
    <verbageLines>
      <% if (theCheck.Claim.Policy.ProducerCode == null) { %><stubProducer/><% } else { %><stubProducer><%=theCheck.Claim.Policy.ProducerCode%></stubProducer><% } %>
      <% var checkNumPart = "CHECK # " + theCheck.CheckNumber;
         var amountPart = "AMT " + NumberFormat.getCurrencyInstance().format(theCheck.NetAmount.Amount);
         var issuedDate = "ISSUED " + DateFormat.getDateInstance(DateFormat.SHORT).format(theCheck.ScheduledSendDate);
         var fillerCount : Double = (90 - checkNumPart.length() - amountPart.length() - issuedDate.length()) / 2;
         var fillerCount1 = Math.ceil(fillerCount);
         var fillerCount2 = Math.floor(fillerCount);
         var combinedLine = new StringBuffer().append(checkNumPart).append(StringUtils.leftPad(amountPart, amountPart.length() + fillerCount1)).append(StringUtils.leftPad(issuedDate, issuedDate.length() + fillerCount2));
      %> 
      <verbageLine><%=combinedLine%></verbageLine>
      <% var memoLine1 = ""; 
         var memoLine2 = "";
        if (theCheck.Memo == null) { %>
        <% } else if (theCheck.Memo.length() < 75) {
             memoLine1 = theCheck.Memo; %>
        <% } else {
          var lastIndex = theCheck.Memo.lastIndexOf(" ", 75);
          %><%
          if (lastIndex < 0) {
                memoLine1 = theCheck.Memo.substring(0, 75);
                memoLine2 = theCheck.Memo.substring(75, theCheck.Memo.length());
          }
          else {
                memoLine1 = theCheck.Memo.substring(0, lastIndex);
                memoLine2 = theCheck.Memo.substring(lastIndex + 1, theCheck.Memo.length());
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
      
      <verbageLine>INSURED:  <%=util.StringUtils.getXMLValue(theCheck.getDisplayNameWithoutFormerAndClosed(theCheck.Claim.Insured.DisplayName), true)%></verbageLine>
      <%if (theCheck.IssuedClaimantExt.length >= 78) {%>
          <verbageLine>CLAIMANT: <%=util.StringUtils.getXMLValue(theCheck.getDisplayNameWithoutFormerAndClosed(theCheck.IssuedClaimantExt.substring(0,78)), true)%></verbageLine>
      <%}else{%> 
          <verbageLine>CLAIMANT: <%=util.StringUtils.getXMLValue(theCheck.getDisplayNameWithoutFormerAndClosed(theCheck.IssuedClaimantExt), true)%></verbageLine>
      <%}%>
      <% var policyPart = "POLICY # " + theCheck.Claim.Policy.PolicyNumber;
                     var claimNumPart = "CLAIM # " + theCheck.Claim.ClaimNumber;
                     var dolPart = "DATE OF LOSS " + DateFormat.getDateInstance(DateFormat.SHORT).format(theCheck.Claim.LossDate);
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
      <verbageLine>                                <%=util.StringUtils.getXMLValue(theCheck.Claim.AssignedUser.Contact.DisplayName, true)%></verbageLine>
      <verbageLine>                                 <![CDATA[<%=theCheck.Claim.Policy.IssuingCompanyExt.DisplayName%>]]></verbageLine>
      <% var mailingAddress : Address = null;
         var businessAddress : Address = null;
         for (anAddress in theCheck.Claim.AssignedUser.Contact.AllAddresses) {
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
           if (theCheck.Claim.LOBCode.Code == "equine") { %>
      <verbageLine>                                EQUINE CLAIMS</verbageLine>
      <verbageLine>                                P.O. BOX 2428</verbageLine>
      <verbageLine>                                CINCINNATI, OH 45201-2438</verbageLine>
          <% } else {
                 if ((theCheck.Claim.LOBCode.Code == "agriproperty" ) || (theCheck.Claim.LOBCode.Code == "agriliability" ) || (theCheck.Claim.LOBCode.Code == "agriauto" )) { %>
      <verbageLine>                                AGRIBUSINESS CLAIMS</verbageLine>
      <verbageLine>                                P.O. BOX 1239</verbageLine>
      <verbageLine>                                CINCINNATI, OH 45201-1239</verbageLine>
                <% }
             }
         } %>
      <verbageLine>                                <%=util.StringUtils.getXMLValue(theCheck.Claim.AssignedUser.Contact.WorkPhone, true)%></verbageLine>
      <verbageLine/>
      <verbageLine/>
      <verbageLine/>
      <verbageLine/>
      <verbageLine/>
      <verbageLine/>
      <verbageLine>GREAT AMERICAN INSURANCE COMPANY, AS AGENT FOR:</verbageLine>
      <verbageLine><![CDATA[<%=theCheck.Claim.Policy.IssuingCompanyExt.DisplayName%>]]></verbageLine>
      <% var businessUnitAddress : Address %> 
      <% if ( businessUnitAddress != null) { %>
        <verbageLine><%=util.StringUtils.getXMLValue(businessUnitAddress.AddressLine1, true)%></verbageLine>
        <verbageLine><%=util.StringUtils.getXMLValue(businessUnitAddress.CityStateZip, true)%></verbageLine>
                  <% } else { %>
                                <verbageLine>  </verbageLine>
        <verbageLine>  </verbageLine>
      <% } %>
      <verbageLine><% var claimNo = "CLAIM  NO.: " + theCheck.Claim.ClaimNumber; if (claimNo.length() > 50) { %><%=claimNo.substring(0, 49) %><% } else { %><%=claimNo%><% } %></verbageLine>
      <verbageLine><% var policyNo = "POLICY NO.: " + theCheck.Claim.Policy.PolicyType + " " + theCheck.Claim.Policy.PolicyNumber; if (policyNo.length() > 50) { %><%=policyNo.substring(0, 49) %><% } else { %><%=policyNo%><% } %></verbageLine>
      <verbageLine><% var dol = "DATE/LOSS: " + DateFormat.getDateInstance(DateFormat.SHORT).format(theCheck.Claim.LossDate); if (dol.length() > 50) { %><%=dol.substring(0, 49) %><% } else { %><%=dol%><% } %></verbageLine>
      <verbageLine>STMT. OF ACCT: <%=util.StringUtils.getXMLValue(memoLine1, true)%></verbageLine>
      <verbageLine><%=StringUtils.substring(util.StringUtils.getXMLValue(theCheck.Claim.Policy.ex_Agency.Name, true), 0, 40)%></verbageLine>
      <verbageLine><%=StringUtils.substring(util.StringUtils.getXMLValue(theCheck.Claim.Policy.ex_Agency.PrimaryAddress.AddressLine1, true) + (theCheck.Claim.Policy.ex_Agency.PrimaryAddress.AddressLine2 != null ? ", " + util.StringUtils.getXMLValue(theCheck.Claim.Policy.ex_Agency.PrimaryAddress.AddressLine2, true) : ""), 0, 40) %></verbageLine>
      <verbageLine><%=StringUtils.substring(util.StringUtils.getXMLValue(theCheck.Claim.Policy.ex_Agency.PrimaryAddress.CityStateZip.toUpperCase(), true), 0, 40)%></verbageLine>
    </verbageLines>
  </stubData>
    <% if (theCheck.getDisplayNameWithoutFormerAndClosed(theCheck.FirstPayee.Payee.DisplayName).length() > 40) { %>
      <EscheatName><![CDATA[<%=theCheck.getDisplayNameWithoutFormerAndClosed(theCheck.FirstPayee.Payee.DisplayName).substring(0, 40)%>]]></EscheatName>
    <% } else { %> 
      <EscheatName><![CDATA[<%=theCheck.getDisplayNameWithoutFormerAndClosed(theCheck.FirstPayee.Payee.DisplayName)%>]]></EscheatName>
    <% } %>
  <EscheatAddress1><% if (theCheck.PayToAddressOwner != null and theCheck.PayToAddressOwner.Address.AddressLine1 != Null) {%><% if (util.StringUtils.getXMLValue(theCheck.getDisplayNameWithoutFormerAndClosed(theCheck.PayToAddressOwner.Address.AddressLine1), true).length() > 40) { %><%=util.StringUtils.getXMLValue(theCheck.getDisplayNameWithoutFormerAndClosed(theCheck.PayToAddressOwner.Address.AddressLine1), true).substring(0, 39)%><% } else {%><%=util.StringUtils.getXMLValue(theCheck.getDisplayNameWithoutFormerAndClosed(theCheck.PayToAddressOwner.Address.AddressLine1), true)%><% } }%></EscheatAddress1>
  <EscheatAddress2><% if (theCheck.PayToAddressOwner != null and theCheck.PayToAddressOwner.Address.AddressLine2 != Null) {%><% if (util.StringUtils.getXMLValue(theCheck.getDisplayNameWithoutFormerAndClosed(theCheck.PayToAddressOwner.Address.AddressLine2), true).length() > 40) { %><%=util.StringUtils.getXMLValue(theCheck.getDisplayNameWithoutFormerAndClosed(theCheck.PayToAddressOwner.Address.AddressLine2), true).substring(0, 39)%><% } else {%><%=util.StringUtils.getXMLValue(theCheck.getDisplayNameWithoutFormerAndClosed(theCheck.PayToAddressOwner.Address.AddressLine2), true)%><% } }%></EscheatAddress2>
  <EscheatCity><% if (theCheck.PayToAddressOwner != null and theCheck.PayToAddressOwner.Address.City != null) { %><%=util.StringUtils.getXMLValue(theCheck.getDisplayNameWithoutFormerAndClosed(theCheck.PayToAddressOwner.Address.City), true)%><% } %></EscheatCity>
  <EscheatState><% if (theCheck.PayToAddressOwner != null and theCheck.PayToAddressOwner.Address.State.Code != null) { %><%=util.StringUtils.getXMLValue(theCheck.getDisplayNameWithoutFormerAndClosed(theCheck.PayToAddressOwner.Address.State.Code), true)%><% } %></EscheatState>
  <EscheatZipCode><% if (theCheck.PayToAddressOwner != null and theCheck.PayToAddressOwner.Address != null) { %><%=theCheck.replacePostalCode(theCheck.PayToAddressOwner.Address)%><% } %></EscheatZipCode>
  <JurisdictionState><%=theCheck.getBackOfCheckStateCode()%></JurisdictionState>
  <BackCheckInd><%=theCheck.getBackOfCheckIndicator()%></BackCheckInd>
</PrintableCheck>
