package util.gaic.billimport
uses java.lang.Exception

class BillImportException extends Exception{

  construct(errorMessage : String) {
    super(errorMessage)
  }

}
