package gw.ant

uses com.guidewire.ant.module.BuildPath
uses com.guidewire.modules.Module
uses gw.ant.util.JavadocUtil
uses gw.ant.wrappers.Copy
uses gw.ant.wrappers.Delete
uses gw.ant.wrappers.Expand
uses gw.ant.wrappers.Mkdir
uses gw.ant.wrappers.Jar
uses gw.ant.wrappers.Javac
uses gw.ant.wrappers.Javadoc
uses gw.ant.wrappers.Zip
uses java.io.File
uses org.apache.tools.ant.types.Path

class JavaToolkit
{

  static function regenJavaApi() {
    var javaApiDir = ScriptEnv.get().RootDir.file("java-api")
    Delete.dir(javaApiDir)
    Mkdir.dir(javaApiDir)

    new Expand(ScriptEnv.get().RootDir.file("java-api.zip"), javaApiDir).execute()
    regenExternalEntities(javaApiDir)
    copyJavaApiJarDependencies(javaApiDir)
  }

  static function regenSoapApi() {
    var soapApiDir = ScriptEnv.get().RootDir.file("soap-api")
    Delete.dir(soapApiDir)
    Mkdir.dir(soapApiDir)

    regenSoap(soapApiDir)
  }

  private static function regenSoap(soapApiDir : File) {
    var xx = ScriptEnv.get().App
    var wsdlDir = genWsdl(xx, "configuration,${xx}-tools")
    var soapLib = genSoapLib(xx, wsdlDir)
    var soapJar = soapLib.buildJar()
    var soapDoc = soapLib.buildJavadoc(
      "Guidewire SOAP API",
      "gw.*, com.guidewire.${xx}.webservices.*, com.guidewire.util.webservices.*",
      "com.guidewire.util.webservices.axis.*",
      \ javadoc -> {
        javadoc.addGroup( "Guidewire SOAP API", "com.guidewire.${xx}.webservices.api" )
        javadoc.addGroup( "Guidewire SOAP Entities", "com.guidewire.${xx}.webservices.entity:com.guidewire.${xx}.webservices.enumeration:com.guidewire.${xx}.webservices.fault" )
        javadoc.addGroup( "Guidewire SOAP Utilities", "com.guidewire.util.webservices" )
      } )
    var soapSrc = soapLib.packageSource()

    Mkdir.dir(soapApiDir.file("wsdl"))
    new Copy() { :FileSet = wsdlDir.fileSet(), :ToDir = soapApiDir.file("wsdl") }.execute()
    Mkdir.dir(soapApiDir.file("lib"))
    new Copy() { :File = soapJar, :ToDir = soapApiDir.file("lib") }.execute()
    new Copy() { :File = soapSrc, :ToDir = soapApiDir.file("lib") }.execute()
    Mkdir.dir(soapApiDir.file("doc/api"))
    new Expand(soapDoc, soapApiDir.file("doc/api")).execute()
    // gw-xx-plugin directory must go along side the api dir under template/toolkit-javadoc/ , for the relative links to work
    new Copy() { :FileSet = ScriptEnv.get().RootDir.file("template/toolkit-javadoc/gw-${xx}-plugin").fileSet(), :ToDir = soapApiDir.file("doc/gw-${xx}-plugin") }.execute()
  }

  static function genWsdl(xx : String, targetModules : String) : File {
    var wsdlDir = ScriptEnv.get().BuildDir.file("${xx}/wsdl")
    wsdlDir.deleteRecursively()
    wsdlDir.mkdirs()

    var prog = new Program("com.guidewire.tools.wsdl.WSDLGenerator", targetModules)
    prog.addArg( "-modulesFile " + ScriptEnv.get().getModulesFile(xx) )
    prog.addArg( "-productName " + xx )
    prog.addArg( "-outputRoot " + wsdlDir )
    prog.run()

    return wsdlDir
  }

  static function genSoapLib(xx : String, wsdlDir : File) : TempModule {
    var soapLibDir = ScriptEnv.get().BuildDir.file("${xx}/soap")

    var module = new TempModule(soapLibDir, "gw-soap-${xx}", BuildPath.forTarget("${xx}-plugin", false))
    Mkdir.dir(module.SrcDir)

    var prog = new Program("com.guidewire.util.webservices.axis.WSDLToJavaGenerator", "${xx}-tools")
    prog.addArg( module.SrcDir.Path )
    prog.addArg( wsdlDir.file("api").Path )
    prog.run()

    return module
  }

  private static function regenExternalEntities(javaApiDir : File) {
    var xx = ScriptEnv.get().App
    var externalEntities = genExternalEntities(xx, "configuration,${xx}-tools")
    var externalEntitiesJar = externalEntities.buildJar()
    var externalEntitiesDoc = externalEntities.buildJavadoc(
      "Guidewire Java API",
      "external.*, com.guidewire.*",
      "com.guidewire.util.webservices.axis.*",
      \ javadoc -> {
        javadoc.addGroup( "Guidewire Plugins", "com.guidewire.${xx}.plugin.*:com.guidewire.pl.plugin:com.guidewire.pl.plugin.*" )
        javadoc.addGroup( "Guidewire Entities", "com.guidewire.${xx}.external.*:com.guidewire.external:com.guidewire.external.*" )
        javadoc.addGroup( "Guidewire SOAP Utilities", "com.guidewire.util.webservices" )
        javadoc.addGroup( "Guidewire Other Utilities", "com.guidewire:com.guidewire.logging:com.guidewire.util:com.guidewire.util.*" )
      } )

    new Copy() { :File = externalEntitiesJar, :ToDir = javaApiDir.file("lib") }.execute()
    Mkdir.dir(javaApiDir.file("doc/api"))
    new Expand(externalEntitiesDoc, javaApiDir.file("doc/api")).execute()
    // gw-xx-plugin directory must go along side the api dir under template/toolkit-javadoc/ , for the relative links to work
    new Copy() { :FileSet = ScriptEnv.get().RootDir.file("template/toolkit-javadoc/gw-${xx}-plugin").fileSet(), :ToDir = javaApiDir.file("doc/gw-${xx}-plugin") }.execute()
  }

  static function genExternalEntities(xx : String, targetModules : String) : TempModule {
    var extEntitiesDir = ScriptEnv.get().BuildDir.file("${xx}/ext-entity")

    var module = new TempModule(extEntitiesDir, "gw-entity-${xx}", BuildPath.forTarget("${xx}-plugin", false))
    Mkdir.dir(module.SrcDir)

    var prog = new Program("com.guidewire.commons.entity.external.ExternalGenerator", targetModules)
    prog.addArg( "-modulesFile " + ScriptEnv.get().getModulesFile(xx) )
    prog.addArg( "-productName " + xx )
    prog.addArg( "-outputRoot " + module.SrcDir )
    prog.run()

    return module
  }

  private static function copyJavaApiJarDependencies(javaApiDir : File) {
    var xx = ScriptEnv.get().App
    var toolkitLibDir = javaApiDir.file("lib")
    Mkdir.dir(toolkitLibDir)
    for (module in ScriptEnv.get().ModuleGraph.buildModuleList("${xx}-plugin")) {
      if (module.Dir.file("lib").exists()) {
        new Copy() { :FileSet = module.Dir.file("lib").fileSet("*.jar", null), :ToDir = toolkitLibDir }.execute()
      }
    }
  }

  static class TempModule {
    var _root : File
    var _namePrefix : String
    var _cpath : Path

    property get SrcDir() : File { return _root.file("src") }
    property get DestDir() : File { return _root.file("classes") }
    property get DistDir() : File { return _root.file("dist") }
    property get DocDir() : File { return _root.file("doc") }

    private construct(root : File, namePrefix : String, cpath : Path) {
      _namePrefix = namePrefix
      _root = root
      Delete.dir(_root)
      _cpath = cpath
    }

    function buildJar() : File {
      Mkdir.dir(DestDir)
      new Javac() { :SrcDir = SrcDir, :DestDir = DestDir, :Source = "1.6", :Target = "1.6", :Nowarn = true, :Debug = true,
                    :Cpath = _cpath, :Fork = true, :MemoryMaximumSize = 512 }
      .execute()

      Mkdir.dir(DistDir)
      var jar = DistDir.file("${_namePrefix}.jar")
      new Jar(jar, DestDir).execute()

      return jar
    }

    function buildJavadoc(windowTitle : String, packageNames : String, excludePackageNames : String, op(javadoc : Javadoc)) : File {
      var xx = ScriptEnv.get().App
      new Copy() { :FileSet = ScriptEnv.get().RootDir.file("template/toolkit-javadoc/gw-${xx}-plugin").fileSet(), :ToDir = _root.file("gw-${xx}-plugin") }.execute()

      Mkdir.dir(DocDir)
      var javadoc = new Javadoc() {
        :Maxmemory = "512m",
        :SrcDir = SrcDir,
        :Packagenames = packageNames,
        :ExcludePackageNames = excludePackageNames,
        :Nodeprecated = false,
        :ShowProtected = false,
        :Version = true,
        :Author = true,
        :WindowTitle = windowTitle,
        :Verbose = false,
        :Breakiterator = true,
        :Destdir = DocDir,
        :Encoding = "UTF-8",
        :Cpath = _cpath
      }
      javadoc.Doctitle = "<h1>${windowTitle}</h1>"
      JavadocUtil.applyCopyrightBoilerplate(javadoc)
      javadoc.addArg( "-quiet" )
      javadoc.addTag( "notest", "No test", false )
      javadoc.addTag( "istested", "Is tested", false )
      javadoc.addTag( "scriptable-all", "Scriptable all", false )
      javadoc.addTag( "hidden", "Hidden", false )
      javadoc.addTag( "generatetypeinfo", "Generate type info", false )
      javadoc.addTag( "dontgeneratetypeinfo", "Do not generate type info", false )
      javadoc.setLink("../gw-${xx}-plugin", false)
      if (op != null) {
        op(javadoc)
      }
      javadoc.execute()

      Mkdir.dir(DistDir)
      var zip = DistDir.file("${_namePrefix}-doc.zip")
      new Zip(zip, DocDir).execute()

      return zip
    }

    function packageSource() : File {
      Mkdir.dir(DistDir)
      var zip = DistDir.file("${_namePrefix}-src.zip")
      new Zip(zip, SrcDir).execute()

      return zip
    }
  }
}
