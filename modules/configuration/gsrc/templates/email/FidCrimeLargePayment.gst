<%@ params(TransactionSet : TransactionSet)%>

<html>
  <head>
    <style type="text/css">
      td.header {font-family:verdana;font-size:12;font-weight:bold}
      td.label {font-family:verdana;font-size:10;font-weight:bold;text-align:left}
      td.value {font-family:verdana;font-size:10;text-align:left}
      p.value {font-family:verdana;font-size:10;text-align:left}
    </style>	
  </head>
	
  <body> 	
    <%
      var counter : int = 0
      var user : String = "" 
      var busUnit : String = ""		
     
      var Exposures = TransactionSet.Exposures
      var FeatureAdjuster : String = ""      
      var To = util.GlobalParameters.ParameterFinder.getUserParameter("ccproperty", TransactionSet.Claim.LossType)
      var Cc = "Karen Birdseye" 
      var DivAccounting = ScriptParameters.Divisional_Accounting_Name
      var TotalIncurredNet = gw.api.financials.FinancialsCalculationUtil.getTotalIncurredNet().getAmount(TransactionSet.Claim)
   			
      for( key in Exposures ) {
        if( counter < 1 ) {
   	  FeatureAdjuster = key.AssignedUser as java.lang.String
   	  counter = counter + 1
   	} else {
            FeatureAdjuster = TransactionSet.Claim.AssignedUser as java.lang.String
   	}
      }
      
      if( TransactionSet.RequestingUser != null ) {
         // 4/2/2012 kepage removed to fix defect #5281
        //user = TransactionSet.RequestingUser as java.lang.String
        //usUnit=TransactionSet.RequestingUser.getUserBusinessUnit()
        
        // 4/2/2012 kepage added to fix defect #5281
        busUnit=TransactionSet.Claim.AssignedUser.getUserBusinessUnit()      
      }      
    %>
	
  <table>
    <tr>
      <td class=header>Notice of Incurred of $1,000,000 or greater for Claim <%= TransactionSet.Claim.ClaimNumber %></td>
    </tr>
    <tr>
      <td><br></td>
    </tr>
   </table>
			
    <table>
      <tr>
        <td class=label>To:</td>
	<td class=value><%= To %></td>
      </tr>
       <tr>
        <td class=label>Cc:</td>
	<td class=value><%= Cc %></td>
      </tr>
      <tr>
	<td class=label>From:</td>
	<td class=value><%= FeatureAdjuster %></td>
      </tr>
    </table>
					
    <p class=value>This notification is to advise you the incurred on this file has reached $1,000,000 or higher:<br>				
    <table>
      <tr>
        <td class=label>Claim Number:</td>
        <td class=value><%= TransactionSet.Claim.ClaimNumber %></td>
      </tr>
      <tr>
	<td class=label>Insured Name:</td>
	  <td class=value><%= TransactionSet.Claim.Insured %></td>
	</tr>
      </tr>
      <tr>
	<td class=label>Total Incurred Amount:</td> 
	<td class=value><%= gw.api.util.StringUtil.formatNumber(TotalIncurredNet, "$#,##0.00") %></td>
      </tr>
      <tr>
        <td class=label>Business Unit:</td>
	<td class=value><%= busUnit %></td>
      </tr>		
    </table> 
    <p class=value>Please contact the adjuster, <%= FeatureAdjuster %>, if you have any further questions.</p>
  </body>
</html>