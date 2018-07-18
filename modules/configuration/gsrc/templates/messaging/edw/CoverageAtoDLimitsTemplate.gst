<% uses templates.messaging.edw.TypeListTemplate %>
<%@ params(thecoveragesublimit : CoverageBasisLimitExt) %>
<% if (thecoveragesublimit.CoverageBasisExt != null or thecoveragesublimit.CoverageLimitAppExt != null or thecoveragesublimit.LimitAmountExt != null) {%>   
<CoverageLimits>
  <CoverageLimit><%=thecoveragesublimit.LimitAmountExt%></CoverageLimit>
  <% if (thecoveragesublimit.CoverageLimitAppExt != null) { %> 
  <%=TypeListTemplate.renderToString(thecoveragesublimit.CoverageLimitAppExt, "LimitApplies", thecoveragesublimit.CoverageLimitAppExt.ListName)%>
  <%}%>
  <LimitCat>
    <Code>AMT</Code>
    <Description>AMT</Description>
    <ListName>Limit Category</ListName>
  </LimitCat> 	
  <% if (thecoveragesublimit.CoverageBasisExt != null) {%>
  <%=TypeListTemplate.renderToString(thecoveragesublimit.CoverageBasisExt, "LimitValuation", thecoveragesublimit.CoverageBasisExt.ListName)%>
  <%} else {%>
  <LimitValuation>
    <Code>agreed</Code>
    <Description>agreed</Description>
    <ListName>CoverageBasis</ListName>
  </LimitValuation> 	
  <%}%>
</CoverageLimits>
<%}%>
