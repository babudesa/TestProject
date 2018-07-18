<% uses templates.messaging.edw.TypeListTemplate %>
<%@ params(thecoverage : Coverage) %>
<% if (thecoverage.IncidentLimit != null) {%>   
<CoverageLimits>
  <CoverageLimit><%=thecoverage.IncidentLimit.Amount%></CoverageLimit>
  <LimitBasis>
    <Code>PEROCC</Code>
    <Description>Per Occurrence</Description>
    <ListName>LimitBasisExt</ListName>
  </LimitBasis> 	
  <LimitCat>
    <Code>AMT</Code>
    <Description>AMT</Description>
    <ListName>Limit Category</ListName>
  </LimitCat> 	
  <% if (thecoverage.CoverageBasisExt != null) {%>
  <%=TypeListTemplate.renderToString(thecoverage.CoverageBasisExt, "LimitValuation", thecoverage.CoverageBasisExt.ListName)%>
  <%} else {%>
  <LimitValuation>
    <Code>agreed</Code>
    <Description>agreed</Description>
    <ListName>CoverageBasis</ListName>
  </LimitValuation> 	
  <%}%>
  </CoverageLimits>
  <%}%>
  <% if (thecoverage.AggregateLimitExt != null) {%>   
  <CoverageLimits>
  <CoverageLimit><%=thecoverage.AggregateLimitExt%></CoverageLimit>
  <LimitBasis>
    <Code>APL</Code>
    <Description>Aggregate per Policy Term</Description>
    <ListName>LimitBasisExt</ListName>
  </LimitBasis> 	
  <LimitCat>
    <Code>AMT</Code>
    <Description>AMT</Description>
    <ListName>Limit Category</ListName>
  </LimitCat>
  <% if (thecoverage.CoverageBasisExt != null) {%>
  <%=TypeListTemplate.renderToString(thecoverage.CoverageBasisExt, "LimitValuation", thecoverage.CoverageBasisExt.ListName)%>
  <%} else {%>
  <LimitValuation>
    <Code>agreed</Code>
    <Description>agreed</Description>
    <ListName>CoverageBasis</ListName>
  </LimitValuation> 	
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