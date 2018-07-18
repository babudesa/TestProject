<% uses util.StringUtils %>
<% uses templates.messaging.edw.TypeListTemplate %>
<% uses templates.messaging.edw.PersonMedicareTemplate %>
<%@ params(person : Person, objStatus : String) %>
<Person>
  <PublicID><%=person.AddressBookUID%></PublicID>
  <ObjectStatus><%=objStatus%></ObjectStatus>
  <% if (person.LastName != null) {%>
  <LastName><%=StringUtils.getXMLValue(person.LastName, false)%></LastName>
  <%}%>
  <% if (person.FirstName != null) {%>
  <FirstName><%=StringUtils.getXMLValue(person.FirstName, false)%></FirstName>
  <%}%>
  <% if (person.MiddleName != null) {%>
  <MiddleName><%=StringUtils.getXMLValue(person.MiddleName, false)%></MiddleName>
  <%}%>
  <% if (person.Prefix != null) {%>
  <%=TypeListTemplate.renderToString(person.Prefix, "Prefix", person.Prefix.ListName)%>
  <%}%>
  <% if (person.Suffix != null) {%>
  <%=TypeListTemplate.renderToString(person.Suffix, "Suffix", person.Suffix.ListName)%>
  <%}%>
  <% if (person.DateOfBirth != null) {%>	        
  <DateOfBirth><%=person.DateOfBirth%></DateOfBirth>
  <%}%>
  <% if (person.Gender != null) {%>
  <%=TypeListTemplate.renderToString(person.Gender, "Gender", person.Gender.ListName)%>
  <%}%>
  <% if (person.MaritalStatus != null) {%>
  <%=TypeListTemplate.renderToString(person.MaritalStatus, "MaritalStatus", person.MaritalStatus.ListName)%>
  <%}%>
  <% if (person.FormerName != null) {%>
  <FormerName><%=StringUtils.getXMLValue(person.FormerName, false)%></FormerName>
  <%}%>
  <% if (person.Occupation != null) {%>
  <Occupation><%=StringUtils.getXMLValue(person.Occupation, false)%></Occupation>
  <%}%>
  <% if (person.LicenseNumber != null) {%>
  <DriverLicNumber><%=StringUtils.getXMLValue(person.LicenseNumber, false)%></DriverLicNumber>
  <%}%>
  <% if (person.LicenseState != null) {%>
  <%=TypeListTemplate.renderToString(person.LicenseState, "DriverLicState", person.LicenseState.ListName)%>
  <%}%>
  <% if (person.MedicareEligibleExt != null) {%>	        
  <MedicareEligibleExt><%=person.MedicareEligibleExt%></MedicareEligibleExt>
  <%}%>
  <% if (person.LegalLNameExt != null) {%>
  <LegalLNameExt><%=StringUtils.getXMLValue(person.LegalLNameExt, false)%></LegalLNameExt>
  <%}%>
  <% if (person.LegalFNameExt != null) {%>
  <LegalFNameExt><%=StringUtils.getXMLValue(person.LegalFNameExt, false)%></LegalFNameExt>
  <%}%>
  <% if (person.LegalMNameExt != null) {%>
  <LegalMNameExt><%=StringUtils.getXMLValue(person.LegalMNameExt, false)%></LegalMNameExt>
  <%}%>
  <% if (!(person typeis UserContact)) {%>
    <%=PersonMedicareTemplate.renderToString(person, null)%>
  <%}%>
</Person>