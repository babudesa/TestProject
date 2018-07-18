<!DOCTYPE html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8">		
	    <style type="text/css">
	      td.header {font-family:verdana;font-size:12;font-weight:bold}
	      td.label {font-family:verdana;font-size:10;font-weight:bold;text-align:left}
	      td.value {font-family:verdana;font-size:10;text-align:left}
	      p.value {font-family:verdana;font-size:14;font-weight:bold;text-align:left}
		  ul.value {font-family:verdana;font-size:10;text-align:left}
		  td.address {padding-left:50px;font-family:verdana;font-size:10;text-align:left}
	    </style>	
	</head>
	
  	<body> 	
  	<table>
	    <tr>
	      <td class="header">ClaimCenter Message Queue Error ( ${queueName} )</td>
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
			<td class="label">From:</td>
			<td class="value">${from}</td>
	    </tr>
    </table>
	</br>
	<p class="value">An error has occurred in the ${queueName} Message Queue. Action is required. Details are included below:
	</br>
	<table>
	  <tr>
        <td class=label>Claim</td>
        <td class=value>${messageClaim}</td>
      </tr>
      <tr>
        <td class=label>Adjustor</td>
        <td class=value>${messageAdjustor}</td>
      </tr>
      <tr>
        <td class=label>Business Unit</td>
        <td class=value>${messageBusinessUnit}</td>
      </tr>
	  <tr>
        <td class=label>EventName</td>
        <td class=value>${messageEventName}</td>
      </tr>
	  <tr>
        <td class=label>CreationTime</td>
        <td class=value>${messageCreationTime}</td>
      </tr>
	  <tr>
        <td class=label>SendTime</td>
        <td class=value>${messageSendTime}</td>
      </tr>
      <tr>
        <td class=label>User</td>
        <td class=value>${messageUser}</td>
      </tr>
	  <tr>
        <td class=label>PrimaryObject</td>
        <td class=value>${messagePrimaryObject}</td>
      </tr>
      <tr>
        <td class=label>Retryable?</td>
        <td class=value>${messageRetryable}</td>
      </tr>
	  <tr>
        <td class=label>RetryCount</td>
        <td class=value>${messageRetryCount}</td>
      </tr>
      <tr>
        <td class=label>DestinationID</td>
        <td class=value>${messageDestinationID}</td>
      </tr>
      <tr>
        <td class=label>ID</td>
        <td class=value>${messageID}</td>
      </tr>      
	  <tr>
        <td class=label>PublicID</td>
        <td class=value>${messagePublicID}</td>
      </tr>
      <tr>
        <td class=label>MessageRoot</td>
        <td class=value>${messageRoot}</td>
      </tr>
	  </br>
      <tr>
        <td class=label>Payload</td>
        <td class=value>${messagePayload}</td>
      </tr>
	</table> 

	</body>
</html>
