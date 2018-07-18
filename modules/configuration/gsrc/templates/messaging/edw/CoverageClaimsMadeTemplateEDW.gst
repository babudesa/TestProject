<% uses templates.messaging.edw.TypeListTemplate %>
<%@ params(thecoverage : Coverage) %>
<% if (thecoverage.ClaimsMadeIndicatorExt != null) {%>   

  <ClaimsMadeIndicatorExt><%=thecoverage.ClaimsMadeIndicatorExt%></ClaimsMadeIndicatorExt>
  <% if (thecoverage.CoverageRetroDateExt != null) {%>
    <CoverageRetroDateExt><%=thecoverage.CoverageRetroDateExt%></CoverageRetroDateExt> 
  <%}%>
  <% if (thecoverage.ReinAggLmtIndicatorExt != null) {%>
    <ReinAggLmtIndicatorExt><%=thecoverage.ReinAggLmtIndicatorExt%></ReinAggLmtIndicatorExt>
  <%}%>
  <% if (thecoverage.BasicExtdPeriodAmtExt != null) {%>
    <BasicExtdPeriodAmtExt><%=thecoverage.BasicExtdPeriodAmtExt%></BasicExtdPeriodAmtExt>
  <%}%>
  <% if (thecoverage.BasicExtdPeriodUnitExt != null) {%>
    <%=TypeListTemplate.renderToString(thecoverage.BasicExtdPeriodUnitExt, "BasicExtdPeriodUnitExt", thecoverage.BasicExtdPeriodUnitExt.ListName)%>
  <%}%>
  <% if (thecoverage.SupplExtdPeriodAmtExt != null) {%>
    <SupplExtdPeriodAmtExt><%=thecoverage.SupplExtdPeriodAmtExt%></SupplExtdPeriodAmtExt>
  <%}%>
  <% if (thecoverage.SupplExtdPeriodUntExt != null) {%>
    <%=TypeListTemplate.renderToString(thecoverage.SupplExtdPeriodUntExt, "SupplExtdPeriodUntExt", thecoverage.SupplExtdPeriodUntExt.ListName)%>
  <%}%>
  <% if (thecoverage.SupplExtdRprtgPeriodExt != null) {%>
    <SupplExtdRprtgPeriodExt><%=thecoverage.SupplExtdRprtgPeriodExt%></SupplExtdRprtgPeriodExt> 
  <%}%>

<%}%>
