package util.gaic.EDWPush
uses jxl.Workbook
uses java.io.File
uses java.util.ArrayList
uses com.gaic.claims.env.Environment
uses gw.api.util.Logger
uses java.lang.Exception

class ReadClaimFromExcel {

var claimNumber=""
var claimOrder=""
var claimPublicID=""
var featurePublicID=""
var claimExcelDTO : ClaimExcelDTO
var claimExcelDTOList :ArrayList<ClaimExcelDTO>
var env = Environment.getInstance()
var logger = Logger.forCategory("EDWConversionLog")
var filePath=""
  construct() {

  }
  function readDataFromExcel() :ArrayList<ClaimExcelDTO> {
    
    if (env == Environment.LOCAL) {
	  filePath = "C://Development//FeatureCloseMessage.xls"
     }
     else {
	  filePath = "//app//tomcat//tomcat-cccore//apache-tomcat-6.0.30//temp//FeatureCloseMessage.xls"
     }
     try {
             logger.info(" ******** filePath : "+ filePath)
             var wrk1 =  Workbook.getWorkbook(new File(filePath))
             
            //Obtain the reference to the first sheet in the workbook
             //var sheet = wrk1.getSheet("FeatureCloseMessage");
             var sheet = wrk1.getSheet(0);
             claimExcelDTOList = new ArrayList<ClaimExcelDTO>()
             for(var x in sheet.getRows()){
                for(var y in sheet.getColumns()){ 
                  claimExcelDTO =new ClaimExcelDTO()
        	  
        	  if(y==0){
        	     claimNumber= sheet.getCell(y,x).Contents
        	  }
        	  if(y==1){
        	    claimOrder = sheet.getCell(y,x).Contents
        	  }
        	  if(y==2){ 
        	    claimPublicID = sheet.getCell(y,x).Contents
        	  }
        	  if(y==3){
        	    featurePublicID = sheet.getCell(y,x).Contents
        	  }
        	}
                claimExcelDTO.ClaimNumber=claimNumber.trim()
                claimExcelDTO.ClaimOrder=claimOrder.trim()
                claimExcelDTO.ClaimPublicID=claimPublicID.trim()
                claimExcelDTO.FeaturePublicID=featurePublicID.trim()
                claimExcelDTOList.add(claimExcelDTO)
                
                
                
                
               } 
               }catch (e:Exception){
                 e.printStackTrace()
                 logger.info(" ******** Error in reading file : "+ e.Message)
                }
                logger.info(" No. of claims stored in  the ClaimExcelDTO " + claimExcelDTOList.Count)

            return claimExcelDTOList
      
  
}

}
