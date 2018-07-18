<%@ params(g : Group) %>
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
			for(field in g.changedFields){
				var originalValue=g.getOriginalValue(field);
				var newValue=g.getFieldValue(field);
				if(originalValue typeis GroupUser[]){
					var oldUsers:String="";
					var newUsers:String="";
					for(oldVal in originalValue as GroupUser[]){
						oldUsers+=oldVal.User.Contact+"<br/>"
					}
					for(newVal in newValue as GroupUser[]){
						newUsers+=newVal.User.Contact+"<br/>"
					}
					fieldValue += "<tr><td>"+field+"</td><td>"+oldUsers+"</td><td>"+newUsers+"</td></tr>"
				}
				else{
					fieldValue += "<tr><td>"+field+"</td><td>"+originalValue+"</td><td>"+newValue+"</td></tr>"
				}
			}
		%>
		<b>Update User:</b> <%= g.updateuser %> <br/>
		<b>Logged In User:</b> <%=gw.plugin.util.CurrentUserUtil.getCurrentUser().User %><br/>
		<b>Group Changed:</b> <%= g.name %><br/>
		<b>New Group?</b> <%= g.new %> <br/>
		<b>Fields changed:</b> 
		<table border="1" width="50%">
		<%=fieldValue%>
		</table>
		
		
		
		
	</body>
</html>