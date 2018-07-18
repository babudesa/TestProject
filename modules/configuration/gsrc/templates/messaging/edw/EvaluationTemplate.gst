<% uses util.UniqueNumberGenerators %>
<% uses util.StringUtils %>
<% uses templates.messaging.edw.TypeListTemplate %>
<% uses templates.messaging.edw.LossLocationTemplate %>
<% uses templates.messaging.edw.UserTemplate %>
<% uses gaic.conversion.util.ConversionStatusChecker %>
<%@ params(evaluation : Evaluation, objStatus : String) %>
<Transaction>
  <CCTransactionTime><%=util.custom_Ext.DateTime.getTimeStamp()%></CCTransactionTime>
  <uniqueID><%=UniqueNumberGenerators.generateEDWUniqueID()%></uniqueID>
  <% if (ConversionStatusChecker.isCurrentlyConverting(evaluation.LoadCommandID, evaluation.CreateUser, evaluation.UpdateUser)) {%>
  <FinanciallyProcessedIndicator>true</FinanciallyProcessedIndicator>
  <% } else {%>
  <FinanciallyProcessedIndicator>false</FinanciallyProcessedIndicator>
  <% } %>		  
  <%if (evaluation.Claim.ClaimNumber != null) {%>
  <ClaimNumber><%=evaluation.Claim.ClaimNumber%></ClaimNumber>
  <%}%>
  <%if (evaluation.Claim.Policy.PolicyType != null) {%>
  <PolicySymbol><%=evaluation.Claim.Policy.PolicyType%></PolicySymbol>
  <%}%>
  <%if (evaluation.Claim.LossType != null) {%>
  <TransactionLossType><%=evaluation.Claim.LossType%></TransactionLossType>
  <%}%>

  <Evaluation>
    <PublicID><%=evaluation.PublicID%></PublicID>	
    <ObjectStatus><%=objStatus%></ObjectStatus>
    <% if (evaluation.CreateTime != null) {%>
    <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(evaluation.CreateTime)%></CreateTime> 
    <%}%>
    <% if (evaluation.UpdateTime != null) {%>
    <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(evaluation.UpdateTime)%></UpdateTime>
    <%}%>

    <%var partyRelTo = "<PartyRelTo><PublicID>"+evaluation.PublicID+"</PublicID><RelToType>Evaluation</RelToType></PartyRelTo>"%>
    <Parties>
      <% if (evaluation.CreateUser != null) { %>
      <%=UserTemplate.renderToString(evaluation.CreateUser, "", objStatus, displaykey.EDW.Templates.CreateUserRole, "", partyRelTo)%>
      <%}%>

      <% if ((evaluation.UpdateUser != null) ) { %>
      <%=UserTemplate.renderToString(evaluation.UpdateUser, "", objStatus, displaykey.EDW.Templates.UpdateUserRole, "", partyRelTo)%>
      <%}%>
    </Parties>
    	
    <% if (evaluation.Claim != null && evaluation.Claim.PublicID != null) {%>
    <RelToClaim><%=evaluation.Claim.PublicID%></RelToClaim>
    <%}%>
    <% if (evaluation.Exposure != null && evaluation.Exposure.PublicID != null) {%>
    <RelToFeature><%=evaluation.Exposure.PublicID%></RelToFeature>
    <%}%>

    <% if (evaluation.EvaluationTypeExt != null) {%>
    <%=TypeListTemplate.renderToString(evaluation.EvaluationTypeExt, "EvaluationTypeExt", evaluation.EvaluationTypeExt.ListName)%>
    <%}%>

    <% if (evaluation.Name != null) {%>
    <Name><%=StringUtils.getXMLValue(evaluation.Name, false)%></Name> 
    <%}%>

    <% if (evaluation.OtherFactorsExt != null) {%>
    <Comment>
      <CommentCategory>
        <Code>OtherFactorsExt</Code>
        <Description>OtherFactorsExt</Description>
        <ListName>Evaluation Comment Category</ListName>
      </CommentCategory>
      <Text><%=StringUtils.getXMLValue(evaluation.OtherFactorsExt,false)%></Text> 
    </Comment> 
    <%}%>
    
    <% if (evaluation.LiabilityEvalExt != null) {%>
    <Comment>
      <CommentCategory>
        <Code>LiabilityEvalExt</Code>
        <Description>LiabilityEvalExt</Description>
        <ListName>Evaluation Comment Category</ListName>
      </CommentCategory>
      <Text><%=StringUtils.getXMLValue(evaluation.LiabilityEvalExt,false)%></Text> 
    </Comment>
    <%}%>
    
    <% if (evaluation.ClaimantOccupationExt != null) {%>
    <Comment>
      <CommentCategory>
        <Code>ClaimantOccupationExt</Code>
        <Description>ClaimantOccupationExt</Description>
        <ListName>Evaluation Comment Category</ListName>
      </CommentCategory>
      <Text><%=StringUtils.getXMLValue(evaluation.ClaimantOccupationExt,false)%></Text> 
    </Comment>
    <%}%>

    <% if (evaluation.CoverageIssuesExt != null) {%>
    <Comment>
      <CommentCategory>
        <Code>CoverageIssuesExt</Code>
        <Description>CoverageIssuesExt</Description>
        <ListName>Evaluation Comment Category</ListName>
      </CommentCategory>
      <Text><%=StringUtils.getXMLValue(evaluation.CoverageIssuesExt,false)%></Text> 
    </Comment>
    <%}%>

    <% if (evaluation.DamageDescriptionExt != null) {%>
    <Comment>
      <CommentCategory>
        <Code>DamageDescriptionExt</Code>
        <Description>DamageDescriptionExt</Description>
        <ListName>Evaluation Comment Category</ListName>
      </CommentCategory>
      <Text><%=StringUtils.getXMLValue(evaluation.DamageDescriptionExt,false)%></Text> 
    </Comment>
    <%}%>
    
    <% if (evaluation.DefenseEvalExt != null) {%>
    <Comment>
      <CommentCategory>
        <Code>DefenseEvalExt</Code>
        <Description>DefenseEvalExt</Description>
        <ListName>Evaluation Comment Category</ListName>
      </CommentCategory>
      <Text><%=StringUtils.getXMLValue(evaluation.DefenseEvalExt,false)%></Text> 
    </Comment> 
    <%}%>

    <% if (evaluation.ReserveChangeReasonExt != null) {%>
    <Comment>
      <CommentCategory>
        <Code>ReserveChangeReasonExt</Code>
        <Description>ReserveChangeReasonExt</Description>
        <ListName>Evaluation Comment Category</ListName>
      </CommentCategory>
      <Text><%=StringUtils.getXMLValue(evaluation.ReserveChangeReasonExt,false)%></Text> 
    </Comment> 
    <%}%>
    
    <% if (evaluation.ReserveBasisExt != null) {%>
    <Comment>
      <CommentCategory>
        <Code>ReserveBasisExt</Code>
        <Description>ReserveBasisExt</Description>
        <ListName>Evaluation Comment Category</ListName>
      </CommentCategory>
      <Text><%=StringUtils.getXMLValue(evaluation.ReserveBasisExt,false)%></Text> 
    </Comment> 
    <%}%>
    
    <% if (evaluation.OtherInfoExt != null) {%>
    <Comment>
      <CommentCategory>
        <Code>OtherInfoExt</Code>
        <Description>OtherInfoExt</Description>
        <ListName>Evaluation Comment Category</ListName>
      </CommentCategory>
      <Text><%=StringUtils.getXMLValue(evaluation.OtherInfoExt,false)%></Text> 
    </Comment> 
    <%}%>

    <% if (evaluation.CommentsExt != null) {%>
    <Comment>
      <CommentCategory>
        <Code>CommentsExt</Code>
        <Description>CommentsExt</Description>
        <ListName>Evaluation Comment Category</ListName>
      </CommentCategory>
      <Text><%=StringUtils.getXMLValue(evaluation.CommentsExt,false)%></Text> 
    </Comment>  
    <%}%>
    
    <% if (evaluation.LiabilityOverviewExt != null) {%>
    <Comment>
      <CommentCategory>
        <Code>LiabilityOverviewExt</Code>
        <Description>LiabilityOverviewExt</Description>
        <ListName>Evaluation Comment Category</ListName>
      </CommentCategory>
      <Text><%=StringUtils.getXMLValue(evaluation.LiabilityOverviewExt,false)%></Text> 
    </Comment>  
    <%}%>

    <% if (evaluation.DamageOverviewExt != null) {%>
    <Comment>
      <CommentCategory>
        <Code>DamageOverviewExt</Code>
        <Description>DamageOverviewExt</Description>
        <ListName>Evaluation Comment Category</ListName>
      </CommentCategory>
      <Text><%=StringUtils.getXMLValue(evaluation.DamageOverviewExt,false)%></Text> 
    </Comment>  
    <%}%>

    <% if (evaluation.DefenseStrengthsExt != null) {%>
    <Comment>
      <CommentCategory>
        <Code>DefenseStrengthsExt</Code>
        <Description>DefenseStrengthsExt</Description>
        <ListName>Evaluation Comment Category</ListName>
      </CommentCategory>
      <Text><%=StringUtils.getXMLValue(evaluation.DefenseStrengthsExt,false)%></Text> 
    </Comment>  
    <%}%>

    <% if (evaluation.PlaintiffStrengthsExt != null) {%>
    <Comment>
      <CommentCategory>
        <Code>PlaintiffStrengthsExt</Code>
        <Description>PlaintiffStrengthsExt</Description>
        <ListName>Evaluation Comment Category</ListName>
      </CommentCategory>
      <Text><%=StringUtils.getXMLValue(evaluation.PlaintiffStrengthsExt,false)%></Text> 
    </Comment>  
    <%}%>

    <% if (evaluation.AmbulanceDamagesPastExt != null) {%>
    <Value>
      <ValueCategory>
        <Code>AmbulanceDamagesPastExt</Code>
        <Description>AmbulanceDamagesPastExt</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.AmbulanceDamagesPastExt as java.lang.String,false)%></Amount> 
    </Value> 
    <%}%>

    <% if (evaluation.PotFeatRangeHighExt != null) {%>
    <Value>
      <ValueCategory>
        <Code>PotFeatRangeHighExt</Code>
        <Description>PotFeatRangeHighExt</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.PotFeatRangeHighExt as java.lang.String,false)%></Amount> 
    </Value> 
    <%}%>		

    <% if (evaluation.DefenseCostExt != null) {%>
    <Value>
      <ValueCategory>
        <Code>DefenseCostExt</Code>
        <Description>DefenseCostExt</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.DefenseCostExt as java.lang.String,false)%></Amount> 
    </Value> 
    <%}%>

    <% if (evaluation.RecReserveExt != null) {%>
    <Value>
      <ValueCategory>
        <Code>RecReserveExt</Code>
        <Description>RecReserveExt</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.RecReserveExt as java.lang.String,false)%></Amount> 
      </Value> 
    <%}%>
    
    <% if (evaluation.AdvancesExt != null) {%>
    <Value>
      <ValueCategory>
        <Code>AdvancesExt</Code>
        <Description>AdvancesExt</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.AdvancesExt as java.lang.String,false)%></Amount> 
    </Value> 
    <%}%>
    
    <% if (evaluation.PotFeatRangeLowExt != null) {%>
    <Value>
      <ValueCategory>
        <Code>PotFeatRangeLowExt</Code>
        <Description>PotFeatRangeLowExt</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.PotFeatRangeLowExt as java.lang.String,false)%></Amount> 
    </Value> 
    <%}%>
    	
    <% if (evaluation.SurgeryDamagesPastExt != null) {%>
    <Value>
      <ValueCategory>
        <Code>SurgeryDamagesPastExt</Code>
        <Description>SurgeryDamagesPastExt</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.SurgeryDamagesPastExt as java.lang.String,false)%></Amount> 
    </Value> 
    <%}%>
    
    <% if (evaluation.TherapyDamagesPastExt != null) {%>
    <Value>
      <ValueCategory>
        <Code>TherapyDamagesPastExt</Code>
        <Description>TherapyDamagesPastExt</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.TherapyDamagesPastExt as java.lang.String,false)%></Amount> 
    </Value> 
    <%}%>
    
    <% if (evaluation.MedicationDamagesPastExt != null) {%>
    <Value>
      <ValueCategory>
        <Code>MedicationDamagesPastExt</Code>
        <Description>MedicationDamagesPastExt</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.MedicationDamagesPastExt as java.lang.String,false)%></Amount> 
    </Value> 
    <%}%>
    
    <% if (evaluation.OtherMedicalDamagesPastExt != null) {%>
    <Value>
      <ValueCategory>
        <Code>OtherMedicalDamagesPastExt</Code>
        <Description>OtherMedicalDamagesPastExt</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.OtherMedicalDamagesPastExt as java.lang.String,false)%></Amount> 
    </Value> 
    <%}%>
    
    <% if (evaluation.WageLossDamagesPastExt != null) {%>
    <Value>
      <ValueCategory>
        <Code>WageLossDamagesPastExt</Code>
        <Description>WageLossDamagesPastExt</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.WageLossDamagesPastExt as java.lang.String,false)%></Amount> 
    </Value> 
    <%}%>
    
    <% if (evaluation.FutureWagesDamagesExt != null) {%>
    <Value>
      <ValueCategory>
        <Code>FutureWagesDamagesExt</Code>
        <Description>FutureWagesDamagesExt</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.FutureWagesDamagesExt as java.lang.String,false)%></Amount> 
    </Value> 
    <%}%>
    
    <% if (evaluation.FutureOtherDamagesExt != null) {%>
    <Value>
      <ValueCategory>
        <Code>FutureOtherDamagesExt</Code>
        <Description>FutureOtherDamagesExt</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.FutureOtherDamagesExt as java.lang.String,false)%></Amount> 
    </Value> 
    <%}%>
    
    <% if (evaluation.DisfigurementDamagesLowExt != null) {%>
    <Value>
      <ValueCategory>
        <Code>DisfigurementDamagesLowExt</Code>
        <Description>DisfigurementDamagesLowExt</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.DisfigurementDamagesLowExt as java.lang.String,false)%></Amount> 
    </Value> 
    <%}%>
    
    <% if (evaluation.DisfigurementDamagesHighExt != null) {%>
    <Value>
      <ValueCategory>
        <Code>DisfigurementDamagesHighExt</Code>
        <Description>DisfigurementDamagesHighExt</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.DisfigurementDamagesHighExt as java.lang.String,false)%></Amount> 
    </Value>
    <%}%>
    
    <% if (evaluation.PainSufferingDamagesLowExt != null) {%>
    <Value>
      <ValueCategory>
        <Code>PainSufferingDamagesLowExt</Code>
        <Description>PainSufferingDamagesLowExt</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.PainSufferingDamagesLowExt as java.lang.String,false)%></Amount> 
    </Value> 
    <%}%>
    
    <% if (evaluation.PainSufferingDamagesHighExt != null) {%>
    <Value>
      <ValueCategory>
        <Code>PainSufferingDamagesHighExt</Code>
        <Description>PainSufferingDamagesHighExt</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.PainSufferingDamagesHighExt as java.lang.String,false)%></Amount> 
    </Value> 
    <%}%>
    
    <% if (evaluation.OtherDamagesLowExt != null) {%>
    <Value>
      <ValueCategory>
        <Code>OtherDamagesLowExt</Code>
        <Description>OtherDamagesLowExt</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.OtherDamagesLowExt as java.lang.String,false)%></Amount> 
    </Value> 
    <%}%>
    
    <% if (evaluation.OtherDamagesHighExt != null) {%>
    <Value>
      <ValueCategory>
        <Code>OtherDamagesHighExt</Code>
        <Description>OtherDamagesHighExt</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.OtherDamagesHighExt as java.lang.String,false)%></Amount> 
    </Value> 
    <%}%>
    
    <% if (evaluation.JVVRangeLowExt != null) {%>
    <Value>
      <ValueCategory>
        <Code>JVVRangeLowExt</Code>
        <Description>JVVRangeLowExt</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.JVVRangeLowExt as java.lang.String,false)%></Amount> 
    </Value> 
    <%}%>
    
    <% if (evaluation.JVVRangeHighExt != null) {%>
    <Value>
      <ValueCategory>
        <Code>JVVRangeHighExt</Code>
        <Description>JVVRangeHighExt</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.JVVRangeHighExt as java.lang.String,false)%></Amount> 
    </Value>  
    <%}%>

    <% if (evaluation.ADRPotentialExt != null) {%>
    <Value>
      <ValueCategory>
        <Code>ADRPotentialExt</Code>
        <Description>ADRPotentialExt</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Indicator><%=StringUtils.getXMLValue(evaluation.ADRPotentialExt as java.lang.String,false)%></Indicator> 
    </Value> 
    <%}%>
    
    <% if (evaluation.StructPotentialExt != null) {%>
    <Value>
      <ValueCategory>
        <Code>StructPotentialExt</Code>
        <Description>StructPotentialExt</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Indicator><%=StringUtils.getXMLValue(evaluation.StructPotentialExt as java.lang.String,false)%></Indicator> 
    </Value>  
    <%}%>

    <% if (evaluation.LowInsuredLiabilityExt != null) {%>
    <Value>
      <ValueCategory>
        <Code>LowInsuredLiabilityExt</Code>
        <Description>LowInsuredLiabilityExt</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Percent><%=StringUtils.getXMLValue(evaluation.LowInsuredLiabilityExt as java.lang.String,false)%></Percent> 
    </Value>  
    <%}%>
    
    <% if (evaluation.HighInsuredLiabilityExt != null) {%>
    <Value>
      <ValueCategory>
        <Code>HighInsuredLiabilityExt</Code>
        <Description>HighInsuredLiabilityExt</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Percent><%=StringUtils.getXMLValue(evaluation.HighInsuredLiabilityExt as java.lang.String,false)%></Percent> 
    </Value>  
    <%}%>
    
    <% if (evaluation.LowSettlementRangeExt != null) {%>
    <Value>
      <ValueCategory>
        <Code>LowSettlementRangeExt</Code>
        <Description>LowSettlementRangeExt</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.LowSettlementRangeExt as java.lang.String,false)%></Amount> 
    </Value>  
    <%}%>

    <% if (evaluation.Diagnostic != null) {%>
    <Value>
      <ValueCategory>
        <Code>Diagnostic</Code>
        <Description>Diagnostic</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.Diagnostic.Amount as java.lang.String,false)%></Amount> 
    </Value>  
    <%}%>

    <% if (evaluation.FutureMedical != null) {%>
    <Value>
      <ValueCategory>
        <Code>FutureMedical</Code>
        <Description>FutureMedical</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.FutureMedical.Amount as java.lang.String,false)%></Amount> 
    </Value>  
    <%}%>
    
    <% if (evaluation.HighSettlementRangeExt != null) {%>
    <Value>
      <ValueCategory>
        <Code>HighSettlementRangeExt</Code>
        <Description>HighSettlementRangeExt</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.HighSettlementRangeExt as java.lang.String,false)%></Amount> 
    </Value>  
    <%}%>

    <% if (evaluation.MedicalEquipment != null) {%>
    <Value>
      <ValueCategory>
        <Code>MedicalEquipment</Code>
        <Description>MedicalEquipment</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.MedicalEquipment.Amount as java.lang.String,false)%></Amount> 
    </Value>  
    <%}%>

    <% if (evaluation.HospitalER != null) {%>
    <Value>
      <ValueCategory>
        <Code>HospitalER</Code>
        <Description>HospitalER</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.HospitalER.Amount as java.lang.String,false)%></Amount> 
    </Value>  
    <%}%>
    
    <% if (evaluation.Other != null) {%>
    <Value>
      <ValueCategory>
        <Code>Other</Code>
        <Description>Other</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.Other.Amount as java.lang.String,false)%></Amount> 
    </Value>  
    <%}%>

    <% if (evaluation.TreatingPhysician != null) {%>
    <Value>
      <ValueCategory>
        <Code>TreatingPhysician</Code>
        <Description>TreatingPhysician</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.TreatingPhysician.Amount as java.lang.String,false)%></Amount> 
    </Value>  
    <%}%>

    <% if (evaluation.EmergencyRoomDamagesPastExt != null) {%>
    <Value>
      <ValueCategory>
        <Code>EmergencyRoomDamagesPastExt</Code>
        <Description>EmergencyRoomDamagesPastExt</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.EmergencyRoomDamagesPastExt as java.lang.String,false)%></Amount> 
    </Value>
    <%}%>

    <% if (evaluation.SettlementTargetAmtExt != null) {%>
    <Value>
      <ValueCategory>
        <Code>SettlementTargetAmtExt</Code>
        <Description>SettlementTargetAmtExt</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.SettlementTargetAmtExt as java.lang.String,false)%></Amount> 
    </Value>
    <%}%>

    <% if (evaluation.ApprReserveAmtExt != null) {%>
    <Value>
      <ValueCategory>
        <Code>ApprReserveAmtExt</Code>
        <Description>ApprReserveAmtExt</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.ApprReserveAmtExt as java.lang.String,false)%></Amount> 
    </Value>
    <%}%>

    <% if (evaluation.ChangeAmtGrossExt != null) {%>
    <Value>
      <ValueCategory>
        <Code>ChangeAmtGrossExt</Code>
        <Description>ChangeAmtGrossExt</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.ChangeAmtGrossExt as java.lang.String,false)%></Amount> 
    </Value>
    <%}%>

    <% if (evaluation.ChangeAmtNewExt != null) {%>
    <Value>
      <ValueCategory>
        <Code>ChangeAmtNewExt</Code>
        <Description>ChangeAmtNewExt</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.ChangeAmtNewExt as java.lang.String,false)%></Amount> 
    </Value>
    <%}%>	

    <% if (evaluation.AmbulanceDamagesPastExt != null || evaluation.EmergencyRoomDamagesPastExt != null
    || evaluation.HospitalER != null || evaluation.SurgeryDamagesPastExt != null || evaluation.TreatingPhysician != null
    || evaluation.TherapyDamagesPastExt != null || evaluation.MedicalEquipment != null
    || evaluation.MedicationDamagesPastExt !=null || evaluation.Diagnostic != null
    || evaluation.OtherMedicalDamagesPastExt != null) {%>
    <Value> 
      <ValueCategory>
        <Code>calculateTotalPastMedical</Code>
        <Description>calculateTotalPastMedical</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.calculateTotalPastMedical() as java.lang.String,false)%></Amount> 
    </Value>
    <%}%>

    <% if (evaluation.WageLossDamagesPastExt != null || evaluation.Other != null
    || evaluation.AmbulanceDamagesPastExt != null || evaluation.EmergencyRoomDamagesPastExt != null
    || evaluation.HospitalER != null || evaluation.SurgeryDamagesPastExt != null || evaluation.TreatingPhysician != null
    || evaluation.TherapyDamagesPastExt != null || evaluation.MedicalEquipment != null
    || evaluation.MedicationDamagesPastExt !=null || evaluation.Diagnostic != null
    || evaluation.OtherMedicalDamagesPastExt != null) {%>
    <Value>
      <ValueCategory>
        <Code>calculateSpecialDamage</Code>
        <Description>calculateSpecialDamage</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.calculateSpecialDamage() as java.lang.String,false)%></Amount> 
    </Value>
    <%}%>

    <% if (evaluation.FutureMedical != null || evaluation.FutureWagesDamagesExt != null
    || evaluation.FutureOtherDamagesExt != null) {%>
    <Value>
      <ValueCategory>
        <Code>calculateFutureDamagesTotal</Code>
        <Description>calculateFutureDamagesTotal</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.calculateFutureDamagesTotal() as java.lang.String,false)%></Amount> 
    </Value>
    <%}%>

    <% if (evaluation.WageLossDamagesPastExt != null || evaluation.Other != null
    || evaluation.AmbulanceDamagesPastExt != null || evaluation.EmergencyRoomDamagesPastExt != null
    || evaluation.HospitalER != null || evaluation.SurgeryDamagesPastExt != null || evaluation.TreatingPhysician != null
    || evaluation.TherapyDamagesPastExt != null || evaluation.MedicalEquipment != null
    || evaluation.MedicationDamagesPastExt !=null || evaluation.Diagnostic != null
    || evaluation.OtherMedicalDamagesPastExt != null || evaluation.FutureMedical != null
    || evaluation.FutureWagesDamagesExt != null || evaluation.FutureOtherDamagesExt != null) {%>
    <Value>
      <ValueCategory>
        <Code>getAllDamagesTotal</Code>
        <Description>getAllDamagesTotal</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.getAllDamagesTotal() as java.lang.String,false)%></Amount> 
    </Value>
    <%}%>

    <% if (evaluation.DisfigurementDamagesHighExt != null || evaluation.PainSufferingDamagesHighExt != null
    || evaluation.OtherDamagesHighExt != null || evaluation.WageLossDamagesPastExt != null || evaluation.Other != null
    || evaluation.AmbulanceDamagesPastExt != null || evaluation.EmergencyRoomDamagesPastExt != null
    || evaluation.HospitalER != null || evaluation.SurgeryDamagesPastExt != null || evaluation.TreatingPhysician != null
    || evaluation.TherapyDamagesPastExt != null || evaluation.MedicalEquipment != null
    || evaluation.MedicationDamagesPastExt !=null || evaluation.Diagnostic != null
    || evaluation.OtherMedicalDamagesPastExt != null || evaluation.FutureMedical != null
    || evaluation.FutureWagesDamagesExt != null || evaluation.FutureOtherDamagesExt != null) {%>
    <Value>
      <ValueCategory>
        <Code>getTotalDamagesHigh</Code>
        <Description>getTotalDamageHigh</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.getTotalDamageHigh() as java.lang.String,false)%></Amount> 
    </Value>
    <%}%>

    <% if (evaluation.DisfigurementDamagesLowExt != null || evaluation.PainSufferingDamagesLowExt != null
    || evaluation.OtherDamagesLowExt != null || evaluation.WageLossDamagesPastExt != null || evaluation.Other != null
    || evaluation.AmbulanceDamagesPastExt != null || evaluation.EmergencyRoomDamagesPastExt != null
    || evaluation.HospitalER != null || evaluation.SurgeryDamagesPastExt != null || evaluation.TreatingPhysician != null
    || evaluation.TherapyDamagesPastExt != null || evaluation.MedicalEquipment != null
    || evaluation.MedicationDamagesPastExt !=null || evaluation.Diagnostic != null
    || evaluation.OtherMedicalDamagesPastExt != null || evaluation.FutureMedical != null
    || evaluation.FutureWagesDamagesExt != null || evaluation.FutureOtherDamagesExt != null) {%>
    <Value>
      <ValueCategory>
        <Code>getTotalDamagesLow</Code>
        <Description>getTotalDamageLow</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.getTotalDamageLow() as java.lang.String,false)%></Amount> 
    </Value>
    <%}%>

    <% if (evaluation.DisfigurementDamagesHighExt != null || evaluation.PainSufferingDamagesHighExt != null
    || evaluation.OtherDamagesHighExt != null) {%>
    <Value>
      <ValueCategory>
        <Code>getTotalGeneralDamagesHigh</Code>
        <Description>getTotalGeneralDamagesHigh</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.getTotalGeneralDamagesHigh() as java.lang.String,false)%></Amount> 
    </Value>
    <%}%>

    <% if (evaluation.DisfigurementDamagesLowExt != null || evaluation.PainSufferingDamagesLowExt != null
    || evaluation.OtherDamagesLowExt != null) {%>
    <Value>
      <ValueCategory>
        <Code>getTotalGeneralDamagesLow</Code>
        <Description>getTotalGeneralDamagesLow</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.getTotalGeneralDamagesLow() as java.lang.String,false)%></Amount> 
    </Value>
    <%}%>

    <% if (evaluation.RecReserveExt != null || evaluation.CurrentLossReserveExt != null
    || evaluation.CurrentExpenseReserveExt != null) {%>
    <Value>
      <ValueCategory>
        <Code>calculateReserveChange</Code>
        <Description>calculateReserveChange</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.calculateReserveChange() as java.lang.String,false)%></Amount> 
    </Value>
    <%}%>

    <% if (evaluation.CurrentLossReserveExt != null) {%>
    <Value>
      <ValueCategory>
        <Code>CurrentLossReserveExt</Code>
        <Description>CurrentLossReserveExt</Description>
        <ListName>Evaluation Value Category</ListName>
      </ValueCategory>
      <Amount><%=StringUtils.getXMLValue(evaluation.CurrentLossReserveExt as java.lang.String,false)%></Amount> 
    </Value>
    <%}%>

    <%if ( evaluation.LossLocationExt != null) {%>
    <%=LossLocationTemplate.renderToString(evaluation.LossLocationExt, objStatus, evaluation.Claim)%>
    <%}%>
  </Evaluation>
</Transaction>