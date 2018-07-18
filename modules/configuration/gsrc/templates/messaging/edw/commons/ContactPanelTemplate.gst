<%@ params(thecontact : Contact) %>
<% if (thecontact typeis Attorney && thecontact != null && thecontact.PanelIndicatorExt != null) {%>
<Panel><%=thecontact.PanelIndicatorExt.Code%></Panel>
<%} else if (thecontact typeis LawFirm && thecontact != null && thecontact.PanelIndicatorExt != null) {%>
<Panel><%=thecontact.PanelIndicatorExt.Code%></Panel>
<%} else if (thecontact typeis Ex_ForeignCoVenLawFrm && thecontact != null && thecontact.PanelIndicatorExt != null) {%>
<Panel><%=thecontact.PanelIndicatorExt.Code%></Panel>
<%} else if (thecontact typeis  Ex_ForeignPerVndrAttny && thecontact != null && thecontact.PanelIndicatorExt != null) {%>
<Panel><%=thecontact.PanelIndicatorExt.Code%></Panel>
<%}%> 