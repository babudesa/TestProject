package util.gaic.EDWPayloadGen
uses entity.Policy
uses entity.RecoveryReserve
uses typekey.ExposureState
uses entity.ClaimAssociation
uses entity.Exposure
uses entity.Reserve
uses typekey.ClaimState
uses typekey.UserRole
uses util.gaic.EDWPayloadGen.EDWPayloadGenFinancialFunctions
uses entity.Check
uses entity.Activity
uses entity.UserRoleAssignment
uses entity.ClaimContact
uses entity.Exposure
uses util.gaic.EDWPayloadGen.EDWPayloadGenFeatureFunction
uses entity.Transaction
uses util.gaic.EDWPayloadGen.EDWPayloadGenNoteFunctions
uses entity.Recovery
uses util.gaic.EDWPayloadGen.EDWPayloadGenFunctionsFactory
uses java.lang.String
uses entity.Note
uses entity.Claim
uses entity.Contact
uses entity.UserContact
uses util.gaic.EDWPayloadGen.EDWPayloadGenClaimFunctions
uses util.gaic.EDWPayloadGen.EDWPayloadGenClaimContactRoleFunctions
uses util.gaic.EDWPayloadGen.EDWPayloadGenClaimContactFunction
uses util.gaic.EDWPayloadGen.EDWPayloadGenAssociationFunctions
uses util.gaic.EDWPayloadGen.EDWPayloadGenActivityFunctions
uses util.gaic.EDWPayloadGen.EDWMessagePayloadDTO
uses java.util.ArrayList
uses java.lang.Exception
uses gw.api.util.Logger
uses java.text.SimpleDateFormat
uses java.util.concurrent.TimeUnit
uses java.util.Date
uses gw.api.database.Query
uses org.apache.commons.lang.StringUtils;
class EDWPayloadGenConversionImpl {

  construct() {
  }
   
   var logger = Logger.forCategory("EDWConversionLog") 
   public function getClaimPayLoad(cc:Claim , payloadList:ArrayList<EDWMessagePayloadDTO>):ArrayList<EDWMessagePayloadDTO> {
      var claim_st_time =  gw.api.util.DateUtil.currentDate()  
      var claimPayload: String
      var claimChangePayload : String
      var ClmF=EDWPayloadGenFunctionsFactory.getClaimFunctions()
      var claimPayloadDTO : EDWMessagePayloadDTO
      try{
                 if(cc.State != "closed"){
                   claimPayloadDTO=new EDWMessagePayloadDTO()
                        claimPayloadDTO.eventName="ClaimAdded"
                        claimPayloadDTO.publicIdVal=cc.PublicID
                        claimPayload=ClmF.sendNewClaim("ClaimAdded", cc );
                        if(claimPayload.length>0){
                            claimPayloadDTO.payload=claimPayload
                            payloadList.add(claimPayloadDTO)
                            claimPayloadDTO = null
                         }
                  }else{
                      if(cc.State == "closed"){
                        var changeDto=new EDWMessagePayloadDTO()
                        changeDto.eventName="ClaimAdded"
                        changeDto.publicIdVal=cc.PublicID
                        claimChangePayload=ClmF.sendChangedClaim("ClaimAdded", cc );
                        if(claimChangePayload.length>0){
                          changeDto.payload=claimChangePayload
                          payloadList.add(changeDto)
                          changeDto = null
                         }
                       }
                        
                 }
                  
  
         }catch(e:Exception){
                //throw new Exception("<Claim><PublicId>"+cc.PublicID+"</PublicId><TransationName>ClaimAdd</TransationName><ErrorMessage>"+e.Message+"</ErrorMessage></Claim>");
                throw e
          } finally {
                claimPayloadDTO = null
                ClmF = null
                claimChangePayload = null
          }
          var claim_end_time =  gw.api.util.DateUtil.currentDate()
          if(payloadList.Count>0){
            //logger.info(cc.ClaimNumber +" No. of ClaimAdded payloads generated : "+ payloadList.Count +getExecutionTimeInterval(claim_st_time, claim_end_time))
          } 
          return payloadList 
    }
    
    public function getExposureAddedPayload(cc:Claim , payloadList:ArrayList<EDWMessagePayloadDTO>):ArrayList<EDWMessagePayloadDTO> {
         var exposure_st_time =  gw.api.util.DateUtil.currentDate()
         var expOpenPayCount=0
         var expClosedPayCount=0
         var featureF:EDWPayloadGenFeatureFunction = null
         var expAddDto:EDWMessagePayloadDTO = null
         var expChangeDto:EDWMessagePayloadDTO = null
         var featurePayload:String = null
         var featureChangedPayload:String = null
         if(cc.Exposures.Count>0){
           for (exposure in cc.Exposures) {
                  featureF = EDWPayloadGenFunctionsFactory.getFeatureFunctions()
                  if(exposure.LoadCommandID !=null) {
                      expAddDto=new EDWMessagePayloadDTO()
                      
                      try{
                          if(cc.State != "closed"){  
                            featurePayload=featureF.sendExposureAdd(exposure);
                            expAddDto.eventName="ExposureAdded"
                            expAddDto.publicIdVal=exposure.PublicID
                              if(featurePayload.length>0){
                                expAddDto.payload=featurePayload
                                expOpenPayCount= expOpenPayCount+1
                                payloadList.add(expAddDto)
                              } 
                          }else{
                            expChangeDto = new EDWMessagePayloadDTO()
                            featureChangedPayload=featureF.sendExposureChanged(exposure);
                            expChangeDto.eventName="ExposureAdded"
                            expChangeDto.publicIdVal=exposure.PublicID
                              if(featureChangedPayload.length>0){
                                expChangeDto.payload=featureChangedPayload
                                expClosedPayCount=expClosedPayCount+1
                                payloadList.add(expChangeDto)
                              } 
                          }
                       }catch(e:Exception){
                        //throw new Exception("<Exposure><PublicId>"+exposure.PublicID+"</PublicId><TransationName>ExposureAdd</TransationName><ErrorMessage>"+e.Message+"</ErrorMessage></Exposure>")
                        throw e
                       }
                       finally  {
                         featureF = null
                         expAddDto = null
                         expChangeDto = null
                         featurePayload = null
                         featureChangedPayload = null
                       }
                    }
                 }
              }
               var exposure_end_time =  gw.api.util.DateUtil.currentDate()
               if(expOpenPayCount>0){
                //logger.info(cc.ClaimNumber +" No. of ExposureAdded payloads generated : "+expOpenPayCount +getExecutionTimeInterval(exposure_st_time, exposure_end_time))
               }
                if(expClosedPayCount>0){
                //logger.info(cc.ClaimNumber +" No. of ExposureAdded payloads generated : "+expClosedPayCount +getExecutionTimeInterval(exposure_st_time, exposure_end_time))
               }
               return payloadList
    }
    
    public function getActivitiesPayload(cc:Claim , payloadList:ArrayList<EDWMessagePayloadDTO>):ArrayList<EDWMessagePayloadDTO> {
            var activity_st_time =  gw.api.util.DateUtil.currentDate()
            var activityF:EDWPayloadGenActivityFunctions = null
            var activityPayloadDto:EDWMessagePayloadDTO = null
            var activityPayload: String = null
            if(cc.Activities.Count>0){
              for (activity in cc.Activities) {
                 activityF =EDWPayloadGenFunctionsFactory.getActivityFunctions()
                 if(activity.LoadCommandID !=null){
                   activityPayloadDto=new EDWMessagePayloadDTO()
                   activityPayloadDto.publicIdVal=activity.PublicID
                   try{
                      if(cc.State != "closed"){ 
                        activityPayload=activityF.createActivityPayload(activity, "A","ActivityAdded");
                        activityPayloadDto.eventName="ActivityAdded"
                      }
//                      else{
//                        activityPayload=activityF.createActivityPayload(activity, "C","ActivityChanged");
//                        activityPayloadDto.eventName="ActivityChanged"
//                      }
                      if(activityPayload.length>0){
                       activityPayloadDto.payload=activityPayload
                       payloadList.add(activityPayloadDto) 
                     }
                    }catch(e:Exception){
                      //throw new Exception("<Activity><PublicId>"+activity.PublicID+"</PublicId><TransationName>Activity</TransationName><ErrorMessage>"+e.Message+"</ErrorMessage></Activity>")
                      throw e
                     }
                     finally
                     {
                       activityPayload = null
                       activityF = null
                       activityPayloadDto = null
                       activityPayload = null
                     }
                 }
               } 
            }
          var activty_end_time =  gw.api.util.DateUtil.currentDate()
          if(cc.Activities.Count>0){
           //logger.info(cc.ClaimNumber +" No. of Activity payloads generated : "+cc.Activities.Count +getExecutionTimeInterval(activity_st_time, activty_end_time))
          }
              
        return payloadList
    }
    public function getActivitiesChangedPayload(cc:Claim , payloadList:ArrayList<EDWMessagePayloadDTO>):ArrayList<EDWMessagePayloadDTO> {
            var activity_st_time =  gw.api.util.DateUtil.currentDate()
            var activityF:EDWPayloadGenActivityFunctions = null
            var activityPayloadDto:EDWMessagePayloadDTO = null
            var activityPayload: String = null
            if(cc.Activities.Count>0){
              for (activity in cc.Activities) {
                 activityF =EDWPayloadGenFunctionsFactory.getActivityFunctions()
                 if(activity.LoadCommandID !=null){
                   activityPayloadDto=new EDWMessagePayloadDTO()
                   activityPayloadDto.publicIdVal=activity.PublicID
                   try{
                      if(cc.State == "closed"){ 
                        activityPayload=activityF.createActivityPayload(activity, "C","ActivityChanged");
                        activityPayloadDto.eventName="ActivityChanged"
                      }
                      if(activityPayload.length>0){
                       activityPayloadDto.payload=activityPayload
                       payloadList.add(activityPayloadDto) 
                     }
                    }catch(e:Exception){
                      //throw new Exception("<Activity><PublicId>"+activity.PublicID+"</PublicId><TransationName>Activity</TransationName><EventName>ActivityChanged</EventName><ErrorMessage>"+e.Message+"</ErrorMessage></Activity>")
                      throw e
                     }
                     finally
                     {
                       activityPayload = null
                       activityF = null
                       activityPayloadDto = null
                       activityPayload = null
                     }
                 }
               } 
            }
          var activty_end_time =  gw.api.util.DateUtil.currentDate()
          if(cc.Activities.Count>0){
           //logger.info(cc.ClaimNumber +" No. of ActivityChanged payloads generated : "+cc.Activities.Count +getExecutionTimeInterval(activity_st_time, activty_end_time))
          }
              
        return payloadList
    }
    public function getMainContAndReportByPayload(cc:Claim , payloadList:ArrayList<EDWMessagePayloadDTO>):ArrayList<EDWMessagePayloadDTO> {
           var parties_st_time =  gw.api.util.DateUtil.currentDate()
           var Lpayload = new ArrayList<EDWMessagePayloadDTO>()
           var claimContactF:EDWPayloadGenClaimContactFunction = null
           var payLoadCount=0
           try{ 
               claimContactF= EDWPayloadGenFunctionsFactory.getClaimContactFunctions()
               if (cc.Policy.insured !=null and cc.maincontact != null ){
               Lpayload=claimContactF.processRelToInsuredParties( cc) 
               }
               if(Lpayload!=null and Lpayload.length>0){
                 payloadList.addAll(Lpayload)
                 payLoadCount=payLoadCount+1
               }
            }catch(e:Exception){
               throw new Exception(e.Message)
             }
             finally {
               Lpayload = null
               claimContactF = null
             }
            var parties_end_time =  gw.api.util.DateUtil.currentDate()
            if(payLoadCount>0){
             //logger.info(cc.ClaimNumber +" No. of MainContactTypeChanged payloads generated : "+payLoadCount +getExecutionTimeInterval(parties_st_time, parties_end_time))
            }
            return payloadList
     }

     public function getUserRoleAssignPayload(cc:Claim , payloadList:ArrayList<EDWMessagePayloadDTO>):ArrayList<EDWMessagePayloadDTO> {
            var userrole_st_time =  gw.api.util.DateUtil.currentDate()
            var userRoleChangePayload: String = null
            var claimContactRoleF:EDWPayloadGenClaimContactRoleFunctions = null
            var userRolePayloaddto:EDWMessagePayloadDTO = null
            var userRolePayloadListCount:int  = 0
            if(cc.AllRoleAssignments.Count >0){
              for (usrrole in cc.AllRoleAssignments) {
                  claimContactRoleF = EDWPayloadGenFunctionsFactory.getClaimContactRoleFunctions();
                    if(usrrole.LoadCommandID !=null ){
                        if (usrrole.Role.Code == "siu" or usrrole.Role.Code == "scoassist" or usrrole.Role.Code == "RecoveryAssist" or usrrole.Role.Code == "secureclaim"
                           or usrrole.Role.Code == "sensitiveclaim" or usrrole.Role.Code == "tempclaimeditor" or usrrole.Role.Code == "transferclaim"
                           or usrrole.Role.Code == "secureadjuster") {
                           if(usrrole.AssignedUser.LoadCommandID!=null   and usrrole.AssignedUser.Contact.LoadCommandID!=null) {
                               try{
                                    userRoleChangePayload=claimContactRoleF.sendUserRoleChange( usrrole, "");
                                    if(userRoleChangePayload.length>0){
                                    userRolePayloaddto=new EDWMessagePayloadDTO()
                                    userRolePayloaddto.eventName="NewClaim"
                                    userRolePayloaddto.publicIdVal=usrrole.PublicID
                                    userRolePayloaddto.payload=userRoleChangePayload
                                    userRolePayloadListCount=userRolePayloadListCount+1
                                    payloadList.add(userRolePayloaddto) 
                                  }
                                }catch(e:Exception){
                                    throw new Exception(e.Message)
                                }finally {
                                 claimContactRoleF = null
                                 userRoleChangePayload = null
                                 userRolePayloaddto = null
                               }
                           }
                       }
                   }
               }
             }
               var userrole_end_time =  gw.api.util.DateUtil.currentDate()
               if(userRolePayloadListCount>0){
                //logger.info(cc.ClaimNumber +" No. of UserRole payloads generated : "+userRolePayloadListCount +getExecutionTimeInterval(userrole_st_time, userrole_end_time))
               }
               return payloadList      
        }
        
        public function getContactPayload(cc:Claim , payloadList:ArrayList<EDWMessagePayloadDTO>):ArrayList<EDWMessagePayloadDTO> {
                var contact_st_time =  gw.api.util.DateUtil.currentDate()
                var conMessagePayload : EDWMessagePayloadDTO = null
                var claimContactF:EDWPayloadGenClaimContactFunction = null
                var conChangedPayloaddto:EDWMessagePayloadDTO = null
                var conPayloadList=new ArrayList<String>()
                var conPayloadAddCount= 0
                var conPayloadChangeCount= 0
                if(cc.Contacts.Count>0){
                  for(claimcontact in cc.Contacts){
                     if(claimcontact.LoadCommandID!=null and claimcontact.Contact.LoadCommandID!=null){
                        try{
                          claimContactF = EDWPayloadGenFunctionsFactory.getClaimContactFunctions()
                          //if(cc.State != "closed") {
                           conPayloadList=claimContactF.createClaimContactAdded(claimcontact);
                           // if(conPayloadList.length>0 ){
                             for(conpayload in conPayloadList){
                                conChangedPayloaddto=new EDWMessagePayloadDTO()
                                conChangedPayloaddto.publicIdVal=claimcontact.PublicID
                                conPayloadAddCount=conPayloadAddCount+1
                                conChangedPayloaddto.eventName="ClaimContactAdded"
                                conChangedPayloaddto.payload=conpayload
                                payloadList.add(conChangedPayloaddto) 
                              }
                            //}
//                           }else {
//                             conPayloadChangeCount = conPayloadChangeCount+1
//                             conMessagePayload=claimContactF.createClaimContactChanged(claimcontact)
//                             payloadList.add(conMessagePayload)
//                          }
                        }catch(e:Exception){
                          throw new Exception(e.Message)
                        }
                        finally {
                          claimContactF = null
                          conChangedPayloaddto = null
                          conMessagePayload = null
                        }
                    }
                  }
               }
               var contact_end_time =  gw.api.util.DateUtil.currentDate()
               if(conPayloadAddCount>0){
                //logger.info(cc.ClaimNumber +" No. of ClaimContactAdded payloads generated : "+conPayloadAddCount +getExecutionTimeInterval(contact_st_time, contact_end_time))
               }
                if(conPayloadChangeCount>0){
                //logger.info(cc.ClaimNumber +" No. of ClaimContactChanged payloads generated : "+conPayloadChangeCount +getExecutionTimeInterval(contact_st_time, contact_end_time))
               }
                if(conPayloadList.Count>0) {
                  conPayloadList.clear()
                }
               return payloadList
          
        }
        public function getAssociationPayload(cc:Claim , payloadList:ArrayList<EDWMessagePayloadDTO>):ArrayList<EDWMessagePayloadDTO> {
               var asso_start_time =  gw.api.util.DateUtil.currentDate()
               var associationF:EDWPayloadGenAssociationFunctions = null
               var claimAssociationPayDto:EDWMessagePayloadDTO = null
               var payload:String = null
               var assPayloadCount=0
               logger.info("claimassociations   count=====================" +   cc.Associations.Count)
               if(cc.Associations.Count>0){
               for( association in cc.Associations){
                 if(association.LoadCommandID!=null){
                    try{
                        associationF = EDWPayloadGenFunctionsFactory.getAssociationFunctions();
                        claimAssociationPayDto=new EDWMessagePayloadDTO()
                        claimAssociationPayDto.publicIdVal=association.PublicID
                        if(cc.State != "closed"){ 
                          payload=associationF.sendAssociationAdded(association);
                          claimAssociationPayDto.eventName="ClaimAssociationAdded"
                        }else{
                           payload=associationF.sendAssociationChanged(association);
                           claimAssociationPayDto.eventName="ClaimAssociationChanged"
                        }
                        if(payload.length>0){
                          claimAssociationPayDto.payload=payload
                          payloadList.add(claimAssociationPayDto) 
                        }
                        
                     }catch(e:Exception){
                         //throw new Exception("<Association><PublicId>"+association.PublicID+"</PublicId><TransationName>Association</TransationName><ErrorMessage>"+e.Message+"</ErrorMessage></Association>")
                         throw e

                     }
                   finally
                   {
                     associationF = null
                     claimAssociationPayDto = null
                     payload = null
                   }
                   assPayloadCount= assPayloadCount+1
                 }
                }
               }
               var asso_end_time =  gw.api.util.DateUtil.currentDate()
               if(assPayloadCount>0){
                //logger.info(cc.ClaimNumber +" No. of ClaimAssociation  payloads generated : "+assPayloadCount +getExecutionTimeInterval(asso_start_time, asso_end_time))
               }
              
               return payloadList
        }
        
        public function getCheckPayload(cc:Claim , payloadList:ArrayList<EDWMessagePayloadDTO>):ArrayList<EDWMessagePayloadDTO>{
                var chk_start_time =  gw.api.util.DateUtil.currentDate()
                var financialF:EDWPayloadGenFinancialFunctions = null
                var checkpayloadDto:EDWMessagePayloadDTO = null
                var aQueryCheckResult =Query.make(Check).compare("Claim", Equals, cc.ID).select()
                var checkPayload:String = null
                var chkPayloadCount=0
                for( chk in aQueryCheckResult){ 
                   if(chk.LoadCommandID !=null) {
                       try{
                         financialF =EDWPayloadGenFunctionsFactory.getFinancialFunctionsFunctions()
                         checkPayload=financialF.sendCheckChanges(chk);
                         if(checkPayload.length>0){
                               checkpayloadDto=new EDWMessagePayloadDTO()
                               checkpayloadDto.publicIdVal=chk.PublicID
                               checkpayloadDto.eventName="CheckChanged"
                               checkpayloadDto.payload=checkPayload
                               payloadList.add(checkpayloadDto) 

                         }
                       }catch(exp:Exception){
                          //throw new Exception("<Check><PublicId>"+chk.PublicID+"</PublicId><TransationName>Check</TransationName><ErrorMessage>"+exp.Message+"</ErrorMessage></Check>")
                          throw exp
                        } finally {
                          financialF = null
                          checkPayload = null
                          checkpayloadDto = null
                          aQueryCheckResult = null
                  
                        }
                        chkPayloadCount= chkPayloadCount+1
                    }
                }
             
               var chk_end_time =  gw.api.util.DateUtil.currentDate()
               if(chkPayloadCount>0){
               // logger.info(cc.ClaimNumber +" No. of CheckChanged payloads generated : "+chkPayloadCount +getExecutionTimeInterval(chk_start_time, chk_end_time))
               }
               return payloadList
        }
        
        function getTransactionPayload(cc:Claim , payloadList:ArrayList<EDWMessagePayloadDTO>):ArrayList<EDWMessagePayloadDTO> {
                   var transaction_start_time =  gw.api.util.DateUtil.currentDate()
                   var txnResult =Query.make(Transaction).compare("Claim", Equals, cc.ID).select()
                   var reserveCount=0
                   var recoveryCount=0
                   var recoveryReserveCount=0
                   var reservePayload:String
                   for(tran in txnResult){
                      if(tran.LoadCommandID !=null){
                      var financialF =EDWPayloadGenFunctionsFactory.getFinancialFunctionsFunctions()
                      //Generating Reserve Payload
                      if(tran typeis Reserve){  
                              try{
                                  reservePayload=financialF.sendReserveChanges(tran);
                                  if(reservePayload.length>0){
                                    var dto=new EDWMessagePayloadDTO()
                                        dto.publicIdVal=tran.PublicID
                                        dto.eventName="ReserveChanged"
                                        dto.payload=reservePayload
                                        reserveCount=reserveCount+1
                                        payloadList.add(dto) 
                                        dto = null
                                   }
                               } catch(exc:Exception) {
                                //throw new Exception("<Reserve><PublicId>"+tran.PublicID+"</PublicId><TransationName>Reserve</TransationName><ErrorMessage>"+exc.Message+"</ErrorMessage></Reserve>")
                                throw exc
                              }
                              finally
                              {
                                reservePayload = null
                              }
                        }
                        var recoveryPayload:String
                         //Generating Recovery Payload
                        if(tran typeis Recovery){ 
                          try{
                             recoveryPayload=financialF.sendRecoveryChanges(tran);
                             if(recoveryPayload.length>0){
                                    var dto=new EDWMessagePayloadDTO()
                                        dto.publicIdVal=tran.PublicID
                                        dto.eventName="RecoveryChanged"
                                        dto.payload=recoveryPayload
                                        recoveryCount=recoveryCount+1
                                        payloadList.add(dto)  
                                        dto = null
                            }
                          }
                          catch(ex:Exception) {
                           // throw new Exception("<Recovery><PublicId>"+tran.PublicID+"</PublicId><TransationName>Recovery</TransationName><ErrorMessage>"+ex.Message+"</ErrorMessage></Recovery>")
                           throw ex
                          }
                          finally
                          {
                            recoveryPayload = null
                          }
                        }
                          var recoveryReservePayload: String
                           //Generating RecoveryReserve Payload
                          if(tran typeis RecoveryReserve){ 
                            try{
                                recoveryReservePayload=financialF.sendRecoveryReserveChanges(tran);
                                if(recoveryReservePayload.length>0){
                                     var dto=new EDWMessagePayloadDTO()
                                        dto.publicIdVal=tran.PublicID
                                        dto.eventName="RecoveryReserveChanged"
                                        dto.payload=recoveryReservePayload
                                        recoveryReserveCount=recoveryReserveCount+1
                                        payloadList.add(dto) 
                                        dto = null
                                }
                             } catch(ex:Exception) {
                                //throw new Exception("<RecoveryReserve><PublicId>"+tran.PublicID+"</PublicId><TransationName>RecoveryReserve</TransationName><ErrorMessage>"+ex.Message+"</ErrorMessage></RecoveryReserve>")
                                throw ex
                            }
                            finally
                            {
                              recoveryReservePayload = null
                            }
                          }
                          //generating the payment payload
                           /*if(tran typeis Payment){ 
                             try{
                                   var paymentPayload=financialF.sendPaymentChanges(tran.Check);
                                   if(paymentPayload.length>0){
                                      dto=new EDWMessagePayloadDTO()
                                      dto.publicIdVal=tran.PublicID
                                      dto.eventName="PaymentChanged"
                                      dto.payload=paymentPayload
                                      payloadList.add(dto) 
                                   }
                             } catch(ex:Exception) {
                                    errMessage=errMessage+"<Payment><PublicId>"+tran.PublicID+"</PublicId><TransationName>PaymentStatusChanged</TransationName><ErrorMessage>"+ex.Message+"</ErrorMessage></Payment>"
                              }
                           }
                           */
               
                        }
                      }
                      var transaction_end_time =  gw.api.util.DateUtil.currentDate()
                      if(reserveCount>0){
                        //logger.info(cc.ClaimNumber +" No. of Reserve payloads generated : "+reserveCount +getExecutionTimeInterval(transaction_start_time, transaction_end_time))
                      }
                       if(recoveryCount>0){
                        //logger.info(cc.ClaimNumber +" No. of Recovery payloads generated : "+recoveryCount +getExecutionTimeInterval(transaction_start_time, transaction_end_time))
                      }
                       if(recoveryReserveCount>0){
                        //logger.info(cc.ClaimNumber +" No. of RecoveryReserve payloads generated : "+recoveryReserveCount +getExecutionTimeInterval(transaction_start_time, transaction_end_time))
                      }
                     return payloadList
         }
         
         public function getExposureChangedPayload(cc:Claim , payloadList:ArrayList<EDWMessagePayloadDTO>):ArrayList<EDWMessagePayloadDTO>  {

                      var changeFeaturePayloadCount=0
                      var featureF:EDWPayloadGenFeatureFunction = null
                      var changeFeadto:EDWMessagePayloadDTO = null 
                      var fPayload:String = null
                         // if(cc.State=="closed"){
                            for(exposure in cc.Exposures){
                              if(exposure.State=="closed"){
                                  if(exposure.LoadCommandID!=null){
                                    try{
                                     featureF = EDWPayloadGenFunctionsFactory.getFeatureFunctions()
                                     changeFeadto=new EDWMessagePayloadDTO()
                                     fPayload=featureF.sendExposureChange(exposure);
                                     changeFeadto.eventName="ExposureChanged"
                                     changeFeadto.publicIdVal=exposure.PublicID
                                      if(fPayload.length>0){
                                       changeFeadto.payload=fPayload
                                       changeFeaturePayloadCount=changeFeaturePayloadCount+1
                                       payloadList.add(changeFeadto)
                                     } 
                                } catch(ex:Exception) {
                                     //throw new Exception("<Exposure><PublicId>"+exposure.PublicID+"</PublicId><TransationName>Exposure</TransationName><ErrorMessage>"+ex.Message+"</ErrorMessage></Exposure>")
                                     throw ex
                                 } finally {
                                    featureF = null
                                    changeFeadto = null
                                    fPayload = null
                                 }
                            }
                            }
                        
                          }
                     //}
                    
                     var exposure_end_time =  gw.api.util.DateUtil.currentDate()
                     if(changeFeaturePayloadCount>0){
                        //logger.info(cc.ClaimNumber +" No. of ExposureChanged payloads generated : "+changeFeaturePayloadCount +getExecutionTimeInterval(exposure_start_time, exposure_end_time))
                      }
                     return payloadList
         }
   
    public function createtExposureChangedPayload(exp:Exposure , payloadList:ArrayList<EDWMessagePayloadDTO>):ArrayList<EDWMessagePayloadDTO>  {
                      logger.info("Sstarts createtExposureChangedPayload for exposure :"  + exp.PublicID + " claimnumber : " +   exp.Claim.ClaimNumber)
      
                      var changeFeaturePayloadCount=0
                      var featureF:EDWPayloadGenFeatureFunction = null
                      var changeFeadto:EDWMessagePayloadDTO = null 
                      var fPayload:String = null
                         
                                    try{
                                     featureF = EDWPayloadGenFunctionsFactory.getFeatureFunctions()
                                     changeFeadto=new EDWMessagePayloadDTO()
                                     fPayload=featureF.sendExposureChange(exp);
                                     changeFeadto.eventName="ExposureChanged"
                                     changeFeadto.publicIdVal=exp.PublicID
                                      if(fPayload.length>0){
                                       changeFeadto.payload=fPayload
                                       changeFeaturePayloadCount=changeFeaturePayloadCount+1
                                       payloadList.add(changeFeadto)
                                     } 
                                } catch(ex:Exception) {
                                  ex.printStackTrace()
                                     //throw new Exception("<Exposure><PublicId>"+exp.PublicID+"</PublicId><TransationName>Exposure</TransationName><ErrorMessage>"+ex.Message+"</ErrorMessage></Exposure>")
                                     throw ex
                                 } finally {
                                    featureF = null
                                    changeFeadto = null
                                    fPayload = null
                                 }
                           
                        
                     //}
                    
                    
                      logger.info("Ends createtExposureChangedPayload for exposure :"  + exp.PublicID + " claimnumber : " +   exp.Claim.ClaimNumber)
                     
                     return payloadList

         }
   
        
    public function getClaimChangedPayload(cc:Claim , payloadList:ArrayList<EDWMessagePayloadDTO>):ArrayList<EDWMessagePayloadDTO> {
        var claim_start_time =  gw.api.util.DateUtil.currentDate()
        var changeClaimPayloadCount=0
        var ClmF:EDWPayloadGenClaimFunctions = null
        var changeClmdto:EDWMessagePayloadDTO = null
        var claimChangedPayload:String = null
        try {
            if(cc.State == "closed"){
               ClmF=EDWPayloadGenFunctionsFactory.getClaimFunctions();
               changeClmdto = new  EDWMessagePayloadDTO()
               changeClmdto.eventName="ClaimChanged"
               changeClmdto.publicIdVal=cc.PublicID
               claimChangedPayload=ClmF.sendNewClaim("ClaimChanged", cc );
               var uptPayload: String
               var replacedCodeTag :String
                 if(claimChangedPayload.length>0){
                   //Defect 9246  -  Update the claim state for ClaimChanged after the payload is generated
                   var updatedPaylaod= claimChangedPayload
                   if(updatedPaylaod != null && updatedPaylaod.contains("<Status>")){
                     logger.info("Payload message has <Status> tag")
                     logger.info("Started update the Code, description and ListName tags inside the Status tag")
                     if(updatedPaylaod.contains("<Code>open</Code>")){
                        replacedCodeTag=StringUtils.replace(updatedPaylaod,"<Code>open</Code>","<Code>closed</Code>")
                     }
                     if(replacedCodeTag != null){
                     if(replacedCodeTag.contains("<Description>Open</Description>")){
                        uptPayload=StringUtils.replace(replacedCodeTag,"<Description>Open</Description>","<Description>Closed</Description>")
                     
                    }
                     }
                     logger.info("Ended update the Code, description and ListName tags inside the Status tag")
                  }
                   if(uptPayload != null){
                     changeClmdto.payload=uptPayload
                   }
                   else{
                   changeClmdto.payload = updatedPaylaod;
                   }
                     changeClaimPayloadCount=changeClaimPayloadCount+1
                     payloadList.add(changeClmdto)
                  }
              }
        }catch(e:Exception){
          //throw new Exception("<Claim><PublicId>"+cc.PublicID+"</PublicId><TransationName>ClaimAdd</TransationName><ErrorMessage>"+e.Message+"</ErrorMessage></Claim>");
          throw e
        } finally {
            ClmF = null
            changeClmdto = null
            claimChangedPayload = null
        }
         var claim_end_time =  gw.api.util.DateUtil.currentDate()
         if(changeClaimPayloadCount>0){
                 //logger.info(cc.ClaimNumber +" No. of ClaimChanged payloads generated : "+changeClaimPayloadCount +getExecutionTimeInterval(claim_start_time, claim_end_time))
         }
         return payloadList
}
   
   
   public function getNotesPayload(cc:Claim , payloadList:ArrayList<EDWMessagePayloadDTO>):ArrayList<EDWMessagePayloadDTO>
   {
     //Generating the payload for Notes
            for (note in cc.Notes) {
              if(note.LoadCommandID !=null){
              var notePayload:String
              var notePayloaddto=new EDWMessagePayloadDTO()
                
              try{
                 if(cc.State != "closed"){ 
                   var noteF = EDWPayloadGenFunctionsFactory.getNoteFunctions()
                   notePayload=noteF.sendNoteAdded(note,"A","NoteAdded")
                   notePayloaddto.eventName="NoteAdded"
                   notePayloaddto.publicIdVal = note.PublicID
                   noteF = null
                 }else{
                   var noteF = EDWPayloadGenFunctionsFactory.getNoteFunctions()
                   notePayload=noteF.sendNoteAdded(note,"A","NoteAdded")
                   notePayloaddto.eventName="NoteAdded"
                   notePayloaddto.publicIdVal = note.PublicID
                   noteF = null
                 }
                if(notePayload.length>0){
                  notePayloaddto.payload=notePayload
                  payloadList.add(notePayloaddto) 
                  notePayloaddto = null
                }

              }catch(e:Exception){
//                 throw new Exception("<Note><PublicId>"+note.PublicID+"</PublicId><TransationName>Note</TransationName>"+
//                 "<ErrorMessage>"+e.Message+"</ErrorMessage></Note>")
              throw e
              }
              finally
              {
                notePayloaddto = null 
                notePayload = null
              }
            }
   }
            
        return payloadList    

   }

   public function getExecutionTimeInterval(start_time:Date , end_time:Date):String {
                       var sf=new SimpleDateFormat("MM/dd/yyyy HH:mm:ss.SSS")
                       var stDat = sf.format(start_time)
                       var endDat =sf.format(end_time)
                       var parseStartDate=sf.parse(stDat)
                       var parseEndDate=sf.parse(endDat)
                       //logger.info("Batch Started At:"+stDat+" - Ended At:"+endDat)
                       var diff : long = parseEndDate.Time - parseStartDate.Time
                       var tUnit = TimeUnit.SECONDS
                       var seconds = tUnit.convert(diff,TimeUnit.MILLISECONDS)
                       //var oneDay = 1000*60*60*24
                       var days = seconds/(24*60*60)
                       var rest= seconds-(days*24*60*60)
                       var hrs = rest/(60*60)
                       var rest1= rest - (hrs*60*60)
                       var min=rest1/60
                       var sec= seconds%60
                       var miliseconds = (diff - (seconds * 1000)) 
                       var totTimeFrame=""
                       
//                       totTimeFrame =fill2(hrs as int) + ":"
//                       totTimeFrame +=fill2(min as int) + ":"
//                       totTimeFrame +=fill2(sec as int) + ","
//                       totTimeFrame +=fill2(miliseconds as int) +" milliseconds"
//                       
                      // var execution_time_details= totTimeFrame 
                       var splitter:String=":" 
                       var commaSeparator = ","
                       var milliSec = " milliseconds"
                       var execution_time_details= hrs+splitter+min+splitter+sec+commaSeparator+miliseconds+milliSec
                       
                       splitter = null
                       commaSeparator = null
                       milliSec = null
                       
                       return execution_time_details
               }
                      //    public function fill2(value:int):String{
                      //      var ret = String.valueOf(value)
                      //      if(ret.length()<2) 
                      //      ret = "0" + ret
                      //      return ret
                      //    }


}
