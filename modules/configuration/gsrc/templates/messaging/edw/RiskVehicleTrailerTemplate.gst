<%@ params(thetrailer : TrailerExt) %>
<% if (thetrailer != null) { %>
<TrailerExt>
  <% if (thetrailer.CreateTime != null) {%>
  <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(thetrailer.CreateTime)%></CreateTime>
  <%}%>
  <% if (thetrailer.UpdateTime != null) {%>
  <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(thetrailer.UpdateTime)%></UpdateTime>
  <%}%>
  <% if (thetrailer.InsuranceLimit != null) {%>
  <InsuranceLimit><%=thetrailer.InsuranceLimit%></InsuranceLimit> 
  <%}%>
  <% if (thetrailer.Manufacturer != null) {%>
  <Manufacturer><%=thetrailer.Manufacturer%></Manufacturer>
  <%}%>
  <% if (thetrailer.Model != null) {%>
  <Model><%=thetrailer.Model%></Model> 
  <%}%>
  <% if (thetrailer.PhysicalDamageIndicator != null) {%>
  <PhysicalDamageIndicator><%=thetrailer.PhysicalDamageIndicator%></PhysicalDamageIndicator> 
  <%}%>
  <% if (thetrailer.PhysicalDamageLimit != null) {%>
  <PhysicalDamageLimit><%=thetrailer.PhysicalDamageLimit%></PhysicalDamageLimit> 
  <%}%>
  <% if (thetrailer.SerialNo != null) {%>
  <SerialNo><%=thetrailer.SerialNo%></SerialNo> 
  <%}%>
  <% if (thetrailer.Year != null) {%>
  <Year><%=thetrailer.Year%></Year> 
  <%}%>
  <% if (thetrailer.Length != null) {%>
  <Length><%=thetrailer.Length%></Length> 
  <%}%>
</TrailerExt>
<%}%>
