package gw.api.profiler

final class GosuProfilerPageHelper
{
  private construct() {
  }

  static function enableProfilingFor( type : typekey.ProfilerConfig, entryPointName : String) : entity.ProfilerConfig {
    var profilerConfig : entity.ProfilerConfig
    gw.transaction.Transaction.runWithNewBundle( \ bundle -> {
      profilerConfig = com.guidewire.pl.system.profiler.ProfilerConfiguration.getProfilerConfigOrCreateAllOffProfilerConfig( type, entryPointName)
      profilerConfig = bundle.add( profilerConfig )
      profilerConfig.ProfilerEnabled = true
    })
    return profilerConfig
  }
}
