<%@ params(value : int, assignment : MatterAssignmentExt, TagXML : String) %>
  <Law_Attorney_Rating>
    <LeadAttorneyID><%=assignment.LeadCounselExt.PublicID%></LeadAttorneyID>
    <MatterID><%=assignment.PublicID%></MatterID>
    <FactorName><%=TagXML%></FactorName>
  <%if(value==3) { %>
    <FactorRating>Positive</FactorRating>
  <%} else if(value == 2) {%>
    <FactorRating>Neutral</FactorRating>
  <%} else if(value == 1) {%>
    <FactorRating>Negative</FactorRating>
  <%}%>
  </Law_Attorney_Rating>