package gw.ant

uses java.io.File

class Studio
{
  function run() {
    var xx = ScriptEnv.get().App
    runImpl(ScriptEnv.get().RootDir.file( "studio" ), ScriptEnv.get().getModulesNode(xx).Target + ",${xx}-studio", "")
  }

  function verifyTypes() {
    var xx = ScriptEnv.get().App
    verifyTypesImpl(ScriptEnv.get().getModulesNode(xx).Target)
  }

  function verifyTypes(targetModules : String) {
    verifyTypesImpl(targetModules)
  }

  protected function runImpl(studioDir : File, targetModules : String, args : String) {
    var prog = new Program("com.guidewire.studio.main.Main", targetModules)
    prog.UseTargetModulesInGpath = true
    prog.addArg("-modulesFile " + ScriptEnv.get().getModulesFile(ScriptEnv.get().App))
    prog.addArg("-studioDir " + studioDir)
    prog.addArg(args)
    prog.addJvmArg("-Dsun.java2d.noddraw=true")
	prog.addJvmArg("-XX:+UseCompressedOops")
    prog.addJvmArg("-Ddev.home=\"${ScriptEnv.get().RootDir}\"")
    prog.addPassThruProp( "project.targetModules", "gw.project.targetModules")
    prog.run()
  }

  protected function verifyTypesImpl(targetModules : String) {
    var prog = new Program("com.guidewire.tools.typesystem.TypeVerifierMain", targetModules)
    prog.addArg("-modulesFile " + ScriptEnv.get().ModulesFile)
    prog.run()
  }
}
