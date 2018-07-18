<%@ params(claim : Claim, evaluation : Evaluation, medProvidersData : String, transportationData : String, transportationSum : java.math.BigDecimal, medLiensData : String, formID : String) %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html> 
<head>
	<meta http-equiv="content-type"content="text/html; charset=UTF-8">
	<title></title>
	<style type="text/css">
		.labelStyle{
			font-size: 11px;
			font-family: Arial;
			font-weight: bold;
		}
		.dataStyle{
			font-size: 11px;
			font-family: Verdana;
		}
		.footerStyle{
			font-size: 10px;
			font-family: Arial;
		}
		h2{
			font-size: 16px;
			font-weight: bold;
			font-family: Arial;
			text-align: center;
			text-decoration: underline;
		}
		h3{
			font-size: 12px;
			font-weight: bold;
			font-family: Arial;
		}
		p{
                        text-indent: 10px;
                }   
		td{
			vertical-align: top;
			border: 2px solid #000000;
			padding: 0 0 0 3px;
		}
		td.noRightBorder{
			border-right-width: 0px;
		}
		td.noLeftBorder{
			border-left-width:0px;
		}
		td.noBorder{
			border-style: none none none none;
		}
		table{
			border:3px solid #000000;
			border-collapse: collapse;
			width: 600px;
			border-spacing: 2;
			padding: 3;
			margin-left: auto;
			margin-right: auto;
		}
		table.noBorder{
			border-style: none none none none;
		}
		.center{
			text-align: center;
		}
		.left{
		        text-align: left;
                }
                #top {
    			position: absolute;
		}
		#container {
    			min-height: 100%;
    			margin-bottom: -14px;
		}
		* html #container {
			height: 100%;
		}
		#footer-spacer {
    			height: 14px;
		}
		#footer {
                        position:fixed;
                        bottom:0;
                        left: 0;
                        width:100%;
                        height: 13px;
			margin-left: 24px;
		}

	</style>
</head>
<body>
<div id="top"></div>
  <div id="container">
    <h2>MEDICAL RESERVE EVALUATION</h2> 
  <div class="center">
    <table>
      <tbody>
	<tr>
	  <td style="width:225px"><span class="labelStyle">Created By:</span></td>
	  <td style="width:375px"><span class="dataStyle"><%= User.util.getCurrentUser() %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:225px"><span class="labelStyle">Claim Number:</span></td>
	  <td style="width:375px"><span class="dataStyle"><%= claim.ClaimNumber %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:225px"><span class="labelStyle">Insured Name:</span></td>
	  <td style="width:375px"><span class="dataStyle"><%= claim.Insured.DisplayName %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:225px"><span class="labelStyle">Injured Worker Name:</span></td>
	  <td style="width:375px"><span class="dataStyle"><%= claim.claimant %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:225px"><p><span class="labelStyle">Date of Birth:</span></td>
	  <td style="width:375px"><span class="dataStyle"><%= claim.claimant.DateOfBirth==null ? "" : claim.claimant.DateOfBirth.formatDate(SHORT) %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:225px"><p><span class="labelStyle">Occupation:</span></td>
	  <td style="width:375px"><span class="dataStyle"><%= claim.claimant.Occupation==null ? "" : claim.claimant.Occupation %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:225px"><span class="labelStyle">Jurisdiction:</span></td>
	  <td style="width:375px"><span class="dataStyle"><%= claim.JurisdictionState.DisplayName==null ? "" : claim.JurisdictionState.DisplayName %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:225px"><span class="labelStyle">Evaluation Comments:</span></td>
	  <td style="width:375px"><span class="dataStyle"><%= evaluation.MedicalEval.MedicalEvalComments==null ? "" : evaluation.MedicalEval.MedicalEvalComments %></span><br/></td>
	</tr> 
      </tbody>
    </table>
    <br/>
    <table class="noBorder">
      <tbody>
        <tr>
          <td class="noBorder"><span class="labelStyle">Medical Providers</span></td>
        </tr>
      </tbody>
    </table>
    <table>
      <tbody>
	<tr>
	  <td class="labelStyle">Provider Type</td>
	  <td class="labelStyle"># of Visits</td>
	  <td class="labelStyle">Rate per Visit</td>
	  <td class="labelStyle">Total</td>
        </tr>
	<%= medProvidersData %>
	<tr>
	  <td class="labelStyle">Sum:</td>
	  <td></td>
	  <td></td>
	  <td><span class="dataStyle"><%= evaluation.MedicalEval.ProvidersTotal==null ? "" : gw.api.util.StringUtil.formatNumber(evaluation.MedicalEval.ProvidersTotal as java.lang.Double, "$###,###.00") %></span><br/></td>
	</tr>
      </tbody>
    </table>
    <br/>
    <table class="noBorder">
      <tbody>
        <tr>
          <td class="noBorder"><span class="labelStyle">Hospital/Surgery Center/Clinics</span></td>
        </tr>
      </tbody>
    </table>
    <table>
      <tbody>
  	<tr>
	  <td style="width:225px"><span class="labelStyle">Surgeon:</span></td>
	  <td style="width:375px"><span class="dataStyle"><%= evaluation.MedicalEval.SurgeonCost==null ? "" : gw.api.util.StringUtil.formatNumber(evaluation.MedicalEval.SurgeonCost as java.lang.Double, "$###,###.00") %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:225px"><span class="labelStyle">Hospital/Surgery Center:</span></td>
	  <td style="width:375px"><span class="dataStyle"><%= evaluation.MedicalEval.HospitalCost==null ? "" : gw.api.util.StringUtil.formatNumber(evaluation.MedicalEval.HospitalCost as java.lang.Double, "$###,###.00") %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:225px"><span class="labelStyle">Emergency Room:</span></td>
	  <td style="width:375px"><span class="dataStyle"><%= evaluation.MedicalEval.ERCost==null ? "" : gw.api.util.StringUtil.formatNumber(evaluation.MedicalEval.ERCost as java.lang.Double, "$###,###.00") %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:225px"><span class="labelStyle">Diagnostics:</span></td>
	  <td style="width:375px"><span class="dataStyle"><%= evaluation.MedicalEval.DiagnosticsCost==null ? "" : gw.api.util.StringUtil.formatNumber(evaluation.MedicalEval.DiagnosticsCost as java.lang.Double, "$###,###.00") %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:225px"><span class="labelStyle">Anesthesia:</span></td>
	  <td style="width:375px"><span class="dataStyle"><%= evaluation.MedicalEval.AnesthesiaCost==null ? "" : gw.api.util.StringUtil.formatNumber(evaluation.MedicalEval.AnesthesiaCost as java.lang.Double, "$###,###.00") %></span><br/></td>
	</tr> 
      </tbody>
    </table>
    <br/>
    <table class="noBorder">
      <tbody>
        <tr>
          <td class="noBorder"><span class="labelStyle">Medical Examinations</span></td>
        </tr>
      </tbody>
    </table>
    <table>
      <tbody>
  	<tr>
	  <td style="width:225px"><span class="labelStyle">Panel QME:</span></td>
	  <td style="width:375px"><span class="dataStyle"><%= evaluation.MedicalEval.PanelQMECost==null ? "" : gw.api.util.StringUtil.formatNumber(evaluation.MedicalEval.PanelQMECost as java.lang.Double, "$###,###.00") %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:225px"><span class="labelStyle">AME/QME/IME:</span></td>
	  <td style="width:375px"><span class="dataStyle"><%= evaluation.MedicalEval.AMEQMEIMECost==null ? "" : gw.api.util.StringUtil.formatNumber(evaluation.MedicalEval.AMEQMEIMECost as java.lang.Double, "$###,###.00") %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:225px"><span class="labelStyle">Medical Reports:</span></td>
	  <td style="width:375px"><span class="dataStyle"><%= evaluation.MedicalEval.MedicalReportsCost==null ? "" : gw.api.util.StringUtil.formatNumber(evaluation.MedicalEval.MedicalReportsCost as java.lang.Double, "$###,###.00") %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:225px"><span class="labelStyle">Functional Capacity Exam:</span></td>
	  <td style="width:375px"><span class="dataStyle"><%= evaluation.MedicalEval.FunctionalCapacityCost==null ? "" : gw.api.util.StringUtil.formatNumber(evaluation.MedicalEval.FunctionalCapacityCost as java.lang.Double, "$###,###.00") %></span><br/></td>
	</tr>
      </tbody>
    </table>
    <br/>
    <table class="noBorder">
      <tbody>
        <tr>
          <td class="noBorder"><span class="labelStyle">Medical Management</span></td>
        </tr>
      </tbody>
    </table>
    <table>
      <tbody>
  	<tr>
	  <td style="width:225px"><span class="labelStyle">Home Healthcare:</span></td>
	  <td style="width:375px"><span class="dataStyle"><%= evaluation.MedicalEval.HomeHealthcareCost==null ? "" : gw.api.util.StringUtil.formatNumber(evaluation.MedicalEval.HomeHealthcareCost as java.lang.Double, "$###,###.00") %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:225px"><span class="labelStyle">Medical Case Management:</span></td>
	  <td style="width:375px"><span class="dataStyle"><%= evaluation.MedicalEval.NurseCaseMgmtCost==null ? "" : gw.api.util.StringUtil.formatNumber(evaluation.MedicalEval.NurseCaseMgmtCost as java.lang.Double, "$###,###.00") %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:225px"><span class="labelStyle">Pain Management/Injections:</span></td>
	  <td style="width:375px"><span class="dataStyle"><%= evaluation.MedicalEval.PainMgmtCost==null ? "" : gw.api.util.StringUtil.formatNumber(evaluation.MedicalEval.PainMgmtCost as java.lang.Double, "$###,###.00") %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:225px"><span class="labelStyle">Prescriptions/Drugs:</span></td>
	  <td style="width:375px"><span class="dataStyle"><%= evaluation.MedicalEval.PrescriptionsDrugsCost==null ? "" : gw.api.util.StringUtil.formatNumber(evaluation.MedicalEval.PrescriptionsDrugsCost as java.lang.Double, "$###,###.00") %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:225px"><span class="labelStyle">Durable Medical Equipment(DME):</span></td>
	  <td style="width:375px"><span class="dataStyle"><%= evaluation.MedicalEval.DMECost==null ? "" : gw.api.util.StringUtil.formatNumber(evaluation.MedicalEval.DMECost as java.lang.Double, "$###,###.00") %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:225px"><span class="labelStyle">Miscellaneous:</span></td>
	  <td style="width:375px"><span class="dataStyle"><%= evaluation.MedicalEval.MiscellaneousCost==null ? "" : gw.api.util.StringUtil.formatNumber(evaluation.MedicalEval.MiscellaneousCost as java.lang.Double, "$###,###.00") %></span><br/></td>
	</tr>
      </tbody>
    </table>
    <br/>
    <table class="noBorder">
      <tbody>
        <tr>
          <td class="noBorder"><span class="labelStyle">Transportation/Translation</span></td>
        </tr>
      </tbody>
    </table>
    <table>
      <tbody>
  	<tr>
	  <td style="width:225px"><span class="labelStyle">Translation:</span></td>
	  <td style="width:375px"><span class="dataStyle"><%= evaluation.MedicalEval.Translation==null ? "" : gw.api.util.StringUtil.formatNumber(evaluation.MedicalEval.Translation as java.lang.Double, "$###,###.00") %></span><br/></td>
	</tr>
      </tbody>
    </table>
    <br/>
    <table>
      <tbody>
	<tr>
	  <td class="labelStyle">Destination</td>
	  <td class="labelStyle"># of Miles</td>
	  <td class="labelStyle">Cents per Mile</td>
	  <td class="labelStyle">Total</td>
        </tr>
	<%= transportationData %>
	<tr>
	  <td class="labelStyle">Sum:</td>
	  <td></td>
	  <td></td>
	  <td><span class="dataStyle"><%= transportationSum==null ? "" : gw.api.util.StringUtil.formatNumber(transportationSum as java.lang.Double, "$###,###.00") %></span><br/></td>
	</tr>
      </tbody>
    </table>
    <br/>
    <table class="noBorder">
      <tbody>
        <tr>
          <td class="noBorder"><span class="labelStyle">Medical Liens</span></td>
        </tr>
      </tbody>
    </table>
    <table>
      <tbody>
	<tr>
	  <td class="labelStyle">Medical Lien</td>
	  <td class="labelStyle">Dollar Amount</td>
	  <td class="labelStyle">Percentage</td>
	  <td class="labelStyle">Total</td>
        </tr>
	<%= medLiensData %>
	<tr>
	  <td class="labelStyle">Sum:</td>
	  <td></td>
	  <td></td>
	  <td><span class="dataStyle"><%= evaluation.MedicalEval.LienTotal==null ? "" : gw.api.util.StringUtil.formatNumber(evaluation.MedicalEval.LienTotal as java.lang.Double, "$###,###.00") %></span><br/></td>
	</tr>
      </tbody>
    </table>
    <br/>
    <table class="noBorder">
      <tbody>
        <tr>
          <td class="noBorder"><span class="labelStyle">Evaluation Totals</span></td>
        </tr>
      </tbody>
    </table>
    <table>
      <tbody>
  	<tr>
	  <td style="width:225px"><span class="labelStyle">Medical Providers Total:</span></td>
	  <td style="width:375px"><span class="dataStyle"><%= evaluation.MedicalEval.ProvidersTotal==null ? "" : gw.api.util.StringUtil.formatNumber(evaluation.MedicalEval.ProvidersTotal as java.lang.Double, "$###,###.00") %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:225px"><span class="labelStyle">Hospital/Surgery Center/Clinics Total:</span></td>
	  <td style="width:375px"><span class="dataStyle"><%= evaluation.MedicalEval.HospitalsTotal==null ? "" : gw.api.util.StringUtil.formatNumber(evaluation.MedicalEval.HospitalsTotal as java.lang.Double, "$###,###.00")  %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:225px"><span class="labelStyle">Medical Examinations Total:</span></td>
	  <td style="width:375px"><span class="dataStyle"><%= evaluation.MedicalEval.MedicalExamsTotal==null ? "" : gw.api.util.StringUtil.formatNumber(evaluation.MedicalEval.MedicalExamsTotal as java.lang.Double, "$###,###.00") %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:225px"><span class="labelStyle">Medical Management Total:</span></td>
	  <td style="width:375px"><span class="dataStyle"><%= evaluation.MedicalEval.ManagedCareTotal==null ? "" : gw.api.util.StringUtil.formatNumber(evaluation.MedicalEval.ManagedCareTotal as java.lang.Double, "$###,###.00") %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:225px"><span class="labelStyle">Transportation Total:</span></td>
	  <td style="width:375px"><span class="dataStyle"><%= evaluation.MedicalEval.TransportationTotal==null ? "" : gw.api.util.StringUtil.formatNumber(evaluation.MedicalEval.TransportationTotal as java.lang.Double, "$###,###.00") %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:225px"><span class="labelStyle">Medical Liens Total:</span></td>
	  <td style="width:375px"><span class="dataStyle"><%= evaluation.MedicalEval.LienTotal==null ? "" : gw.api.util.StringUtil.formatNumber(evaluation.MedicalEval.LienTotal as java.lang.Double, "$###,###.00") %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:225px"><span class="labelStyle">Medical Evaluation Total:</span></td>
	  <td style="width:375px"><span class="dataStyle"><%= evaluation.MedicalEval.MedEvalTotal==null ? "" : gw.api.util.StringUtil.formatNumber(evaluation.MedicalEval.MedEvalTotal as java.lang.Double, "$###,###.00") %></span><br/></td>
	</tr>
      </tbody>
    </table>
  </div>
  <div id="footer-spacer"></div>
  </div>
  <div id="footer">
    <table class="noBorder">
      <tbody>
        <tr>
          <td  class="noBorder"><span class="footerStyle"><%= formID %></span></td>
        </tr>
      </tbody>
    </table>
  </div>
</body>
</html>	