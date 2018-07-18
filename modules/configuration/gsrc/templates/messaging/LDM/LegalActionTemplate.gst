<% uses templates.messaging.LDM.commons.MatterDate %>
<% uses templates.messaging.LDM.commons.MatterString %>
<% uses templates.messaging.LDM.commons.MatterBit %>
<% uses org.apache.commons.lang.StringEscapeUtils %>

<%@ params(matter : Matter, actionDescription : String) %>
<% var originalMatter = matter.OriginalVersion as Matter%>  

<LegalAction>  
    <LegalActionID>${matter.PublicID}</LegalActionID> 
    <LegalActionNumber>${matter.LegalActionIDNumber}</LegalActionNumber> 
    <ActionDesc>${actionDescription}</ActionDesc>
    <%=MatterString.renderToString(matter.MatterType.toString(), "LegalActionType")%> 
    <%=MatterString.renderToString(matter.StatusExt.toString(), "StatusExt")%>
    <%=MatterString.renderToString(StringEscapeUtils.escapeXml(matter.CaseTypeExt.toString()), "CaseType")%>
    <%=MatterString.renderToString(StringEscapeUtils.escapeXml(matter.Name), "Name")%>
    <%=MatterString.renderToString(matter.CountryExt.toString(), "Country")%>  
    <%if(matter.StateExt != null){%>
        <%=MatterString.renderToString(matter.StateExt.toString(), "State")%>    
    <% } %>  
        <%=MatterString.renderToString(matter.CourtCounty, "County")%>
    <%if(matter.CourtType != null){%>
        <%=MatterString.renderToString(matter.CourtType.toString(), "JurisdictionType")%>
    <% } %>    
    <%if(matter.FederalDistrictExt != null){%>
      <%=MatterString.renderToString(StringEscapeUtils.escapeXml(matter.FederalDistrictExt.toString()), "FederalDistrict")%>
    <% } %>  
    <%=MatterString.renderToString(StringEscapeUtils.escapeXml(matter.CourtExt), "CourtExt")%>
    <% if(matter.JudgeFirstNameExt != null && matter.JudgeLastNameExt != null){ %>
      <JudgeID><%=StringEscapeUtils.escapeXml(matter.JudgeFirstNameExt)%>.<%=StringEscapeUtils.escapeXml(matter.JudgeLastNameExt)%></JudgeID>
    <%} else if(matter.JudgeLastNameExt != null){%>
      <JudgeID>0.<%=StringEscapeUtils.escapeXml(matter.JudgeLastNameExt)%></JudgeID>
    <%} else if(matter.JudgeFirstNameExt != null){%>
      <JudgeID><%=StringEscapeUtils.escapeXml(matter.JudgeFirstNameExt)%>.0</JudgeID>
    <%}%>
    <%if(matter.CaseCaption != null and matter.CaseCaption.length() >= 256){%>
        <%=MatterString.renderToString(StringEscapeUtils.escapeXml(matter.CaseCaption.substring(0,256)), "CaseCaption")%>
   
     <% } else if(matter.CaseCaption != null){%>
        <%=MatterString.renderToString(StringEscapeUtils.escapeXml(matter.CaseCaption), "CaseCaption")%>
     <% } %>    
    <%=MatterBit.renderToString(matter.CoverageOrExtraContractSuitExt, "ExtraContractualAllegation")%>
    <%=MatterBit.renderToString(matter.ClassActionExt, "ClassAction")%>
    <%=MatterBit.renderToString(matter.DerivativeExt, "Derivative")%>
    <%=MatterDate.renderToString(matter.CreateTime , "OpenDate")%>
    <%=MatterDate.renderToString(matter.CloseDate , "CloseDate")%>
    <%=MatterDate.renderToString(matter.SuitFiledDate , "SuitFiledDate")%>
    <%=MatterDate.renderToString(matter.ServiceDate , "ServiceDate")%>
    <%=MatterDate.renderToString(matter.AnswerDueDate , "AnswerDueDate")%>
    <%=MatterDate.renderToString(matter.AnswerFiledDate , "AnswerFiledDate")%>
    <%=MatterDate.renderToString(matter.ArbitrationDate , "ArbitrationDate")%>
    <%=MatterDate.renderToString(matter.DiscoveryCloseDate , "DiscoveryCloseDate")%>
    <%=MatterDate.renderToString(matter.TrialDate , "TrialDate")%>
    <%=MatterDate.renderToString(matter.ExpertCloseDate , "ExpertCloseDate")%>
    <%=MatterDate.renderToString(matter.MotionCloseDate , "MotionCloseDate")%>
    <%=MatterString.renderToString(matter.GAICompanyRoleExt, "GAICompanyRole")%>  
    <%=MatterBit.renderToString(matter.ExtraContractualAllegationExt, "ExtraContractualAllegationExt")%>
    <%=MatterBit.renderToString(matter.OnlyECAllegationExt, "OnlyECAllegationExt")%>
    <%=MatterBit.renderToString(matter.ReportedToCorpLegalExt, "ReportedToCorpLegalExt")%>
    <%=MatterString.renderToString(StringEscapeUtils.escapeXml(matter.KeyCoverageIssues), "KeyCoverageIssues")%>
    <%=MatterString.renderToString(StringEscapeUtils.escapeXml(matter.IssuesSummary), "IssuesSummary")%>
    <%=MatterBit.renderToString(matter.DidMediationOccurExt, "DidMediationOccur")%>
    <% if(matter.CorporateLegalRepresentative != null) { %>
      <%=MatterString.renderToString(StringEscapeUtils.escapeXml(matter.CorporateLegalRepresentative.replaceAll(" ", ".")), "CorporateLegalRepID")%>
    <% } %>
    <%=MatterDate.renderToString(matter.HearingDate, "HearingDate")%>
    <%=MatterDate.renderToString(matter.AppealFilingDateExt, "AppealFilingDate")%>
    <%=MatterDate.renderToString(matter.AppealRespDueDateExt, "AppealResponseDate")%>
    <%=MatterDate.renderToString(matter.FinalHearingDateExt, "FinalHearingDate")%>
    <%if(util.custom_Ext.OfficeBranchFunctions.getClaimOfficeBranch(matter.Claim) != null){%>
      <ClaimBusinessUnit><![CDATA[<%=util.custom_Ext.OfficeBranchFunctions.getClaimOfficeBranch(matter.Claim)%>]]></ClaimBusinessUnit>
    <% } %>
    
    <%if(util.custom_Ext.OfficeBranchFunctions.getClaimBusinessUnitPublicId(matter.Claim) != null){%>
      <GroupPublicId><![CDATA[<%=util.custom_Ext.OfficeBranchFunctions.getClaimBusinessUnitPublicId(matter.Claim)%>]]></GroupPublicId>
    <% } %>

</LegalAction>   


