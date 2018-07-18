package gw.api.databuilder


/**
 * A builder for {@link ReportGroup}
 * 
 * @author paulyoung
 */
class ReportGroupBuilder extends DataBuilder<ReportGroup, ReportGroupBuilder> {
  
  construct(){
    super(ReportGroup)
  }
  
  function withName( aName : String ) : ReportGroupBuilder {
    set( ReportGroup.Type.TypeInfo.getProperty( "Name" ), aName )
    return this
  }
  
  function withReport(sreeRep : SREEReport) : ReportGroupBuilder {
    addArrayElement(ReportGroup.Type.TypeInfo.getProperty( "Reports" ), new ReportGroupReportBuilder().withReport(sreeRep))
    return this 
  }
  
  function withReportByBuilder(sreeRep : SREEReportBuilder) : ReportGroupBuilder {
    addArrayElement(ReportGroup.Type.TypeInfo.getProperty( "Reports" ), new ReportGroupReportBuilder().withReportByBuilder(sreeRep))
    return this 
  }
  
  function withRole(aRole : Role) : ReportGroupBuilder {
    addArrayElement(ReportGroup.Type.TypeInfo.getProperty( "Roles" ), new RoleReportPrivilegeBuilder().withRole(aRole))
    return this 
  }
  
  function withRoleByBuilder(aRole : RoleBuilder) : ReportGroupBuilder {
    addArrayElement(ReportGroup.Type.TypeInfo.getProperty( "Roles" ), new RoleReportPrivilegeBuilder().withRoleByBuilder(aRole))
    return this 
  }
  
  function visibleToUser( aUser : User ) : ReportGroupBuilder {
    var theRole : entity.Role = null
    var usrRole = aUser.Roles.first()
    if (usrRole == null){
      theRole = new RoleBuilder().withPermission(SystemPermissionType.TC_REPORTING_VIEW).create()
    } else {
      theRole = usrRole.Role 
    }
    return withRole(theRole)
  }
}
