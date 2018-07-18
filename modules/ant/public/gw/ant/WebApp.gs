package gw.ant

uses java.util.Map
uses com.guidewire.ant.module.ModulePropertyFileUtil

class WebApp extends Program
{
  static property get make() : WebApp {
    return new WebApp(ScriptEnv.get().App)
  }
  private static var _stopKey = "gwdev"

  static function stop() {
    var prog = new Program( "com.guidewire.commons.jetty.GWServerJettyServerStopMain", ScriptEnv.get().getModulesNode(ScriptEnv.get().App).Target )
    prog.addArg( "-stopPort " + ModulePropertyFileUtil.getTopmostJettyProperty( "port.stop" ) )
    prog.addArg( "-stopKey " + _stopKey )
    prog.run()                           
  }

  static function dropDb() {
    var xx = ScriptEnv.get().App
    for (arg in {"", "-test", "-archive"}) {
      var prog = new Program( "com.guidewire.testharness.db.DBResetTool", ScriptEnv.get().getModulesNode(xx).Target )
      prog.UseTargetModulesInGpath = true
      prog.addArg("-modulesFile " + ScriptEnv.get().getModulesFile(xx))
      prog.addArg("-recreatedb_no_upgrade")
      prog.addArg(arg)

      var env = ScriptEnv.get().Project.getProperty("env")
      if (env != null) {
        prog.addJvmArg("-Dgw.${xx}.env=${env}")
      }

      prog.run()
    }
  }

  private enum Debug {
    SHMEM,
    SOCKET,
    NONE
  }

  var _debugPort : int
  var _debug = Debug.NONE
  var _suspend = false
  var _test = false

  construct(xx : String)
  {
    super( "com.guidewire.commons.jetty.GWServerJettyServerMain", ScriptEnv.get().getModulesNode(xx).Target )

    addJvmArg( "-ea" )
    addJvmArg( "-Dgw.server.mode=dev" )
    var env = ScriptEnv.get().Project.getProperty("env")
    if (env != null) {
      addJvmArg("-Dgw.${xx}.env=${env}")
    }

    UseTargetModulesInGpath = true
    addArg( "-appName " + xx )
    addArg( "-stopKey " + _stopKey )
    addArg( "-modulesFile " + ScriptEnv.get().getModulesFile(xx) )

    addArg( "-port " + ModulePropertyFileUtil.getTopmostJettyProperty("port.url") )
    addArg( "-stopPort " + ModulePropertyFileUtil.getTopmostJettyProperty( "port.stop" ) )
    addPassThruProp( "project.targetModules", "gw.project.targetModules")
    _debugPort = ModulePropertyFileUtil.getTopmostJettyProperty( "port.debug" ) as int
  }

  function debugShmem() : WebApp {
    _debug = Debug.SHMEM
    return this
  }

  function debugSocket() : WebApp {
    _debug = Debug.SOCKET
    return this
  }

  function suspend() : WebApp {
    _suspend = true
    return this
  }

  function test() : WebApp {
    _test = true
    return this
  }

  function start() {
    var debugArg : String
    switch (_debug) {
      case Debug.SHMEM :
        addJvmArg( "-Xdebug" )
        debugArg = "-Xrunjdwp:transport=dt_shmem,address=javadebug${_debugPort},server=y"
        break
      case Debug.SOCKET :
        debugArg = "-Xrunjdwp:transport=dt_socket,address=${_debugPort},server=y"
        break
    }
    if (debugArg != null) {
      addJvmArg( "-Xdebug" )
      addJvmArg( debugArg + ",suspend=" + (_suspend ? "y" : "n") )
    }
    if (_test) {
      addJvmArg( "-Dserver.runlevel=1" )
    }

	addJvmArg( "-Xdebug -Xnoagent -Xrunjdwp:transport=dt_socket,address=5005,server=y,suspend=n " )

    run()
  }
}
