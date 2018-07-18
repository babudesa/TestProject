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
	      <td class="header">ClaimCenter Message Queue ( ${messageQueueName} ) Suspended</td>
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
	
	<p class="value">The ${messageQueueName} Message Queue has suspended.  Action is required. All messages are currently being held in the queue.
	

	</body>
</html>
