<%@ params(claim : Claim, evaluation : Evaluation, rehabTableData : String, formID : String) %>
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
    <h2>VOCATIONAL REHABILITATION RESERVE EVALUATION</h2> 
  <div class="center">
    <table>
      <tbody>
	<tr>
	  <td style="width:200px"><span class="labelStyle">Created By:</span></td>
	  <td style="width:400px"><span class="dataStyle"><%= User.util.getCurrentUser() %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:200px"><span class="labelStyle">Claim Number:</span></td>
	  <td style="width:400px"><span class="dataStyle"><%= claim.ClaimNumber %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:200px"><span class="labelStyle">Insured Name:</span></td>
	  <td style="width:400px"><span class="dataStyle"><%= claim.Insured.DisplayName %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:200px"><span class="labelStyle">Injured Worker Name:</span></td>
	  <td style="width:400px"><span class="dataStyle"><%= claim.claimant %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:200px"><p><span class="labelStyle">Date of Birth:</span></td>
	  <td style="width:400px"><span class="dataStyle"><%= claim.claimant.DateOfBirth==null ? "" : claim.claimant.DateOfBirth.formatDate(SHORT) %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:200px"><p><span class="labelStyle">Occupation:</span></td>
	  <td style="width:400px"><span class="dataStyle"><%= claim.claimant.Occupation==null ? "" : claim.claimant.Occupation %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:200px"><span class="labelStyle">Jurisdiction:</span></td>
	  <td style="width:400px"><span class="dataStyle"><%= claim.JurisdictionState.DisplayName==null ? "" : claim.JurisdictionState.DisplayName %></span><br/></td>
	</tr>
	<tr>
	  <td style="width:200px"><span class="labelStyle">Evaluation Comments:</span></td>
	  <td style="width:400px"><span class="dataStyle"><%= evaluation.VocRehabComments==null ? "" : evaluation.VocRehabComments %></span><br/></td>
	</tr> 
      </tbody>
    </table>
    <br/>
    <table class="noBorder">
      <tbody>
        <tr>
          <td  class="noBorder"><span class="labelStyle">Rehabilitation</span></td>
        </tr>
      </tbody>
    </table>
    <table>
      <tbody>
	<tr>
	  <td class="labelStyle">Rehabilitation Type</td>
	  <td class="labelStyle"># of Weeks</td>
	  <td class="labelStyle">Rate</td>
	  <td class="labelStyle">Total</td>
        </tr>
	<%= rehabTableData %>
	<tr>
	  <td class="labelStyle">Sum:</td>
	  <td></td>
	  <td></td>
	  <td><span class="dataStyle">$<%= evaluation.getRehabTotal() %></span><br/></td>
	</tr>
      </tbody>
    </table>
    <br/>
    <table class="noBorder">
      <tbody>
        <tr>
          <td class="noBorder"><span class="labelStyle">Evaluation Total</span></td>
        </tr>
      </tbody>
    </table>
    <table>
      <tbody>
  	<tr>
	  <td style="width:200px"><span class="labelStyle">Vocational Rehabilitation Evaluation Total:</span></td>
	  <td style="width:400px"><span class="dataStyle">$<%= evaluation.getRehabTotal() %></span><br/></td>
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
          <td class="noBorder"><span class="footerStyle"><%= formID %></span></td>
        </tr>
      </tbody>
    </table>
  </div>
</body>
</html>	