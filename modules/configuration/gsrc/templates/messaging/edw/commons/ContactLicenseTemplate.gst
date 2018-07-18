<%@ params(thecontact : Contact) %>
<% if (thecontact typeis Attorney && thecontact != null && thecontact.AttorneyLicense != null) {%>
<AttorneyLicense><%=thecontact.AttorneyLicense%></AttorneyLicense> 
<%} else if (thecontact typeis Doctor && thecontact != null && thecontact.MedicalLicense != null) {%>
<MedicalLicense><%=thecontact.MedicalLicense%></MedicalLicense> 
<%} else if (thecontact typeis Ex_ForeignPerVndrAttny && thecontact != null && thecontact.AttorneyLicense != null) {%>
<AttorneyLicense><%=thecontact.AttorneyLicense%></AttorneyLicense> 
<%} else if ( thecontact typeis Ex_ForeignPerVndrDoc && thecontact != null && thecontact.MedicalLicense != null) {%>
<MedicalLicense><%=thecontact.MedicalLicense%></MedicalLicense> 
<%}%>
