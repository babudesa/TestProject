<% uses util.UniqueNumberGenerators %>
<% uses util.StringUtils %>
<% uses templates.messaging.edw.TypeListTemplate %>
<% uses templates.messaging.edw.CheckAddressHistoryTemplate %>
<% uses templates.messaging.edw.PartyTemplate %>
<% uses templates.messaging.edw.UserTemplate %>
<% uses gaic.conversion.util.ConversionStatusChecker %>
<%@ params(theCheck : Check, aPayment : Payment, objStatus : String, eventName : String) %>
<Transaction>
  <CCTransactionTime><%=util.custom_Ext.DateTime.getTimeStamp()%></CCTransactionTime>
  <uniqueID><%=UniqueNumberGenerators.generateEDWUniqueID()%></uniqueID>
  <% 
  var allPaymentsConverted = true; 
  if (theCheck.Payments != null) {
     for( var thepayment in theCheck.Payments ) {
         if (allPaymentsConverted and thepayment.LoadCommandID != null and !ConversionStatusChecker.isCurrentlyConverting(thepayment.LoadCommandID, thepayment.CreateUser, thepayment.UpdateUser)) {
           allPaymentsConverted = false;
         }
     }
  }
  %>
  <% if (ConversionStatusChecker.isCurrentlyConverting(theCheck.LoadCommandID, theCheck.CreateUser, theCheck.UpdateUser) and allPaymentsConverted) {%>
  <FinanciallyProcessedIndicator>true</FinanciallyProcessedIndicator>
  <% } else {%>
  <FinanciallyProcessedIndicator>false</FinanciallyProcessedIndicator>
  <% } %>
  <%if (theCheck.Claim.ClaimNumber != null) {%>
  <ClaimNumber><%=theCheck.Claim.ClaimNumber%></ClaimNumber>
  <%}%>
  <%if (theCheck.Claim.Policy.PolicyType != null) {%>
  <PolicySymbol><%=theCheck.Claim.Policy.PolicyType%></PolicySymbol>
  <%}%>
  <%if (theCheck.Claim.LossType != null) {%>
  <TransactionLossType><%=theCheck.Claim.LossType%></TransactionLossType>
  <%}%>
  <% if (theCheck.LoadCommandID != null and ConversionStatusChecker.isCurrentlyConverting(theCheck.LoadCommandID, theCheck.CreateUser, theCheck.UpdateUser) and allPaymentsConverted) {%>
  <% if (aPayment != null && aPayment.AccountingMonthExt != null) {%>
  <AccountingMonth><%=(aPayment.AccountingMonthExt < 10) ? "0" + aPayment.AccountingMonthExt : aPayment.AccountingMonthExt%></AccountingMonth>
  <%}%>
  <% if (aPayment.AccountingYearExt != null) {%>
  <AccountingYear><%=aPayment.AccountingYearExt%></AccountingYear>
  <%}%>
  <%}%>
  <Check>
    <PublicID><%=theCheck.PublicID%></PublicID>
    <ObjectStatus><%=objStatus%></ObjectStatus>
    <% if (theCheck.LoadCommandID != null and ConversionStatusChecker.isCurrentlyConverting(theCheck.LoadCommandID, theCheck.CreateUser, theCheck.UpdateUser) && aPayment != null && aPayment.RptCreateDateExt != null) {%>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(aPayment.RptCreateDateExt)%></CreateTime> 
    <%} else if (theCheck.CreateTime != null) {%>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(theCheck.CreateTime)%></CreateTime> 
    <%}%>
    <% if (theCheck.UpdateTime != null) {%>
    <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(theCheck.UpdateTime)%></UpdateTime> 
    <%}%>
    <% if (theCheck.Claim != null && theCheck.Claim.PublicID != null) {%>
    <RelToClaim><%=theCheck.Claim.PublicID%></RelToClaim> 
    <%}%>
    <% if (theCheck.IssueDate != null) {%>
    <IssueDate><%=theCheck.IssueDate%></IssueDate> 
    <%}%>
    <CheckNumber><%=theCheck.CheckNumber%></CheckNumber>
    <% if (theCheck.ManualCheck != null) {%>
    <ManualCheck><%=theCheck.ManualCheck%></ManualCheck>
    <%}%>
    <% if (theCheck.BackupWithholdingCheckExt != null) {%>
    <BackupWithholdingCheckExt><%=StringUtils.getXMLValue(theCheck.BackupWithholdingCheckExt as java.lang.String, false)%></BackupWithholdingCheckExt>
    <%}%>
    <% if (theCheck.ex_DateVoided != null) {%>
    <ex_DateVoided><%=StringUtils.getXMLValue(theCheck.ex_DateVoided as java.lang.String, false)%></ex_DateVoided>
    <%}%>
    <% if (theCheck.ex_DateVoidExec != null) {%>
    <ex_DateVoidExec><%=StringUtils.getXMLValue(theCheck.ex_DateVoidExec as java.lang.String, false)%></ex_DateVoidExec>
    <%}%>
    <% if (theCheck.ex_DateStopExec != null) {%>
    <ex_DateStopExec><%=StringUtils.getXMLValue(theCheck.ex_DateStopExec as java.lang.String, false)%></ex_DateStopExec>
    <%}%>
    <% if (theCheck.ex_DateStopped != null) {%>
    <ex_DateStopped><%=StringUtils.getXMLValue(theCheck.ex_DateStopped as java.lang.String, false)%></ex_DateStopped>
    <%}%>
    <% if (theCheck.Memo != null) {%>
    <Memo><%=StringUtils.getXMLValue(theCheck.Memo, false)%></Memo>
    <%}%>
    <% if (theCheck.Status != null and theCheck.Status == "transferred") {%>
         <GrossAmount>0</GrossAmount>
         <NetAmount>0</NetAmount>
     <%} else {%>
        <% if (theCheck.GrossAmountExt != null) {%>
           <GrossAmount><%=theCheck.GrossAmountExt%></GrossAmount>
        <%}%>
        <% if (theCheck.NetAmount != null) {%>
        <NetAmount><%=theCheck.NetAmount.Amount%></NetAmount>
        <%}%>
    <%}%>
    <% if (theCheck.ex_CheckVoidStopReasonType != null) {%>
    <%=TypeListTemplate.renderToString(theCheck.ex_CheckVoidStopReasonType, "ex_CheckVoidStopReason", theCheck.ex_CheckVoidStopReasonType.ListName)%>
    <%}%>
    <% if (theCheck.PrefixExt != null) {%>
    <PrefixExt>
      <Code><%=theCheck.PrefixExt.Code%></Code>
      <Description><%=theCheck.PrefixExt.Description%></Description>
      <ListName><%=theCheck.PrefixExt.ListName%></ListName>
    </PrefixExt>
    <%}%>
    <%-- KSO change to option, don't create a default --%>
    <% if (theCheck.ex_DraftRegion != null) {%>
    <%=TypeListTemplate.renderToString(theCheck.ex_DraftRegion, "ex_DraftRegion", theCheck.ex_DraftRegion.ListName)%>
    <%}%>
    <% if (theCheck.BankAccount != null) {%>
    <%=TypeListTemplate.renderToString(theCheck.BankAccount, "BankAccount", theCheck.BankAccount.ListName)%>
    <%}%>
    <%-- BESTOR 01222009 - Added to for Defect 1599 --%>
    <% if (theCheck.PaymentMethod != null) {%>
    <%=TypeListTemplate.renderToString(theCheck.PaymentMethod, "PaymentMethod", theCheck.PaymentMethod.ListName)%>
    <%}%>
    <% if (theCheck.InvoiceNumber != null) {%>
    <InvoiceNumber><%=StringUtils.getXMLValue(theCheck.InvoiceNumber, false)%></InvoiceNumber>
    <%}%>
    <% if (theCheck.ex_ManualPaymentMethod != null) {%>
    <%=TypeListTemplate.renderToString(theCheck.ex_ManualPaymentMethod, "ex_ManualPaymentMethod", theCheck.ex_ManualPaymentMethod.ListName)%>
    <%}%>
    <% if (theCheck.PayTo != null) {%>
    <PayTo><%=StringUtils.getXMLValue(theCheck.PayTo, false)%></PayTo>
    <%}%>
    <% if (theCheck.DateOfService != null) {%>
    <DateOfService><%=theCheck.DateOfService%></DateOfService> 
    <%}%>
    <% if (theCheck.ServicePdStart != null) {%>
    <ServicePdStart><%=theCheck.ServicePdStart%></ServicePdStart> 
    <%}%>
    <% if (theCheck.Status != null) {%>
    <%=TypeListTemplate.renderToString(theCheck.Status, "Status", theCheck.Status.ListName)%>
    <%}%>
    <% if (theCheck.ServicePdEnd != null) {%>
    <ServicePdEnd><%=theCheck.ServicePdEnd%></ServicePdEnd> 
    <%}%>

    <%-- KSO 11072008 - def 1301 - payto, mailto addresses and party info is status A for issued, E after that --%>
    <%
    var oStatus = objStatus
    if ( theCheck.Status == "issued" || (theCheck.LoadCommandID != null and ConversionStatusChecker.isCurrentlyConverting(theCheck.LoadCommandID, theCheck.CreateUser, theCheck.UpdateUser)  and allPaymentsConverted) ) { 
      oStatus = "A";
    } else { 
      oStatus = "E";
    }
    %>
    <%if (theCheck.IssuedPayToAddressExt != null) {%>
    <ex_PayToAddress>
      <%=CheckAddressHistoryTemplate.renderToString(theCheck, theCheck.IssuedPayToAddressExt, theCheck.CheckNumber, false, oStatus)%>
    </ex_PayToAddress>
    <%}%>

    <%if (theCheck.MailToAddress != null) {%>
    <ex_MailToAddress>
      <%=CheckAddressHistoryTemplate.renderToString(theCheck, theCheck.MailToAddress, theCheck.CheckNumber, false, oStatus)%>
    </ex_MailToAddress>
    <%}%>

    <%var partyRelTo = "<PartyRelTo><PublicID>"+theCheck.PublicID+"</PublicID><RelToType>Check</RelToType></PartyRelTo>"%>
    <% if (theCheck.CreateUser != null || theCheck.UpdateUser != null) {%>
    <Parties>
      <% if (theCheck.ex_MailTo != null) { var themailto = theCheck.ex_MailTo;%>
      <%var mrole = "<Role><Code>mailto</Code><Description>MailTo</Description><ListName>MailTo</ListName></Role>"%>
      <%=PartyTemplate.renderToString(themailto, theCheck.CheckNumber, oStatus, mrole, "", partyRelTo, theCheck.Claim, "", "")%>
      <%}%>

      <% for( var thecheckpayee in theCheck.Payees ) { %>
      <%var crole = "<Role><Code>checkpayee</Code><Description>The payee on a check</Description><ListName>ContactRole</ListName></Role>"%>
      <%=PartyTemplate.renderToString(thecheckpayee.ClaimContact.Contact, "", oStatus, crole, "", partyRelTo, theCheck.Claim, "", "")%>
      <%}%>

      <% if (theCheck.CreateUser != null) { %>
	      <%=UserTemplate.renderToString(theCheck.CreateUser, "", oStatus, displaykey.EDW.Templates.CreateUserRole, "", partyRelTo)%>
      <%}%>

      <% if (theCheck.UpdateUser != null) { %>
      <%var obStatus = objStatus%>
      <%
      if ( theCheck.Status == "issued" || (theCheck.LoadCommandID != null and ConversionStatusChecker.isCurrentlyConverting(theCheck.LoadCommandID, theCheck.CreateUser, theCheck.UpdateUser)  and allPaymentsConverted) ) { 
        obStatus = "A";
      }
      %>
	    <%=UserTemplate.renderToString(theCheck.UpdateUser, "", obStatus, displaykey.EDW.Templates.UpdateUserRole, "", partyRelTo)%>
      <%}%>

      <% if (theCheck.CheckSet.getLastApprovingUserExt() != null) { var theapprovedby = theCheck.CheckSet.getLastApprovingUserExt();%> 
      <%var abrole = "<Role><Code>approvedby</Code><Description>ApprovedBy</Description><ListName>ApprovedBy</ListName></Role>"%>
      <%=UserTemplate.renderToString(theapprovedby, "", oStatus, abrole, "", partyRelTo)%>
      <%}%> 
    </Parties>
    <%}%>
    <% var isRecoded = false  %>

    <FinancialTransactions>
      <% if (theCheck.Payments != null) {%>
      <% for( var thepayment in theCheck.Payments ) {%>
      <FinancialTransaction>
        <PublicID><%=thepayment.PublicID%></PublicID>
        <ObjectStatus><%=objStatus%></ObjectStatus>
        <% if (thepayment.CreateTime != null) {%>
        <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(thepayment.CreateTime)%></CreateTime> 
        <%}%>
        <% if (thepayment.UpdateTime != null) {%>
        <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(thepayment.UpdateTime)%></UpdateTime> 
        <%}%>
        <RelToExposure><%=thepayment.Exposure.PublicID%></RelToExposure>
        <% if (theCheck.PublicID != null) {%>
        <RelToCheck><%=theCheck.PublicID%></RelToCheck>
        <%}%>
        <% if (thepayment.Subtype != null) {%>
        <%=TypeListTemplate.renderToString(thepayment.Subtype, "Subtype", thepayment.Subtype.ListName)%>
        <%}%>
        <% if (thepayment.Status != null) {%>
        <%=TypeListTemplate.renderToString(thepayment.Status, "Status", thepayment.Status.ListName)%>
            <% if (thepayment.Status == "recoded") {
                  isRecoded = true } %>                  
        <%}%>
        <% if (thepayment.CostType != null) {%>
        <%=TypeListTemplate.renderToString(thepayment.CostType, "CostType", thepayment.CostType.ListName)%>
        <%}%>
        <% if (thepayment.PaymentType != null) {%>
        <%=TypeListTemplate.renderToString(thepayment.PaymentType, "PaymentTtoe", thepayment.PaymentType.ListName)%>
        <%}%>
        <% if (thepayment.LineItems != null) {%>
        <% for (var thelineitem in thepayment.LineItems) {  %>
        <LineItems>
          <PublicID><%=thelineitem.PublicID%></PublicID>
          <ObjectStatus><%=objStatus%></ObjectStatus>
          <% if (thelineitem.LineCategory != null) {%>
          <%=TypeListTemplate.renderToString(thelineitem.LineCategory, "LineCategory", thelineitem.LineCategory.ListName)%>
          <%}%>
          <Amount><%=thelineitem.Amount%></Amount>
          <% if (thelineitem.CreateTime != null) {%>
          <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(thelineitem.CreateTime)%></CreateTime> 
          <%}%>
          <% if (thelineitem.UpdateTime != null) {%>
          <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(thelineitem.UpdateTime)%></UpdateTime> 
          <%}%>
          <% if (thelineitem.TransactionQualifierExt != null) {%>
          <%=TypeListTemplate.renderToString(thelineitem.TransactionQualifierExt, "TransactionQualifierExt", thelineitem.TransactionQualifierExt.ListName)%>
          <%}%>
        <% if (thelineitem.LineItemDeductions != null) {%>
          <% for (var thededuction in thelineitem.LineItemDeductions) {  %>
              <LineItemDeductions>
                <% if (thededuction.DeductionType != null) {%>
                  <%=TypeListTemplate.renderToString(thededuction.DeductionType, "DeductionType", thededuction.DeductionType.ListName)%>
                <%}%>
                <DeductionAmount><%=thededuction.Amount%></DeductionAmount>
              </LineItemDeductions>
          <%}%>
        <%}%>
        </LineItems>
        <%}%>
        <%}%>

        <% if (thepayment.SubmitDate != null) {%>
        <SubmitDate><%=thepayment.SubmitDate%></SubmitDate> 
        <%}%>
        <% if (thepayment.TransactionDate != null) {%>
        <TransactionDate><%=thepayment.TransactionDate%></TransactionDate> 
        <%}%>
        <% if (thepayment.TransactionSet != null) { var thetransactionset = thepayment.TransactionSet;%>
        <TransactionSet>
          <PublicID><%=thetransactionset.PublicID%></PublicID>
          <ObjectStatus><%=objStatus%></ObjectStatus>
          <% if (thetransactionset.ApprovalDate != null) {%>
          <ApprovalDate><%=thetransactionset.ApprovalDate%></ApprovalDate> 
          <%}%>
          <% if (thetransactionset.Subtype != null) {%>
          <%=TypeListTemplate.renderToString(thetransactionset.Subtype, "SubType", thetransactionset.Subtype.ListName)%>
          <%}%>
        </TransactionSet>
        <%}%>

        <% if (thepayment.CreateUser != null || thepayment.UpdateUser != null) {%>
        <%var ppartyRelTo = "<PartyRelTo><PublicID>"+thepayment.PublicID+"</PublicID><RelToType>Payment</RelToType></PartyRelTo>"%>
        <Parties>
	      <% if (thepayment.CreateUser != null) { %>
		      <%=UserTemplate.renderToString(thepayment.CreateUser, "", objStatus, displaykey.EDW.Templates.CreateUserRole, "", ppartyRelTo)%>
	      <%}%>
          <% if (thepayment.TransactionSet.getLastApprovingUserExt() != null) { var theapprovedby = thepayment.TransactionSet.getLastApprovingUserExt();%> 
          <% var abrole = "<Role><Code>approvedby</Code><Description>ApprovedBy</Description><ListName>ApprovedBy</ListName></Role>"%>
          <%=UserTemplate.renderToString(theapprovedby, "", objStatus, abrole, "", ppartyRelTo)%>
          <%}%> 

          <% if (thepayment.UpdateUser != null) { %>
		      <%=UserTemplate.renderToString(thepayment.UpdateUser, "", objStatus, displaykey.EDW.Templates.UpdateUserRole, "", ppartyRelTo)%>
	      <%}%>
        </Parties>	
        <%}%>
        <% if (thepayment.PaymentCategoryExt != null) {%>
        <%=TypeListTemplate.renderToString(thepayment.PaymentCategoryExt, "PaymentCategoryExt", thepayment.PaymentCategoryExt.ListName)%>
        <%}%>
        <% if (thepayment.CostType != null) { %>
             <% if (thepayment.CostType.Code == "claimcost" or thepayment.CostType.Code == "expense" ) { %>
                   <ClaimHandlingEntity>GAI</ClaimHandlingEntity> 
                   <ClaimsFundSource>GAI</ClaimsFundSource> 
             <% } else if (thepayment.CostType.Code == "gaiastpaexpense" or thepayment.CostType.Code == "gaiastpaloss" ) { %>
                   <ClaimHandlingEntity>GAI</ClaimHandlingEntity> 
                   <ClaimsFundSource>NONGAI</ClaimsFundSource> 
             <%}%>
        <%}%>  
        <% if (thepayment.WCInjuryTypeExt != null) {%>
	     <%var injurytype = gw.api.util.TypecodeMapperUtil.getTypecodeMapper().getAliasByInternalCode( "WCInjuryTypeExt", "WCInjuryType", thepayment.WCInjuryTypeExt.Code);%>
             <% if (injurytype != null){%>
                  <WCInjuryTypeExt>
                    <Code><%=injurytype%></Code>
                    <Description><%=injurytype%></Description>
                    <ListName><%=thepayment.WCInjuryTypeExt.ListName%></ListName>
                  </WCInjuryTypeExt>
             <%}%>
	<%}%>
	<% if (thepayment.Exposure.BureauBenefitTypeExt != null) {%>
	     <%var bbenefittype = gw.api.util.TypecodeMapperUtil.getTypecodeMapper().getAliasByInternalCode( "BureauBenefitExt", "BureauBenefit", thepayment.Exposure.BureauBenefitTypeExt.Code);%>
             <% if (bbenefittype != null){%>
                  <BureauBenefitTypeExt>
                    <Code><%=bbenefittype%></Code>
                    <Description><%=bbenefittype%></Description>
                    <ListName><%=thepayment.Exposure.BureauBenefitTypeExt.ListName%></ListName>
                  </BureauBenefitTypeExt>
             <%}%>
	<%}%>           
      </FinancialTransaction>
      <%}%>
      <%}%>
    </FinancialTransactions>
    <%-- BESTOR 01222009 - Added to for Defect 1437 and/or 1608 --%>
    <% if (theCheck.Reportability != null) {%>
    <%=TypeListTemplate.renderToString(theCheck.Reportability, "Reportability", theCheck.Reportability.ListName)%>
    <% if (theCheck.Reportability == "reportable") {%>
    <% if (theCheck.ReportableAmount != null) {%>
    <ReportableAmount><%=theCheck.ReportableAmount.Amount%></ReportableAmount>
    <% }  }%>
    <%}%>
    <% if (theCheck.CheckBatching != null) {%>
    <%=TypeListTemplate.renderToString(theCheck.CheckBatching, "CheckBatching", theCheck.CheckBatching.ListName)%>
    <%}%>
    <% if (theCheck.CheckInstructions != null) {%>
    <%=TypeListTemplate.renderToString(theCheck.CheckInstructions, "CheckInstructions", theCheck.CheckInstructions.ListName)%>
    <%}%>
    <% if (theCheck.DeliveryMethod != null) {%>
    <%=TypeListTemplate.renderToString(theCheck.DeliveryMethod, "DeliveryMethod", theCheck.DeliveryMethod.ListName)%>
    <%}%>
    <% if (theCheck.ScheduledSendDate != null) {%>
    <ScheduledSendDate><%=theCheck.ScheduledSendDate%></ScheduledSendDate> 
    <%}%>
    <% if (theCheck.EscheatStatusExt != null) {%>
    <EscheatmentStatus><%=theCheck.EscheatStatusExt%></EscheatmentStatus> 
    <%}%>
    <% if (theCheck.DateEscheatedExt != null) {%>
    <DateEscheatedExt><%=theCheck.DateEscheatedExt%></DateEscheatedExt> 
    <%}%>
    <% if (theCheck.Status != null and theCheck.Status == "issued" and !isRecoded) {%>
      <% if (theCheck.TransferredCheck != null) {%>
        <TransferFromCheckID><%=theCheck.TransferredCheck.PublicID%></TransferFromCheckID> 
      <%}%>
    <%}%>
    <% if (theCheck.InvoiceDateExt != null) {%>
    <InvoiceDateExt><%=theCheck.InvoiceDateExt%></InvoiceDateExt> 
    <%}%>
    <% if (theCheck.VendorBillIDExt != null) {%>
    <VendorBillIDExt><%=theCheck.VendorBillIDExt%></VendorBillIDExt> 
    <%}%>
    <% if (theCheck.OrigBillAmtExt != null) {%>
    <OrigBillAmtExt><%=theCheck.OrigBillAmtExt%></OrigBillAmtExt> 
    <%}%>
    <% if (theCheck.OrigInvoiceDateExt != null) {%>
    <OrigInvoiceDateExt><%=theCheck.OrigInvoiceDateExt%></OrigInvoiceDateExt> 
    <%}%>
    <% if (theCheck.GAIInvoiceRecDateExt != null) {%>
    <GAIInvoiceRecDateExt><%=theCheck.GAIInvoiceRecDateExt%></GAIInvoiceRecDateExt> 
    <%}%>
    
    <% if(theCheck.CheckSet != null and theCheck.CheckSet.Recurrence != null){%>
      <RelToCheckRecurrence><%=theCheck.CheckSet.Recurrence.PublicID%></RelToCheckRecurrence> 
    <%}%>    
        
  </Check>
</Transaction>