<% uses templates.messaging.edw.TypeListTemplate %>
<%@ params(thecoverage : Coverage) %>
<% if (thecoverage.IncidentLimit != null) {%>   
<CoverageLimits>
  <CoverageLimit><%=thecoverage.IncidentLimit.Amount%></CoverageLimit>
  <% if (thecoverage.CovLimitBasisExt != null) {%>
  <%=TypeListTemplate.renderToString(thecoverage.CovLimitBasisExt, "LimitBasis", thecoverage.CovLimitBasisExt.ListName)%>
  <%}%>
  <% if (thecoverage.CovLimitAppExt != null) {%> 
  <%=TypeListTemplate.renderToString(thecoverage.CovLimitAppExt, "LimitApplies", thecoverage.CovLimitAppExt.ListName)%>
  <%}%>
  <LimitCat>
    <Code>AMT</Code>
    <Description>AMT</Description>
    <ListName>Limit Category</ListName>
  </LimitCat> 	
  <% if (thecoverage.CoverageBasisExt != null) {%>
  <%=TypeListTemplate.renderToString(thecoverage.CoverageBasisExt, "LimitValuation", thecoverage.CoverageBasisExt.ListName)%>
  <%} else {%>
  <%=TypeListTemplate.renderToString(CoverageBasis.TC_AGREED, "LimitValuation", CoverageBasis.TC_AGREED.ListName)%>
  <%}%>
</CoverageLimits>
<%}%>
<% if (thecoverage.AggregateLimitExt != null) {%>   
<CoverageLimits>
  <CoverageLimit><%=thecoverage.AggregateLimitExt%></CoverageLimit>
  <% if (thecoverage.AggLimitBasisExt != null) { %> 
  <%=TypeListTemplate.renderToString(thecoverage.AggLimitBasisExt, "LimitBasis", thecoverage.AggLimitBasisExt.ListName)%>
  <%}%>
  <% if (thecoverage.AggLimitAppExt != null) { %> 
  <%=TypeListTemplate.renderToString(thecoverage.AggLimitAppExt, "LimitApplies", thecoverage.AggLimitAppExt.ListName)%>
  <%}%>
  <LimitCat>
    <Code>AMT</Code>
    <Description>AMT</Description>
    <ListName>Limit Category</ListName>
  </LimitCat> 	
  <% if (thecoverage.CoverageBasisExt != null) {%>
  <%=TypeListTemplate.renderToString(thecoverage.CoverageBasisExt, "LimitValuation", thecoverage.CoverageBasisExt.ListName)%>
  <%} else {%>
  <%=TypeListTemplate.renderToString(CoverageBasis.TC_AGREED, "LimitValuation", CoverageBasis.TC_AGREED.ListName)%>
  <%}%>
</CoverageLimits>
<% if (thecoverage.CoveragePartPctExt != null) {%>
    <CoverageLimits>
      <LimitBasis>
        <Code>qsparticipantpercent</Code>
        <Description>QS Participant Percent</Description>
        <ListName>LimitBasisExt</ListName>
      </LimitBasis> 
      <LimitApplies>
        <Code>EACHLOSS</Code>
        <Description>Each Loss</Description>
        <ListName>LimitApplicationExt</ListName>
      </LimitApplies> 	
      <LimitCat>
        <Code>PCNT</Code>
        <Description>PCNT</Description>
        <ListName>Limit Category</ListName>
      </LimitCat> 	
      <LimitValuation>
        <Code>agreed</Code>
        <Description>agreed</Description>
        <ListName>CoverageBasis</ListName>
      </LimitValuation>
      <CoverageLimitPcnt><%=thecoverage.CoveragePartPctExt%></CoverageLimitPcnt> 	
    </CoverageLimits>
<%}%>
<%}%>