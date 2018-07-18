package gw.ant

uses com.guidewire.ant.module.GenerateCSS
uses com.guidewire.ant.module.GenerateJS
uses com.guidewire.modules.Module
uses com.guidewire.modules.ModuleGraph
uses com.guidewire.modules.ModulesNode
uses gw.ant.ScriptEnv
uses gw.ant.wrappers.Copy
uses gw.ant.wrappers.Mkdir
uses java.io.File

class Deploy {

  static property get MODULE_PARTS() : List<String> {
    return {
      "config/**",
      "etc/**",
      "gsrc/**",
      "gtest/**",
      "gx/**",
      "plugins/**",
      "sampledata/**",
      "xsd/**",
      "gwmodule.xml"
    }
  }

  static function simple() {
    simple(ScriptEnv.get().RootDir)
  }

  static function simple(rootDir : File) {
    for (xx in ScriptEnv.get().Apps) {
      var modulesNode = ScriptEnv.get().getModulesNode(rootDir, xx)
      var destDir = modulesNode.ModulesFile.parent().dir(modulesNode.LocalServletRoot).toJavaFile()
      deployImpl(destDir, modulesNode.toModuleGraph(), modulesNode.Target, xx, true)
    }
  }

  static function full(destDir : File, targetModules : String, xx : String) {
    deployImpl(destDir, ScriptEnv.get().ModuleGraph, targetModules, xx, false)
  }

  private static function deployImpl(destDir : File, moduleGraph : ModuleGraph, targetModules : String, xx : String, simple : boolean) {
    Mkdir.dir(destDir)

    var modules = moduleGraph.buildModuleList(targetModules).reverse()
    for (module in modules) {
      var webresourcesDir = module.Dir.file("webresources")
      if (webresourcesDir.exists()) {
        new Copy() { :FileSet = webresourcesDir.fileSet(null, "*/css/**/*,javascript/global/**/*"),
                     :ToDir = destDir.file("resources"), :Overwrite = true }
        .execute()
      }
      var deployDir = module.Dir.file("deploy")
      if (deployDir.exists()) {
        new Copy() { :FileSet = deployDir.fileSet(), :ToDir = destDir, :Overwrite = true }
        .execute()
      }
      if (!simple) {
        maybeCopyModuleParts(module, destDir.file("modules/${module.Name}"))

        var webInfLibDir = destDir.file("WEB-INF/lib")
        Mkdir.dir(webInfLibDir)

        copyJarsAndDll(module.Dir.file("dist"), webInfLibDir)

        for (jarDep in module.JarDependencies) {
          try {
            var depModule = ScriptEnv.get().ModuleGraph.get(jarDep.ParentModule)

            var src = new File(depModule.Dir, jarDep.RelPath)
            copyJarsAndDll(src, webInfLibDir)
          }
          catch (e) {
            // TODO - blc - hack for war build to allow unavailable graph node
            if (!e.Message.matches("^could not find graph node for id \"px-magic\"")) {
              throw e
            }
          }
        }
      }
    }
    new GenerateCSS(ScriptEnv.get().Project, destDir).gen(modules)
    new GenerateJS(ScriptEnv.get().Project, destDir).gen(modules)

    if ("true" == ScriptEnv.get().Project.getProperty("config.war.dictionary")) {
      destDir.file("dictionary").mkdir()
      ConfigTools.buildDictionary(destDir.file("dictionary"), "${xx}-tools,${targetModules}")
    }
  }

  private static function maybeCopyModuleParts(module : Module, moduleDestDir : File) {
    if (module.Dir.exists()) {
      var fileSet = module.Dir.fileSet(MODULE_PARTS.join(","), null)
      if (fileSet.size() > 0) {
        Mkdir.dir(moduleDestDir)
        new Copy() { :FileSet = fileSet, :ToDir = moduleDestDir }
        .execute()
      }
    }
  }

  private static function copyJarsAndDll(src : File, destDir : File) {
    if (src.isFile()) {
      new Copy() { :FileSet = src.ParentFile.fileSet(src.Name, "servlet-api.jar,jsp-api.jar"),
                   :ToDir = destDir }
      .execute()
    }
    else if (src.isDirectory()) {
      new Copy() { :FileSet = src.fileSet("*.jar,*.dll", "servlet-api.jar,jsp-api.jar"),
                   :ToDir = destDir }
      .execute()
    }
  }
}
