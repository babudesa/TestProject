<% uses util.UniqueNumberGenerators %>
<% uses templates.messaging.edw.TypeListTemplate %>
<% uses templates.messaging.edw.UserTemplate %>
<% uses gaic.conversion.util.ConversionStatusChecker %>
<%@ params(therecoveryreserve : RecoveryReserve, objStatus : String, eventName : String) %>
<Transaction>
  <CCTransactionTime>
  <%=util.custom_Ext.DateTime.getTimeStamp()%>
  </CCTransactionTime>
  <uniqueID><%=UniqueNumberGenerators.generateEDWUniqueID()%></uniqueID>
  <% if (ConversionStatusChecker.isCurrentlyConverting(therecoveryreserve.LoadCommandID, therecoveryreserve.CreateUser, therecoveryreserve.UpdateUser))  {%>
  <FinanciallyProcessedIndicator>true</FinanciallyProcessedIndicator>
  <% } else {%>
  <FinanciallyProcessedIndicator>false</FinanciallyProcessedIndicator>
  <% } %>		 
  <%if (therecoveryreserve.Exposure.Claim.ClaimNumber != null) {%>
  <ClaimNumber><%=therecoveryreserve.Exposure.Claim.ClaimNumber%></ClaimNumber>
  <%}%>
  <%if (therecoveryreserve.Exposure.Claim.Policy.PolicyType != null) {%>
  <PolicySymbol><%=therecoveryreserve.Exposure.Claim.Policy.PolicyType%></PolicySymbol>
  <%}%>
  <%if (therecoveryreserve.Exposure.Claim.LossType != null) {%>
  <TransactionLossType><%=therecoveryreserve.Exposure.Claim.LossType%></TransactionLossType>
  <%}%>
  <% if (therecoveryreserve.LoadCommandID != null and ConversionStatusChecker.isCurrentlyConverting(therecoveryreserve.LoadCommandID, therecoveryreserve.CreateUser, therecoveryreserve.UpdateUser))  {%>
  <% if (therecoveryreserve.AccountingMonthExt != null)  {%>
  <AccountingMonth><%=(therecoveryreserve.AccountingMonthExt < 10) ? "0" + therecoveryreserve.AccountingMonthExt : therecoveryreserve.AccountingMonthExt%></AccountingMonth>
  <%}%>
  <% if (therecoveryreserve.AccountingYearExt != null)  {%>
  <AccountingYear><%=therecoveryreserve.AccountingYearExt%></AccountingYear>
  <%}%>
  <%}%>
  <FinancialTransaction>
    <PublicID><%=therecoveryreserve.PublicID%></PublicID>
    <ObjectStatus><%=objStatus%></ObjectStatus>
    <% if (therecoveryreserve.RptCreateDateExt != null and therecoveryreserve.LoadCommandID != null and ConversionStatusChecker.isCurrentlyConverting(therecoveryreserve.LoadCommandID, therecoveryreserve.CreateUser, therecoveryreserve.UpdateUser)) {%>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(therecoveryreserve.RptCreateDateExt)%></CreateTime> 
    <%} else if (therecoveryreserve.CreateTime != null) {%>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(therecoveryreserve.CreateTime)%></CreateTime> 
    <%}%>
    <% if (therecoveryreserve.UpdateTime != null) {%>
    <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(therecoveryreserve.UpdateTime)%></UpdateTime> 
    <%}%>
    <RelToExposure><%=therecoveryreserve.Exposure.PublicID%></RelToExposure>
    <TransactionRelToClaim><%=therecoveryreserve.Claim.PublicID%></TransactionRelToClaim>
    <% if (therecoveryreserve.Subtype != null) {%>
    <Subtype>
    <Code><%=therecoveryreserve.Subtype.Code%></Code>
    <Description><%=therecoveryreserve.Subtype.Description%></Description>
    <ListName><%=therecoveryreserve.Subtype.ListName%></ListName>
    </Subtype>
    <%}%>
    <% if (therecoveryreserve.Status != null) {%>
    <%=TypeListTemplate.renderToString(therecoveryreserve.Status, "Status", therecoveryreserve.Status.ListName)%>
    <%}%>
    <% if (therecoveryreserve.CostType != null) {%>
    <%=TypeListTemplate.renderToString(therecoveryreserve.CostType, "CostType", therecoveryreserve.CostType.ListName)%>
    <%}%>
    <% if (therecoveryreserve.CostCategory != null) {%>
    <%=TypeListTemplate.renderToString(therecoveryreserve.CostCategory, "RecoveryCategory", therecoveryreserve.CostCategory.ListName)%>
    <%}%>

    <% if (therecoveryreserve.LineItems != null) {%>
    <% for (var thelineitem in therecoveryreserve.LineItems) {  %>
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

    <% if (therecoveryreserve.OffsetOnsets  != null) {%>
    <% for (var theoffsetonset in therecoveryreserve.OffsetOnsets ) {  %>
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
        <% if (therecoveryreserve.Exposure.PublicID != null) {%>
        <RelToExposure><%=therecoveryreserve.Exposure.PublicID%></RelToExposure>
        <%}%>
        <% if (theoffsetonset.Offset.Subtype != null) {%>
        <Subtype>
        <Code><%=theoffsetonset.Offset.Subtype.Code%></Code>
        <Description><%=theoffsetonset.Offset.Subtype.Description%></Description>
        <ListName><%=theoffsetonset.Offset.Subtype.ListName%></ListName>
        </Subtype>
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
        <% if (therecoveryreserve.Exposure.PublicID != null) {%>
        <RelToExposure><%=therecoveryreserve.Exposure.PublicID%></RelToExposure>
        <%}%>
        <% if (theoffsetonset.Onset.Subtype != null) {%>
        <Subtype>
        <Code><%=theoffsetonset.Onset.Subtype.Code%></Code>
        <Description><%=theoffsetonset.Onset.Subtype.Description%></Description>
        <ListName><%=theoffsetonset.Onset.Subtype.ListName%></ListName>
        </Subtype>
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

    <% if (therecoveryreserve.SubmitDate != null) {%>
    <SubmitDate><%=therecoveryreserve.SubmitDate%></SubmitDate> 
    <%}%>
    <% if (therecoveryreserve.TransactionDate != null) {%>
    <TransactionDate><%=therecoveryreserve.TransactionDate%></TransactionDate> 
    <%}%>
    <% if (therecoveryreserve.TransactionSet != null) { var thetransactionset = therecoveryreserve.TransactionSet;%>
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

    <% if (therecoveryreserve.CreateUser != null || therecoveryreserve.UpdateUser != null) {%>
    <%var ppartyRelTo = "<PartyRelTo><PublicID>"+therecoveryreserve.PublicID+"</PublicID><RelToType>Payment</RelToType></PartyRelTo>"%>
    <Parties>
      <% if (therecoveryreserve.CreateUser != null)  { %>
      <%=UserTemplate.renderToString(therecoveryreserve.CreateUser, "", objStatus, displaykey.EDW.Templates.CreateUserRole, "", ppartyRelTo)%>
      <%}%>

      <% if (therecoveryreserve.TransactionSet.getLastApprovingUserExt() != null) { var theapprovedby = therecoveryreserve.TransactionSet.getLastApprovingUserExt();%> 
      <% var abrole = "<Role><Code>approvedby</Code><Description>ApprovedBy</Description><ListName>ApprovedBy</ListName></Role>"%>
      <%=UserTemplate.renderToString(theapprovedby, "", objStatus, abrole, "", ppartyRelTo)%>
      <%}%> 

      <% if (therecoveryreserve.UpdateUser != null)  { %>
      <%=UserTemplate.renderToString(therecoveryreserve.UpdateUser, "", objStatus, displaykey.EDW.Templates.UpdateUserRole, "", ppartyRelTo)%>
      <%}%>
    </Parties>	
    <%}%>
    <% if (therecoveryreserve.Comments != null) {%>
       <TransactionComments><%=therecoveryreserve.Comments%></TransactionComments>
    <%}%>
    <% if (therecoveryreserve.CostType != null) { %>
         <% if (therecoveryreserve.CostType.Code == "claimcost" or therecoveryreserve.CostType.Code == "expense" ) { %>
               <ClaimHandlingEntity>GAI</ClaimHandlingEntity> 
               <ClaimsFundSource>GAI</ClaimsFundSource> 
         <% } else if (therecoveryreserve.CostType.Code == "gaiastpaexpense" or therecoveryreserve.CostType.Code == "gaiastpaloss" ) { %>
               <ClaimHandlingEntity>GAI</ClaimHandlingEntity> 
               <ClaimsFundSource>NONGAI</ClaimsFundSource> 
         <%}%>
    <%}%> 
    <% if (therecoveryreserve.WCInjuryTypeExt != null) {%>
         <%var rinjurytype = gw.api.util.TypecodeMapperUtil.getTypecodeMapper().getAliasByInternalCode( "WCInjuryTypeExt", "WCInjuryType", therecoveryreserve.WCInjuryTypeExt.Code);%>
         <% if (rinjurytype != null){%>
              <WCInjuryTypeExt>
                <Code><%=rinjurytype%></Code>
                <Description><%=rinjurytype%></Description>
                <ListName><%=therecoveryreserve.WCInjuryTypeExt.ListName%></ListName>
              </WCInjuryTypeExt>
         <%}%>
    <%}%>
    <% if (therecoveryreserve.Exposure.BureauBenefitTypeExt != null) {%>
         <%var rbbenefittype = gw.api.util.TypecodeMapperUtil.getTypecodeMapper().getAliasByInternalCode( "BureauBenefitExt", "BureauBenefit", therecoveryreserve.Exposure.BureauBenefitTypeExt.Code);%>
         <% if (rbbenefittype != null){%>
              <BureauBenefitTypeExt>
                <Code><%=rbbenefittype%></Code>
                <Description><%=rbbenefittype%></Description>
                <ListName><%=therecoveryreserve.Exposure.BureauBenefitTypeExt.ListName%></ListName>
              </BureauBenefitTypeExt>
         <%}%>
    <%}%>
  </FinancialTransaction>
</Transaction>