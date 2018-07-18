<!DOCTYPE html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8">		
	    <style type="text/css">
	      td.header {font-family:verdana;font-size:12;font-weight:bold}
	      td.label {font-family:verdana;font-size:10;font-weight:bold;text-align:left}
	      td.value {font-family:verdana;font-size:10;text-align:left}
	      p.value {font-family:verdana;font-size:10;font-weight:bold;text-align:left}
		  ul.value {font-family:verdana;font-size:10;text-align:left}
		  td.address {padding-left:50px;font-family:verdana;font-size:10;text-align:left}
	    </style>	
	</head>
	
  	<body> 	
  	<table>
	    <tr>
	      <td class="header">LitAdvisor Matter Failure Notification</td>
	    </tr>
	    <tr>
	      <td><br></td>
	    </tr>
	</table>
				
	<table>
	    <tr>
	        <td class="label">To:</td>
			<td class="value">${to}</td>
	    </tr>
		<tr>
	        <td class="label">CC:</td>
			<td class="value">${cc}</td>
	    </tr>
	    <tr>
			<td class="label">From:</td>
			<td class="value">${from}</td>
	    </tr>
    </table>
  <br> 
  <table>
    <tr>
      <p class="value">${extraErrorMessage}</td>
    </tr>
  </table> 
  <br>
					
    <p class="value">The following Legal Action details did not send/update successfully in LitAdvisor.  
	ClaimCenter Support has been notified and is working on resolving the following issue: 
	
	<ul class="value">
		<li type="disk">${errorMessage}</li>
  	</ul>
	<table>
		<tr>
	    	<td class="address">${addressLine1}${addressLine2}</td>
	  	</tr>
	    <tr>
	    	<td class="address">${addressCityStateZip}</td>
	  	</tr>
	</table>
	<br>

	<table>
		<tr>
	    	<td class="label">Claim Number:</td>
	    	<td class="value">${claimNumber}</td>
	  	</tr>	
	  	<tr>
	    	<td class="label">Legal Action:</td>
	    	<td class="value">${legalAction}</td>
	  	</tr>
	  	<tr>
			<td class="label">Law Firm:</td>
	  		<td class="value">${lawFirm}</td>
	 	</tr>
	  	</tr>
	  	<tr>
	    	<td class="label">Insured Name:</td>
			<td class="value">${insuredName}</td>
	  	</tr>
	  	<tr>
	    	<td class="label">Business Unit:</td>
	    	<td class="value">${businessUnit}</td>
	  	</tr>	
	</table> 

	<p class="value">We will contact you with further instruction or advise the resolution.  If you have any questions, please contact 
	ClaimCenter Support at 513-313-9533 or ClaimCenterSupport@gaig.com.
	
	</body>
</html>
