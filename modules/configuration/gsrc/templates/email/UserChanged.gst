<%@ params(u : User) %>
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
			for(field in u.changedFields){
				var originalValue=u.getOriginalValue(field);
				var newValue=u.getFieldValue(field);
				if(originalValue typeis UserRole[]){
					var oldRoles:String="";
					var newRoles:String="";
					for(oldVal in originalValue as UserRole[]){
						oldRoles+=oldVal.role.displayname+"<br/>"
					}
					for(newVal in newValue as UserRole[]){
						newRoles+=newVal.role.displayname+"<br/>"
					}
					fieldValue += "<tr><td>"+field+"</td><td>"+oldRoles+"</td><td>"+newRoles+"</td></tr>"
				}
				else{
					fieldValue += "<tr><td>"+field+"</td><td>"+originalValue+"</td><td>"+newValue+"</td></tr>"
				}
			}
		%>
		<b>Update User:</b> <%= u.updateuser %> <br/>
		<b>Logged In User:</b> <%=gw.plugin.util.CurrentUserUtil.getCurrentUser().User %><br/>
		<b>User Changed:</b> <%= u.contact.lastName + ", " + u.contact.firstName %><br/>
		<b>New User?</b> <%= u.new %> <br/>
		<b>Fields changed:</b> 
		<table border="1" width="50%">
		<%=fieldValue%>
		</table>
		
		
		
		
	</body>
</html>