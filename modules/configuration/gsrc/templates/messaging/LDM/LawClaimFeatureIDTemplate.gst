<%@ params(assignment : MatterAssignmentExt, actionDescription : String) %>
<% var featID  = null %>
<ClaimFeatureID>
  <ActionDesc><%=actionDescription%></ActionDesc>
  <ClaimID><%=assignment.Matter.Claim.PublicID%></ClaimID>
  <% for(assExp in assignment.AssignmentExposuresExt){
        if(assExp.PrimaryClaimantExt){
          featID=assExp.Exposure.PublicID
        }
  } %>
  <FeatID><%=featID%></FeatID>
</ClaimFeatureID>