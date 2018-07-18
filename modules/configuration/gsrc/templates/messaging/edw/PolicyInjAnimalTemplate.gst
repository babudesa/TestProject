<%@ params(theclaim : Claim, thepolicy : Policy, objStatus : String) %>
<% if (thepolicy.Properties != null && thepolicy.Properties.length != 0) { %>
<Risks>
  <% for ( var therisk in thepolicy.Properties ) {%>
  <Risk>
    <PublicID><%=therisk.PublicID%></PublicID>
    <ObjectStatus><%=objStatus%></ObjectStatus>
    <VerifiedRisk>
    <RiskEBIInstExt><%=therisk.Property.PhysicalPropertyEBIInstExt%></RiskEBIInstExt>
    <RiskEBIExt><%=therisk.Property.PhysicalPropertyEBIExt%></RiskEBIExt>
    </VerifiedRisk>
    <% var injAnimal = false; %>
    <% var injAnimalInd = "C"; %> 
    <% if ((theclaim.FixedPropertyIncidentsOnly != null) && (theclaim.FixedPropertyIncidentsOnly.length != 0)) { 
      var newInjAnimal = false;
      for (inc in thepolicy.Claim.FixedPropertyIncidentsOnly ) {
        if (therisk.Property.PublicID == inc.Property.PublicID) {
          injAnimal = true;
          if (inc.New) {
            newInjAnimal = true;
          }
        }
      }
      if (injAnimal == true) {  
        if (objStatus == "D") {
          injAnimalInd = "D"; 
        } else if (newInjAnimal == true) {
          injAnimalInd = "A";
        }
      }
    }
    if (injAnimal == false) { 
       var origClaim = theclaim.OriginalVersion as Claim;
       if (origClaim.FixedPropertyIncidentsOnly != null and origClaim.FixedPropertyIncidentsOnly.length != 0) {  
         var fnd = "false"; 
         for (originc in origClaim.FixedPropertyIncidentsOnly)  { 
            if (therisk.Property.PublicID == originc.Property.PublicID) { 
               injAnimal = true; 
               injAnimalInd = "D"; 
            } 
         } 
      } 
    }
    if (injAnimal == true) { %>
    <InjuredAnimalIndicator><%=injAnimalInd%></InjuredAnimalIndicator>
    <%}%>
  </Risk>
  <%}%>
</Risks>
<%}%>