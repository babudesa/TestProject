<%@ params(r : Role) %>
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
			var privChgArray=r.privileges*.changed
			var privChanged:boolean=false;
			for(priv in privChgArray){
				if(priv){
					privChanged=true;
					break;
				}
			}
			for(field in r.changedFields){
				var originalValue=r.getOriginalValue(field);
				var newValue=r.getFieldValue(field);
				if(originalValue typeis RolePrivilege[] and !privChanged){
					var oldPriv:String="";
					var newPriv:String="";
					for(oldVal in originalValue as RolePrivilege[]){
						oldPriv+=oldVal.Permission.DisplayName+"<br/><br/>"
					}
					for(newVal in newValue as RolePrivilege[]){
						newPriv+=newVal.Permission.DisplayName+"<br/><br/>"
					}
					fieldValue += "<tr><td>"+field+"</td><td>"+oldPriv+"</td><td>"+newPriv+"</td></tr>"

				}
				else{
					fieldValue += "<tr><td>"+field+"</td><td>"+originalValue+"</td><td>"+newValue+"</td></tr>"
				}
			}
			if(privChanged){
				var newValue=r.privileges;

				var oldPriv:String="";
				var newPriv:String="";
				for(newVal in newValue as RolePrivilege[]){
					newPriv+=newVal.Permission.DisplayName+"<br/><br/>"
					oldPriv+=(newVal.originalVersion as RolePrivilege).Permission.DisplayName+"<br/><br/>"
				}
				fieldValue += "<tr><td>"+"Role Privilege"+"</td><td>"+oldPriv+"</td><td>"+newPriv+"</td></tr>"

			}
		%>
		<b>Update User:</b> <%= r.updateuser %> <br/>
		<b>Logged In User:</b> <%=gw.plugin.util.CurrentUserUtil.getCurrentUser().User %><br/>
		<b>Fields changed:</b> 
		<table border="1" width="50%">
		<%=fieldValue%>
		</table>
		
		
		
		
	</body>
</html>