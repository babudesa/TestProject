<%@ params(value : int, assignment : MatterAssignmentExt, TagXML : String) %>
  <Law_Attorney_Rating>
    <LeadAttorneyID><%=assignment.LeadCounselExt.PublicID%></LeadAttorneyID>
    <MatterID><%=assignment.PublicID%></MatterID>
    <FactorName><%=TagXML%></FactorName>
  <% if(value != null) { %>
    <FactorRating><%=value%></FactorRating>  
<%}%>
  </Law_Attorney_Rating>