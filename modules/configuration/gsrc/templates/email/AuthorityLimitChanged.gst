<%@ params(a : AuthorityLimitProfile, u : User) %>
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
			for(field in a.changedFields){
				var originalValue=a.getOriginalValue(field);
				var newValue=a.getFieldValue(field);
				if(originalValue typeis AuthorityLimit[]){
					var oldLimits:String="";
					var newLimits:String="";
					for(oldVal in originalValue as AuthorityLimit[]){
						oldLimits+=oldVal.limittype.displayname+ " - "+ oldVal.costType.displayname + " - "+ oldVal.limitAmount+ "<br/><br/>"
					}
					for(newVal in newValue as AuthorityLimit[]){
						newLimits+=newVal.limittype.displayname+ " - "+ newVal.costType.displayname + " - "+ newVal.limitAmount+ "<br/><br/>"
					}
					fieldValue += "<tr><td>"+field+"</td><td>"+oldLimits+"</td><td>"+newLimits+"</td></tr>"
				}
				else{
					fieldValue += "<tr><td>"+field+"</td><td>"+originalValue+"</td><td>"+newValue+"</td></tr>"
				}
			}
		%>
		<b>Update User:</b> <%= u.updateuser %> <br/>
		<b>User Changed:</b> <%= u.contact.lastName + ", " + u.contact.firstName %><br/>
		<b>Logged In User:</b> <%=gw.plugin.util.CurrentUserUtil.getCurrentUser().User %><br/>
		<b>New User?</b> <%= u.new %> <br/>
		<b>Fields changed:</b> 
		<table border="1" width="100%">
		<%=fieldValue%>
		</table>
		
		
		
		
	</body>
</html>