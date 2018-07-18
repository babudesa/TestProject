package xsd.AdminDataSyncTool
uses xsd.AdminDataSyncTool.Models.AdminDataExportModel.*
uses xsd.AdminDataSyncTool.Models.*

// Some unused imports are for commented out code, others are really not needed...takes to long to
// figure out which is whcih though
uses com.guidewire.commons.entity.EntityBundle
uses com.guidewire.commons.entity.KeyableBean
uses com.guidewire.commons.util.GUIDGenerator
uses com.guidewire.commons.util.ZipUtil
uses com.guidewire.logging.LoggerCategory
uses com.guidewire.pl.system.bundle.EntityBundleImpl
uses com.guidewire.pl.system.bundle.validation.BundleValidationOption
uses com.guidewire.pl.system.dependency.PLDependencies
uses com.guidewire.pl.system.exim.ImportResults
uses com.guidewire.pl.system.exim.PublicIdFinderImpl
uses com.guidewire.pl.system.exim.XMLImporter
uses com.guidewire.pl.system.locale.DisplayKey
uses com.guidewire.pl.system.locale.PLDisplayKeys
uses com.guidewire.pl.system.logging.PLLoggerCategory
uses com.guidewire.pl.system.transaction.CommitOptions
uses com.guidewire.pl.web.admin.ImportDataResults
uses com.guidewire.pl.web.controller.UserDisplayableException
uses com.guidewire.pl.web.util.WebFileUtil
uses com.guidewire.util.ArgCheck
uses com.guidewire.util.ExceptionUtil
uses com.guidewire.util.FileUtil
uses gw.api.web.WebFile
uses gw.lang.PublishInGosu
uses gw.lang.Scriptable
uses java.io.File
uses java.io.FileInputStream
uses java.io.IOException
uses java.io.InputStream
uses java.io.InputStreamReader
uses java.io.Reader
uses java.util.List
uses java.util.zip.ZipInputStream
uses org.apache.commons.io.IOUtils
uses org.apache.commons.lang.StringUtils
uses java.lang.Exception
uses gw.api.admin.ImportDataConflict
uses java.lang.StringBuilder
uses java.io.BufferedReader
uses com.ibm.db2.jcc.c.ad
uses java.util.Date

/**
 * Holds data imported from CustomImportWizardExt_UploadDV in the File property. When an uploaded file is added, it
 * will attept to convert it into a AdminDataExport object and execute it's import() method.
 */
class CustomImportDataInfo{
  private var _adminDataExport : AdminDataExport
  
  private var _file : WebFile
  private var _importBundle : EntityBundleImpl 
  private var _conflicts : String[]//ImportDataConflict[] 
  private var _commitException : Exception 
  private var _canceled : boolean 
  private var _numInserts : int 
  private var _numUpdates : int 
  private var _numDeleted : int 
  private var _errorString: String 
  private var _charSet :String 



  construct(){
    this._conflicts = new List<String>();
    this._commitException = null;
    this._canceled = false;
    this._errorString = null;
    this._charSet = "UTF-8";
    //this._resolution = ResolutionOption.OVERWRITE;
    //this._importer = importer;
  }
  
  property get File() : WebFile {
    return this._file;
  }
  
  /**
   * When the user chooses a file to load from the PCF, this property will execute all of the import code.
   */
  property set File(afile : WebFile ) {
       
        this._file = afile
        var model = importFromInputStreamToModel(this._file.getInputStream())
        importAdminDataExportModel(model)
    /*         
        // temporarily stores file in session temp folder, don't know why and doesn't seem nescessary, didn't replicate
        try {
          var file = new File(WebFileUtil.getSessionTempDir() + java.io.File.separator + GUIDGenerator.newGUID())
          inputStreamFromPossibleZip(WebFile, file)

          if(_file != null){
            FileUtil.deleteDirectoryRecursively(file)
          }
        }
       catch (e : Exception){ }
       finaly {
         IOUtils.closeQuietly(InputStream)
         if(File exists){
           FileUtil.deleteDirectoryRecursively(File)
       }}
    */    
  }

  /**
   * Takes an input stream created from the file and converts it into a AdminDataExportModel
   */
  private function importFromInputStreamToModel(inputStream : InputStream) : 
    xsd.AdminDataSyncTool.Models.AdminDataExportModel.AdminDataExport {
      
    try {
      return xsd.AdminDataSyncTool.Models.AdminDataExportModel.AdminDataExport.parse(inputStream)
    } catch (e : Exception){
      e.printStackTrace()
    } finally {
      IOUtils.closeQuietly(inputStream);
    }
    return null
  }
  
  /**
   * Add an awesome JavaDoc describing this method here. You know you want to.
   */
  private function importAdminDataExportModel(model: AdminDataExportModel.AdminDataExport){
    var results : ImportResults = xsd.AdminDataSyncTool.Importer.Results

    // passing the model into the AdminDataExport makes it import and stuff. The data winds up in the static
    // Importer class. Is that a good design? Probably not, but I ran out of time.
    var adminDataExport : AdminDataExport = new AdminDataExport(model)
    
    // Maybe this should be implemented by somebody? Or not.
    if (results == null) {
    //  throw new UserDisplayableException(PLDisplayKeys.Java_Admin_ImportData_NoDataFound);
    }
    if (results.getErrorLog().length > 0) {
        this._errorString = "\n" + StringUtils.join(results.getErrorLog(), "\n");
    }
    print("start commit - at " + (new Date()).toString() + " | InsertedBeans:" + xsd.AdminDataSyncTool.Importer.InsertedBeans
       + " UpdatedBeans:" + xsd.AdminDataSyncTool.Importer.UpdatedBeans
       + " RemovedBeans:" + xsd.AdminDataSyncTool.Importer.RemovedBeans)
    xsd.AdminDataSyncTool.Importer.commit()
    print("end commit - at " + (new Date()).toString())
  }

  /** Cancels the import */
  public function cancel(){
    this._canceled = true;
  }

  /**
   * Commits the imported Admin Data changes
   */
  public function commitChanges()  {
    
    try
    {
      this._numInserts = xsd.AdminDataSyncTool.Importer.InsertedBeans;
      this._numUpdates = xsd.AdminDataSyncTool.Importer.UpdatedBeans;
      this._numDeleted = xsd.AdminDataSyncTool.Importer.RemovedBeans;
      xsd.AdminDataSyncTool.Importer.commit()
      
    } catch (e : Exception) {
      this._commitException = e;
    }
  }

  // These methods are carried over from the original ImportDataInfo
  property get NumDeleted() : int {
    return this._numDeleted;
  }
  property set NumDeleted(num : int) {
    this._numDeleted = num;
  }
  function getNumConflicts() : int {
    return this._conflicts.length;
  }
  public function getConflicts() : List<String>{
    return this._conflicts;
  }
  public function hasErrors() : boolean {
    return (this._errorString != null);
  }
  public function getErrorString() : String {
    return this._errorString;
  }
  public property get CharSet() : String {
    return this._charSet;
  }
  public property set CharSet(acharSet : String) {
    ArgCheck.nonNull(acharSet, "charSet");
    this._charSet = acharSet;
  }
  public function getResults() : ImportDataResults
  {
    if (this._canceled) {
      return new ImportDataResults(true, false, 0, 0, 0, null);
    }
    return new ImportDataResults(false, this._commitException == null, this._numInserts, this._numUpdates, this._numDeleted, this._commitException);
  }

  // These zip methods are in the original ImportDataInfo, but didn't see any reason to implement them. This
  // code is from the class file and would need a little reverse engineering to work
  /*
  private static function unzipToDir(file : WebFile, unzipDir : File ) : File 
    //throws IOException
  {
    ZipInputStream zis = null;
    try
    {
      unzipDir.mkdir();
      zis = new ZipInputStream(file.getInputStream());
      ZipUtil.unzip(zis, unzipDir);

      File[] files = unzipDir.listFiles();
      if (files.length != 1) {
        throw new IllegalArgumentException("import zip file can only contain one file");
      }
      File localFile = files[0];

      return localFile;
    }
    finally
    {
      IOUtils.closeQuietly(zis);
      IOUtils.closeQuietly(file.getInputStream());
    }
  }
  */
  /*
  InputStream inputStreamFromPossibleZip(WebFile file, File unzipDir) throws IOException { PLLoggerCategory.ADMIN_EX_IM.info("Import: " + file.getName() + " came in with MIME type " + this._file.getMIMEType());
    if ("application/x-zip-compressed".equals(this._file.getMIMEType())) {
      return new FileInputStream(unzipToDir(this._file, unzipDir));
    }

    return this._file.getInputStream();
  }*/
}