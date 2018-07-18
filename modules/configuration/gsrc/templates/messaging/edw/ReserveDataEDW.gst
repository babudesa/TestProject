<% uses util.UniqueNumberGenerators %>
<% uses templates.messaging.edw.TypeListTemplate %>
<% uses util.StringUtils %>
<% uses templates.messaging.edw.UserTemplate %>
<% uses gaic.conversion.util.ConversionStatusChecker %>
<%@ params(thereserve : Reserve, objStatus : String, eventName : String) %>
<Transaction>
  <CCTransactionTime>
  <%=util.custom_Ext.DateTime.getTimeStamp()%>
  </CCTransactionTime>
  <uniqueID><%=UniqueNumberGenerators.generateEDWUniqueID()%></uniqueID>
  <% if (ConversionStatusChecker.isCurrentlyConverting(thereserve.LoadCommandID, thereserve.CreateUser, thereserve.UpdateUser))  {%>
  <FinanciallyProcessedIndicator>true</FinanciallyProcessedIndicator>
  <% } else {%>
  <FinanciallyProcessedIndicator>false</FinanciallyProcessedIndicator>
  <% } %>		 
  <%if (thereserve.Exposure.Claim.ClaimNumber != null) {%>
  <ClaimNumber><%=thereserve.Exposure.Claim.ClaimNumber%></ClaimNumber>
  <%}%>
  <%if (thereserve.Exposure.Claim.Policy.PolicyType != null) {%>
  <PolicySymbol><%=thereserve.Exposure.Claim.Policy.PolicyType%></PolicySymbol>
  <%}%>
  <%if (thereserve.Exposure.Claim.LossType != null) {%>
  <TransactionLossType><%=thereserve.Exposure.Claim.LossType%></TransactionLossType>
  <%}%>
  <% if (thereserve.LoadCommandID != null and ConversionStatusChecker.isCurrentlyConverting(thereserve.LoadCommandID, thereserve.CreateUser, thereserve.UpdateUser))  {%>
  <% if (thereserve.AccountingMonthExt != null)  {%>
  <AccountingMonth><%=(thereserve.AccountingMonthExt < 10) ? "0" + thereserve.AccountingMonthExt : thereserve.AccountingMonthExt%></AccountingMonth>
  <%}%>
  <% if (thereserve.AccountingYearExt != null)  {%>
  <AccountingYear><%=thereserve.AccountingYearExt%></AccountingYear>
  <%}%>
  <%}%>
  <FinancialTransaction>
    <PublicID><%=thereserve.PublicID%></PublicID>
    <ObjectStatus><%=objStatus%></ObjectStatus>
    <% if (thereserve.RptCreateDateExt != null and thereserve.LoadCommandID != null and ConversionStatusChecker.isCurrentlyConverting(thereserve.LoadCommandID, thereserve.CreateUser, thereserve.UpdateUser)) {%>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(thereserve.RptCreateDateExt)%></CreateTime> 
    <%} else if (thereserve.CreateTime != null) {%>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(thereserve.CreateTime)%></CreateTime> 
    <%}%>
    <% if (thereserve.UpdateTime != null) {%>
    <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(thereserve.UpdateTime)%></UpdateTime> 
    <%}%>
    <RelToExposure><%=thereserve.Exposure.PublicID%></RelToExposure>
    <TransactionRelToClaim><%=thereserve.Claim.PublicID%></TransactionRelToClaim>
    <% if (thereserve.Subtype != null) {%>
    <%=TypeListTemplate.renderToString(thereserve.Subtype, "Subtype", thereserve.Subtype.ListName)%>
    <%}%>
    <% if (thereserve.FactorReserveExt != null) {%>
    <FactorReserveExt><%=thereserve.FactorReserveExt%></FactorReserveExt>
    <%}%>
    <% if (thereserve.Status != null) {%>
    <%=TypeListTemplate.renderToString(thereserve.Status, "Status", thereserve.Status.ListName)%>
    <%}%>
    <% if (thereserve.CostType != null) {%>
    <%=TypeListTemplate.renderToString(thereserve.CostType, "CostType", thereserve.CostType.ListName)%>
    <%}%>

    <% if (thereserve.LineItems != null) {%>
    <% for (var thelineitem in thereserve.LineItems) {  %>
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

    <% if (thereserve.OffsetOnsets  != null) {%>
    <% for (var theoffsetonset in thereserve.OffsetOnsets ) {  %>
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
        <% if (thereserve.Exposure.PublicID != null) {%>
        <RelToExposure><%=thereserve.Exposure.PublicID%></RelToExposure>
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
        <% if (thereserve.Exposure.PublicID != null) {%>
        <RelToExposure><%=thereserve.Exposure.PublicID%></RelToExposure>
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

    <% if (thereserve.SubmitDate != null) {%>
    <SubmitDate><%=thereserve.SubmitDate%></SubmitDate> 
    <%}%>
    <% if (thereserve.TransactionDate != null) {%>
    <TransactionDate><%=thereserve.TransactionDate%></TransactionDate> 
    <%}%>
    <% if (thereserve.TransactionSet != null) { var thetransactionset = thereserve.TransactionSet;%>
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

    <% if (thereserve.CreateUser != null || thereserve.UpdateUser != null) {%>
    <%var ppartyRelTo = "<PartyRelTo><PublicID>"+thereserve.PublicID+"</PublicID><RelToType>Payment</RelToType></PartyRelTo>"%>
    <Parties>
      <% if (thereserve.CreateUser != null)  { %>
      <%=UserTemplate.renderToString(thereserve.CreateUser, "", objStatus, displaykey.EDW.Templates.CreateUserRole, "", ppartyRelTo)%>
      <%}%>

      <% if (thereserve.TransactionSet.getLastApprovingUserExt() != null) { var theapprovedby = thereserve.TransactionSet.getLastApprovingUserExt();%> 
      <% var abrole = "<Role><Code>approvedby</Code><Description>ApprovedBy</Description><ListName>ApprovedBy</ListName></Role>"%>
      <%=UserTemplate.renderToString(theapprovedby, "", objStatus, abrole, "", ppartyRelTo)%>
      <%}%> 

      <% if (thereserve.UpdateUser != null)  { %>
      <%=UserTemplate.renderToString(thereserve.UpdateUser, "", objStatus, displaykey.EDW.Templates.UpdateUserRole, "", ppartyRelTo)%>
      <%}%>
    </Parties>	
    <%}%>
    <% if (thereserve.Comments != null) {%>
    <TransactionComments><%=thereserve.Comments%></TransactionComments>
    <%}%>
    <% if (thereserve.CostType != null) { %>
         <% if (thereserve.CostType.Code == "claimcost" or thereserve.CostType.Code == "expense" ) { %>
               <ClaimHandlingEntity>GAI</ClaimHandlingEntity> 
               <ClaimsFundSource>GAI</ClaimsFundSource> 
         <% } else if (thereserve.CostType.Code == "gaiastpaexpense" or thereserve.CostType.Code == "gaiastpaloss" ) { %>
               <ClaimHandlingEntity>GAI</ClaimHandlingEntity> 
               <ClaimsFundSource>NONGAI</ClaimsFundSource> 
         <%}%>
    <%}%> 
    <% if (thereserve.WCInjuryTypeExt != null) {%>
         <%var rinjurytype = gw.api.util.TypecodeMapperUtil.getTypecodeMapper().getAliasByInternalCode( "WCInjuryTypeExt", "WCInjuryType", thereserve.WCInjuryTypeExt.Code);%>
         <% if (rinjurytype != null){%>
              <WCInjuryTypeExt>
                <Code><%=rinjurytype%></Code>
                <Description><%=rinjurytype%></Description>
                <ListName><%=thereserve.WCInjuryTypeExt.ListName%></ListName>
              </WCInjuryTypeExt>
         <%}%>
    <%}%>
    <% if (thereserve.Exposure.BureauBenefitTypeExt != null) {%>
         <%var rbbenefittype = gw.api.util.TypecodeMapperUtil.getTypecodeMapper().getAliasByInternalCode( "BureauBenefitExt", "BureauBenefit", thereserve.Exposure.BureauBenefitTypeExt.Code);%>
         <% if (rbbenefittype != null){%>
              <BureauBenefitTypeExt>
                <Code><%=rbbenefittype%></Code>
                <Description><%=rbbenefittype%></Description>
                <ListName><%=thereserve.Exposure.BureauBenefitTypeExt.ListName%></ListName>
              </BureauBenefitTypeExt>
         <%}%>
    <%}%>
    <% if (thereserve.ReserveTypeExt != null) {%>
    	<%=TypeListTemplate.renderToString(thereserve.ReserveTypeExt, "ReserveTypeExt", thereserve.ReserveTypeExt.ListName)%>
    <%}%>
  </FinancialTransaction>
</Transaction>