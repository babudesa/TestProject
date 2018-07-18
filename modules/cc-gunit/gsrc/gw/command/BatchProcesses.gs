package gw.command
uses gw.batchprocess.BatchProcessTestUtil

class BatchProcesses extends BaseCommand{

  function withDefault() {
    // One test to run all batch processes, and manually check the server log for exceptions/errors after the test.        
    BatchProcessTestUtil.startAndWaitUntilWorkFinishedEndToEnd( BatchProcessType.TC_ACTIVITYESC, 100000, {} )
    BatchProcessTestUtil.startAndWaitUntilWorkFinishedEndToEnd( BatchProcessType.TC_AGGLIMITCALC, 100000, {} )
    BatchProcessTestUtil.startAndWaitUntilWorkFinishedEndToEnd( BatchProcessType.TC_AGGLIMITLOADERCALC, 100000, {} )   
    BatchProcessTestUtil.startAndWaitUntilWorkFinishedEndToEnd( BatchProcessType.TC_BULKINVOICEESC, 100000, {} )              
    BatchProcessTestUtil.startAndWaitUntilWorkFinishedEndToEnd( BatchProcessType.TC_BULKINVOICESUBMISSION, 100000, {} )
    BatchProcessTestUtil.startAndWaitUntilWorkFinishedEndToEnd( BatchProcessType.TC_BULKINVOICEWF, 100000, {} )   
    BatchProcessTestUtil.startAndWaitUntilWorkFinishedEndToEnd( BatchProcessType.TC_BULKPURGE, 100000, {} )
    BatchProcessTestUtil.startAndWaitUntilWorkFinishedEndToEnd( BatchProcessType.TC_CATASTROPHECLAIMFINDER, 100000, {} )
    BatchProcessTestUtil.startAndWaitUntilWorkFinishedEndToEnd( BatchProcessType.TC_CLAIMCONTACTSCALC, 100000, {} )   
    BatchProcessTestUtil.startAndWaitUntilWorkFinishedEndToEnd( BatchProcessType.TC_CLAIMEXCEPTION, 100000, {} )
    BatchProcessTestUtil.startAndWaitUntilWorkFinishedEndToEnd( BatchProcessType.TC_CLAIMHEALTHCALC, 100000, {} )
    BatchProcessTestUtil.startAndWaitUntilWorkFinishedEndToEnd( BatchProcessType.TC_CONTACTAUTOSYNC, 100000, {} )
    BatchProcessTestUtil.startAndWaitUntilWorkFinishedEndToEnd( BatchProcessType.TC_DASHBOARDSTATISTICS, 100000, {} )
    BatchProcessTestUtil.startAndWaitUntilWorkFinishedEndToEnd( BatchProcessType.TC_EXCHANGERATE, 100000, {} )
    BatchProcessTestUtil.startAndWaitUntilWorkFinishedEndToEnd( BatchProcessType.TC_FINANCIALSCALC, 100000, {} )   
    BatchProcessTestUtil.startAndWaitUntilWorkFinishedEndToEnd( BatchProcessType.TC_FINANCIALSESC, 100000, {} )
   //Commment out GEOCODE batchprocess since this needs the Geocode setup and will be manually tested  
   //BatchProcessTestUtil.startAndWaitUntilWorkFinishedEndToEnd( BatchProcessType.TC_GEOCODE, 100000, {} )
    BatchProcessTestUtil.startAndWaitUntilWorkFinishedEndToEnd( BatchProcessType.TC_GROUPEXCEPTION, 100000, {} )   
    BatchProcessTestUtil.startAndWaitUntilWorkFinishedEndToEnd( BatchProcessType.TC_REVIEWSYNC, 100000, {} )
    BatchProcessTestUtil.startAndWaitUntilWorkFinishedEndToEnd( BatchProcessType.TC_STATISTICS, 100000, {} )
    BatchProcessTestUtil.startAndWaitUntilWorkFinishedEndToEnd( BatchProcessType.TC_TACCOUNTESC, 100000, {} )   
    BatchProcessTestUtil.startAndWaitUntilWorkFinishedEndToEnd( BatchProcessType.TC_USEREXCEPTION, 100000, {} )
    BatchProcessTestUtil.startAndWaitUntilWorkFinishedEndToEnd( BatchProcessType.TC_WORKFLOW, 100000, {} )
    BatchProcessTestUtil.startAndWaitUntilWorkFinishedEndToEnd( BatchProcessType.TC_WORKQUEUEINSTRUMENTATIONPURGE, 100000, {} )
    //The following 2 batch processes throw exceptions (refer to CLM-15125).   
    BatchProcessTestUtil.startAndWaitUntilWorkFinishedEndToEnd( BatchProcessType.TC_DATADISTRIBUTION, 100000, {} )   
    BatchProcessTestUtil.startAndWaitUntilWorkFinishedEndToEnd( BatchProcessType.TC_DBSTATS, 100000, {} )  
    //There's no way to run 'Claim Validation' from commandline or internal tools. So it might not be practical. I commented out here b/c it throws the java.lang.ArrayIndexOutOfBoundsException. 
    //BatchProcessTestUtil.startAndWaitUntilWorkFinishedEndToEnd( BatchProcessType.TC_CLAIMVALIDATION, 100000, {} )   
  }
}