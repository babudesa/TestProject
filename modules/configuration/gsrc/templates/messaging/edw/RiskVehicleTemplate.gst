<% uses templates.messaging.edw.TypeListTemplate %>
<%@ params(thevehicle : Vehicle, vehcategory : String) %>
<% if (thevehicle != null) {%>
<% if (thevehicle.CreateTime != null) {%>
<CreateTime><%=util.custom_Ext.DateTime.formatTimeXML(thevehicle.CreateTime)%></CreateTime>
<%}%>
<% if (thevehicle.UpdateTime != null) {%>
<UpdateTime><%=util.custom_Ext.DateTime.formatTimeXML(thevehicle.UpdateTime)%></UpdateTime>
<%}%>
<% if (thevehicle.BoatFuelTankMaterialTypeExt != null) {%>
<%=TypeListTemplate.renderToString(thevehicle.BoatFuelTankMaterialTypeExt, "BoatFuelTankMaterialTypeExt", thevehicle.BoatFuelTankMaterialTypeExt.ListName)%>
<%}%>
<% if (thevehicle.BoatHullDesignTypeExt != null) {%>
<%=TypeListTemplate.renderToString(thevehicle.BoatHullDesignTypeExt, "BoatHullDesignTypeExt", thevehicle.BoatHullDesignTypeExt.ListName)%>
<%}%>
<% if (thevehicle.BoatHullMaterialTypeExt != null) {%>
<%=TypeListTemplate.renderToString(thevehicle.BoatHullMaterialTypeExt, "BoatHullMaterialTypeExt", thevehicle.BoatHullMaterialTypeExt.ListName)%>
<%}%>
<% if (thevehicle.BoatHullMaxSpeedExt != null) {%>
<%=TypeListTemplate.renderToString(thevehicle.BoatHullMaxSpeedExt, "BoatHullMaxSpeedExt", thevehicle.BoatHullMaxSpeedExt.ListName)%>
<%}%>
<% if (thevehicle.BoatHullTypeExt != null) {%>
<%=TypeListTemplate.renderToString(thevehicle.BoatHullTypeExt, "BoatHullTypeExt", thevehicle.BoatHullTypeExt.ListName)%>
<%}%>
<% if (thevehicle.BoatType != null) {%>
<%=TypeListTemplate.renderToString(thevehicle.BoatType, "BoatType", thevehicle.BoatType.ListName)%>
<%}%>
<% if (thevehicle.ClassCodeDescExt != null) {%>
<ClassCodeDescExt><%=thevehicle.ClassCodeDescExt%></ClassCodeDescExt> 
<%}%>
<% if (thevehicle.ClassCodeExt != null) {%>
<ClassCodeExt><%=thevehicle.ClassCodeExt%></ClassCodeExt> 
<%}%>
<% if (thevehicle.Color != null) {%>
<Color><%=thevehicle.Color%></Color> 
<%}%>
<% if (thevehicle.DesignExplanationExt != null) {%>
<DesignExplanationExt><%=thevehicle.DesignExplanationExt%></DesignExplanationExt> 
<%}%>
<% if (thevehicle.FuelTankExt != null) {%>
<FuelTankExt><%=thevehicle.FuelTankExt%></FuelTankExt> 
<%}%>
<% if (thevehicle.HullDesignExt != null) {%>
<HullDesignExt><%=thevehicle.HullDesignExt%></HullDesignExt> 
<%}%>
<% if (thevehicle.HullTypeExplanationExt != null) {%>
<HullTypeExplanationExt><%=thevehicle.HullTypeExplanationExt%></HullTypeExplanationExt> 
<%}%>
<% if (thevehicle.HullTypeExt != null) {%>
<HullTypeExt><%=thevehicle.HullTypeExt%></HullTypeExt> 
<%}%>
<% if (thevehicle.InsuranceLimitExt != null) {%>
<InsuranceLimitExt><%=thevehicle.InsuranceLimitExt%></InsuranceLimitExt> 
<%}%>
<% if (thevehicle.LicensePlate != null) {%>
<LicensePlate><%=thevehicle.LicensePlate%></LicensePlate> 
<%}%>
<% if (thevehicle.Loan != null) {%>
<Loan><%=thevehicle.Loan%></Loan> 
<%}%>
<% if (thevehicle.LoanMonthlyPayment != null) {%>
<LoanMonthlyPayment><%=thevehicle.LoanMonthlyPayment.Amount%></LoanMonthlyPayment> 
<%}%>
<% if (thevehicle.LoanMonthsRemaining != null) {%>
<LoanMonthsRemaining><%=thevehicle.LoanMonthsRemaining%></LoanMonthsRemaining> 
<%}%>
<% if (thevehicle.LoanPayoffAmount != null) {%>
<LoanPayoffAmount><%=thevehicle.LoanPayoffAmount.Amount%></LoanPayoffAmount> 
<%}%>
<% if (thevehicle.Make != null) {%>
<Make><%=thevehicle.Make%></Make> 
<%}%>
<% if (thevehicle.MaxSpeedExt != null) {%>
<MaxSpeedExt><%=thevehicle.MaxSpeedExt%></MaxSpeedExt> 
<%}%>
<% if (thevehicle.Model != null) {%>
<Model><%=thevehicle.Model%></Model> 
<%}%>
<% if (thevehicle.OffRoadStyle != null) {%>
<%=TypeListTemplate.renderToString(thevehicle.OffRoadStyle, "OffRoadStyle", thevehicle.OffRoadStyle.ListName)%>
<%}%>
<% if (thevehicle.PhysicalDamageExt != null) {%>
<PhysicalDamageExt><%=thevehicle.PhysicalDamageExt%></PhysicalDamageExt> 
<%}%>
<% if (thevehicle.PhysicalDamageLimitExt != null) {%>
<PhysicalDamageLimitExt><%=thevehicle.PhysicalDamageLimitExt%></PhysicalDamageLimitExt> 
<%}%>
<% if (thevehicle.PurchaseDateExt != null) {%>
<PurchaseDateExt><%=thevehicle.PurchaseDateExt%></PurchaseDateExt> 
<%}%>
<% if (thevehicle.RegistrationNoExt != null) {%>
<RegistrationNoExt><%=thevehicle.RegistrationNoExt%></RegistrationNoExt> 
<%}%>
<% if (thevehicle.SerialNumber != null) {%>
<SerialNumber><%=thevehicle.SerialNumber%></SerialNumber> 
<%}%>
<% if (thevehicle.VehicleCurrentValueExt != null) {%>
<VehicleCurrentValueExt><%=thevehicle.VehicleCurrentValueExt%></VehicleCurrentValueExt> 
<%}%>
<% if (thevehicle.VehicleEffDateExt != null) {%>
<VehicleEffDateExt><%=thevehicle.VehicleEffDateExt%></VehicleEffDateExt> 
<%}%>
<% if (thevehicle.VehicleExpDateExt != null) {%>
<VehicleExpDateExt><%=thevehicle.VehicleExpDateExt%></VehicleExpDateExt> 
<%}%>
<% if (thevehicle.VehicleHorsePowerExt != null) {%>
<VehicleHorsePowerExt><%=thevehicle.VehicleHorsePowerExt%></VehicleHorsePowerExt> 
<%}%>
<% if (thevehicle.VehicleLengthExt != null) {%>
<VehicleLengthExt><%=thevehicle.VehicleLengthExt%></VehicleLengthExt> 
<%}%>
<% if (thevehicle.Manufacturer != null) {%>
<%=TypeListTemplate.renderToString(thevehicle.Manufacturer, "VehicleManufacturer", thevehicle.Manufacturer.ListName)%>
<%}%>
<% if (thevehicle.VehicleMaterialTypeExt != null) {%>
<%=TypeListTemplate.renderToString(thevehicle.VehicleMaterialTypeExt, "VehicleMaterialTypeExt", thevehicle.VehicleMaterialTypeExt.ListName)%>
<%}%>
<% if (thevehicle.VehicleNameExt != null) {%>
<VehicleNameExt><%=thevehicle.VehicleNameExt%></VehicleNameExt> 
<%}%>
<% if (thevehicle.VehicleNewValueExt != null) {%>
<VehicleNewValueExt><%=thevehicle.VehicleNewValueExt%></VehicleNewValueExt> 
<%}%>
<% if (thevehicle.VehiclePowerTypeExt != null) {%>
<%=TypeListTemplate.renderToString(thevehicle.VehiclePowerTypeExt, "VehiclePowerTypeExt", thevehicle.VehiclePowerTypeExt.ListName)%>
<%}%>
<% if (thevehicle.State != null) {%>
<%=TypeListTemplate.renderToString(thevehicle.State, "VehicleState", thevehicle.State.ListName)%>
<%}%>
<% if (thevehicle.Vin != null) {%>
<Vin><%=thevehicle.Vin%></Vin> 
<%}%>
<% if (thevehicle.WaterNavigatedExt != null) {%>
<%=TypeListTemplate.renderToString(thevehicle.WaterNavigatedExt, "WaterNavigatedExt", thevehicle.WaterNavigatedExt.ListName)%>
<%}%>
<% if (thevehicle.WatersNavigatedExt != null) {%>
<WatersNavigatedExt><%=thevehicle.WatersNavigatedExt%></WatersNavigatedExt> 
<%}%>
<% if (thevehicle.Year != null) {%>
<Year><%=thevehicle.Year%></Year> 
<%}%>
<% if (vehcategory != null and vehcategory != "") {%>
 <VehicleCategory><%=vehcategory%></VehicleCategory>
<%}%>
<% if (thevehicle.MechanicalLiftExt != null) {%>
<MechanicalLiftExt><%=thevehicle.MechanicalLiftExt%></MechanicalLiftExt> 
<%}%>  
<%}%>