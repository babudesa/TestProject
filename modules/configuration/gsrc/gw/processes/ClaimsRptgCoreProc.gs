package gw.processes
uses gw.transaction.Transaction
uses java.lang.Exception
uses com.gaic.integration.cc.plugins.reinsurance.ReinsuranceSearchAndRetrieval;
uses com.gaic.integration.cc.plugins.amy.AMYSearchAndRetrieval;
uses com.gaic.services.cededloss.CededSummaryFeatureContract;
uses java.math.BigDecimal
uses java.util.GregorianCalendar
uses java.io.File
uses java.io.PrintWriter
uses java.io.FileNotFoundException
uses javax.mail.Message
uses javax.mail.Session
uses javax.mail.Transport
uses javax.mail.internet.InternetAddress
uses javax.mail.internet.MimeBodyPart
uses javax.mail.internet.MimeMessage
uses javax.mail.internet.MimeMultipart
uses java.lang.System
uses com.gaic.claims.env.Environment
uses gw.processes.DocumentConstants
uses javax.activation.DataHandler
uses javax.activation.FileDataSource
uses javax.xml.datatype.DatatypeFactory
uses java.lang.String
uses java.util.ArrayList
uses java.util.Properties
uses java.util.Date
uses com.gaic.services.accountingmonthandyear.service.AccountingMonthAndYearResponseDTO
uses java.lang.Integer
uses java.text.SimpleDateFormat
uses java.text.DecimalFormat
uses java.lang.Double
uses java.util.Date
uses java.io.FileWriter
uses java.util.HashMap
uses gw.api.financials.FinancialsCalculationUtil
uses gw.api.system.database.SequenceUtil
uses java.util.TreeMap

class ClaimsRptgCoreProc  {
  var env = Environment.getInstance()
  
  construct() {
  }
  
  public function ClaimsDataProcess(runType : String, clmMap : HashMap, lastRunTran : Date, lobPrefix : String, runDate : String, lobCode : LOBCode): void{

     var df = new DecimalFormat("#.00")
     var dateFormat =  new SimpleDateFormat("yyyy-MM-dd HH:mm:ssss.mmm")
     var dateFormatText = new SimpleDateFormat("MM/dd/yyyy")
     var tranCnt = 0
     var sumCnt = 0
     
     //lastRunTran = dateFormat.parse("1900-01-01 01:01:0001.001")

     print("Last Run Time: " + lastRunTran.formatDateTime(LONG, LONG))
     var lastRunSum = lastRunTran
     if (runType == "Full" or runType == "Rerun") {
       lastRunSum = lastRunTran.addDays(-2)
     }
     var fileSuffix = ""
     if (runType == "Rerun") {
       fileSuffix = ".fix.txt"
     }
     else {
       fileSuffix = ".txt"
     }
     print("Summary Extract Date: " + lastRunSum.formatDateTime(LONG, LONG))
     var cal = new GregorianCalendar()
     var month = cal.get(cal.MONTH) + 1
     var year = cal.get(cal.YEAR)
     var day = cal.get(cal.DAY_OF_MONTH)

     var monthStr = String.valueOf(month)
     if (month < 10) {
       monthStr = "0" + monthStr
     }
     
     var dayStr = String.valueOf(day)
     if (day < 10) {
       dayStr = "0" + dayStr
     }
     var excelSumFileName = ""
     var excelTranFileName = ""
     var excelBalFileName = ""
     if (env == Environment.PROD or env == Environment.UAT or env == Environment.LOCAL) {
       excelSumFileName = lobPrefix + "ClaimsSummary" + String.valueOf(year) + monthStr + dayStr + fileSuffix
       excelTranFileName = lobPrefix + "ClaimsTrans"  + String.valueOf(year) + monthStr + dayStr + fileSuffix
       excelBalFileName = lobPrefix + "ClaimsBalancing"  + String.valueOf(year) + monthStr + dayStr + fileSuffix
     }
     else {
       excelSumFileName = lobPrefix + "ClaimsSummary" + env + String.valueOf(year) + monthStr + dayStr + fileSuffix
       excelTranFileName = lobPrefix + "ClaimsTrans"  + env + String.valueOf(year) + monthStr + dayStr + fileSuffix
       excelBalFileName = lobPrefix + "ClaimsBalancing"  + env + String.valueOf(year) + monthStr + dayStr + fileSuffix
     }
    // var summaryUniqueIDFileName = "ELDSummaryUniqueID.txt"
    // var summaryUniqueIDFileNamePath = ""
     System.out.print(excelSumFileName)
     var excelSumFileNameIncPath = ""
     var excelTranFileNameIncPath = ""
     var excelBalFileNameIncPath = ""
     if (env == Environment.LOCAL) {
        excelSumFileNameIncPath = "c:/work/" + lobPrefix  + "ClaimsSummary"
        excelTranFileNameIncPath = "c:/work/" + lobPrefix  + "ClaimsTrans"
        excelBalFileNameIncPath = "c:/work/" + lobPrefix  + "ClaimsBalancing"
     }
     else
     if (env <> Environment.DEV3) {
        excelSumFileNameIncPath = "/app/tomcat/tomcat-cccore/apache-tomcat-6.0.30/temp/" + lobPrefix  + "ClaimsSummary"
        excelTranFileNameIncPath = "/app/tomcat/tomcat-cccore/apache-tomcat-6.0.30/temp/" + lobPrefix  + "ClaimsTrans"
        excelBalFileNameIncPath = "/app/tomcat/tomcat-cccore/apache-tomcat-6.0.30/temp/" + lobPrefix  + "ClaimsBalancing"
   //    summaryUniqueIDFileNamePath = "/app/tomcat/tomcat-cccore/apache-tomcat-6.0.30/temp/"
     }
     else
     {
        excelSumFileNameIncPath = "/app/tomcat/tomcat-ccdev3/apache-tomcat-6.0.30/temp/" + lobPrefix  + "ClaimsSummary"
        excelTranFileNameIncPath = "/app/tomcat/tomcat-ccdev3/apache-tomcat-6.0.30/temp/" + lobPrefix  + "ClaimsTrans"
        excelBalFileNameIncPath = "/app/tomcat/tomcat-ccdev3/apache-tomcat-6.0.30/temp/" + lobPrefix  + "ClaimsBalancing"
   //    summaryUniqueIDFileNamePath = "/app/tomcat/tomcat-ccdev3/apache-tomcat-6.0.30/temp/"
     }
     var sumFileNameFull = ""
     var tranFileNameFull = ""
     var balFileNameFull = ""
     if (env == Environment.PROD or env == Environment.UAT or env == Environment.LOCAL) {
       sumFileNameFull = excelSumFileNameIncPath + String.valueOf(year) + monthStr + dayStr + fileSuffix
       tranFileNameFull = excelTranFileNameIncPath + String.valueOf(year) + monthStr + dayStr + fileSuffix
       balFileNameFull = excelBalFileNameIncPath + String.valueOf(year) + monthStr + dayStr + fileSuffix
     }
     else {
       sumFileNameFull = excelSumFileNameIncPath + env + String.valueOf(year) + monthStr + dayStr + fileSuffix
       tranFileNameFull = excelTranFileNameIncPath + env + String.valueOf(year) + monthStr + dayStr + fileSuffix
       balFileNameFull = excelBalFileNameIncPath + env + String.valueOf(year) + monthStr + dayStr + fileSuffix
     }
     var outputSumFile = new File(sumFileNameFull)
     var fwSum = outputSumFile.createNewFile();
     var pwSum = new PrintWriter(outputSumFile);
     var outputTranFile = new File(tranFileNameFull);
     var fwTran = outputTranFile.createNewFile()
     var pwTran = new PrintWriter(outputTranFile);
     var outputBalFile = new File(balFileNameFull);
     var fwBal = outputBalFile.createNewFile();
     var pwBal = new PrintWriter(outputBalFile);
     
     //var sumUniqueID = 100000

     try{
       var bundle=gw.transaction.Transaction.getCurrent()
       var combRptQuery = gw.api.database.Query.make(Claim)
       var cctlLobCodeTable = combRptQuery.compare("LOBCode", Equals, lobCode);
       //      if it's M&A, use LOBCode.tc_mergacqu

    // gw.transaction.Transaction.runWithNewBundle(\ bundle -> ELDClaimsDataExtract())
    // var transactionTable = ELDRptQuery.outerJoin(Transaction, "Claim")
    // var transactionLineitemTable = transactionTable.outerJoin(TransactionLineItem, "Transaction")
       var resultSet = combRptQuery.select().orderBy(\ c -> c.ClaimNumber)
       var rsal : ReinsuranceSearchAndRetrieval = new ReinsuranceSearchAndRetrieval();
       var amySAR : AMYSearchAndRetrieval = new AMYSearchAndRetrieval();
       var reinsContracts : CededSummaryFeatureContract[];
       var unSync : java.util.ArrayList = new java.util.ArrayList();
       var rptClaim = false
       var rptTran = false
       var validClmStatus = false

       var newLossResvFound = false
       var newExpResvFound = false 
       var closedResvFound = false
       var tranMap = new TreeMap()
       //pwSum.println(currentRunDt)
       //pwSum.println("^" + covgCounselTaxID)
       //pwSum.println("^" + covgCounselName)
       //pwSum.println("^" + defCounselTaxID)
       //pwSum.println("^" + defCounselName)

       pwSum.println("CLM_NO^NDTD_LOSS_RESERVE^DTDW_LOSS_RESERVE^DTDW_EXPENSE_RESERVE^DTDO_LOSS_RESERVE^DTDO_EXPENSE_RESERVE^NDTD_EXPENSE_RESERVE^CVG_EXPENSE_RESERVE^CLM_CREATED_DATE^" + 
           "CLM_MADE_DATE^CAUSE1^CAUSE2^CAUSE3^NDTD_LOSS_PAID^DTDW_LOSS_PAID^DTDW_EXPENSE_PAID^DTDO_LOSS_PAID^DTDO_EXPENSE_PAID^NDTD_EXPENSE_PAID^CVG_EXPENSE_PAID^ATTORNEY^CLM_TYPE^" +
           "NOTICE_DATE^PLAINTIFF_TYPE^PLAINTIFF_FIRM_CODE^CLAIMANT^JOURNAL^RENEWAL_COMMENTS^CED_LOSS_RES^CED_LAE_RES^CED_LOSS_PAID^CED_LAE_PAID^POTENTIAL_OVERINCURRED^CASE_SUMMARY^" + 
           "CLM_RET^CLASS_ACTION^DERIVATIVE_SUIT^CLM_RELATED_TYPE^BODILY_INJURY^A_SIDE_CVG^CVG_COUNSEL_TAX_ID^CVG_COUNSEL_NAME^DEF_COUNSEL_TAX_ID^DEF_COUNSEL_NAME^UNIQUE_ID^" +
           "PRODUCT^POL_NO^POL_EFFECTIVE_DATE^CLAIM_STATUS^CLOSED_DATE^REOPEN_DATE^REOPEN_REASON^FACT_SUMMARY^JURIS_STATE^JURIS_CODE^COVERAGE_TYPE |")
       //tranStr = tranStr.concatln(currentRunDt)
       pwTran.println("CLM_NO^CLM_TRANS_NO^CLM_PROCESS_DATE^CLM_TRANS^NDTD_LOSS_RESERVE_ADJ^DTDW_LOSS_RESERVE_ADJ^DTDW_EXPENSE_RESERVE_ADJ^DTDO_LOSS_RESERVE_ADJ^DTDO_EXPENSE_RESERVE_ADJ^" + 
           "NDTD_EXPENSE_RESERVE_ADJ^CVG_EXPENSE_RESERVE_ADJ^CLM_TRANS_YEAR_MONTH^CHECK_DATE^CHECK_NO^NDTD_LOSS_PAID_ADJ^DTDW_LOSS_PAID_ADJ^DTDW_EXPENSE_PAID_ADJ^DTDO_LOSS_PAID_ADJ^" + 
           "DTDO_EXPENSE_PAID_ADJ^NDTD_EXPENSE_PAID_ADJ^CVG_EXPENSE_PAID_ADJ^RESERVES_PAID_COMMENTS^TRANS_CED_LOSS_RES^TRANS_CED_LOSS_PAID^TRANS_CED_LAE_RES^TRANS_CED_LAE_PAID^"  + 
           "PAYEE_NAME^INVOICE_AMOUNT^UNIQUE_ID^PRODUCT^POL_NO^POL_EFFECTIVE_DATE|")  
       pwBal.println("TRANS_CNT^SUMMARY_CNT^RUN_DATE|")
       for (aClaim in resultSet) {

        if ((aClaim.ClaimNumber.substring(0, 1) != "T" and runType <> "Claim") or (runType == "Claim" and clmMap.containsKey(aClaim.ClaimNumber))) {
          bundle.add(aClaim)
          var cutOffDate = dateFormat.parse("2013-11-19 01:01:0001.001")
          if (aClaim.ValidationLevel == ValidationLevel.TC_PAYMENT) {
            if (env == Environment.UAT) {
              if  (aClaim.CreateUser.Department == "Executive Liability" and aClaim.CreateTime > cutOffDate) {
                validClmStatus = true
              }
              else {
                validClmStatus = false
              }
            }
            else {
              validClmStatus = true
            }
          }
          else {
            validClmStatus = false
          }
          if (aClaim.UpdateTime > lastRunTran and validClmStatus) {
            rptClaim = true
          }
          else {
            rptClaim = false
          }
          reinsContracts = rsal.searchReinsContracts(aClaim.ClaimNumber)
          var amount = 0.0

          var reserveLossDToDIn = 0.0
          var reserveLossDToDOut = 0.0
          var reserveLossNoDToD = 0.0
          var reserveLossLAE = 0.0
          var reserveExpDToDIn = 0.0
          var reserveExpDToDOut = 0.0
          var reserveExpNoDToD = 0.0
          var reserveExpLAE = 0.0
          var paidLossDToDIn = 0.0
          var paidLossDToDOut = 0.0
          var paidLossNoDToD = 0.0
          var paidLossLAE = 0.0
          var paidExpDToDIn = 0.0
          var paidExpDToDOut = 0.0
          var paidExpNoDToD = 0.0
          var paidExpLAE = 0.0
          //var recoveriesLoss = 0.0
          //var recoveriesExp = 0.0
          var cededLossRes = 0.0
          var cededLAERes = 0.0
          var cededLAERecov = 0.0
          var cededLossRecov = 0.0
          var cededLossPaid = 0.0
          var cededLAEPaid = 0.0
          var deductible = 0.0
          var coverageType = ""
          //var claimsMadeInd = false

          if (!aClaim.Policy.Coverages.IsEmpty) {
            //claimsMadeInd = aClaim.Policy.Coverages[0].ClaimsMadeIndicatorExt
            if (aClaim.Policy.Verified) {
                deductible = aClaim.Policy.Coverages[0].Deductible.Amount
            }
            else
            {
               if (!aClaim.Policy.Coverages[0].DeductiblesExt.IsEmpty) {
                   deductible = aClaim.Policy.Coverages[0].DeductiblesExt[0].Deductible as double
               }
            }
          }
          var claimantName = ""
          if (!aClaim.ClaimantNames.IsEmpty) {
            claimantName = aClaim.ClaimantNames[0]
          }
          var paymentType = ""
          var paymentCat = ""
          var jurisdictionState = ""
          var totalReserves = 0.0
          closedResvFound = false
          var exposureList = aClaim.Exposures
          var totalPaymentsCalculator = FinancialsCalculationUtil.getTotalPayments()
          var availReservesCalculator = FinancialsCalculationUtil.getAvailableReserves()
          var totalRecoveriesCalculator = FinancialsCalculationUtil.getTotalRecoveries()
          var exposurePriority = "low"
          var legalExpenseFound = false
          for (exposure in exposureList) {
             newLossResvFound = false
             newExpResvFound = false

             if (exposure.Claimant.UpdateTime > lastRunTran and validClmStatus) {
                rptClaim = true
             }

             if (aClaim.Policy.Verified) {
                deductible = exposure.Coverage.Deductible.Amount as double
             }
             else
             {
               if (!exposure.Coverage.DeductiblesExt.IsEmpty) {
                deductible = exposure.Coverage.DeductiblesExt[0].Deductible as double
               }
             }
             coverageType = exposure.Coverage.Type as java.lang.String
             if (exposure.UpdateTime > lastRunTran and validClmStatus) {
                rptClaim = true
             }
             
             if (exposure.ExposureType == ExposureType.TC_EL_LOSSADJUSTEXP) {
                cededLAERes = cededLAERes + calculateReinsurancesExtCededReserveAmount(reinsContracts, exposure)
                cededLAEPaid = cededLAEPaid + calculateReinsurancesExtTotalPaid(reinsContracts, exposure)
                cededLAERecov = cededLAERecov + calculateReinsurancesExtRecoveryReceipts(reinsContracts, exposure)
                cededLAERes = cededLAERes + cededLAERecov 
                cededLAEPaid = cededLAEPaid - cededLAERecov
             }
             else
             {
                cededLossRes = cededLossRes + calculateReinsurancesExtCededReserveAmount(reinsContracts, exposure)
                cededLossPaid = cededLossPaid + calculateReinsurancesExtTotalPaid(reinsContracts, exposure)
                cededLossRecov = cededLossRecov + calculateReinsurancesExtRecoveryReceipts(reinsContracts, exposure)
                cededLossRes = cededLossRes + cededLAERecov 
                cededLossPaid = cededLossPaid - cededLAERecov
             }
             if (exposure.ExposureType == ExposureType.TC_EL_LOSSADJUSTEXP) {
                amount = availReservesCalculator.getAmount( exposure, CostType.TC_CLAIMCOST )
                reserveLossLAE  =  reserveLossLAE +  amount
                amount = totalPaymentsCalculator.getAmount( exposure, CostType.TC_CLAIMCOST )
                paidLossLAE = paidLossLAE + amount
                //recoveriesLoss = totalRecoveriesCalculator.getAmount(exposure, CostType.TC_CLAIMCOST) as Double
                //reserveLossLAE = reserveLossLAE + recoveriesLoss
                //paidLossLAE = paidLossLAE - recoveriesLoss
                amount = availReservesCalculator.getAmount( exposure, CostType.TC_EXPENSE )
                reserveExpLAE  =  reserveExpLAE +  amount
                amount = totalPaymentsCalculator.getAmount( exposure, CostType.TC_EXPENSE )
                paidExpLAE = paidExpLAE + amount
                //recoveriesExp = totalRecoveriesCalculator.getAmount(exposure, CostType.TC_EXPENSE) as Double
                //reserveExpLAE = reserveExpLAE + recoveriesExp
                //paidExpLAE = paidExpLAE - recoveriesLoss
             }
             else
             if (exposure.ExposureType == ExposureType.TC_EL_INDEMNITY) {
                amount = availReservesCalculator.getAmount( exposure, CostType.TC_CLAIMCOST )
                reserveLossNoDToD = reserveLossNoDToD + amount 
                amount = totalPaymentsCalculator.getAmount( exposure, CostType.TC_CLAIMCOST )
                paidLossNoDToD = paidLossNoDToD + amount
                //recoveriesLoss = totalRecoveriesCalculator.getAmount(exposure, CostType.TC_CLAIMCOST) as Double
                //reserveLossNoDToD = reserveLossNoDToD + recoveriesLoss
                //paidLossNoDToD = paidLossNoDToD - recoveriesLoss
                amount = availReservesCalculator.getAmount( exposure, CostType.TC_EXPENSE )
                reserveExpNoDToD = reserveExpNoDToD + amount 
                amount = totalPaymentsCalculator.getAmount( exposure, CostType.TC_EXPENSE )
                paidExpNoDToD = paidExpNoDToD + amount
                //recoveriesExp = totalRecoveriesCalculator.getAmount(exposure, CostType.TC_EXPENSE) as Double
                //reserveExpNoDToD = reserveExpNoDToD + recoveriesExp
                //paidExpNoDToD = paidExpNoDToD - recoveriesExp
             }
             else
             if (exposure.ExposureType == ExposureType.TC_EL_DUTYDEFWTHNLIMITS) {
                amount = availReservesCalculator.getAmount( exposure, CostType.TC_CLAIMCOST )
                reserveLossDToDIn = reserveLossDToDIn + amount
                amount = totalPaymentsCalculator.getAmount( exposure, CostType.TC_CLAIMCOST )
                paidLossDToDIn = paidLossDToDIn + amount
                //recoveriesLoss = totalRecoveriesCalculator.getAmount(exposure, CostType.TC_CLAIMCOST) as Double
                //reserveLossDToDIn = reserveLossDToDIn + recoveriesLoss
                //paidLossDToDIn = paidLossDToDIn - recoveriesLoss
                amount = availReservesCalculator.getAmount( exposure, CostType.TC_EXPENSE )
                reserveExpDToDIn = reserveExpDToDIn + amount
                amount = totalPaymentsCalculator.getAmount( exposure, CostType.TC_EXPENSE )
                paidExpDToDIn = paidExpDToDIn + amount
                //recoveriesExp = totalRecoveriesCalculator.getAmount(exposure, CostType.TC_EXPENSE) as Double
                //reserveExpDToDIn = reserveExpDToDIn + recoveriesExp
                //paidExpDToDIn = paidExpDToDIn - recoveriesExp
             }
             else
             if (exposure.ExposureType == ExposureType.TC_EL_DUTYDEFOTSDLIMITS) {
                amount = availReservesCalculator.getAmount( exposure, CostType.TC_CLAIMCOST )
                reserveLossDToDOut = reserveLossDToDOut + amount
                amount = totalPaymentsCalculator.getAmount( exposure, CostType.TC_CLAIMCOST )
                paidLossDToDOut = paidLossDToDOut + amount
                //recoveriesLoss = totalRecoveriesCalculator.getAmount(exposure, CostType.TC_CLAIMCOST) as Double
                //reserveLossDToDOut = reserveLossDToDOut + recoveriesLoss
                //paidLossDToDOut = paidLossDToDOut - recoveriesLoss
                amount = availReservesCalculator.getAmount( exposure, CostType.TC_EXPENSE )
                reserveExpDToDOut = reserveExpDToDOut + amount
                amount = totalPaymentsCalculator.getAmount( exposure, CostType.TC_EXPENSE )
                paidExpDToDOut = paidExpDToDOut + amount
                //recoveriesExp = totalRecoveriesCalculator.getAmount(exposure, CostType.TC_EXPENSE) as Double
                //reserveExpDToDOut = reserveExpDToDOut + recoveriesExp
                //paidExpDToDOut = paidExpDToDOut - recoveriesExp
             }

             var transList = find(t in Transaction where t.Exposure == exposure)
             transList.orderBy(\ row ->  row.ID )
             if (exposure.LegalExpenseExt and aClaim.Matters.Count > 0 and aClaim.Matters[0] <> null) {
                legalExpenseFound = true
             }

             if (transList.Empty) {
                 if (!legalExpenseFound and jurisdictionState == "" and exposure.ExposureType != ExposureType.TC_EL_LOSSADJUSTEXP and exposure.JurisdictionState <> null) {
                   jurisdictionState = exposure.JurisdictionState as java.lang.String
                 }
             }
             else
			 {  
               if (!legalExpenseFound) {
                 if ((jurisdictionState == "" or exposurePriority == "low") and exposure.ExposureType != ExposureType.TC_EL_LOSSADJUSTEXP and exposure.State == ExposureState.TC_OPEN and exposure.JurisdictionState <> null) {
                   jurisdictionState = exposure.JurisdictionState as java.lang.String
                   exposurePriority = "high"
                 }
                 else
                 if (jurisdictionState == "" and exposure.ExposureType != ExposureType.TC_EL_LOSSADJUSTEXP and exposure.JurisdictionState <> null) {
                   jurisdictionState = exposure.JurisdictionState as java.lang.String
                 }
               }
               for(trans in transList){
                 if (!trans.LineItems.IsEmpty) {
                   var cntUpd = false
                   for (li in trans.LineItems) {
                     if (li.Transaction typeis Payment  and (li.Transaction.Status == TransactionStatus.TC_SUBMITTED
                        or  (li.Transaction.Status == TransactionStatus.TC_TRANSFERRED or li.Transaction.Status == TransactionStatus.TC_RECODED)  )) {
                        paymentType = li.Transaction.PaymentType.DisplayName
                        paymentCat = li.Transaction.PaymentCategoryExt.DisplayName
                     }  
                     else {
                       paymentCat = ""
                     }

                     var inclTranInTotals = false
                     if (li.Transaction.CostType == CostType.TC_EXPENSE or (li.Transaction.Exposure.ExposureType == ExposureType.TC_EL_DUTYDEFOTSDLIMITS or li.Transaction.Exposure.ExposureType == ExposureType.TC_EL_DUTYDEFWTHNLIMITS or
                         li.Transaction.Exposure.ExposureType == ExposureType.TC_EL_INDEMNITY)) {
                       if (((li.Transaction typeis Payment or li.Transaction.TransactionTypeName == "Reserve" or li.Transaction.TransactionTypeName == "Recovery") and (li.Transaction.Status == TransactionStatus.TC_SUBMITTED
                          or  (li.Transaction.Status == TransactionStatus.TC_TRANSFERRED or li.Transaction.Status == TransactionStatus.TC_RECODED) ))) {
                          inclTranInTotals = true
                       }
                       else
                       if ((li.Transaction typeis Payment or li.Transaction typeis Recovery)  and (li.Transaction.Status == TransactionStatus.TC_AWAITINGSUBMISSION or li.Transaction.Status == TransactionStatus.TC_ISSUED or li.Transaction.Status == TransactionStatus.TC_PENDINGAPPROVAL
                          or  li.Transaction.Status == TransactionStatus.TC_PENDINGTRANSFER or li.Transaction.Status == TransactionStatus.TC_PENDINGRECODE)) {
                          var tranAmt = li.Transaction.Amount as double
                          if (exposure.ExposureType == ExposureType.TC_EL_LOSSADJUSTEXP and li.Transaction.CostType == CostType.TC_CLAIMCOST) {
                             reserveLossLAE  =  reserveLossLAE + tranAmt
                             paidLossLAE = paidLossLAE - tranAmt
                          }
                          else
                          if (exposure.ExposureType == ExposureType.TC_EL_LOSSADJUSTEXP and li.Transaction.CostType == CostType.TC_EXPENSE) {
                             reserveExpLAE  =  reserveExpLAE + tranAmt
                             paidExpLAE = paidExpLAE - tranAmt
                          }
                          else
                          if (exposure.ExposureType == ExposureType.TC_EL_INDEMNITY and li.Transaction.CostType == CostType.TC_CLAIMCOST) {
                             reserveLossNoDToD = reserveLossNoDToD + tranAmt
                             paidLossNoDToD = paidLossNoDToD - tranAmt
                          }
                          else
                          if (exposure.ExposureType == ExposureType.TC_EL_INDEMNITY and li.Transaction.CostType == CostType.TC_EXPENSE) {
                             reserveExpNoDToD = reserveExpNoDToD + tranAmt
                             paidExpNoDToD = paidExpNoDToD - tranAmt
                          }
                          else
                          if (exposure.ExposureType == ExposureType.TC_EL_DUTYDEFWTHNLIMITS and li.Transaction.CostType == CostType.TC_CLAIMCOST) {
                             reserveLossDToDIn = reserveLossDToDIn + tranAmt
                             paidLossDToDIn = paidLossDToDIn - tranAmt
                          }
                          else
                          if (exposure.ExposureType == ExposureType.TC_EL_DUTYDEFWTHNLIMITS and li.Transaction.CostType == CostType.TC_EXPENSE) {
                             reserveExpDToDIn = reserveExpDToDIn + tranAmt
                             paidExpDToDIn = paidExpDToDIn - tranAmt
                          }
                          else
                          if (exposure.ExposureType == ExposureType.TC_EL_DUTYDEFOTSDLIMITS and li.Transaction.CostType == CostType.TC_CLAIMCOST) {
                             reserveLossDToDOut = reserveLossDToDOut + tranAmt
                             paidLossDToDOut = paidLossDToDOut - tranAmt
                          }
                          else
                          if (exposure.ExposureType == ExposureType.TC_EL_DUTYDEFOTSDLIMITS and li.Transaction.CostType == CostType.TC_EXPENSE) {
                             reserveExpDToDOut = reserveExpDToDOut + tranAmt
                             paidExpDToDOut = paidExpDToDOut - tranAmt
                          }
                       }
                     }
                        
                     //if ((li.Transaction.TransactionTypeName == "Reserve" or li.Transaction.TransactionTypeName == "Recovery") and inclTranInTotals) 
                     //{
                     //  totalReserves = totalReserves + li.Transaction.Amount as double
                     //}
                     //else
                     //if (li.Transaction.TransactionTypeName == "Payment" and paymentType <> "Supplemental" and inclTranInTotals) {
                     //  totalReserves = totalReserves - li.Transaction.Amount as double
                     //}
                     if ((li.Transaction.UpdateTime > lastRunSum) and  (li.Transaction typeis Payment or li.Transaction typeis Recovery or li.Transaction.Exposure.ExposureType != ExposureType.TC_EL_NONDUTYDEF)
                       and validClmStatus) {
                       rptClaim = true    
                     }
                     var tranStr = ""
                     if (li.Transaction.UpdateTime > lastRunTran and (li.Transaction typeis Payment or li.Transaction typeis Recovery or li.Transaction.Exposure.ExposureType != ExposureType.TC_EL_NONDUTYDEF)
                       and validClmStatus and inclTranInTotals and (((li.Transaction.Status == TransactionStatus.TC_RECODED or li.Transaction.Status == TransactionStatus.TC_TRANSFERRED) and li.Transaction.CreateTime.formatDate(MEDIUM) == li.Transaction.UpdateTime.formatDate(MEDIUM)) or (li.Transaction.Status <> TransactionStatus.TC_RECODED and li.Transaction.Status <> TransactionStatus.TC_TRANSFERRED))) {
                       rptTran = true
                       tranStr = tranStr.concat(aClaim.ClaimNumber)
                       tranStr = tranStr.concat("^" + li.Transaction.ID)
                       tranStr = tranStr.concat("^" + li.Transaction.UpdateTime)
                       //  print("Tran type " + li.Transaction.TransactionTypeName + " Last Run Tran " + lastRunTran + " CloseDate " + aClaim.CloseDate + " Amt " + li.Transaction.Amount +
                         //  " exp create time " + exposure.CreateTime.formatDate(SHORT) + " tran UpdateTime date " + li.Transaction.UpdateTime.formatDate(SHORT))
                       if (li.Transaction.TransactionTypeName == "Reserve" and newLossResvFound == false and li.Transaction.CostType == CostType.TC_CLAIMCOST) {
                         tranStr = tranStr.concat("^NEW")
                         newLossResvFound = true
                       } 
                       else
                       if (li.Transaction.TransactionTypeName == "Reserve" and newExpResvFound == false and li.Transaction.CostType == CostType.TC_EXPENSE) {
                         tranStr = tranStr.concat("^NEW")
                         newExpResvFound = true
                       } 
                       else
                       if (li.Transaction.TransactionTypeName == "Reserve" and li.Transaction.Amount <= 0) {
                         tranStr = tranStr.concat("^DEC")
                       }  
                       else 
                       if (li.Transaction.TransactionTypeName == "Reserve" and li.Transaction.Amount > 0) {
                         tranStr = tranStr.concat("^INC")
                       }
                       else
                       if (li.Transaction.TransactionTypeName == "Payment" and li.Transaction.Amount >= 0) {
                         tranStr = tranStr.concat("^PAY")
                       }
                       else
                       if (li.Transaction.TransactionTypeName == "Recovery" or li.Transaction.TransactionTypeName == "Payment" ) {
                         tranStr = tranStr.concat("^REF")
                       }  
                     }
                     else {
                       rptTran = false
                       if ((li.Transaction typeis Payment or li.Transaction.TransactionTypeName == "Reserve") and inclTranInTotals) 
                       {
                         if (li.Transaction.TransactionTypeName == "Reserve" and newLossResvFound == false and li.Transaction.CostType == CostType.TC_CLAIMCOST) {
                           newLossResvFound = true
                         } 
                         else
                         if (li.Transaction.TransactionTypeName == "Reserve" and newExpResvFound == false and li.Transaction.CostType == CostType.TC_EXPENSE) {
                           newExpResvFound = true
                         } 
                       }
                     } 
                     //print(aClaim + " : " + li.TransactionAmount + " : " + li.Transaction.Subtype + " : "+ li.Transaction.CostType.DisplayName)
                    if (li.Transaction.Exposure.ExposureType == ExposureType.TC_EL_LOSSADJUSTEXP and li.Transaction.CostType == CostType.TC_EXPENSE and inclTranInTotals) {
                        if (li.Transaction typeis Reserve) {
                          //reserveLossCLAE = reserveLossCLAE + li.Transaction.Amount
                          if (rptTran == true) {
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^" + df.format(li.Transaction.Amount))
   
                            tranStr = printAcctYrMthCheckInfoRes(li.Transaction, tranStr, amySAR)
                            tranStr = printZeroPaid(tranStr)
                            tranStr = tranStr.concat("^" + li.Transaction.Comments)
                            
                            tranStr = printZeroCeded(tranStr)
                            //tranTotRsvC = tranTotRsvC + li.Transaction.Amount
                          }
                        }
                        else
                        if (li.Transaction typeis Payment) {
                          //paidLossCLAE = paidLossCLAE + li.Transaction.Amount
                          if (rptTran == true) {
                            //if (aClaim.CloseDate == null or aClaim.CloseDate > lastRunTran) {
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^0.00")
                            if (paymentType <> "Supplemental") {
                            tranStr = tranStr.concat("^" + df.format(-1 * li.Transaction.Amount))
                            }
                            else
                            {
                              tranStr = tranStr.concat("^0.00")
                            }
                            //}  
                            //else {
                             // printZeroReserves(tranStr)
                            //}
                            tranStr = printAcctYrMthCheckInfoPymt(li.Transaction, tranStr, amySAR)
                           
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^" + df.format(li.Transaction.Amount))
                            
                            tranStr = tranStr.concat("^" + li.Transaction.Check.Memo)
                            
                            tranStr = printZeroCeded(tranStr)
                            //tranTotPaidC = tranTotPaidC + li.Transaction.Amount
                          }
                        }
                        else
                        if (li.Transaction typeis Recovery) {
                           //paidLossCLAE = paidLossCLAE - li.Transaction.Amount
                           if (rptTran == true) {
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             
                             tranStr = printAcctYrMthCheckInfoRecovery(li.Transaction, tranStr, amySAR)
                             
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^" + df.format(-1 * li.Transaction.Amount))
                             tranStr = tranStr.concat("^" + li.Transaction.Comments)
                        
                             tranStr = printZeroCeded(tranStr)
                           }
                        }
                     }  
                     else
                     if (li.Transaction.Exposure.ExposureType == ExposureType.TC_EL_INDEMNITY and li.Transaction.CostType == CostType.TC_CLAIMCOST and inclTranInTotals) {
                        if (li.Transaction typeis Reserve) {
                         // reserveLossNoDToD = reserveLossNoDToD + li.Transaction.Amount
                          if (rptTran == true) {
                            tranStr = tranStr.concat("^" + df.format(li.Transaction.Amount))
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
    
                            tranStr = printAcctYrMthCheckInfoRes(li.Transaction, tranStr, amySAR)
                            tranStr = printZeroPaid(tranStr)
                            tranStr = tranStr.concat("^" + li.Transaction.Comments)
                             
                            tranStr = printZeroCeded(tranStr)
                            //tranTotRsvA = tranTotRsvA + li.Transaction.Amount
                          }
                        }
                        else
                        if (li.Transaction typeis Payment) {
                         // paidLossNoDToD = paidLossNoDToD + li.Transaction.Amount
                          if (rptTran == true) {
                            //if (aClaim.CloseDate == null or aClaim.CloseDate > lastRunTran) {
                            if (paymentType <> "Supplemental") {
                              tranStr = tranStr.concat("^" + df.format(-1 * li.Transaction.Amount))
                            }
                            else
                            {
                              tranStr = tranStr.concat("^0.00")
                            }
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                            //} 
                            //else {
                             // printZeroReserves(tranStr)
                            //}
                            tranStr = printAcctYrMthCheckInfoPymt(li.Transaction, tranStr, amySAR)
                            
                            tranStr = tranStr.concat("^" + df.format(li.Transaction.Amount))                          
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")

                            tranStr = tranStr.concat("^" + li.Transaction.Check.Memo)
                           
                            tranStr = printZeroCeded(tranStr)
                            //tranTotpaidLoss = tranTotpaidLoss + li.Transaction.Amount
                          }
                        }
                        else
                        if (li.Transaction typeis Recovery) {
                           // paidLossNoDToD = paidLossNoDToD - li.Transaction.Amount
                            if (rptTran == true) {
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              
                              tranStr = printAcctYrMthCheckInfoRecovery(li.Transaction, tranStr, amySAR)
                              
                              tranStr = tranStr.concat("^" + df.format(-1 * li.Transaction.Amount))                          
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")

                              tranStr = tranStr.concat("^" + li.Transaction.Comments)
                           
                              tranStr = printZeroCeded(tranStr)
                            }
                         }
                     }
                     else
                     if (li.Transaction.Exposure.ExposureType == ExposureType.TC_EL_DUTYDEFWTHNLIMITS and li.Transaction.CostType == CostType.TC_CLAIMCOST 
                        and inclTranInTotals) {
                        if (li.Transaction typeis Reserve) {
                           //reserveLossDToDIn = reserveLossDToDIn + li.Transaction.Amount
                           if (rptTran == true) {
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^" + df.format(li.Transaction.Amount))
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             
                             tranStr = printAcctYrMthCheckInfoRes(li.Transaction, tranStr, amySAR)
                             tranStr = printZeroPaid(tranStr)
                             tranStr = tranStr.concat("^" + li.Transaction.Comments)
                              
                             tranStr = printZeroCeded(tranStr)
                             //tranTotRsvB = tranTotRsvB + li.Transaction.Amount
                           }
                        }
                        else
                        if (li.Transaction typeis Payment) {
                          //paidLossDToDIn = paidLossDToDIn + li.Transaction.Amount
                          if (rptTran == true) {
                            //if (aClaim.CloseDate == null or aClaim.CloseDate > lastRunTran) {
                              tranStr = tranStr.concat("^0.00")
                              if (paymentType <> "Supplemental") {
                              tranStr = tranStr.concat("^" + df.format(-1 * li.Transaction.Amount))
                              }
                              else
                              {
                                tranStr = tranStr.concat("^0.00")
                              }
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                            //} 
                            //else {
                              //printZeroReserves(tranStr)
                            //}
                            tranStr = printAcctYrMthCheckInfoPymt(li.Transaction, tranStr, amySAR)
                                                   
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^" + df.format(li.Transaction.Amount))  
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^" + li.Transaction.Check.Memo)
                           
                            tranStr = printZeroCeded(tranStr)
                            //tranTotPaidB = tranTotPaidB + li.Transaction.Amount
                          }
                        }
                        else
                        if (li.Transaction typeis Recovery) {
                            // paidLossDToDIn = paidLossDToDIn - li.Transaction.Amount
                            if (rptTran == true) {
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")                              
                              tranStr = printAcctYrMthCheckInfoRecovery(li.Transaction, tranStr, amySAR)
                              
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^" + df.format(-1 * li.Transaction.Amount))  
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")

                              tranStr = tranStr.concat("^" + li.Transaction.Comments)
                           
                              tranStr = printZeroCeded(tranStr)
                            }
                        }
                    }
                    else
                     if (li.Transaction.Exposure.ExposureType == ExposureType.TC_EL_DUTYDEFWTHNLIMITS and li.Transaction.CostType == CostType.TC_EXPENSE 
                        and inclTranInTotals) {
                        if (li.Transaction typeis Reserve) {
                           //reserveLossDToDIn = reserveLossDToDIn + li.Transaction.Amount
                           if (rptTran == true) {
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^" + df.format(li.Transaction.Amount))
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             
                             tranStr = printAcctYrMthCheckInfoRes(li.Transaction, tranStr, amySAR)
                             tranStr = printZeroPaid(tranStr)
                             tranStr = tranStr.concat("^" + li.Transaction.Comments)
                              
                             tranStr = printZeroCeded(tranStr)
                             //tranTotRsvB = tranTotRsvB + li.Transaction.Amount
                           }
                        }
                        else
                        if (li.Transaction typeis Payment) {
                          //paidLossDToDIn = paidLossDToDIn + li.Transaction.Amount
                          if (rptTran == true) {
                            //if (aClaim.CloseDate == null or aClaim.CloseDate > lastRunTran) {
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              if (paymentType <> "Supplemental") {
                              tranStr = tranStr.concat("^" + df.format(-1 * li.Transaction.Amount))
                              }
                              else
                              {
                                tranStr = tranStr.concat("^0.00")
                              }
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                            //} 
                            //else {
                              //printZeroReserves(tranStr)
                            //}
                            tranStr = printAcctYrMthCheckInfoPymt(li.Transaction, tranStr, amySAR)
                                                   
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^" + df.format(li.Transaction.Amount)) 
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^" + li.Transaction.Check.Memo)
                           
                            tranStr = printZeroCeded(tranStr)
                            //tranTotPaidB = tranTotPaidB + li.Transaction.Amount
                          }
                        }
                        else
                        if (li.Transaction typeis Recovery) {
                            // paidLossDToDIn = paidLossDToDIn - li.Transaction.Amount
                            if (rptTran == true) {
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")                              
                              tranStr = printAcctYrMthCheckInfoRecovery(li.Transaction, tranStr, amySAR)
                              
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^" + df.format(-1 * li.Transaction.Amount))  
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")

                              tranStr = tranStr.concat("^" + li.Transaction.Comments)
                           
                              tranStr = printZeroCeded(tranStr)
                            }
                        }
                    }
                    else
                    if (li.Transaction.Exposure.ExposureType == ExposureType.TC_EL_DUTYDEFOTSDLIMITS and li.Transaction.CostType == CostType.TC_CLAIMCOST 
                        and inclTranInTotals) {
                        if (li.Transaction typeis Reserve) {
                          //reserveLossDToDOut = reserveLossDToDOut + li.Transaction.Amount
                          if (rptTran == true) {
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^" + df.format(li.Transaction.Amount))
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")                             
                             
                             tranStr = printAcctYrMthCheckInfoRes(li.Transaction, tranStr, amySAR)
                             tranStr = printZeroPaid(tranStr)
                             tranStr = tranStr.concat("^" + li.Transaction.Comments)
                              
                             tranStr = printZeroCeded(tranStr)
                             //tranTotRsvB2 = tranTotRsvB2 + li.Transaction.Amount
                           }
                        }
                        else
                        if (li.Transaction typeis Payment) {
                          //paidLossDToDOut = paidLossDToDOut + li.Transaction.Amount
                          if (rptTran == true) {
                            //if (aClaim.CloseDate == null or aClaim.CloseDate > lastRunTran) {
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^0.00")
                            if (paymentType <> "Supplemental") {
                            tranStr = tranStr.concat("^" + df.format(-1 * li.Transaction.Amount))
                            }
                            else
                            {
                              tranStr = tranStr.concat("^0.00")
                            }
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^0.00")                              
                            //} 
                            //else {
                              //printZeroReserves(tranStr)
                            //}
                            tranStr = printAcctYrMthCheckInfoPymt(li.Transaction, tranStr, amySAR)
                                                   
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^" + df.format(li.Transaction.Amount))  
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^0.00")

                            tranStr = tranStr.concat("^" + li.Transaction.Check.Memo)
                           
                            tranStr = printZeroCeded(tranStr)
                            //tranTotpaidLoss = tranTotpaidLoss + li.Transaction.Amount
                          }
                        }
                        else
                        if (li.Transaction typeis Recovery) {
                            //paidLossDToDOut = paidLossDToDOut - li.Transaction.Amount
                            if (rptTran == true) {
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = printAcctYrMthCheckInfoRecovery(li.Transaction, tranStr, amySAR)
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^" + df.format(-1 * li.Transaction.Amount))  
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^" + li.Transaction.Comments)
                           
                              tranStr = printZeroCeded(tranStr)
                            }
                        }
                    }
                    else
                    if (li.Transaction.Exposure.ExposureType == ExposureType.TC_EL_DUTYDEFOTSDLIMITS and li.Transaction.CostType == CostType.TC_EXPENSE
                        and inclTranInTotals) {
                        if (li.Transaction typeis Reserve) {
                          //reserveLossDToDOut = reserveLossDToDOut + li.Transaction.Amount
                          if (rptTran == true) {
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^" + df.format(li.Transaction.Amount))
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")                             
                             
                             tranStr = printAcctYrMthCheckInfoRes(li.Transaction, tranStr, amySAR)
                             tranStr = printZeroPaid(tranStr)
                             tranStr = tranStr.concat("^" + li.Transaction.Comments)
                              
                             tranStr = printZeroCeded(tranStr)
                             //tranTotRsvB2 = tranTotRsvB2 + li.Transaction.Amount
                           }
                        }
                        else
                        if (li.Transaction typeis Payment) {
                          //paidLossDToDOut = paidLossDToDOut + li.Transaction.Amount
                          if (rptTran == true) {
                            //if (aClaim.CloseDate == null or aClaim.CloseDate > lastRunTran) {
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^0.00")
                            if (paymentType <> "Supplemental") {
                            tranStr = tranStr.concat("^" + df.format(-1 * li.Transaction.Amount))
                            }
                            else
                            {
                              tranStr = tranStr.concat("^0.00")
                            }
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^0.00")                              
                            //} 
                            //else {
                              //printZeroReserves(tranStr)
                            //}
                            tranStr = printAcctYrMthCheckInfoPymt(li.Transaction, tranStr, amySAR)
                                                   
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^" + df.format(li.Transaction.Amount))
                            tranStr = tranStr.concat("^0.00")
                            tranStr = tranStr.concat("^0.00")

                            tranStr = tranStr.concat("^" + li.Transaction.Check.Memo)
                           
                            tranStr = printZeroCeded(tranStr)
                            //tranTotpaidLoss = tranTotpaidLoss + li.Transaction.Amount
                          }
                        }
                        else
                        if (li.Transaction typeis Recovery) {
                            //paidLossDToDOut = paidLossDToDOut - li.Transaction.Amount
                            if (rptTran == true) {
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = printAcctYrMthCheckInfoRecovery(li.Transaction, tranStr, amySAR)
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^" + df.format(-1 * li.Transaction.Amount))  
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^" + li.Transaction.Comments)
                           
                              tranStr = printZeroCeded(tranStr)
                            }
                        }
                    }
                    else
                    if (li.Transaction.Exposure.ExposureType == ExposureType.TC_EL_INDEMNITY and li.Transaction.CostType == CostType.TC_EXPENSE and inclTranInTotals) {
                        if (li.Transaction typeis Reserve) {
                         // reserveLossNoDToD = reserveLossNoDToD + li.Transaction.Amount
                          if (rptTran == true) {
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^" + df.format(li.Transaction.Amount))
                             tranStr = tranStr.concat("^0.00")
    
                            tranStr = printAcctYrMthCheckInfoRes(li.Transaction, tranStr, amySAR)
                            tranStr = printZeroPaid(tranStr)
                            tranStr = tranStr.concat("^" + li.Transaction.Comments)
                             
                            tranStr = printZeroCeded(tranStr)
                            //tranTotRsvA = tranTotRsvA + li.Transaction.Amount
                          }
                        }
                        else
                        if (li.Transaction typeis Payment) {
                         // paidLossNoDToD = paidLossNoDToD + li.Transaction.Amount
                          if (rptTran == true) {
                            //if (aClaim.CloseDate == null or aClaim.CloseDate > lastRunTran) {
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             if (paymentType <> "Supplemental") {
                             tranStr = tranStr.concat("^" + df.format(-1 * li.Transaction.Amount))
                             }
                             else
                             {
                               tranStr = tranStr.concat("^0.00")
                             }
                             tranStr = tranStr.concat("^0.00")
                            //} 
                            //else {
                             // printZeroReserves(tranStr)
                            //}
                            tranStr = printAcctYrMthCheckInfoPymt(li.Transaction, tranStr, amySAR)
                                 
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^0.00")
                             tranStr = tranStr.concat("^" + df.format(li.Transaction.Amount))  
                             tranStr = tranStr.concat("^0.00")

                            tranStr = tranStr.concat("^" + li.Transaction.Check.Memo)
                           
                            tranStr = printZeroCeded(tranStr)
                            //tranTotpaidLoss = tranTotpaidLoss + li.Transaction.Amount
                          }
                        }
                        else
                        if (li.Transaction typeis Recovery) {
                           // paidLossNoDToD = paidLossNoDToD - li.Transaction.Amount
                            if (rptTran == true) {
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              
                              tranStr = printAcctYrMthCheckInfoRecovery(li.Transaction, tranStr, amySAR)
                                                   
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^0.00")
                              tranStr = tranStr.concat("^" + df.format(-1 * li.Transaction.Amount)) 
                              tranStr = tranStr.concat("^0.00")

                              tranStr = tranStr.concat("^" + li.Transaction.Comments)
                           
                              tranStr = printZeroCeded(tranStr)
                            }
                         }
                     }
                    if (rptTran == true) {
                      //tranStr = tranStr.concat("^" + aClaim.Policy.SubmissionIDExt)
                      if (li.Transaction typeis Payment) {
                        var payToLineExt = li.Transaction.Check.PayToLine1Ext
                        if (li.Transaction.Check.PayToLine2Ext != null) {
                          payToLineExt = payToLineExt + " " + li.Transaction.Check.PayToLine2Ext
                        }
                        if (li.Transaction.Check.PayToLine3Ext != null) {
                          payToLineExt = payToLineExt + " " + li.Transaction.Check.PayToLine3Ext
                        }
                        if (li.Transaction.Check.PayToLine4Ext != null) {
                          payToLineExt = payToLineExt + " " + li.Transaction.Check.PayToLine4Ext
                        }
                        if (li.Transaction.Check.PayToLine5Ext != null) {
                          payToLineExt = payToLineExt + " " + li.Transaction.Check.PayToLine5Ext
                        }
                        if (li.Transaction.Check.PayToLine6Ext != null) {
                          payToLineExt = payToLineExt + " " + li.Transaction.Check.PayToLine6Ext
                        }
                        tranStr = tranStr.concat("^" + payToLineExt)
                        //tranStr = tranStr.concat("^" + li.Transaction.Check.Payees[0].ClaimContact.DisplayName)                     
                      }
                      else {
                        tranStr = tranStr.concat("^")
                      }
                      if (li.Transaction typeis Payment) {
                        tranStr = tranStr.concat("^" + df.format(li.Transaction.Amount))
                        //tranTotInvAmt = tranTotInvAmt + li.Transaction.Amount
                      }
                      else {
                        tranStr = tranStr.concat("^")
                      }
                      tranStr = tranStr.concat("^" + li.Transaction.ID)
                      tranStr = tranStr.concat("^" + aClaim.Policy.PolicyType)
                      tranStr = tranStr.concat("^" + aClaim.Policy.PolicyType + aClaim.Policy.PolicyNumber)
                      tranStr = tranStr.concat("^" + aClaim.Policy.EffectiveDate + "|")
                      tranMap.put(li.Transaction.ID, tranStr)
                      if (cntUpd == false) {
                      	tranCnt = tranCnt + 1
                        cntUpd = true
                      }
                      //tranRecCnt = tranRecCnt + 1
                    }
                 }     
		}
             }
            }     
              //print(aClaim + " : " + (transaction as TransactionDefaultView).Transaction.Subtype + " : " + (transaction as TransactionDefaultView).Transaction.TransactionAmount);

          }
          for (entry in tranMap.entrySet()) {
            var key = entry.getKey()
            var value = entry.getValue()

            pwTran.println(value)
          }
          tranMap.clear()
          if (rptClaim == false and validClmStatus) {
            if (aClaim.Matters.Count > 0) {
              if (aClaim.Matters[0].UpdateTime > lastRunTran) {
                rptClaim = true
              }
            }
          }
          var journal = ""
          var renewal = ""
          var caseSummary = ""
          var factSummary = ""
          var noteNbr = 0
          var createTimePotDev = "1900-01-01 01:01:0001.001" as java.util.Date
          var createTimeFactSum = "1900-01-01 01:01:0001.001" as java.util.Date
          while (!aClaim.Notes.IsEmpty and noteNbr < aClaim.Notes.Count and aClaim.Notes[noteNbr] <> null and validClmStatus) {
            if (aClaim.Notes[noteNbr].Topic == NoteTopicType.TC_GENERAL) {
              if (aClaim.Notes[noteNbr].UpdateTime > lastRunTran) {
                rptClaim = true
              }
              if (journal.length + aClaim.Notes[noteNbr].Body.length + 1 < 65000) {
                aClaim.Notes[noteNbr].Body = aClaim.Notes[noteNbr].Body.replaceAll("[|]", "-")
                aClaim.Notes[noteNbr].Body = aClaim.Notes[noteNbr].Body.replaceAll("\\^", " ")
                if (journal.length > 0) {
                  journal = journal + "\r\n" + dateFormatText.format(aClaim.Notes[noteNbr].CreateTime) + "\r" + aClaim.Notes[noteNbr].Body
                }
                else {
                  journal = dateFormatText.format(aClaim.Notes[noteNbr].CreateTime) + "\r" + aClaim.Notes[noteNbr].Body
                }        
              }
            }
            else
            if (aClaim.Notes[noteNbr].Topic == NoteTopicType.TC_UNDERWRITECLAIMNOTE and validClmStatus) {
              if (aClaim.Notes[noteNbr].UpdateTime > lastRunTran) {
                rptClaim = true
              }
              if (renewal.length + aClaim.Notes[noteNbr].Body.length + 1 < 65000) {
                aClaim.Notes[noteNbr].Body = aClaim.Notes[noteNbr].Body.replaceAll("[|]", "-")
                aClaim.Notes[noteNbr].Body = aClaim.Notes[noteNbr].Body.replaceAll("\\^", " ")
                if (renewal.length > 0) {
                  renewal = renewal + "\r\n" + dateFormatText.format(aClaim.Notes[noteNbr].CreateTime) + "\r" + aClaim.Notes[noteNbr].Body
                }
                else {
                  renewal = dateFormatText.format(aClaim.Notes[noteNbr].CreateTime) + "\r" + aClaim.Notes[noteNbr].Body
                }
              }
            }
            else
            if (aClaim.Notes[noteNbr].Topic == NoteTopicType.TC_POTDEV and validClmStatus) {
              if (caseSummary.length + aClaim.Notes[noteNbr].Body.length + 1 < 65000) {
                if (aClaim.Notes[noteNbr].UpdateTime > lastRunTran) {
                  rptClaim = true
                }
                if (aClaim.Notes[noteNbr].CreateTime > createTimePotDev) {
                  aClaim.Notes[noteNbr].Body = aClaim.Notes[noteNbr].Body.replaceAll("[|]", "-")
                  aClaim.Notes[noteNbr].Body = aClaim.Notes[noteNbr].Body.replaceAll("\\^", " ")
                  caseSummary = dateFormatText.format(aClaim.Notes[noteNbr].CreateTime) + "\r" + aClaim.Notes[noteNbr].Body
                  createTimePotDev = aClaim.Notes[noteNbr].UpdateTime
                }
              }
            }
            else
            if (aClaim.Notes[noteNbr].Topic == NoteTopicType.TC_FACTSUM and validClmStatus) {
              if (factSummary.length + aClaim.Notes[noteNbr].Body.length + 1 < 65000) {
                if (aClaim.Notes[noteNbr].UpdateTime > lastRunTran) {
                  rptClaim = true
                }
                if (aClaim.Notes[noteNbr].CreateTime > createTimeFactSum) {
                  aClaim.Notes[noteNbr].Body = aClaim.Notes[noteNbr].Body.replaceAll("[|]", "-")
                  aClaim.Notes[noteNbr].Body = aClaim.Notes[noteNbr].Body.replaceAll("\\^", " ")
                  factSummary = dateFormatText.format(aClaim.Notes[noteNbr].CreateTime) + "\r" + aClaim.Notes[noteNbr].Body
                  createTimeFactSum = aClaim.Notes[noteNbr].UpdateTime
                }
              }
            }
            noteNbr = noteNbr + 1
          }
          var covgCounselTaxID = ""
          var covgCounselName = ""
          var defCounselTaxID = ""
          var defCounselName = ""
          if (validClmStatus) {
            var clmContactList = aClaim.Contacts

            for (contact in clmContactList) {
              var rolesList = contact.Roles
              for (role in rolesList) {
                 if (role.DisplayName == ContactRole.TC_COVERAGECOUNSEL.DisplayName) {
                    covgCounselTaxID = role.Contact.TaxID
                    if (role.Contact typeis Person) {
                      covgCounselName = role.Contact.FirstName + " " + role.Contact.LastName
                    }
                    else
                    if (role.Contact typeis Company) {
                      if (role.Contact.Name2Ext <> null) {
                        covgCounselName = role.Contact.Name + role.Contact.Name2Ext
                      }
                      else {
                        covgCounselName = role.Contact.Name
                      }
                    }
                    else
                    {
                      print("Error: Coverage Counsel Contact is a Place")
                    }
                    if (role.UpdateTime > lastRunTran) {
                      rptClaim = true
                    }
               	  }
               	  else
               	  if (role.DisplayName == ContactRole.TC_DEFENSECOUNSEL.DisplayName) {
                    defCounselTaxID = role.Contact.TaxID
                    if (role.Contact typeis Person) {
                      defCounselName = role.Contact.FirstName + " " + role.Contact.LastName
                    }
                    else
                    if (role.Contact typeis Company) {
                      if (role.Contact.Name2Ext <> null) {
                        defCounselName = role.Contact.Name + role.Contact.Name2Ext
                      }
                      else {
                        defCounselName = role.Contact.Name
                      }
                    }
                    else
                    {
                      print("Error: Defense Counsel Contact is a Place")
                    }
                    if (role.UpdateTime > lastRunTran) {
                  	  rptClaim = true
                    }
               	  }
             	}
              }
          }

          if (rptClaim == true) {
            pwSum.print(aClaim.ClaimNumber)
            //print("rsv A Ind " + reserveLossNoDToD + " paid A Ind " + paidLossNoDToD + "rsv B Ind " + reserveLossNoDToD + " paid A Ind " + paidLossNoDToD + " rsv B1 " + reserveLossDToDIn + " pay B1 " + paidLossDToDIn +
              //    " rsv B2 " + reserveLossDToDOut + " pay B2 " + paidLossDToDOut + " pay B3 " + paidLossNoDToD + " rsv CLAE " + reserveLossCLAE + " pay CLAE " + paidLossCLAE)
            //paidLossNoDToD = paidLossNoDToD - paidLossNoDToD

           // reserveLossDToDIn = reserveLossDToDIn - paidLossDToDIn
           // if (reserveLossDToDIn < 0) {
           //   reserveLossDToDIn = 0
           // }
           // reserveLossDToDOut = reserveLossDToDOut - paidLossDToDOut
           // if (reserveLossDToDOut < 0) {
           //   reserveLossDToDOut = 0
           // }
           // reserveLossCLAE = reserveLossCLAE - paidLossCLAE
           // if (reserveLossCLAE < 0) {
           //   reserveLossCLAE = 0
           // }
            pwSum.print("^" + df.format(reserveLossNoDToD))
            pwSum.print("^" + df.format(reserveLossDToDIn))
            pwSum.print("^" + df.format(reserveExpDToDIn))
            pwSum.print("^" + df.format(reserveLossDToDOut))
            pwSum.print("^" + df.format(reserveExpDToDOut))
            pwSum.print("^" + df.format(reserveExpNoDToD))
            pwSum.print("^" + df.format(reserveExpLAE))
            pwSum.print("^" + aClaim.RptCreateDateExt)
            //if (claimsMadeInd == true) {
              pwSum.print("^" + aClaim.ReportedDate)
            //}
            //else {
            //  pwSum.print("^")  
            //}
            pwSum.print("^" + aClaim.ex_DetailLossCause.DisplayName)
            pwSum .print("^" + aClaim.DetailLossCause2Ext.DisplayName)
            pwSum.print("^" + aClaim.DetailLossCause3Ext.DisplayName)
            pwSum.print("^" + df.format(paidLossNoDToD))
            pwSum.print("^" + df.format(paidLossDToDIn))
            pwSum.print("^" + df.format(paidExpDToDIn))
            pwSum.print("^" + df.format(paidLossDToDOut))
            pwSum.print("^" + df.format(paidExpDToDOut))
            pwSum.print("^" + df.format(paidExpNoDToD))
            pwSum.print("^" + df.format(paidExpLAE))
            //pwSum.print("^" + aClaim.AssignedUser.ex_Signature)
            pwSum.print("^" + aClaim.AssignedUser.Contact.EmailAddress1)
            pwSum.print("^" + aClaim.ClaimTypeExt.DisplayName)
            if (aClaim.NoticeDateExt != null) {
           	pwSum.print("^" + aClaim.NoticeDateExt)
            }
            else
            {
                pwSum.print("^" + aClaim.ReportedDate)
            }
            pwSum.print("^" + aClaim.LossCause.DisplayName)
            //if (aClaim.plaintiff.Count > 0) {
            //  pwSum.print("^" + aClaim.plaintiff[0].DisplayName)
            //}
            //else {
            pwSum.print("^")
            //}
            pwSum.print("^" + claimantName)

            pwSum.print("^" + journal) //Journal - Topic in Claim Notes
            pwSum.print("^" + renewal) //Renewal Comments - Topic in Claim Notes
            pwSum.print("^" + df.format(cededLossRes))
            pwSum.print("^" + df.format(cededLAERes))
            pwSum.print("^" + df.format(cededLossPaid))
            pwSum.print("^" + df.format(cededLAEPaid))
            //sumTotRsvA = sumTotRsvA + reserveLossNoDToD
            //sumTotRsvB = sumTotRsvB + reserveLossDToDIn
            //sumTotRsvB2 = sumTotRsvB2 + reserveLossDToDOut
            //sumTotRsvC = sumTotRsvC + reserveLossCLAE
            //sumTotpaidLoss = sumTotpaidLoss + paidLossNoDToD
            //sumTotPaidB = sumTotPaidB + paidLossDToDIn
            //sumTotpaidLoss = sumTotpaidLoss + paidLossDToDOut
            //sumTotpaidLoss = sumTotpaidLoss + paidLossNoDToD
            //sumTotPaidC = sumTotPaidC + paidLossCLAE
            //sumTotCedLossRes = sumTotCedLossRes + cededLossRes
            //sumTotCedLAERes = sumTotCedLAERes + cededLAERes
            //sumTotCedLossPd = sumTotCedLossPd + cededLossPaid
            //sumTotCedLAEPd = sumTotCedLAEPd + cededLAEPaid
            var potentialDevAmt = 0.0
            potentialDevAmt = aClaim.PotentialDevelopmentExt as double
            pwSum.print("^" + df.format(potentialDevAmt))
            pwSum.print("^" + caseSummary) //Case Summary
            //pwSum.print("^" + aClaim.Policy.SubmissionIDExt) //Acct ID (Submission ID)
            pwSum.print("^" + df.format(deductible))
          //pw.print(",") //Claim Retentions (Deductible)
            if (aClaim.Matters.Count > 0) {
              pwSum.print("^" + aClaim.Matters[0].ClassActionExt)
            }
            else {
              pwSum.print("^false")
            }
            if (aClaim.Matters.Count > 0) {
              pwSum.print("^" + aClaim.Matters[0].DerivativeExt)
            }
            else {
              pwSum.print("^false")
            }
            pwSum.print("^" + aClaim.ClaimRelatedTypeExt.DisplayName)
            if (aClaim.BodilyInjuryExt != null) {
              pwSum.print("^" + aClaim.BodilyInjuryExt)
            }
            else {
              pwSum.print("^false")
            }
            if (aClaim.ASideDICExt != null) {
              pwSum.print("^" + aClaim.ASideDICExt)
            }
            else {
              pwSum.print("^false")
            }
            pwSum.print("^" + covgCounselTaxID)
            pwSum.print("^" + covgCounselName)
            pwSum.print("^" + defCounselTaxID)
            pwSum.print("^" + defCounselName)
            pwSum.print("^" + generateNewTranID(lobPrefix))
            pwSum.print("^" + aClaim.Policy.PolicyType)
            pwSum.print("^" + aClaim.Policy.PolicyType + aClaim.Policy.PolicyNumber)
            pwSum.print("^" + aClaim.Policy.EffectiveDate)
            if (aClaim.State == "closed") {
              pwSum.print("^CLO")
            }
            else
            if (aClaim.ReOpenDate <> null) {
              pwSum.print("^REO")
            }
            else {
              pwSum.print("^")
            }
            if (aClaim.CloseDate != null) {
              pwSum.print("^" + aClaim.CloseDate)
            }
            else {
              pwSum.print("^")
            }
            if (aClaim.ReOpenDate != null) {
              pwSum.print("^" + aClaim.ReOpenDate)
            }
            else {
              pwSum.print("^")
            }
            if (aClaim.ReopenedReason != null) {
              pwSum.print("^" + aClaim.ReopenedReason)
            }
            else {
              pwSum.print("^")
            }
            pwSum.print("^" + factSummary) //Case Summary
            if (legalExpenseFound) {
              var saveMatter = aClaim.Matters[0]
              for (matter in aClaim.Matters) {
                if (matter.StateExt <> null and matter.CreateTime > saveMatter.CreateTime) {
                  saveMatter = matter
                }
              }
              if (saveMatter.StateExt <> null) {
             	pwSum.print("^" + saveMatter.StateExt)
             	if (saveMatter.CourtType <> null) {
              		pwSum.print("^" + saveMatter.CourtType)
                }
                else {
                    pwSum.print("^")
                }
              }
              else 
              if (jurisdictionState <> null) {
              	pwSum.print("^" + jurisdictionState + "^")
              }
              else {
               pwSum.print("^^")
              }      
            }
            else 
            if (jurisdictionState <> null) {
              pwSum.print("^" + jurisdictionState + "^")
            }
            else {
              pwSum.print("^^")
            }
            if (coverageType <> null) {
              pwSum.println("^" + coverageType + "|")
            }
            else {
              pwSum.println("^|")
            }
            
            sumCnt = sumCnt + 1
            //sumRecCnt = sumRecCnt + 1
          }
        }
     }
   
        //var reinsurance_service_url.local="https://sstdev.td.afg:1024/sst/ceded.loss_1?WSDL"
    }Catch(ex: Exception){
       util.ErrorHandling.GAICErrorHandling.logError(null, lobPrefix + "ClaimsRptImpl.gs", ex, null)
       gw.api.util.Logger.logError(ex.Message)
       gw.api.util.Logger.logError(ex.printStackTrace())
    }
    try {
       //tranStr = tranStr.concatln(tranRecCnt + "^" + tranTotRsvA + "^" + tranTotRsvB + "^" + tranTotRsvB2 + "^" + tranTotRsvC + "^" + tranTotpaidLoss + "^" + tranTotPaidB + "^" + tranTotpaidLoss + "^" + tranTotpaidLoss + "^" + tranTotPaidC + "^" + tranTotInvAmt)
       //pwSum.println(sumRecCnt + "^" + sumTotRsvA + "^" + sumTotRsvB + "^" + sumTotRsvB2 + "^" + sumTotRsvC + "^" + sumTotpaidLoss + "^" + sumTotPaidB + "^" + sumTotpaidLoss + "^" + sumTotpaidLoss + "^" + sumTotPaidC + "^" + sumTotCedLossRes + "^" + sumTotCedLAERes + "^" + sumTotCedLossPd + "^" + sumTotCedLAEPd)
        pwBal.println(tranCnt + "^" + sumCnt + "^" + runDate + "|")
        pwSum.flush();
	        
        //Close the Print Writer
        pwSum.close();

        //Flush the output to the file
        pwTran.flush();
	        
        //Close the Print Writer
        pwTran.close();

        pwBal.flush();
        
        pwBal.close();

     } catch (fe : FileNotFoundException) {
		fe.printStackTrace();
     }
     		var prop = System.getProperties();
                var PROPERTY_PATH = "etc"
		//var mailPropsFile = "mail.properties"
		//var mailProps = Environment.getInstance().createPropertiesForPath(PROPERTY_PATH, mailPropsFile);
                var mailProps : Properties = new Properties()
                //mailProps.load(new FileInputStream("modules\\configuration\\config\\ELDclaimsreporting\\mail.properties"))
                
		// Read properties file.
		//PropertiesUtil.loadPropertiesFromFile(mailProps, mailPropsFile);
                var ses1 = Session.getDefaultInstance(prop, null)
                var msg = new MimeMessage(ses1)
     		msg.setFrom(new InternetAddress("ClaimCenter@gaig.com"))

     		var to_address = DocumentConstants.TO

     		if (env == Environment.PROD) {
     		  to_address = "ClaimCenterSupport@gaig.com"
     		}
     		else
     		{
     		  to_address = "ClaimCenterTesting@gaig.com"
     		}

		//var commaPos = to_address.indexOf(",")
		//var to_addr_sub = "
		//while (commaPos > 0) {
		//	to_addr_sub = to_address.substring(0, commaPos);
		//	msg.addRecipient(Message.RecipientType.TO, new InternetAddress(to_addr_sub));
		//	to_address = to_address.substring(commaPos + 1);
		//	commaPos = to_address.indexOf(",");
		//}

		msg.addRecipient(Message.RecipientType.TO, new InternetAddress(to_address));

		var messageBodyPart = new MimeBodyPart();
		print(env.toString())
                if (env <> Environment.PROD) {
		  msg.setSubject(lobPrefix + " Claims Reporting File " + env);
                }
                else
                {
                  msg.setSubject(lobPrefix + " Claims Reporting File ")
                }
     		var multipart = new MimeMultipart()
     		
          	messageBodyPart.setText("Attached you'll find a file containing all " + lobPrefix + " Claims Reporting data produced since the last report")

		multipart.addBodyPart(messageBodyPart)
		messageBodyPart = new MimeBodyPart()
		var dataHandler = new DataHandler(new FileDataSource(outputSumFile))
		messageBodyPart.setDisposition(MimeBodyPart.ATTACHMENT)
		messageBodyPart.setFileName(excelSumFileName)
		messageBodyPart.setDataHandler(dataHandler)
		messageBodyPart.setHeader("Content-Type", "text/plain")
		multipart.addBodyPart(messageBodyPart)
		
	        messageBodyPart = new MimeBodyPart()
		var dataHandler2 = new DataHandler(new FileDataSource(outputTranFile))
		messageBodyPart.setDisposition(MimeBodyPart.ATTACHMENT)
		messageBodyPart.setFileName(excelTranFileName)
		messageBodyPart.setDataHandler(dataHandler2)
		messageBodyPart.setHeader("Content-Type", "text/plain")
		multipart.addBodyPart(messageBodyPart)

		msg.setContent(multipart)
		msg.setSentDate(new java.util.Date())

		gw.api.util.Logger.logInfo("msg=" + msg)
		if (env <> Environment.PROD) {
	          Transport.send(msg)
		}
   }
 //  public class DocumentConstants() {

//	 var CC_ENV_PROPERTY = "cc.env"
//	var MAIL_HOST = "doc.mail.host"
//	var FROM_ADDRESS = "doc.mail.from"
//	var TO = "doc.mail.to"
//	var SUBJECT = "doc.mail.subject"
//	var MESSAGE = "doc.mail.message"
//	var NOERRMSG = "doc.mail.noerrmsg"
//	var META_ATTACH_NAME = "doc.metaAttachName"
//	var META_MIME_TYPE = "doc.metaMimeType"
//	var ECF_URL = "doc.ecf.url"
//	private  DocumentConstants() {
//	}
  //  }
  public function printAcctYrMthCheckInfoRes(transaction : Reserve, tranStr : String, amySAR : AMYSearchAndRetrieval) : String {
    var actgMthYear = new AccountingMonthAndYearResponseDTO()
    var gcProcDt = new GregorianCalendar()
    gcProcDt.setTimeInMillis(transaction.UpdateTime.Time)
    var dfProcDt = DatatypeFactory.newInstance()
    var gcTransEffDt = new GregorianCalendar()
    gcTransEffDt.setTimeInMillis(transaction.TransactionDate.getTime())
    var dfTransEffDt = DatatypeFactory.newInstance()
    actgMthYear = amySAR.findAMY(dfTransEffDt.newXMLGregorianCalendar(gcTransEffDt), dfProcDt.newXMLGregorianCalendar(gcProcDt))
    var actgMthStr = Integer.toString(actgMthYear.AccountingMonth)
    actgMthStr = actgMthStr.leftPad(2).replace(" ",0)
    tranStr = tranStr.concat("^" + actgMthYear.AccountingYear + actgMthStr)
    tranStr = tranStr.concat("^")
    tranStr = tranStr.concat("^")
    return tranStr
  }
  
  public function printAcctYrMthCheckInfoPymt(transaction : Payment, tranStr : String, amySAR : AMYSearchAndRetrieval) : String {
    var actgMthYear = new AccountingMonthAndYearResponseDTO()
    var gcProcDt = new GregorianCalendar()
    gcProcDt.setTimeInMillis(transaction.UpdateTime.Time)
    var dfProcDt = DatatypeFactory.newInstance()
    var gcTransEffDt = new GregorianCalendar()
    gcTransEffDt.setTimeInMillis(transaction.TransactionDate.getTime())
    var dfTransEffDt = DatatypeFactory.newInstance()
    actgMthYear = amySAR.findAMY(dfTransEffDt.newXMLGregorianCalendar(gcTransEffDt), dfProcDt.newXMLGregorianCalendar(gcProcDt))
    var actgMthStr = Integer.toString(actgMthYear.AccountingMonth)
    actgMthStr = actgMthStr.leftPad(2).replace(" ",0)
    tranStr = tranStr.concat("^" + actgMthYear.AccountingYear + actgMthStr)
    if (transaction typeis Payment) {
      tranStr = tranStr.concat("^" + transaction.Check.IssueDate)
    }
    else {
      tranStr = tranStr.concat("^")
    }
    if (transaction typeis Payment) {
      tranStr = tranStr.concat("^" + transaction.Check.CheckNumber)
    }
    else {
      tranStr = tranStr.concat("^")
    }
    return tranStr
  }
  
  public function printAcctYrMthCheckInfoRecovery(transaction : Recovery, tranStr : String, amySAR : AMYSearchAndRetrieval) : String {
    var actgMthYear = new AccountingMonthAndYearResponseDTO()
    var gcProcDt = new GregorianCalendar()
    gcProcDt.setTimeInMillis(transaction.UpdateTime.Time)
    var dfProcDt = DatatypeFactory.newInstance()
    var gcTransEffDt = new GregorianCalendar()
    gcTransEffDt.setTimeInMillis(transaction.TransactionDate.getTime())
    var dfTransEffDt = DatatypeFactory.newInstance()
    actgMthYear = amySAR.findAMY(dfTransEffDt.newXMLGregorianCalendar(gcTransEffDt), dfProcDt.newXMLGregorianCalendar(gcProcDt))
    var actgMthStr = Integer.toString(actgMthYear.AccountingMonth)
    actgMthStr = actgMthStr.leftPad(2).replace(" ",0)
    tranStr = tranStr.concat("^" + actgMthYear.AccountingYear + actgMthStr)
    tranStr = tranStr.concat("^")
    tranStr = tranStr.concat("^")
    return tranStr
  }
  
  public function printZeroPaid(tranStr : String) : String {
    tranStr = tranStr.concat("^0.00")
    tranStr = tranStr.concat("^0.00")
    tranStr = tranStr.concat("^0.00")
    tranStr = tranStr.concat("^0.00")
    tranStr = tranStr.concat("^0.00")
    tranStr = tranStr.concat("^0.00")
    tranStr = tranStr.concat("^0.00")
    return tranStr
  }
  
  public function printZeroReserves(tranStr : String) : String {
    tranStr = tranStr.concat("^0.00")
    tranStr = tranStr.concat("^0.00")
    tranStr = tranStr.concat("^0.00")
    tranStr = tranStr.concat("^0.00")
    tranStr = tranStr.concat("^0.00")
    tranStr = tranStr.concat("^0.00")
    tranStr = tranStr.concat("^0.00")
    return tranStr
  }
      
  public function printZeroCeded(tranStr : String) : String {
    tranStr = tranStr.concat("^0.00")
    tranStr = tranStr.concat("^0.00")
    tranStr = tranStr.concat("^0.00")
    tranStr = tranStr.concat("^0.00")
    return tranStr
  }
     
  public function calculateReinsurancesExtTotalPaid(reinsContracts : CededSummaryFeatureContract[], exposure: Exposure) : BigDecimal {
    var totalPaid: BigDecimal = 0;
    
    for (reinsContract in reinsContracts) {
      if(exposure.ClaimOrder == reinsContract.ClaimFeatOrderNumber){
        totalPaid = totalPaid + reinsContract.TotalPaid;
      }
    }
    return totalPaid;
  }

  public function calculateReinsurancesExtCededReserveAmount(reinsContracts : CededSummaryFeatureContract[], exposure: Exposure) : BigDecimal {
    var ceded: BigDecimal = 0;
    
    for (reinsContract in reinsContracts) {
      if(exposure.ClaimOrder == reinsContract.ClaimFeatOrderNumber){
        ceded = ceded + reinsContract.OpenReserves;
      }
    }
    
    return ceded
  }

  public function calculateReinsurancesExtRecoveryReceipts(reinsContracts : CededSummaryFeatureContract[], exposure: Exposure) : BigDecimal {
    var recoveryReceipts: BigDecimal = 0;
    
    for (reinsContract in reinsContracts) {
      if(exposure.ClaimOrder == reinsContract.ClaimFeatOrderNumber){
        recoveryReceipts = recoveryReceipts + reinsContract.RecoveryReceipts;
      }
    }
    return recoveryReceipts;
  }
  
  //****** 9/7/10 erawe - for calculations on the ReserveReinsurancesExtLV screen *******/
  public function calculateReinsurancesExtTotalPaid(reinsContracts : CededSummaryFeatureContract[], exposure: Exposure, costType: String) : BigDecimal {
    var totalPaid: BigDecimal = 0;
    
    for (reinsContract in reinsContracts) {
      var ct: String = reinsContract.FinancialLossCategory
      if(ct.equals( "claimcost" )){
        ct = "Loss"
      }
        else{
          ct = "Expense"
        }
      if(exposure.ClaimOrder == reinsContract.ClaimFeatOrderNumber and costType.equals( ct )){
        totalPaid = totalPaid + reinsContract.TotalPaid;
      }
    }
    return totalPaid;
  }
  
  public function calculateReinsurancesExtCededReserveAmount(reinsContracts : CededSummaryFeatureContract[], exposure: Exposure, costType: String) : BigDecimal {
    var ceded: BigDecimal = 0;
    
    for (reinsContract in reinsContracts) {
      var ct: String = reinsContract.FinancialLossCategory
      if(ct.equals( "claimcost" )){
        ct = "Loss"
      }
        else{
          ct = "Expense"
        }
      if(exposure.ClaimOrder == reinsContract.ClaimFeatOrderNumber and costType.equals( ct )){
        ceded = ceded + reinsContract.OpenReserves;
      }
    }
    return ceded;
  }

  public function calculateReinsurancesExtRecoveryReceipts(reinsContracts : CededSummaryFeatureContract[], exposure: Exposure,costType: String) : BigDecimal {
    var recoveryReceipts: BigDecimal = 0;
    
    for (reinsContract in reinsContracts) {
      var ct: String = reinsContract.FinancialLossCategory
      if(ct.equals( "claimcost" )){
        ct = "Loss"
      }
        else{
          ct = "Expense"
        }
      if(exposure.ClaimOrder == reinsContract.ClaimFeatOrderNumber and costType.equals( ct )){
        recoveryReceipts = recoveryReceipts + reinsContract.RecoveryReceipts;
      }
    }
    return recoveryReceipts;
  } 
  

  /******** Claim Level Calculations for Reinsurance GrandTotal Summary Data **********/
  public function calculateReinsurancesExtTotalPaid(reinsContracts : CededSummaryFeatureContract[]) : BigDecimal {
    var totalPaid: BigDecimal = 0;
    
    for (reinsContract in reinsContracts) {
      totalPaid = totalPaid + reinsContract.TotalPaid;
    }
    return totalPaid;
  }

  public function calculateReinsurancesExtCededReserveAmount(reinsContracts : CededSummaryFeatureContract[]) : BigDecimal {
    var ceded: BigDecimal = 0;
    
    for (reinsContract in reinsContracts) {
      ceded = ceded + reinsContract.OpenReserves;
    }
    return ceded;
  }

  public function calculateReinsurancesExtRecoveryReceipts(reinsContracts : CededSummaryFeatureContract[]) : BigDecimal {
    var recoveryReceipts: BigDecimal = 0;
    
    for (reinsContract in reinsContracts) {
      recoveryReceipts = recoveryReceipts + reinsContract.RecoveryReceipts;
    }
    return recoveryReceipts;
  }

  //9/15/10 erawe - use to retrieve contract names
  public function getContractName(reinsContracts : CededSummaryFeatureContract[], exposure : Exposure, costType : String): CededSummaryFeatureContract[] {
    var list = new java.util.ArrayList()
    for (reinsContract in reinsContracts) {
      var ct: String = reinsContract.FinancialLossCategory
      if(ct.equals( "claimcost" )){
        ct = "Loss"
      }
        else{
          ct = "Expense"
        }
      if(exposure.ClaimOrder == reinsContract.ClaimFeatOrderNumber and costType.equals( ct )){
        
        list.add( reinsContract )
      }
    }
    return list.toArray() as CededSummaryFeatureContract[]
  }
  
  //9/2/10 erawe - use to retrieve costtype
  public function getCostType(reinsContracts : CededSummaryFeatureContract[], exposure : Exposure): String[]{
    var hasLoss : boolean = false
    var hasExp : boolean = false
    for (reinsContract in reinsContracts) {
       if(exposure.ClaimOrder == reinsContract.ClaimFeatOrderNumber){
         if("claimcost" == reinsContract.FinancialLossCategory){
           hasLoss = true
         }
          else{
            hasExp = true
          }
          if(hasLoss and hasExp){
            return new String[] {"Loss", "Expense"}
          }
       }
    }
    if(hasLoss){
      return new String[] {"Loss"}
    }
    if(hasExp){
      return new String[] {"Expense"}
    }
    return null
  }
  
  // 9/17/10 function to format BigDecimal as a String for financial data
  public static function formatReinsuranceValue(valueToFormat:BigDecimal):String{
    var formatedValue:String = (new java.text.DecimalFormat("$###,####,##0.00;($-###,####,##0.00)")).format(valueToFormat)
    return formatedValue;
  }
  
  //10/27/2010 function to concatenate the contract number and name
  public static function formatContractNumberAndName(contractNumber:String, contractName:String):String {
    var contractNumberAndName:String = contractNumber.concat(" - ").concat(contractName)
    return contractNumberAndName;
  }
   
  public function generateNewTranID( lobPrefix : String ) : String {
    return buildTranNumber(lobPrefix + "TranNumberSequence")
  }
  
  public function cancelNewTranID ( templateData : String, transNumber : String) : void {
  }  	 									 
  
  private function buildTranNumber( seqName : String ) : String {
    var limit = 1000000000 
    var prefixNumber:String 
    var tempPrefixNumber:String 
    var environment = gw.api.system.server.ServerUtil.getEnv()
    if (environment != null) {
      environment = environment.toLowerCase()
    }
    //print("Testing Claim number");
    var seqno = SequenceUtil.next( 1, seqName )
    
    return seqno as java.lang.String
  } 
}