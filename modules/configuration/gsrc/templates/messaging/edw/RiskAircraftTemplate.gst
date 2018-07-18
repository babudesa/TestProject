<% uses templates.messaging.edw.TypeListTemplate %>
<% uses util.StringUtils %>
<% uses templates.messaging.edw.commons.YesNoTypeListTemplate %>
<% uses templates.messaging.edw.commons.StringParseTemplate %>
<%@ params(theclaim : Claim, objStatus : String ) %>
<%var origClaim = theclaim.OriginalVersion as Claim %>
<% if (theclaim.AircraftEngineTypeExt != Null or (origClaim.AircraftEngineTypeExt != Null and theclaim.AircraftEngineTypeExt == Null)
   or  theclaim.AircraftMakeExt != null or (origClaim.AircraftMakeExt != null and theclaim.AircraftMakeExt == null)
   or  theclaim.AircraftModelExt != null or (origClaim.AircraftModelExt != null and theclaim.AircraftModelExt == null)
   or  theclaim.AircraftMakeExt != null or (origClaim.AircraftMakeExt != null and theclaim.AircraftMakeExt == null)
   or  theclaim.AircraftOwnerCategoryExt != null or (origClaim.AircraftOwnerCategoryExt != null and theclaim.AircraftOwnerCategoryExt == null)
   or  theclaim.AircraftSizeExt != null or (origClaim.AircraftSizeExt != null and theclaim.AircraftSizeExt == null)
   or  theclaim.AircraftTypeExt != null or (origClaim.AircraftTypeExt != null and theclaim.AircraftTypeExt == null)
   or  theclaim.AircraftUseExt != null or (origClaim.AircraftUseExt != null and theclaim.AircraftUseExt == null)
   or  theclaim.AircraftYearExt != null or (origClaim.AircraftYearExt != null and theclaim.AircraftYearExt == null)
   or  theclaim.TailNumberExt != null or (origClaim.TailNumberExt != null and theclaim.TailNumberExt == null)
   or  theclaim.StandardAirworthinessExt != null or (origClaim.StandardAirworthinessExt != null and theclaim.StandardAirworthinessExt == null) ) {%>      
      <Risk>
         <%var obStatus = objStatus%>
         <% if (theclaim.AircraftEngineTypeExt == Null 
           and  theclaim.AircraftMakeExt == null 
           and  theclaim.AircraftModelExt == null 
           and  theclaim.AircraftMakeExt == null 
           and  theclaim.AircraftOwnerCategoryExt == null
           and  theclaim.AircraftSizeExt == null 
           and  theclaim.AircraftTypeExt == null 
           and  theclaim.AircraftUseExt == null 
           and  theclaim.AircraftYearExt == null 
           and  theclaim.TailNumberExt == null 
           and  theclaim.StandardAirworthinessExt == null  ) {%>   
                    <% obStatus = "D"%>
         <%} else if (origClaim.AircraftEngineTypeExt == Null 
                 and  origClaim.AircraftMakeExt == null 
                 and  origClaim.AircraftModelExt == null 
                 and  origClaim.AircraftMakeExt == null 
                 and  origClaim.AircraftOwnerCategoryExt == null
                 and  origClaim.AircraftSizeExt == null 
                 and  origClaim.AircraftTypeExt == null 
                 and  origClaim.AircraftUseExt == null 
                 and  origClaim.AircraftYearExt == null 
                 and  origClaim.TailNumberExt == null 
                 and  origClaim.StandardAirworthinessExt == null  ) {%>   
                    <% obStatus = "A"%>
         <% }%> 
         <PublicID><%=theclaim.PublicID%>:<%=theclaim.ClaimNumber%>:AVIATNOPS</PublicID>
      	 <ObjectStatus><%=obStatus%></ObjectStatus>
         <UnVerifiedRisk>
            <Aircraft>
      	      <% if (theclaim.CreateTime != null) {%>
      	      <CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(theclaim.CreateTime)%></CreateTime>
      	      <%}%>
      	      <% if (theclaim.UpdateTime != null) {%>
      	      <UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(theclaim.UpdateTime)%></UpdateTime>
      	      <%}%>
      	      <% if (theclaim.AircraftEngineTypeExt != null) {%>
      	      <%=TypeListTemplate.renderToString(theclaim.AircraftEngineTypeExt, "AircraftEngineTypeExt", theclaim.AircraftEngineTypeExt.ListName)%>
      	      <%}%>
      	      <% if (theclaim.AircraftMakeExt != null) {%>
      	      <%=StringParseTemplate.renderToString(theclaim.AircraftMakeExt, "AircraftMakeExt")%>
      	      <%}%>
      	      <% if (theclaim.AircraftModelExt != null) {%>
      	      <%=StringParseTemplate.renderToString(theclaim.AircraftModelExt, "AircraftModelExt")%>
      	      <%}%>
      	      <% if (theclaim.AircraftOwnerCategoryExt != null) {%>
      	      <%=TypeListTemplate.renderToString(theclaim.AircraftOwnerCategoryExt, "AircraftOwnerCategoryExt", theclaim.AircraftOwnerCategoryExt.ListName)%>
      	      <%}%>
      	      <% if (theclaim.AircraftSizeExt != null) {%>
      	      <%=TypeListTemplate.renderToString(theclaim.AircraftSizeExt, "AircraftSizeExt", theclaim.AircraftSizeExt.ListName)%>
      	      <%}%>
      	      <% if (theclaim.AircraftTypeExt != null) {%>
      	      <%=TypeListTemplate.renderToString(theclaim.AircraftTypeExt, "AircraftTypeExt", theclaim.AircraftTypeExt.ListName)%>
      	      <%}%>
      	      <% if (theclaim.AircraftUseExt != null) {%>
      	      <%=TypeListTemplate.renderToString(theclaim.AircraftUseExt, "AircraftUseExt", theclaim.AircraftUseExt.ListName)%>
      	      <%}%>
      	      <% if (theclaim.AircraftYearExt != null) {%>
      	      <AircraftYearExt><%=theclaim.AircraftYearExt%></AircraftYearExt>
      	      <%}%>
      	      <% if (theclaim.TailNumberExt != null) {%>
      	      <%=StringParseTemplate.renderToString(theclaim.TailNumberExt, "TailNumberExt")%>
      	      <%}%>
      	      <% if (theclaim.StandardAirworthinessExt != null) {%>
      	      <StandardAirworthinessExt><%=theclaim.StandardAirworthinessExt%></StandardAirworthinessExt>
      	      <%}%>
            </Aircraft>
         </UnVerifiedRisk>     
      	 <RiskCat><Code>AVIATNOPS</Code><Description>Aviation OPS</Description><ListName>EDWRiskType</ListName></RiskCat>
      </Risk>
<% }%> 

