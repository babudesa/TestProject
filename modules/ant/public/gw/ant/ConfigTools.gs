package gw.ant

uses gw.ant.Program
uses gw.ant.ScriptEnv
uses gw.ant.wrappers.Java
uses java.io.File
uses java.util.Properties
uses java.util.jar.JarFile
uses org.apache.tools.ant.types.Path

class ConfigTools
{
  static function copyStarterConfigResources(targetModules : String)
  {
    var configurationModule = ScriptEnv.get().ModuleGraph.get("configuration")
    var prog = new Program("com.guidewire.tools.config.CopyStarterConfigResourcesTool", targetModules)
    prog.addArg("-modulesFile \"${ScriptEnv.get().ModulesFile}\"")
    prog.addArg("-destModule \"${configurationModule.Dir.Path}\"")
    prog.run()
  }

  static function buildDataMapping(destDir : File, split : boolean, targetModules : String)
  {
    destDir.mkdirs()
    var prog = new Program("com.guidewire.tools.datamapping.DataMappingTool", targetModules)
    prog.addArg("-modulesFile \"${ScriptEnv.get().ModulesFile}\"")
    prog.addArg("-destdir \"" + destDir.Path + "\"")
    prog.addArg("-datamodelfile 'DataMap.csv'")
    prog.addArg("-typelistfile 'TypeListMap.csv'")
    if (split)
    {
      prog.addArg("-split")
    }
    prog.run()

    print("Results in " + destDir)
  }

  static function buildDictionary(destDir : File, targetModules : String)
  {
    var dataDir = destDir.file("data")
    dataDir.mkdirs()
    var prog = new Program("com.guidewire.tools.dictionary.data.DataDictionaryTool", targetModules)
    prog.addArg("-modulesFile \"${ScriptEnv.get().ModulesFile}\"")
    prog.addArg("-destdir \"" + dataDir.Path + "\"")
    prog.addJvmArg("-DtoolName=buildDictionary")
    prog.run()

    var securityDir = destDir.file("security")
    securityDir.mkdirs()
    prog = new Program("com.guidewire.tools.dictionary.security.SecurityDictionaryTool", targetModules)
    prog.addArg("-modulesFile \"${ScriptEnv.get().ModulesFile}\"")
    prog.addArg("-destdir \"" + securityDir.Path + "\"")
    prog.addJvmArg("-DtoolName=securityDictionary")
    prog.run()

    print("Results in " + destDir)
  }

  static function buildGosudoc(destDir : File, targetModules : String)
  {
    var modulesFile = ScriptEnv.get().ModulesFile
    var prog = new Program("com.guidewire.tools.gosudoc.GosuDocMain", targetModules)
    prog.addArg("-modulesFile \"${modulesFile.Path}\"")
    prog.addArg("-destdir \"${destDir.Path}\"")
    var propFile = findTopmostFile("etc/gosudoc.properties", targetModules)
    prog.addArg("-propfile \"${propFile.Path}\"")
    prog.run()
    print("Results in " + destDir)
  }

  static function buildPcfMapping(destDir : File, targetModules : String)
  {
    destDir.mkdirs()
    var prog = new Program("com.guidewire.tools.pcfmapping.PCFMappingWriterMain", targetModules)
    prog.addArg("-modulesFile \"${ScriptEnv.get().ModulesFile.Path}\"")
    prog.addArg("-outdir \"${destDir.Path}\"")
    prog.run()

    print("Results in " + destDir)
  }

  static function buildXsd(destDir : File)
  {
    var prog = new Program("com.guidewire.tools.importschema.XSDGeneratorTool", ScriptEnv.get().App + "-tools")
    prog.addArg("-appName ${ScriptEnv.get().App}")
    prog.addArg("-deployDir \"${destDir.Path}\"")
    prog.addArg("-modulesFile \"${ScriptEnv.get().ModulesFile.Path}\"")
    prog.run()
    print("Results in " + destDir)
  }

  static function buildRuleRepoReport(destDir : File, targetModules : String) {
    destDir.mkdirs()
    var prog = new Program("com.guidewire.tools.rules.RuleRepositoryReportTool", targetModules)
    prog.addArg("-modulesFile \"${ScriptEnv.get().ModulesFile.Path}\"")
    prog.addArg("-destdir \"${destDir.Path}\"")
    prog.run()
    print("Results in " + destDir)
  }

  static function importL10Ns(targetModules : String, importFile : String, importLocale : String)
  {
    var prog = new Program("com.guidewire.tools.locale.L10NImportTool", targetModules)
    prog.addArg("-importFile \"${importFile}\"")
    prog.addArg("-importLocale \"${importLocale}\"")
    prog.addArg("-modulesFile \"${ScriptEnv.get().ModulesFile}\"")
    prog.run()
  }

  static function printProductVersion()
  {
    var xx = ScriptEnv.get().App
    var jar = new JarFile(ScriptEnv.get().ModuleGraph.get(xx).Dir.file("lib/gw-${xx}.jar"))
    using ( var inputStream = jar.getInputStream( jar.getEntry("gw-version.properties") ) )
    {
      var props = new Properties()
      props.load(inputStream)
      var productName = props.getProperty("product.name")
      var productRelease = props.getProperty("product.release")
      var productBuild = props.getProperty("product.build")
      print("${productName} ${productRelease}.${productBuild}")
    }
  }

  private static function findTopmostFile(name : String, targetModules : String) : File {
    for (module in ScriptEnv.get().ModuleGraph.buildModuleList(targetModules)) {
      var f = module.Dir.file(name)
      if (f.exists()) {
        print("Found file ${name} in ${module.Dir}")
        return f
      }
    }
    throw "Could not find file ${name}"
  }
}
