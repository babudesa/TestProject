<% uses templates.messaging.edw.TypeListTemplate %>
<%@ params(theengine : EngineExt) %>
<% if (theengine != null) { %>
<Engine>
  <% if (theengine.CreateTime != null) {%>
  <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(theengine.CreateTime)%></CreateTime>
  <%}%>
  <% if (theengine.UpdateTime != null) {%>
  <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(theengine.UpdateTime)%></UpdateTime>
  <%}%>
  <% if (theengine.InsuranceLimit != null) {%>
  <InsuranceLimit><%=theengine.InsuranceLimit%></InsuranceLimit> 
  <%}%>
  <% if (theengine.Manufacturer != null) {%>
  <Manufacturer><%=theengine.Manufacturer%></Manufacturer>
  <%}%>
  <% if (theengine.Model != null) {%>
  <Model><%=theengine.Model%></Model> 
  <%}%>
  <% if (theengine.PhysicalDamageIndicator != null) {%>
  <PhysicalDamageIndicator><%=theengine.PhysicalDamageIndicator%></PhysicalDamageIndicator> 
  <%}%>
  <% if (theengine.PhysicalDamageLimit != null) {%>
  <PhysicalDamageLimit><%=theengine.PhysicalDamageLimit%></PhysicalDamageLimit> 
  <%}%>
  <% if (theengine.SerialNo != null) {%>
  <SerialNo><%=theengine.SerialNo%></SerialNo> 
  <%}%>
  <% if (theengine.Year != null) {%>
  <Year><%=theengine.Year%></Year> 
  <%}%>
  <% if (theengine.EngineNumber != null) {%>
  <EngineNumber><%=theengine.EngineNumber%></EngineNumber> 
  <%}%>
  <% if (theengine.EnginePowerCatTypeExt != null) {%>
  <%=TypeListTemplate.renderToString(theengine.EnginePowerCatTypeExt, "EnginePowerCatTypeExt", theengine.EnginePowerCatTypeExt.ListName)%>
  <%}%>
  <% if (theengine.Horsepower != null) {%>
  <HorsePower><%=theengine.Horsepower%></HorsePower> 
  <%}%>
</Engine>
<%}%>
