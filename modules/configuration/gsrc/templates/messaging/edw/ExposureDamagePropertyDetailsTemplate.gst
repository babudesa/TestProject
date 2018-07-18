<%@ params(theexposure : Exposure) %>
<%-- bestor 20101014: defect 2557 - Total Loss Reporting --%>
<DamagePropertyDetails>
  <% if (theexposure.InvolveOthDirDmgExt != null) {%>
  <InvolveOthDirDmgExt><%=theexposure.InvolveOthDirDmgExt%></InvolveOthDirDmgExt>
  <%}%>
  <% if (theexposure.InvolveTerrorismExt != null) {%>
  <InvolveTerrorismExt><%=theexposure.InvolveTerrorismExt%></InvolveTerrorismExt>
  <%}%>
  <% if (theexposure.InvolveLawOrdExt != null) {%>
  <InvolveLawOrdExt><%=theexposure.InvolveLawOrdExt%></InvolveLawOrdExt>
  <%}%>
  <% if (theexposure.InvolveGreenCvgExt != null) {%>
  <InvolveGreenCvgExt><%=theexposure.InvolveGreenCvgExt%></InvolveGreenCvgExt>
  <%}%>
  <% if (theexposure.InvolveAddlCvgExt != null) {%>
  <InvolveAddlCvgExt><%=theexposure.InvolveAddlCvgExt%></InvolveAddlCvgExt>
  <%}%>
  <% if (theexposure.InvolveBuiltCvgExt != null) {%>
  <InvolveBuiltCvgExt><%=theexposure.InvolveBuiltCvgExt%></InvolveBuiltCvgExt>
  <%}%>
  <% if (theexposure.InvolveWaterPropExt != null) {%>
  <InvolveWaterPropExt><%=theexposure.InvolveWaterPropExt%></InvolveWaterPropExt>
  <%}%>
  <% if (theexposure.InvolveCranesExt != null) {%>
    <InvolveCranesExt><%=theexposure.InvolveCranesExt%></InvolveCranesExt>
    <% if (theexposure.InvolveCranesExt == true and theexposure.InvolveOutriggingExt != null) {%>
      <InvolveOutriggingExt><%=theexposure.InvolveOutriggingExt%></InvolveOutriggingExt>
    <%}%>
  <%}%>
  <% if (theexposure.InvolvePropLsToExt != null) {%>
  <InvolvePropLsToExt><%=theexposure.InvolvePropLsToExt%></InvolvePropLsToExt>
  <%}%>
  <% if (theexposure.InvolvePropLsFromExt != null) {%>
  <InvolvePropLsFromExt><%=theexposure.InvolvePropLsFromExt%></InvolvePropLsFromExt>
  <%}%>
  <% if (theexposure.InvolveEmpPropExt != null) {%>
  <InvolveEmpPropExt><%=theexposure.InvolveEmpPropExt%></InvolveEmpPropExt>
  <%}%>
  <% if (theexposure.LawOrdAmountExt != null) {%>
  <LawOrdAmountExt><%=theexposure.LawOrdAmountExt%></LawOrdAmountExt>
  <%}%>
  <% if (theexposure.GreenCvgAmountExt != null) {%>
  <GreenCvgAmountExt><%=theexposure.GreenCvgAmountExt%></GreenCvgAmountExt>
  <%}%>
</DamagePropertyDetails>
