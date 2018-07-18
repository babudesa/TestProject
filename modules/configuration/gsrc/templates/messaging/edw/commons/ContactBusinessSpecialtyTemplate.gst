<% uses templates.messaging.edw.TypeListTemplate %>
<%@ params(thecontact : Contact) %>
<% if (thecontact typeis MedicalCareOrg && thecontact != null && thecontact.MedicalOrgSpecialty != null) {%>
<%=TypeListTemplate.renderToString(thecontact.MedicalOrgSpecialty, "BusinessSpecialty", thecontact.MedicalOrgSpecialty.ListName)%>
<%} else if (thecontact typeis Doctor && thecontact != null && thecontact.DoctorSpecialty != null) {%>
<%=TypeListTemplate.renderToString(thecontact.DoctorSpecialty, "BusinessSpecialty", thecontact.DoctorSpecialty.ListName)%>
<%} else if (thecontact typeis Attorney && thecontact != null && thecontact.AttorneySpecialty != null) {%>
<%=TypeListTemplate.renderToString(thecontact.AttorneySpecialty, "BusinessSpecialty", thecontact.AttorneySpecialty.ListName)%>
<%} else if (thecontact typeis LawFirm && thecontact != null && thecontact.LawFirmSpecialty != null) {%>
<%=TypeListTemplate.renderToString(thecontact.LawFirmSpecialty, "BusinessSpecialty", thecontact.LawFirmSpecialty.ListName)%>
<%}%> 
