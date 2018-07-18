<% uses templates.messaging.edw.TypeListTemplate %>
<%@ params(theexposure : Exposure) %>
<%-- bestor 20101014: defect 2557 - Total Loss Reporting --%>
<%-- kotteson 20110112: defect 2557 - and test for vehicletypeext --%>
<% if (theexposure.TotalLossIndExt && theexposure.VehicleIncident != null
  && theexposure.VehicleIncident.Vehicle != null
  && (theexposure.VehicleIncident.Vehicle.VehicleTypeExt != null
    || theexposure.VehicleIncident.OdomRead != null
    || theexposure.VehicleIncident.IsOwnerRetainingExt != null
    || theexposure.VehicleIncident.ReasonForTotalLossExt != null
    || theexposure.VehicleIncident.Vehicle.Vin != null
    || theexposure.VehicleIncident.Vehicle.Make != null
    || theexposure.VehicleIncident.Vehicle.Model != null
    || theexposure.VehicleIncident.Vehicle.Year != null
    || theexposure.VehicleIncident.Vehicle.VehicleStyleExt != null )) {%>
<TotalLossReporting>
  <% if (theexposure != null && theexposure.VehicleIncident != null) { %>
  <% if (theexposure.VehicleIncident.OdomRead != null) {%>
  <Odometer><%=theexposure.VehicleIncident.OdomRead%></Odometer> 
  <%}%>
  <% if (theexposure.VehicleIncident.Vehicle != null) { var theincidentvehicle = theexposure.VehicleIncident.Vehicle; %>
  <% if (theincidentvehicle.Vin != null) {%>
  <Vin><%=theincidentvehicle.Vin%></Vin> 
  <%}%>
  <% if (theincidentvehicle.Make != null) {%>
  <Make><%=theincidentvehicle.Make%></Make> 
  <%}%>
  <% if (theincidentvehicle.Model != null) {%>
  <Model><%=theincidentvehicle.Model%></Model> 
  <%}%>
  <% if (theincidentvehicle.Year != null) {%>
  <Year><%=theincidentvehicle.Year%></Year> 
  <%}%>
  <% if (theincidentvehicle.VehicleTypeExt != null) {%>
  <%=TypeListTemplate.renderToString(theincidentvehicle.VehicleTypeExt, "VehicleType", theincidentvehicle.VehicleTypeExt.ListName)%>
  <%}%>
  <% if (theincidentvehicle.VehicleStyleExt != null) {%>
  <%=TypeListTemplate.renderToString(theincidentvehicle.VehicleStyleExt, "VehicleStyle", theincidentvehicle.VehicleStyleExt.ListName)%>
  <%}%>
  <% if (theexposure.VehicleIncident.ReasonForTotalLossExt != null) {%>
  <ReasonForTotalLossExt><%=theexposure.VehicleIncident.ReasonForTotalLossExt%></ReasonForTotalLossExt> 
  <%}%>
  <% if (theexposure.VehicleIncident.IsOwnerRetainingExt != null) {%>
  <IsOwnerRetainingExt><%=theexposure.VehicleIncident.IsOwnerRetainingExt%></IsOwnerRetainingExt> 
  <%}%>
  <%}%>
  <%}%>
</TotalLossReporting>
<%}%>
