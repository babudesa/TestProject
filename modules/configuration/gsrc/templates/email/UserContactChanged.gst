<%@ params(uc : UserContact) %>
<html>
	<head>
		<style type="text/css">
			td.header {font-family:verdana;font-size:12;font-weight:bold}
			td.label {font-family:verdana;font-size:10;font-weight:bold;text-align:left}
			td.value {font-family:verdana;font-size:10;text-align:left}
		</style>
	</head>
	<body> 
		<% 
			var fieldValue:String="<tr><th>Field Name</th><th>Original Value</th><th>New Value</th></tr>";
			var addyChgArray=uc.alladdresses*.changed
			var addyChanged:boolean=false;
			for(addy in addyChgArray){
				if(addy){
					addyChanged=true;
					break;
				}
			}
			for(field in uc.changedFields){
				var originalValue=uc.getOriginalValue(field);
				var newValue=uc.getFieldValue(field);
				if(originalValue typeis Address[]){
					var oldAddy:String="";
					var newAddy:String="";
					for(oldVal in originalValue as Address[]){
						oldAddy+=oldVal+"<br/><br/>"
					}
					for(newVal in newValue as Address[]){
						newAddy+=newVal+"<br/><br/>"
					}
					fieldValue += "<tr><td>"+field+"</td><td>"+oldAddy+"</td><td>"+newAddy+"</td></tr>"
				}
				else{
					fieldValue += "<tr><td>"+field+"</td><td>"+originalValue+"</td><td>"+newValue+"</td></tr>"
				}
			}
			if(addyChanged){
				var newValue=uc.AllAddresses;

				var oldAddy:String="";
				var newAddy:String="";
				for(newVal in newValue as Address[]){
					newAddy+=newVal+"<br/><br/>"
					oldAddy+=newVal.originalVersion+"<br/><br/>"
				}
				fieldValue += "<tr><td>"+"Address"+"</td><td>"+oldAddy+"</td><td>"+newAddy+"</td></tr>"

			}
		%>
		<b>Update User:</b> <%= uc.updateuser %> <br/>
		<b>Logged In User:</b> <%=gw.plugin.util.CurrentUserUtil.getCurrentUser().User %><br/>
		<b>User Changed:</b> <%= uc.lastName + ", " + uc.firstName %><br/>
		<b>New User?</b> <%= uc.new %> <br/>
		<b>Fields changed:</b> 
		<table border="1" width="50%">
		<%=fieldValue%>
		</table>
		
		
		
		
	</body>
</html>