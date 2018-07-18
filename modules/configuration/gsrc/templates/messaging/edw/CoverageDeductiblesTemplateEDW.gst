<% uses templates.messaging.edw.TypeListTemplate %>
<%@ params(thecoverage : Coverage) %>

<% if (thecoverage.DeductiblesExt != null and thecoverage.DeductiblesExt.length > 0) {%>
  <CovDeductibles>
    <% for( var thedeductible in thecoverage.DeductiblesExt ) {%>
        <CovDeductible>
          <% if (thedeductible.Deductible != null) {%>
            <DeductibleAmt><%=thedeductible.Deductible%></DeductibleAmt>
          <%}%>
          <% if (thedeductible.DeductLimitAppExt != null) {%>
            <DeductibleText><%=thedeductible.DeductLimitAppExt.Description%></DeductibleText>
          <%}%>
		    <CovDeductCat>
		      <Code>0</Code>
		      <Description>none</Description>
		      <ListName>Deductible Category</ListName>
		    </CovDeductCat>
		    <Basis>
		      <Code>0</Code>
		      <Description>none</Description>
		      <ListName>Deductible Basis</ListName>
		    </Basis>
            <% if (thedeductible.DeductLimitAppExt != null) {%>
               <%=TypeListTemplate.renderToString(thedeductible.DeductLimitAppExt, "Applies", thedeductible.DeductLimitAppExt.ListName)%>
            <%} else {%>
               <Applies>
                 <Code>0</Code>
                 <Description>none</Description>
                 <ListName>Deductible Applies To</ListName>
               </Applies>
            <%}%>
		    <DurCat>
		      <Code>0</Code>
		      <Description>none</Description>
		      <ListName>Deductible Duration</ListName>
		    </DurCat>
        </CovDeductible>
    <%}%>
  </CovDeductibles>
<%}%>