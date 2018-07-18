<%@ params(therisk : LocationBasedRU) %>
<%
var typecodeMapper = gw.api.util.TypecodeMapperUtil.getTypecodeMapper();
var isDwelling : boolean = false;
var isFarmStructure : boolean = false;
if (therisk.Coverages != null) {
  for (rcvrg in therisk.Coverages) {
    var typeCode = typecodeMapper.getInternalCodeByAlias( "EDWRiskType", "CoverageRisk", rcvrg.Type.Code);
    if (typeCode == "FRMDWL") {
      isDwelling = true;
    } else if (typeCode == "FRMSTRUCT") {
      isFarmStructure = true;
    }
  }
}
%>
<% if ((therisk.Property.YearBuiltExt != null || therisk.Property.LocationNumber !=null)
&& (isDwelling or isFarmStructure)) {%>
<FarmProperty>
  <Structure>
    <% if (therisk.Property.LocationNumber != null) {%>
    <Description><%=therisk.Property.LocationNumber%></Description>
    <%}%>
    <% if (therisk.Property.YearBuiltExt != null) {%>
    <YearBuilt><%=therisk.Property.YearBuiltExt%></YearBuilt>
    <%}%>
  </Structure>
</FarmProperty>
<%}%>