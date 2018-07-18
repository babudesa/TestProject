<% uses templates.messaging.LDM.commons.MatterDate %>
<% uses templates.messaging.LDM.commons.MatterString %>
<% uses templates.messaging.LDM.commons.MatterBit %>

<%@ params(assignment : MatterAssignmentExt, actionDescription : String) %>

<LawMatter>

  <ActionDesc><%=actionDescription%></ActionDesc>
  <MatterID><%=assignment.PublicID%></MatterID>
  <LegalActionID><%=assignment.Matter.PublicID%></LegalActionID>   
  
  <%if(assignment.LSSMatterID != null){%>
    <%=MatterString.renderToString(assignment.LSSMatterID.toString(), "MatterNumber")%>
  <% } else { %>
    <%=MatterString.renderToString(assignment.AssignmentIDNumber, "MatterNumber")%>
  <% } %>
  <%if(assignment.LeadCounselExt != null){%>
    <%=MatterString.renderToString(assignment.LeadCounselExt.PublicID, "LeadAttorneyID")%>
  <% } %>
  <%=MatterString.renderToString(assignment.CounselLawFirmExt.PublicID, "LawFirmID")%>
  <%=MatterString.renderToString(assignment.AttorneyTypeExt.toString(), "AttorneyType")%>
  <%=MatterString.renderToString(assignment.StatusExt.toString(), "MatterStatus")%>
  <%=MatterString.renderToString(assignment.BillSharePrctExt, "BillSharePrctExt")%>
  <%=MatterString.renderToString(assignment.MatterAssignmentStatusExt.toString(), "AssignmentStatus")%>
  <%=MatterDate.renderToString(assignment.ClosedDate, "CloseDate")%>
  <%=MatterDate.renderToString(assignment.PreTrialReportReceivedDate, "PreTrialReportReceivedDate")%>
  <%=MatterDate.renderToString(assignment.InitlCaseAssessmentRcvdDate, "InitlCaseAssessmentRcvdDate")%>
  <%=MatterDate.renderToString(assignment.DefenseApptDate, "DefenseApptDate")%>
  <%=MatterDate.renderToString(assignment.PreTrialReportDueDate, "PreTrialReportDueDate")%>
  <%=MatterDate.renderToString(assignment.InitlCaseAssessmentDueDate, "InitlCaseAssessmentDueDate")%>
  <%=MatterDate.renderToString(assignment.DefenseAcceptedDate, "DefenseAcceptedDate")%>
  
  <%if(util.custom_Ext.OfficeBranchFunctions.getClaimOfficeBranch(assignment.Matter.Claim) != null){%>
      <ClaimBusinessUnit><![CDATA[<%=util.custom_Ext.OfficeBranchFunctions.getClaimOfficeBranch(assignment.Matter.Claim)%>]]></ClaimBusinessUnit>
   <% } %>
   <%if(util.custom_Ext.OfficeBranchFunctions.getClaimBusinessUnitPublicId(assignment.Matter.Claim) != null){%>
     <GroupPublicId><![CDATA[<%=util.custom_Ext.OfficeBranchFunctions.getClaimBusinessUnitPublicId(assignment.Matter.Claim)%>]]></GroupPublicId>
   <% } %>
  <% if(assignment.WorkOnContingency != null){ %>
    <%=MatterBit.renderToString(assignment.WorkOnContingency, "WorkOnContingency")%>
    <% if(assignment.ContingencyPct != null){ %>
      <ContingencyPct><%=assignment.ContingencyPct%></ContingencyPct>
    <%}%> 
  <%}%> 
  <%=MatterBit.renderToString(assignment.StaffBudgetRequiredExt, "StaffBudgetRequired")%>
  <%if(assignment.CounselContactAddressExt != null){%>  
    <%=MatterString.renderToString(assignment.CounselContactAddressExt.PublicID, "LawFirmAddressID")%>
    <% if(assignment.CounselContactAddressExt.AddressType != null){%>
        <%=MatterString.renderToString(assignment.CounselContactAddressExt.AddressType.toString(), "AddressType")%>
    <%}%>     
  <%}%> 
  <%=MatterDate.renderToString(assignment.Matter.ClaimantRepDateExt, "ClaimantRepresentationDate")%>
</LawMatter>

  <%if(assignment.CounselContactAddressExt != null){%>
    <LawFirmContactAddress>
      <ActionDesc><%=actionDescription%></ActionDesc>
    <%=MatterString.renderToString(assignment.CounselContactAddressExt.Description, "Name")%>
    <%=MatterString.renderToString(assignment.CounselLawFirmExt.PublicID, "LawFirmID")%>
    <%=MatterString.renderToString(assignment.CounselContactAddressExt.PublicID, "LawFirmAddressID")%>
    <%=MatterString.renderToString(assignment.CounselContactAddressExt.AddressLine1, "Address1")%>
    <%=MatterString.renderToString(assignment.CounselContactAddressExt.AddressLine2, "Address2")%>
    <%=MatterString.renderToString(assignment.CounselContactAddressExt.AddressLine3, "Address3")%>
    <%=MatterString.renderToString(assignment.CounselContactAddressExt.City, "City")%>
    <%=MatterString.renderToString(assignment.CounselContactAddressExt.PostalCode, "Zip")%>
    <% if(assignment.CounselContactAddressExt.State != null){%>
        <%=MatterString.renderToString(assignment.CounselContactAddressExt.State.Code, "State")%>
    <%}%>
    <% if(assignment.CounselContactAddressExt.AddressType != null){%>
        <%=MatterString.renderToString(assignment.CounselContactAddressExt.AddressType.toString(), "AddressType")%>
    <%}%>    
    <% if(assignment.CounselContactAddressExt.Country != null){%>
        <%=MatterString.renderToString(assignment.CounselContactAddressExt.Country.Code, "Country")%>
    <%}%>    
    </LawFirmContactAddress>
  <%}%>