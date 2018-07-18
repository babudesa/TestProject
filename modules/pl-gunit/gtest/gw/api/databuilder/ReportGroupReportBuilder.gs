package gw.api.databuilder

/**
 * A builder for {@link ReportGroupReport}
 * 
 * @author paulyoung
 */
class ReportGroupReportBuilder extends DataBuilder<ReportGroupReport, ReportGroupReportBuilder>{

  construct() {
    super(entity.ReportGroupReport)
  }
  
  function withReport(rep : SREEReport) : ReportGroupReportBuilder {
    set( entity.ReportGroupReport.Type.TypeInfo.getProperty("SREEReport"), rep)
    return this
  }
  
  function withReportByBuilder(rep : SREEReportBuilder) : ReportGroupReportBuilder {
    set( entity.ReportGroupReport.Type.TypeInfo.getProperty("SREEReport"), rep)
    return this
  }
    
  function onReportGroup(grp : ReportGroup) : ReportGroupReportBuilder {
    set( entity.ReportGroupReport.Type.TypeInfo.getProperty("ReportGroup"), grp)
    return this
  }
  
  function onReportGroupByBuilder(grp : ReportGroupBuilder) : ReportGroupReportBuilder {
    set( entity.ReportGroupReport.Type.TypeInfo.getProperty("ReportGroup"), grp)
    return this
  }
}
