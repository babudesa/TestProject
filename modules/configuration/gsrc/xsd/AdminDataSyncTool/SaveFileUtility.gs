package xsd.AdminDataSyncTool
uses java.lang.StringBuffer
uses net.sf.cotta.*
uses com.guidewire.pl.web.util.WebFileUtil
uses java.lang.Exception
uses com.guidewire.commons.util.GUIDGenerator
uses java.io.FileInputStream
uses java.io.InputStream
uses com.guidewire.pl.system.dependency.PLDependencies
uses com.guidewire.pl.web.controller.WebController
uses javax.servlet.http.HttpServletResponse;
/**
 * Static class that can be used to creates files that users can download.
 * 
 * Based on [] in [].jar 
 */
class SaveFileUtility {

  /**
   * Creates a temporary file on disk and prompts the user to open/save it.
   * @param fileContents - The string contents of the file
   * @param fileName - Name of the File to write and default name the user will save the file as.
   * <br><br>
   * <b>NOTE:</b> Will not work from Gosu Tester as the session will be null
   */
  public static function writeAndDisplayFile(fileContents : String, fileName : String){
    
    var file = getFile(fileName)
    print(file.path())
    writeToFile(fileContents, file)
  }

  private static function writeToFile(writeString : String, file: TFile) {
    file.save(writeString)
    /*
    var aWebController : WebController = PLDependencies.getWebController();
    var response : HttpServletResponse = aWebController.getResponse();
    print("response: " + response)*/
    WebFileUtil.copyFileToClient(file.toJavaFile(), file.name(), "text/xml")
  }
  
  private static function getFile(fileName : String) : TFile{
    var folder = getSessionTempFolder()
    return folder.file(fileName)
  }

  private static function getSessionTempFolder() : TDirectory{
    var outputDir : TDirectory

    // Gets the session temp folder, then it makes a new temp folder in it
    try{
      var GUID = GUIDGenerator.newGUID()
      var tempDir = WebFileUtil.getSessionTempDir()
      
      outputDir = TFileFactory.physicalDir(tempDir).dir(GUID);
    } catch (e : Exception){
      print("Session could not be found. Using temp folder instead.")
      outputDir = TFileFactory.physicalDir(
        "C:\\Users\\bbenson2\\AppData\\Local\\Temp\\work\\Jetty_0_0_0_0_8080__cc\\temp_wcc\\1kmv2ui8ojfmj"
      ).dir("CmYJPpe2wCkAAAAC");
      
    }
    return outputDir
  }
  
}