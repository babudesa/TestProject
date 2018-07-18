package util.gaic.test;

class PSARTestResult
{
  private var testDuration_ : String
  private var dateRun_ : java.util.Date
  private var psarVersion_ : String
  
  public property get testDuration() : String { return testDuration_; }
  public property get dateRun() : java.util.Date { return dateRun_; }
  public property get psarVersion() : String { return psarVersion_; }
  
  construct(){
  }
  
  construct(newDuration : String, newDateRun : java.util.Date, newVersion : String){
    testDuration_ = newDuration;
    dateRun_ = newDateRun;
    psarVersion_ = newVersion;
  }
}
