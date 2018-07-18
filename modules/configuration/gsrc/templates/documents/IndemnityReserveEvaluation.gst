<%@ params(claim : Claim, evaluation : Evaluation, disabilityBenefitsData : String, lifetimeBenefitsData : String, deathBenefitsData : String, deathBenefitsSum : java.math.BigDecimal, expensesData : String, expensesSum : java.math.BigDecimal, formID : String) %>
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
			width: 644px;
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

        <%
	  var cola = ""
	  if(evaluation.IndemnityEval.COLA == true){
	    cola = "TRUE"
          }else if(evaluation.IndemnityEval.COLA == false){
            cola = "FALSE"
          }
        %>

<div id="top"></div>
  <div id="container">
    <h2>INDEMNITY RESERVE EVALUATION</h2> 
  <div class="center">
    <table>
      <tbody>
	<tr>
	  <td style="width:250px"><span class="labelStyle">Created By:</span></td>
	  <td style="width:450px"><span class="dataStyle"><%= User.util.getCurrentUser() %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:250px"><span class="labelStyle">Claim Number:</span></td>
	  <td style="width:450px"><span class="dataStyle"><%= claim.ClaimNumber %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:250px"><span class="labelStyle">Insured Name:</span></td>
	  <td style="width:450px"><span class="dataStyle"><%= claim.Insured.DisplayName %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:250px"><span class="labelStyle">Injured Worker Name:</span></td>
	  <td style="width:450px"><span class="dataStyle"><%= claim.claimant %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:250px"><p><span class="labelStyle">Date of Birth:</span></td>
	  <td style="width:450px"><span class="dataStyle"><%= claim.claimant.DateOfBirth==null ? "" : claim.claimant.DateOfBirth.formatDate(SHORT) %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:250px"><p><span class="labelStyle">Occupation:</span></td>
	  <td style="width:450px"><span class="dataStyle"><%= claim.claimant.Occupation==null ? "" : claim.claimant.Occupation %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:250px"><span class="labelStyle">Jurisdiction:</span></td>
	  <td style="width:450px"><span class="dataStyle"><%= claim.JurisdictionState.DisplayName==null ? "" : claim.JurisdictionState.DisplayName %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:250px"><span class="labelStyle">Evaluation Comments:</span></td>
	  <td style="width:450px"><span class="dataStyle"><%= evaluation.CommentsExt==null ? "" : evaluation.CommentsExt %></span><br/></td>
	</tr> 
      </tbody>
    </table>
    <br/>
    <table class="noBorder">
      <tbody>
        <tr>
          <td class="noBorder"><span class="labelStyle">Disability Benefits</span></td>
        </tr>
      </tbody>
    </table>
    <table>
      <tbody>
  	<tr>
	  <td style="width:250px"><span class="labelStyle">Age at DOI:</span></td>
	  <td style="width:450px"><span class="dataStyle"><%= util.WCHelper.ageAtInjury(claim)==null ? "" : gw.api.util.StringUtil.formatNumber(util.WCHelper.ageAtInjury(claim), "###") %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:250px"><span class="labelStyle">Current Age:</span></td>
	  <td style="width:450px"><span class="dataStyle"><%= util.WCHelper.currentAge(claim)==null ? "" : gw.api.util.StringUtil.formatNumber(util.WCHelper.currentAge(claim), "###") %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:250px"><span class="labelStyle">COLA Applicable:</span></td>
	  <td style="width:450px"><span class="dataStyle"><%= cola %></span><br/></td>
	</tr>
      </tbody>
    </table>
    <br/>
    <table>
      <tbody>
	<tr>
	  <td class="labelStyle">Disability Type</td>
	  <td class="labelStyle">Paid</td>
	  <td class="labelStyle">Weeks Paid</td>
	  <td class="labelStyle">Future Scheduled</td>
	  <td class="labelStyle">Weeks Scheduled</td>
	  <td class="labelStyle">Area of Body</td>
	  <td class="labelStyle">Detailed Body Part</td>
	  <td class="labelStyle">Percentage Disabled</td>
	  <td class="labelStyle"># of Weeks</td>
	  <td class="labelStyle">Rate</td>
	  <td class="labelStyle">Total</td>
	</tr>
	<%= disabilityBenefitsData %>
	<tr>
	  <td class="labelStyle">Sum:</td>
	  <td></td>
	  <td></td>
	  <td></td>
	  <td></td>
	  <td></td>
	  <td></td>
	  <td></td>
	  <td></td>
	  <td></td>
	  <td><span class="dataStyle"><%= evaluation.IndemnityEval.DisabilityBenefitTotal==null ? "" : gw.api.util.StringUtil.formatNumber(evaluation.IndemnityEval.DisabilityBenefitTotal as java.lang.Double, "$###,###.00") %></span><br/></td>
	</tr>
      </tbody>
    </table>
    <br/>
    <table class="noBorder">
      <tbody>
        <tr>
          <td class="noBorder"><span class="labelStyle">Other Benefits</span></td>
        </tr>
      </tbody>
    </table>
    <table>
      <tbody>
  	<tr>
	  <td style="width:250px"><span class="labelStyle">Disfigurement or Scarring:</span></td>
	  <td style="width:450px"><span class="dataStyle"><%= evaluation.IndemnityEval.DisfigureScarring==null ? "" : gw.api.util.StringUtil.formatNumber(evaluation.IndemnityEval.DisfigureScarring as java.lang.Double, "$###,###.00") %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:250px"><span class="labelStyle">Wage Differential/Wage Loss:</span></td>
	  <td style="width:450px"><span class="dataStyle"><%= evaluation.IndemnityEval.WageLoss==null ? "" : gw.api.util.StringUtil.formatNumber(evaluation.IndemnityEval.WageLoss as java.lang.Double, "$###,###.00") %></span><br/></td>
	</tr>
      </tbody>
    </table>
    <br/>
    <table class="noBorder">
      <tbody>
        <tr>
          <td class="noBorder"><span class="labelStyle">Lifetime Benefits</span></td>
        </tr>
      </tbody>
    </table>
    <table>
      <tbody>
	<tr>
	  <td class="labelStyle">Lifetime Benefit Type</td>
	  <td class="labelStyle"># of Weeks</td>
	  <td class="labelStyle">Rate</td>
	  <td class="labelStyle">Total</td>
        </tr>
	<%= lifetimeBenefitsData %>
	<tr>
	  <td class="labelStyle">Sum:</td>
	  <td></td>
	  <td></td>
	  <td><span class="dataStyle"><%= evaluation.IndemnityEval.LifetimeBenefitTotal==null ? "" : gw.api.util.StringUtil.formatNumber(evaluation.IndemnityEval.LifetimeBenefitTotal as java.lang.Double, "$###,###.00") %></span><br/></td>
	</tr>
      </tbody>
    </table>
    <br/>
    <table class="noBorder">
      <tbody>
        <tr>
          <td class="noBorder"><span class="labelStyle">Death Benefits</span></td>
        </tr>
      </tbody>
    </table>
    <table>
      <tbody>
  	<tr>
	  <td style="width:250px"><span class="labelStyle">Burial Expense:</span></td>
	  <td style="width:450px"><span class="dataStyle"><%= evaluation.IndemnityEval.BurialExpense==null ? "" : gw.api.util.StringUtil.formatNumber(evaluation.IndemnityEval.BurialExpense as java.lang.Double, "$###,###.00") %></span><br/></td>
	</tr>
      </tbody>
    </table>
    <br/>
    <table>
      <tbody>
	<tr>
	  <td class="labelStyle">Death Benefit Type</td>
	  <td class="labelStyle">Dependent</td>
	  <td class="labelStyle">Date of Birth</td>
	  <td class="labelStyle"># of Pay Periods</td>
	  <td class="labelStyle">Rate</td>
	  <td class="labelStyle">Total</td>
	</tr>
	<%= deathBenefitsData %>
	<tr>
	  <td class="labelStyle">Sum:</td>
	  <td></td>
	  <td></td>
	  <td></td>
	  <td></td>
	  <td><span class="dataStyle"><%= deathBenefitsSum==null ? "" : gw.api.util.StringUtil.formatNumber(deathBenefitsSum as java.lang.Double, "$###,###.00") %></span><br/></td>
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
	  <td style="width:250px"><span class="labelStyle">Disability Benefits Total:</span></td>
	  <td style="width:450px"><span class="dataStyle"><%= evaluation.IndemnityEval.DisabilityBenefitTotal==null ? "" : gw.api.util.StringUtil.formatNumber(evaluation.IndemnityEval.DisabilityBenefitTotal as java.lang.Double, "$###,###.00") %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:250px"><span class="labelStyle">Other Benefits Total:</span></td>
	  <td style="width:450px"><span class="dataStyle"><%= evaluation.IndemnityEval.OtherBenefitTotal==null ? "" : gw.api.util.StringUtil.formatNumber(evaluation.IndemnityEval.OtherBenefitTotal as java.lang.Double, "$###,###.00")  %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:250px"><span class="labelStyle">Lifetime Benefits Total:</span></td>
	  <td style="width:450px"><span class="dataStyle"><%= evaluation.IndemnityEval.LifetimeBenefitTotal==null ? "" : gw.api.util.StringUtil.formatNumber(evaluation.IndemnityEval.LifetimeBenefitTotal as java.lang.Double, "$###,###.00") %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:250px"><span class="labelStyle">Death Benefits Total:</span></td>
	  <td style="width:450px"><span class="dataStyle"><%= evaluation.IndemnityEval.DeathBenefitTotal==null ? "" : gw.api.util.StringUtil.formatNumber(evaluation.IndemnityEval.DeathBenefitTotal as java.lang.Double, "$###,###.00") %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:250px"><span class="labelStyle">Indemnity Evaluation Total:</span></td>
	  <td style="width:450px"><span class="dataStyle"><%= evaluation.IndemnityEval.IndemnityEvalTotal==null ? "" : gw.api.util.StringUtil.formatNumber(evaluation.IndemnityEval.IndemnityEvalTotal as java.lang.Double, "$###,###.00") %></span><br/></td>
	</tr>
      </tbody>
    </table>
    <br/>
    <table class="noBorder">
      <tbody>
        <tr>
          <td class="noBorder"><span class="labelStyle">Projected Expenses</span></td>
        </tr>
      </tbody>
    </table>
    <table>
      <tbody>
	<tr>
	  <td class="labelStyle">Expense Code</td>
	  <td class="labelStyle">Expense Amount</td>
	</tr>
	<%= expensesData %>
	<tr>
	  <td class="labelStyle">Sum:</td>
	  <td><span class="dataStyle"><%= expensesSum==null ? "" : gw.api.util.StringUtil.formatNumber(expensesSum as java.lang.Double, "$###,###.00") %></span><br/></td>
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