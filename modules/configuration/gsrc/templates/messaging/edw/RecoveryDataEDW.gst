<% uses util.UniqueNumberGenerators %>
<% uses templates.messaging.edw.TypeListTemplate %>
<% uses templates.messaging.edw.PartyTemplate %>
<% uses templates.messaging.edw.UserTemplate %>
<% uses util.StringUtils %>
<% uses gaic.conversion.util.ConversionStatusChecker %>
<%@ params(therecovery : Recovery, objStatus : String, eventName : String) %>
<Transaction>
  <CCTransactionTime>
  <%=util.custom_Ext.DateTime.getTimeStamp()%>
  </CCTransactionTime>
  <uniqueID><%=UniqueNumberGenerators.generateEDWUniqueID()%></uniqueID>
  <% if (ConversionStatusChecker.isCurrentlyConverting(therecovery.LoadCommandID, therecovery.CreateUser, therecovery.UpdateUser))  {%>
  <FinanciallyProcessedIndicator>true</FinanciallyProcessedIndicator>
  <% } else {%>
  <FinanciallyProcessedIndicator>false</FinanciallyProcessedIndicator>
  <% } %>		 
  <%if (therecovery.Exposure.Claim.ClaimNumber != null) {%>
  <ClaimNumber><%=therecovery.Exposure.Claim.ClaimNumber%></ClaimNumber>
  <%}%>
  <%if (therecovery.Exposure.Claim.Policy.PolicyType != null) {%>
  <PolicySymbol><%=therecovery.Exposure.Claim.Policy.PolicyType%></PolicySymbol>
  <%}%>
  <%if (therecovery.Exposure.Claim.LossType != null) {%>
  <TransactionLossType><%=therecovery.Exposure.Claim.LossType%></TransactionLossType>
  <%}%>
  <% if (therecovery.LoadCommandID != null and ConversionStatusChecker.isCurrentlyConverting(therecovery.LoadCommandID, therecovery.CreateUser, therecovery.UpdateUser))  {%>
  <% if (therecovery.AccountingMonthExt != null)  {%>
  <AccountingMonth><%=(therecovery.AccountingMonthExt < 10) ? "0" + therecovery.AccountingMonthExt : therecovery.AccountingMonthExt%></AccountingMonth>
  <%}%>
  <% if (therecovery.AccountingYearExt != null)  {%>
  <AccountingYear><%=therecovery.AccountingYearExt%></AccountingYear>
  <%}%>
  <%}%>
  <FinancialTransaction>
    <PublicID><%=therecovery.PublicID%></PublicID>
    <ObjectStatus><%=objStatus%></ObjectStatus>
    <% if (therecovery.RptCreateDateExt != null and therecovery.LoadCommandID != null and ConversionStatusChecker.isCurrentlyConverting(therecovery.LoadCommandID, therecovery.CreateUser, therecovery.UpdateUser)) {%>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(therecovery.RptCreateDateExt)%></CreateTime> 
    <%} else if (therecovery.CreateTime != null) {%>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(therecovery.CreateTime)%></CreateTime> 
    <%}%>
    <% if (therecovery.UpdateTime != null) {%>
    <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(therecovery.UpdateTime)%></UpdateTime> 
    <%}%>
    <RelToExposure><%=therecovery.Exposure.PublicID%></RelToExposure>
    <TransactionRelToClaim><%=therecovery.Claim.PublicID%></TransactionRelToClaim>
    <% if (therecovery.Subtype != null) {%>
    <Subtype>
    <Code><%=therecovery.Subtype.Code%></Code>
    <Description><%=therecovery.Subtype.Description%></Description>
    <ListName><%=therecovery.Subtype.ListName%></ListName>
    </Subtype>
    <%}%>
    <% if (therecovery.Status != null) {%>
    <%=TypeListTemplate.renderToString(therecovery.Status, "Status", therecovery.Status.ListName)%>
    <%}%>
    <% if (therecovery.CostType != null) {%>
    <%=TypeListTemplate.renderToString(therecovery.CostType, "CostType", therecovery.CostType.ListName)%>
    <%}%>
    <% if (therecovery.CostCategory != null) {%>
    <%=TypeListTemplate.renderToString(therecovery.CostCategory, "RecoveryCategory", therecovery.CostCategory.ListName)%>
    <%}%>
    <% if (therecovery.ex_CashReceiptNumber != null) {%>
    <ex_CashReceiptNumber><%=StringUtils.getXMLValue(therecovery.ex_CashReceiptNumber, false)%></ex_CashReceiptNumber>
    <%}%>
    <% if (therecovery.ex_recoveryCheckNumber != null) {%>
    <ex_recoveryCheckNumber><%=StringUtils.getXMLValue(therecovery.ex_recoveryCheckNumber, false)%></ex_recoveryCheckNumber>
    <%}%>
    <% if (therecovery.ex_recoverycheckdate != null) {%>
    <ex_recoveryCheckdate><%=therecovery.ex_recoverycheckdate%></ex_recoveryCheckdate> 
    <%}%>

    <% if (therecovery.LineItems != null) {%>
    <% for (var thelineitem in therecovery.LineItems) {  %>
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
    </LineItems>
    <%}%>
    <%}%>

    <% if (therecovery.OffsetOnsets  != null) {%>
    <% for (var theoffsetonset in therecovery.OffsetOnsets ) {  %>
    <OffsetOnsets>
      <PublicID><%=theoffsetonset.PublicID%></PublicID>
      <% if (theoffsetonset.Offset != null) {%>
      <Offset>
        <PublicID><%=theoffsetonset.Offset.PublicID%></PublicID>
        <ObjectStatus><%=objStatus%></ObjectStatus>
        <% if (theoffsetonset.Offset.CreateTime != null) {%>
        <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(theoffsetonset.Offset.CreateTime)%></CreateTime> 
        <%}%>
        <% if (theoffsetonset.Offset.UpdateTime != null) {%>
        <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(theoffsetonset.Offset.UpdateTime)%></UpdateTime> 
        <%}%>
        <% if (therecovery.Exposure.PublicID != null) {%>
        <RelToExposure><%=therecovery.Exposure.PublicID%></RelToExposure>
        <%}%>
        <% if (theoffsetonset.Offset.Subtype != null) {%>
        <%=TypeListTemplate.renderToString(theoffsetonset.Offset.Subtype, "Subtype", theoffsetonset.Offset.Subtype.ListName)%>
        <%}%>
        <% if (theoffsetonset.Offset.Status != null) {%>
        <%=TypeListTemplate.renderToString(theoffsetonset.Offset.Status, "Status", theoffsetonset.Offset.Status.ListName)%>
        <%}%>
        <% if (theoffsetonset.Offset.CostType != null) {%>
        <%=TypeListTemplate.renderToString(theoffsetonset.Offset.CostType, "CostType", theoffsetonset.Offset.CostType.ListName)%>
        <%}%>
        <% if (theoffsetonset.Offset.LineItems != null) {%>
        <% for (var thelineitem in theoffsetonset.Offset.LineItems) {  %>
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
        </LineItems>
        <%}%>
        <%}%>
        <% if (theoffsetonset.Offset.SubmitDate != null) {%>
        <SubmitDate><%=theoffsetonset.Offset.SubmitDate%></SubmitDate> 
        <%}%>
        <% if (theoffsetonset.Offset.TransactionDate != null) {%>
        <TransactionDate><%=theoffsetonset.Offset.TransactionDate%></TransactionDate> 
        <%}%>
        <% if (theoffsetonset.Offset.TransactionSet != null) { var thetransactionset = theoffsetonset.Offset.TransactionSet;%>
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
        <% if (theoffsetonset.Offset.CostType != null) { %>
           <% if (theoffsetonset.Offset.CostType.Code == "claimcost" or theoffsetonset.Offset.CostType.Code == "expense" ) { %>
                 <ClaimHandlingEntity>GAI</ClaimHandlingEntity> 
                 <ClaimsFundSource>GAI</ClaimsFundSource> 
           <% } else if (theoffsetonset.Offset.CostType.Code == "gaiastpaexpense" or theoffsetonset.Offset.CostType.Code == "gaiastpaloss" ) { %>
                 <ClaimHandlingEntity>GAI</ClaimHandlingEntity> 
                 <ClaimsFundSource>NONGAI</ClaimsFundSource> 
           <%}%>
        <%}%> 
        <% if (theoffsetonset.Offset.WCInjuryTypeExt != null) {%>
	     <%var injurytype = gw.api.util.TypecodeMapperUtil.getTypecodeMapper().getAliasByInternalCode( "WCInjuryTypeExt", "WCInjuryType", theoffsetonset.Offset.WCInjuryTypeExt.Code);%>
             <% if (injurytype != null){%>
                  <WCInjuryTypeExt>
                    <Code><%=injurytype%></Code>
                    <Description><%=injurytype%></Description>
                    <ListName><%=theoffsetonset.Offset.WCInjuryTypeExt.ListName%></ListName>
                  </WCInjuryTypeExt>
             <%}%>
	<%}%>
	<% if (theoffsetonset.Offset.Exposure.BureauBenefitTypeExt != null) {%>
	     <%var bbenefittype = gw.api.util.TypecodeMapperUtil.getTypecodeMapper().getAliasByInternalCode( "BureauBenefitExt", "BureauBenefit", theoffsetonset.Offset.Exposure.BureauBenefitTypeExt.Code);%>
             <% if (bbenefittype != null){%>
                  <BureauBenefitTypeExt>
                    <Code><%=bbenefittype%></Code>
                    <Description><%=bbenefittype%></Description>
                    <ListName><%=theoffsetonset.Offset.Exposure.BureauBenefitTypeExt.ListName%></ListName>
                  </BureauBenefitTypeExt>
             <%}%>
	<%}%>  
      </Offset>
      <%}%>
      <% if (theoffsetonset.Onset != null) {%>
      <Onset>
        <PublicID><%=theoffsetonset.Onset.PublicID%></PublicID>
        <ObjectStatus>A</ObjectStatus>
        <% if (theoffsetonset.Onset.CreateTime != null) {%>
        <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(theoffsetonset.Onset.CreateTime)%></CreateTime> 
        <%}%>
        <% if (theoffsetonset.Onset.UpdateTime != null) {%>
        <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(theoffsetonset.Onset.UpdateTime)%></UpdateTime> 
        <%}%>
        <% if (therecovery.Exposure.PublicID != null) {%>
        <RelToExposure><%=therecovery.Exposure.PublicID%></RelToExposure>
        <%}%>
        <% if (theoffsetonset.Onset.Subtype != null) {%>
        <%=TypeListTemplate.renderToString(theoffsetonset.Onset.Subtype, "Subtype", theoffsetonset.Onset.Subtype.ListName)%>
        <%}%>
        <% if (theoffsetonset.Onset.Status != null) {%>
        <%=TypeListTemplate.renderToString(theoffsetonset.Onset.Status, "Status", theoffsetonset.Onset.Status.ListName)%>
        <%}%>
        <% if (theoffsetonset.Onset.CostType != null) {%>
        <%=TypeListTemplate.renderToString(theoffsetonset.Onset.CostType, "CostType", theoffsetonset.Onset.CostType.ListName)%>
        <%}%>
        <% if (theoffsetonset.Onset.LineItems != null) {%>
        <% for (var thelineitem in theoffsetonset.Onset.LineItems) {  %>
        <LineItems>
          <PublicID><%=thelineitem.PublicID%></PublicID>
          <ObjectStatus>A</ObjectStatus>
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
        </LineItems>
        <%}%>
        <%}%>
        <% if (theoffsetonset.Onset.SubmitDate != null) {%>
        <SubmitDate><%=theoffsetonset.Onset.SubmitDate%></SubmitDate> 
        <%}%>
        <% if (theoffsetonset.Onset.TransactionDate != null) {%>
        <TransactionDate><%=theoffsetonset.Onset.TransactionDate%></TransactionDate> 
        <%}%>
        <% if (theoffsetonset.Onset.TransactionSet != null) { var thetransactionset = theoffsetonset.Onset.TransactionSet;%>
        <TransactionSet>
          <PublicID><%=thetransactionset.PublicID%></PublicID>
          <ObjectStatus>A</ObjectStatus>
          <% if (thetransactionset.ApprovalDate != null) {%>
          <ApprovalDate><%=thetransactionset.ApprovalDate%></ApprovalDate> 
          <%}%>
          <% if (thetransactionset.Subtype != null) {%>
          <%=TypeListTemplate.renderToString(thetransactionset.Subtype, "SubType", thetransactionset.Subtype.ListName)%>
          <%}%>
        </TransactionSet>
        <%}%>
        <% if (theoffsetonset.Onset.CostType != null) { %>
           <% if (theoffsetonset.Onset.CostType.Code == "claimcost" or theoffsetonset.Onset.CostType.Code == "expense" ) { %>
                 <ClaimHandlingEntity>GAI</ClaimHandlingEntity> 
                 <ClaimsFundSource>GAI</ClaimsFundSource> 
           <% } else if (theoffsetonset.Onset.CostType.Code == "gaiastpaexpense" or theoffsetonset.Onset.CostType.Code == "gaiastpaloss" ) { %>
                 <ClaimHandlingEntity>GAI</ClaimHandlingEntity> 
                 <ClaimsFundSource>NONGAI</ClaimsFundSource> 
           <%}%>
        <%}%> 
        <% if (theoffsetonset.Onset.WCInjuryTypeExt != null) {%>
	     <%var oninjurytype = gw.api.util.TypecodeMapperUtil.getTypecodeMapper().getAliasByInternalCode( "WCInjuryTypeExt", "WCInjuryType", theoffsetonset.Onset.WCInjuryTypeExt.Code);%>
             <% if (oninjurytype != null){%>
                  <WCInjuryTypeExt>
                    <Code><%=oninjurytype%></Code>
                    <Description><%=oninjurytype%></Description>
                    <ListName><%=theoffsetonset.Onset.WCInjuryTypeExt.ListName%></ListName>
                  </WCInjuryTypeExt>
             <%}%>
	<%}%>
	<% if (theoffsetonset.Onset.Exposure.BureauBenefitTypeExt != null) {%>
	     <%var onbbenefittype = gw.api.util.TypecodeMapperUtil.getTypecodeMapper().getAliasByInternalCode( "BureauBenefitExt", "BureauBenefit", theoffsetonset.Onset.Exposure.BureauBenefitTypeExt.Code);%>
             <% if (onbbenefittype != null){%>
                  <BureauBenefitTypeExt>
                    <Code><%=onbbenefittype%></Code>
                    <Description><%=onbbenefittype%></Description>
                    <ListName><%=theoffsetonset.Onset.Exposure.BureauBenefitTypeExt.ListName%></ListName>
                  </BureauBenefitTypeExt>
             <%}%>
	<%}%>
      </Onset>
      <%}%>
    </OffsetOnsets>
    <%}%>
    <%}%>

    <% if (therecovery.SubmitDate != null) {%>
    <SubmitDate><%=therecovery.SubmitDate%></SubmitDate> 
    <%}%>
    <% if (therecovery.TransactionDate != null) {%>
    <TransactionDate><%=therecovery.TransactionDate%></TransactionDate> 
    <%}%>
    <% if (therecovery.TransactionSet != null) { var thetransactionset = therecovery.TransactionSet;%>
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

    <% if (therecovery.CreateUser != null || therecovery.UpdateUser != null) {%>
    <%var ppartyRelTo = "<PartyRelTo><PublicID>"+therecovery.PublicID+"</PublicID><RelToType>Payment</RelToType></PartyRelTo>"%>
    <Parties>
      <% if (therecovery.CreateUser != null)  { %>
      <%=UserTemplate.renderToString(therecovery.CreateUser, "", objStatus, displaykey.EDW.Templates.CreateUserRole, "", ppartyRelTo)%>
      <%}%>

      <% if (therecovery.TransactionSet.getLastApprovingUserExt() != null) { var theapprovedby = therecovery.TransactionSet.getLastApprovingUserExt();%> 
      <% var abrole = "<Role><Code>approvedby</Code><Description>ApprovedBy</Description><ListName>ApprovedBy</ListName></Role>"%>
      <%=UserTemplate.renderToString(theapprovedby, "", objStatus, abrole, "", ppartyRelTo)%>
      <%}%> 

      <% if (therecovery.UpdateUser != null)  { %>
      <%=UserTemplate.renderToString(therecovery.UpdateUser, "", objStatus, displaykey.EDW.Templates.UpdateUserRole, "", ppartyRelTo)%>
      <%}%>

      <% if (therecovery.PayerDenorm != null)  { var thepayer = therecovery.PayerDenorm;%>
      <% var rrole = "<Role><Code>recoverypayer</Code><Description>The payer on a recovery</Description><ListName>ContactRole</ListName></Role>"%>
      <%=PartyTemplate.renderToString(thepayer, "", objStatus, rrole, "", ppartyRelTo, therecovery.Claim, "", "")%>
      <%}%>
    </Parties>	
    <%}%>
    <% if (therecovery.RecoverySalvagedItemExt != null) {%>
    <RecoverySalvagedItemExt><%=therecovery.RecoverySalvagedItemExt%></RecoverySalvagedItemExt>
    <%}%>
    <% if (therecovery.CostType != null) { %>
         <% if (therecovery.CostType.Code == "claimcost" or therecovery.CostType.Code == "expense" ) { %>
               <ClaimHandlingEntity>GAI</ClaimHandlingEntity> 
               <ClaimsFundSource>GAI</ClaimsFundSource> 
         <% } else if (therecovery.CostType.Code == "gaiastpaexpense" or therecovery.CostType.Code == "gaiastpaloss" ) { %>
               <ClaimHandlingEntity>GAI</ClaimHandlingEntity> 
               <ClaimsFundSource>NONGAI</ClaimsFundSource> 
         <%}%>
    <%}%> 
    <% if (therecovery.TransactionForExt != null) {%>
       <%=TypeListTemplate.renderToString(therecovery.TransactionForExt, "TransactionForExt", therecovery.TransactionForExt.ListName)%>
    <%}%>
    <% if (therecovery.TransctionDescExt != null) {%>
       <TransactionDescExt><%=StringUtils.getXMLValue(therecovery.TransctionDescExt, false)%></TransactionDescExt>
    <%}%>
    <% if (therecovery.WCInjuryTypeExt != null) {%>
         <%var rinjurytype = gw.api.util.TypecodeMapperUtil.getTypecodeMapper().getAliasByInternalCode( "WCInjuryTypeExt", "WCInjuryType", therecovery.WCInjuryTypeExt.Code);%>
         <% if (rinjurytype != null){%>
              <WCInjuryTypeExt>
                <Code><%=rinjurytype%></Code>
                <Description><%=rinjurytype%></Description>
                <ListName><%=therecovery.WCInjuryTypeExt.ListName%></ListName>
              </WCInjuryTypeExt>
         <%}%>
    <%}%>
    <% if (therecovery.Exposure.BureauBenefitTypeExt != null) {%>
         <%var rbbenefittype = gw.api.util.TypecodeMapperUtil.getTypecodeMapper().getAliasByInternalCode( "BureauBenefitExt", "BureauBenefit", therecovery.Exposure.BureauBenefitTypeExt.Code);%>
         <% if (rbbenefittype != null){%>
              <BureauBenefitTypeExt>
                <Code><%=rbbenefittype%></Code>
                <Description><%=rbbenefittype%></Description>
                <ListName><%=therecovery.Exposure.BureauBenefitTypeExt.ListName%></ListName>
              </BureauBenefitTypeExt>
         <%}%>
    <%}%>
    </FinancialTransaction>
</Transaction>