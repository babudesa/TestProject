package gw.ant

uses com.guidewire.ant.module.BuildPath
uses com.guidewire.modules.ConfigFileAccess
uses com.guidewire.ant.module.ModulePropertyFileUtil
uses gw.ant.ScriptEnv
uses gw.ant.wrappers.Java
uses java.io.File
uses java.util.ArrayList
uses java.util.Map
uses org.apache.tools.ant.types.Path
uses org.apache.tools.ant.types.PropertySet

class Program
{
  var _mainClass : String
  var _targetModules : String
  var _mainArgs : List<String>
  var _failOnError : boolean as FailOnError
  var _fork : boolean as Fork
  var _spawn : boolean as Spawn
  var _dir : File as Dir
  var _initHeap : int
  var _maxHeap : int
  var _maxPerm : int
  var _cpath : Path as CPath
  var _additionalJvmArgs : List<String>

  /**
   * If ConfigFileAccess gets initialized in this program, we can either read
   * in the target modules from the modules.xml file, or from
   * a JVM system property.  A dev server or Studio should do the former,
   * while many tools should do the latter.  This value defaults to false, in
   * favor of reading in the target modules from the JVM system property.
   */
  var _useTargetModulesInGpath : boolean as UseTargetModulesInGpath

  construct(mainClass : String, targetModules : String)
  {
    _mainClass = mainClass
    _targetModules = targetModules
    _mainArgs = new ArrayList<String>()
    _additionalJvmArgs = new ArrayList<String>()
    _failOnError = true
    _fork = true
    _spawn = false
    _dir = ScriptEnv.get().RootDir
    _useTargetModulesInGpath = false
    _cpath = BuildPath.forTarget( targetModules, false )

    _initHeap = getDominantMemorySetting("xms", 32)
    _maxHeap = getDominantMemorySetting("xmx", 128)
    _maxPerm = getDominantMemorySetting("maxperm", 64)
  }

  final function getDominantMemorySetting(key : String, defaultValue: int) : int
  {
    var val = ModulePropertyFileUtil.getTopmostMemoryProperty("${_mainClass}.${key}")
    if (val == null) {
      val = ModulePropertyFileUtil.getTopmostMemoryProperty("default.${key}")
    }
    if (val == null) {
      val = defaultValue
    }
    return val
  }

  final function addArg(arg : String)
  {
    _mainArgs.add(arg)
  }

  final function addPassThruProp(inPropName : String, outPropName : String)
  {
    var propValue = ScriptEnv.get().Project.getProperty(inPropName)
    if (propValue != null) {
      addJvmArg("-D${outPropName}=${propValue}")
    }
  }

  final function addJvmArg(arg : String)
  {
    _additionalJvmArgs.add(arg)
  }

  function run()
  {
    var java = new Java() { :ClassName = _mainClass, :Dir = Dir, :FailOnError = FailOnError, :Fork = Fork, :Spawn = Spawn,
                            :Cpath = CPath }

    var propSet = new PropertySet()
    var propRef = new PropertySet.PropertyRef()
    propRef.setBuiltin(new PropertySet.BuiltinPropertySetName() { :Value = "commandline" } )
    propSet.addPropertyref(propRef)
    java.addSyspropertyset(propSet)

    java.addArgs( _mainArgs )

    java.addJvmArg( "-Xms${_initHeap}m" )
    java.addJvmArg( "-Xmx${_maxHeap}m" )
    java.addJvmArg( "-XX:MaxPermSize=${_maxPerm}m" )
    if ( !UseTargetModulesInGpath ) {
      java.addJvmArg( "-D" + ConfigFileAccess.SYSTEM_PROP_TARGET_MODULES + "=" + _targetModules )
    }
    java.addJvmArgs( _additionalJvmArgs )

    print("Invoking main class: ${_mainClass} with memory parameters \"-Xms${_initHeap}m -Xmx${_maxHeap}m -XX:MaxPermSize=${_maxPerm}m\"")
    java.execute()
  }
}
