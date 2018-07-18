package gw.ant

uses java.io.File

class ConfigUpgrade {

  static function upgrade(priorConfig : File, activeConfig : File) {
    activeConfig.mkdirs()
    var xx = ScriptEnv.get().App
    var prog = new Program("com.guidewire.tools.upgrade2.ConfigUpgraderMain", "${xx}-tools")
    prog.addArg("-appName ${xx}")
    prog.addArg("-inputConfig \"${priorConfig.Path}\"")
    prog.addArg("-activeConfig \"${activeConfig.Path}\"")
    prog.addArg("-targetConfig \"${ScriptEnv.get().RootDir}\"")
    if (ScriptEnv.get().Project.getProperty("upgrader.interactive") == "true") {
      prog.addArg("-interactive")
    }
    prog.run()
  }

  static function merge(activeConfig : File) {
    var xx = ScriptEnv.get().App
    var editorTool = upgraderProperty("upgrader.editor.tool")
    var diffTool = upgraderProperty("upgrader.diff.tool")
    var mergeTool = upgraderProperty("upgrader.merge.tool")
    var mergeToolArgOrder = upgraderProperty("upgrader.merge.tool.arg.order")
    var excludePattern = ScriptEnv.get().Project.getProperty("exclude.pattern")

    var prog = new Program("com.guidewire.tools.upgrade2.merge.app.ConfigMergeApp", "${xx}-tools")
    prog.addArg("-appName ${xx}")
    prog.addArg("-activeConfig \"${activeConfig.Path}\"")
    prog.addArg("-targetConfig \"${ScriptEnv.get().RootDir}\"")
    prog.addArg("-editorTool \"${editorTool}\"")
    prog.addArg("-diffTool \"${diffTool}\"")
    prog.addArg("-mergeTool \"${mergeTool}\"")
    prog.addArg("-mergeToolArgOrder \"${mergeToolArgOrder}\"")
    if (excludePattern != null) {
      prog.addArg("-excludePattern \"${excludePattern}\"")
    }
    prog.run()
  }

  private static function upgraderProperty(name : String) : String {
    if (ScriptEnv.get().Project.getProperty(name) != null) {
      var propertyValue = ScriptEnv.get().Project.getProperty(name)
      if (propertyValue.startsWith("\"") and propertyValue.endsWith("\"")) {
        propertyValue = propertyValue.substring(1, propertyValue.length - 1)
      }
      return propertyValue
    }
    else {
      throw "upgrader property \"${name}\" not found (you should specify it in upgrade.properties)"
    }
  }

}
