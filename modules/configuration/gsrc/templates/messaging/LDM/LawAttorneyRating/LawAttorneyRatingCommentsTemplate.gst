<%@ params(comments : String, assignment : MatterAssignmentExt) %>
<% uses org.apache.commons.lang.StringEscapeUtils %>
  <Law_Attorney_Rating>
    <LeadAttorneyID><%=assignment.LeadCounselExt.PublicID%></LeadAttorneyID>
    <MatterID><%=assignment.PublicID%></MatterID>
    <FactorName>AttorneyRating-Comments</FactorName>
  <% if(comments == null) { %>
    <RatingComments/>
  <%} else { %>
    <RatingComments><%=StringEscapeUtils.escapeXml(comments)%></RatingComments>
  <%}%>
  </Law_Attorney_Rating>