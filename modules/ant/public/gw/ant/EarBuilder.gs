package gw.ant

uses com.guidewire.modules.Module
uses gw.ant.ScriptEnv
uses gw.ant.wrappers.Copy
uses gw.ant.wrappers.Delete
uses gw.ant.wrappers.FilterSet
uses gw.ant.wrappers.Zip
uses java.io.File
uses java.util.Map

class EarBuilder {

  enum EarType {
    WEBLOGIC,
    WEBSPHERE
  }

  static property get DeployTemplatesDir() : File {
    return ScriptEnv.get().ModuleGraph.get("ant").Dir.file("deploy-templates")
  }

  var _xx : String
  var _productName : String
  var _earName : String
  var _earType : EarType
  var _destdir : File
  var _warBuilder : WarBuilder

  construct(xx : String) {
    var prodProps = Map.readFromPropertiesFile(ScriptEnv.get().getProductPropertiesFile(xx))

    _xx = prodProps.get("product.code")
    _productName = prodProps.get("product.name")
    withEarName(_productName + ".ear")
    withDestDir(ScriptEnv.get().BuildDir)
    withWarBuilder(new WarBuilder(_xx))
  }

  function withEarName(name : String) : EarBuilder {
    _earName = name
    return this
  }

  function asType(earType : EarType) : EarBuilder {
    _earType = earType
    return this
  }

  function withDestDir(destDir : File) : EarBuilder {
    _destDir = destDir
    return this
  }

  function withWarBuilder(warBuilder : WarBuilder) : EarBuilder {
    _warBuilder = warBuilder
    return this
  }

  function buildAsDirectory() : File {
    var earSetupDir = ScriptEnv.get().BuildDir.file("${_xx}/ear")
    Delete.dir(earSetupDir)

    var war = _warBuilder
      .withOp(\ warSetupDir -> {
        var copyWarStuff = new Copy() { :FileSet = DeployTemplatesDir.fileSet("ibm-web-bnd.xmi,ibm-web-ext.xmi", null),
                                        :ToDir = warSetupDir.file("WEB-INF") }
        addFilters(copyWarStuff.createFilterSet(), _xx)
        copyWarStuff.execute()
      })
      .build()

    new Copy() { :File = war, :ToDir = earSetupDir }
    .execute()

    var deployFiles = "application.xml"
    if (_earType == EarType.WEBSPHERE) {
      deployFiles += ",ibm-application-bnd.xmi,ibm-application-ext.xmi"
    }
    else if (_earType == EarType.WEBLOGIC) {
      deployFiles += ",weblogic-application.xml"
    }

    var copyEarStuff = new Copy() { :FileSet = DeployTemplatesDir.fileSet(deployFiles, null),
                                    :ToDir = earSetupDir.file("META-INF") }
    addFilters(copyEarStuff.createFilterSet(), _xx)
    copyEarStuff.execute()

    return earSetupDir
  }

  function build() : File {
    var ear = _destDir.file(_earName)

    var earSetupDir = buildAsDirectory()
    new Zip(ear, earSetupDir).execute()

    return ear
  }

  private static function addFilters(filterSet : FilterSet, xx : String) {
    filterSet.addFilter("APPNAME", "${xx}")
    filterSet.addFilter("WARNAME", "${xx}.war")
    filterSet.addFilter("APPROOT", "/${xx}")
  }
}
