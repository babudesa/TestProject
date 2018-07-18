package gw.api.databuilder

class RoleReportPrivilegeBuilder extends DataBuilder<RoleReportPrivilege, RoleReportPrivilegeBuilder>{

  construct() {
    super(RoleReportPrivilege)
  }
  
  function withRole(aRole : Role) : RoleReportPrivilegeBuilder {
    set(RoleReportPrivilege.Type.TypeInfo.getProperty("Role"), aRole)
    return this
  }
  
  function withRoleByBuilder(aRole : RoleBuilder) : RoleReportPrivilegeBuilder {
    set(RoleReportPrivilege.Type.TypeInfo.getProperty("Role"), aRole)
    return this
  }
  
  function withReportGroup(aRepGroup : ReportGroup) : RoleReportPrivilegeBuilder {
    set(RoleReportPrivilege.Type.TypeInfo.getProperty("ReportGroup"), aRepGroup)
    return this
  }
  
  function withReportGroupByBuilder(aRepGroup : ReportGroupBuilder) : RoleReportPrivilegeBuilder {
    set(RoleReportPrivilege.Type.TypeInfo.getProperty("ReportGroup"), aRepGroup)
    return this
  }

}
