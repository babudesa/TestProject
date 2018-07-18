<%@ params(actionDescription : String, assignment : MatterAssignmentExt) %>
<% uses org.apache.commons.lang.StringEscapeUtils %>
  <Law_Attorney_Rating>
    <LeadAttorneyID><%=assignment.LeadCounselExt.PublicID%></LeadAttorneyID>
    <MatterID><%=assignment.PublicID%></MatterID>
    <FactorName>AttorneyRating-ActionDescription</FactorName>
    <FactorRating><%=actionDescription%></FactorRating>
  </Law_Attorney_Rating>