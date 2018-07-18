package gw.ant

uses com.guidewire.modules.ModulesNode
uses com.guidewire.modules.Module
uses gw.ant.ScriptEnv
uses gw.ant.wrappers.Delete
uses gw.ant.wrappers.Expand
uses gw.ant.wrappers.Zip
uses java.io.File

class WarBuilder {

  var _xx : String
  var _warName : String
  var _targetModules : String
  var _finalTargetModules : String
  var _ops : List<block(warSetupDir : File)> = {}
  var _destdir : File

  construct(xx : String) {
    _xx = xx
    withWarName(xx + ".war")
    withDestDir(ScriptEnv.get().BuildDir)
  }

  function withWarName(name : String) : WarBuilder {
    _warName = name
    return this
  }

  function withTargetModules(targetModules : String) : WarBuilder {
    _targetModules = targetModules
    if (_finalTargetModules == null) _finalTargetModules = targetModules
    return this
  }

  function withFinalTargetModules(finalTargetModules : String) : WarBuilder {
    _finalTargetModules = finalTargetModules
    return this
  }

  function withOp(op : block(warSetupDir : File)) : WarBuilder {
    _ops.add(op)
    return this
  }

  function withDestDir(destDir : File) : WarBuilder {
    _destDir = destDir
    return this
  }

  function withTestClassesExploded() : WarBuilder {
    return withOp(\ warSetupDir -> {
      var webInfClassesDir = warSetupDir.file("WEB-INF/classes")
      for (testJar in warSetupDir.file("WEB-INF/lib").listFiles(\ jar -> jar.File and jar.Name.matches("gw-.*-test\\.jar"))) {
        webInfClassesDir.mkdirs()
        new Expand(testJar, webInfClassesDir).execute()
        testJar.delete()
      }
    })
  }

  function buildAsDirectory() : File {
    var warSetupDir = ScriptEnv.get().BuildDir.file("${_xx}/war")
    Delete.dir(warSetupDir)

    Deploy.full(warSetupDir, _targetModules, _xx)

    var modulesNode = new ModulesNode() {
      :Product = _xx,
      :LocalServletRoot = "..",
      :Target = _finalTargetModules
    }
    for ( module in ScriptEnv.get().ModuleGraph.buildModuleList( _targetModules ) ) {
      modulesNode.addModule( module.Node )
    }
    modulesNode.writeTo( warSetupDir.file( "modules/modules.xml" ) )

    for (op in _ops) {
      op(warSetupDir)
    }

    return warSetupDir
  }

  function build() : File {
    var war = _destDir.file(_warName)

    var warSetupDir = buildAsDirectory()
    new Zip(war, warSetupDir).execute()

    return war
  }
}
