package gw.command

uses java.io.File
uses java.lang.StringBuffer
uses java.lang.System
uses gw.api.webservice.importTools.ImportResults
uses gw.webservice.importTools.IImportToolsAPI
uses gw.sampledata.SampleDataGroup

class Import extends BaseCommand {

  construct() {
  }

  function sampleAdminData() {
    SampleDataGroup.Admin.load()
  }

  function fromDemoSampleData() {
    SampleDataGroup.Demo.load()
  }

  function fromTestSampleData() {
    SampleDataGroup.Test.load()
  }

  function fromMinimalTestData() {
    SampleDataGroup.MinimalTest.load()
  }

  function fromExchangeRateData() {
    SampleDataGroup.ExchangeRates.load()
  }

  function withDefault() {
    fromDemoSampleData()
  }

  private function printResults(results : ImportResults, duration : long) {
    print("")
     if (!results.isOk()) {
      print("Import failed; the following errors occurred:")
      for (error in results.getErrorLog()) {
        print(error)
      }
    } else {
      print("Import succeeded")
      print("Total time: " + formatDuration(duration))
      print("Parse time: " + formatDuration(results.getParseTime()))
      print("Write time: " + formatDuration(results.getWriteTime()))
      print("")
      if (results.getErrorLog() != null && results.getErrorLog().length > 0) {
        print("The following errors occurred:")
        for (error in results.getErrorLog()) {
          print(error)
        }
        print("")
      } else {
        print("No errors ocurred.")
      }
      print("The following entities were imported:")
      for (s in results.getSummaries()) {
        print(((s.getType() == 0) ? "Inserted" : "Updated") + " " + s.getCount() + " " + s.getEntityName())
      }
    }
    print("")
  }

  /**
    * @param millis A duration of time in milli-seconds
    * @return A nice description of the duration in day, hours, minutes, and
    *     seconds
    */
  private function formatDuration(millis : long) : String {
    if (millis < 0) {
      millis = -millis
    }
    var secs = (millis / 1000) as int
    var mins = (secs / 60) % 60
    var hrs = (secs / 3600) % 24
    var days = secs / (3600 * 24)
    secs = secs % 60
    var buf = new StringBuffer()
    if (days > 0) {
      buf.append(days).append((days > 1 ? " days " : " day "))
    }
    if (hrs > 0) {
      buf.append(hrs).append((hrs > 1 ? " hours " : " hour "))
    }
    if (mins > 0) {
      buf.append(mins).append(mins > 1 ? " minutes " : " minute ")
    }
    buf.append(secs).append((secs != 1 ? " seconds" : " second"))
    if (millis < 1000) {
      buf.append(" [").append(millis).append("ms]")
    }
    return buf.toString()
  }
}
