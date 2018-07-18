package util.financials;

class Taxport
{
  construct()
  {
  }
   public static function reportable1(messageContext:MessageContext, msgCheck : Check){
    
    /*
	 * If the reportable vendor is changed to non reportable and has Backup
	 * withholding on him send two -ve messages to Taxport. Condition 2a) in
	 * backup withholding technical test cases.
	 */
    
    if(msgCheck.BackupWithholdingCheckExt == true && msgCheck.Reportability=="notreportable"){
      var amountToSend : java.math.BigDecimal;
     // amountToSend = -1 * msgCheck.NetAmount;
      
          
      for (p in msgCheck.Payments){
        for (l in p.LineItems){ 
          if (l.LineCategory != null){ // if line category is not null (not specified)									
            for (bn in IRS1099BoxNumber.getTypeKeys(false)){ // loop through all 1099 Box Numbers													
              if(bn.hasCategory( l.LineCategory )){ // if this box number has the line category as a category													
                l.IRS1099BoxNumberExt=bn // set the box number                
                amountToSend = -(l.Amount);
                
        var messageContent04 = util.financials.CheckFunctions.generateTaxport1099Message(msgCheck, amountToSend, "04");
         if (messageContent04 != "") {
           messageContext.createMessage(messageContent04);
         }
         var messageContentxx = util.financials.CheckFunctions.generateTaxport1099Message(msgCheck, amountToSend, l.IRS1099BoxNumberExt.Code);
         if (messageContentxx != "") {
           messageContext.createMessage(messageContentxx); 
              }
            }
          }
         }
        }
      }
    }
    
     /*
		 * if the modify reportablity is changed to Reportable to Non-Reportable
		 * and Backup withholding YES to No send two -ve messages to Taxport.
		 * Condition 4a) in backup withholding technical test cases.
		 */
       
     if(msgCheck.BackupWithholdingCheckExt == false && msgCheck.Reportability=="notreportable"){
      var amountToSend : java.math.BigDecimal;
     // amountToSend = -1 * msgCheck.NetAmount;
     
      
      for (p in msgCheck.Payments){
        for (l in p.LineItems){
          if (l.LineCategory != null){ // if line category is not null (not specified)									
            for (bn in IRS1099BoxNumber.getTypeKeys(false)){ // loop through all 1099 Box Numbers													
              if(bn.hasCategory( l.LineCategory )){ // if this box number has the line category as a category													
                l.IRS1099BoxNumberExt=bn // set the box number                
                amountToSend = -(l.Amount);
        var messageContent04 = util.financials.CheckFunctions.generateTaxport1099Message(msgCheck, amountToSend, "04");
         if (messageContent04 != "") {
           messageContext.createMessage(messageContent04);
         }
         var messageContentxx = util.financials.CheckFunctions.generateTaxport1099Message(msgCheck, amountToSend, l.IRS1099BoxNumberExt.Code);
         if (messageContentxx != "") {
           messageContext.createMessage(messageContentxx); 
               }
             }
            }
          }
        }
      }
    }
    
    /*
	 * Create check to reportable vendor and has Backup withholding on him send
	 * two +ve messages to Taxport. The check is non-reportable and vendor has
	 * Backup withholding on him if non-reportable is changed to reporatble send
	 * two +ve messages to Taxport. Condition 5a) and 1a) in backup withholding
	 * technical test cases.
	 */
       
    if(msgCheck.BackupWithholdingCheckExt == true && msgCheck.Reportability=="reportable"){

       var amountToSend : java.math.BigDecimal;
      
      for (p in msgCheck.Payments){
        for (l in p.LineItems){
          if (l.LineCategory != null){ // if line category is not null (not specified)									
            for (bn in IRS1099BoxNumber.getTypeKeys(false)){ // loop through all 1099 Box Numbers													
              if(bn.hasCategory( l.LineCategory )){ // if this box number has the line category as a category													
                l.IRS1099BoxNumberExt=bn // set the box number                
                amountToSend = l.Amount;
                
                var messageContentxx = util.financials.CheckFunctions.generateTaxport1099Message(msgCheck, amountToSend, "04");
                if (messageContentxx != "") {
                   messageContext.createMessage(messageContentxx); 
                }
   
                messageContentxx = util.financials.CheckFunctions.generateTaxport1099Message(msgCheck, amountToSend, l.IRS1099BoxNumberExt.Code);
                if (messageContentxx != "") {
                   messageContext.createMessage(messageContentxx); 
                }
              }
            }
          }
        }
      }
        
    }
    /*
	 * if the modify reportablity is changed to Non-Reportable to Reportable and
	 * Backup withholding YES to No send one +ve messages to Taxport. Condition
	 * 7a) in backup withholding technical test cases.
	 */
    
    if(msgCheck.BackupWithholdingCheckExt == false && msgCheck.Reportability=="reportable"){
      var amountToSend : java.math.BigDecimal;
      amountToSend =  msgCheck.NetAmount;

      
      for (p in msgCheck.Payments){
        for (l in p.LineItems){
          if (l.LineCategory != null){ // if line category is not null (not specified)									
            for (bn in IRS1099BoxNumber.getTypeKeys(false)){ // loop through all 1099 Box Numbers													
              if(bn.hasCategory( l.LineCategory )){ // if this box number has the line category as a category													
                l.IRS1099BoxNumberExt=bn // set the box number                
                amountToSend = l.Amount;
       
         var messageContentxx = util.financials.CheckFunctions.generateTaxport1099Message(msgCheck, amountToSend, l.IRS1099BoxNumberExt.Code);
         if (messageContentxx != "") {
          messageContext.createMessage(messageContentxx); 
               }
             }
            }
          }
        }
      }
    }
   }



 public static function reportable2( messageContext : MessageContext, msgCheck : Check){
   
     /* If the reportable vendor is changed to non reportable and has no Backup withholding on him send one -ve message to Taxport.  
     Condition 2b) in backup withholding technical test cases. */
     
     if(msgCheck.BackupWithholdingCheckExt == false && msgCheck.Reportability=="notreportable"){
       
      var amountToSend : java.math.BigDecimal;
      //amountToSend = -1 * msgCheck.NetAmount; 
      
            
      for (p in msgCheck.Payments){
        for (l in p.LineItems){
          if (l.LineCategory != null){ // if line category is not null (not specified)									
            for (bn in IRS1099BoxNumber.getTypeKeys(false)){ // loop through all 1099 Box Numbers													
              if(bn.hasCategory( l.LineCategory )){ // if this box number has the line category as a category													
                l.IRS1099BoxNumberExt=bn // set the box number                
                amountToSend = -(l.Amount);
       var messageContentxx = util.financials.CheckFunctions.generateTaxport1099Message(msgCheck, amountToSend, l.IRS1099BoxNumberExt.Code);
         if (messageContentxx != "") {
          messageContext.createMessage(messageContentxx); 
                 }
               }
             }
           }
         }
       }
     }
     
    
      /* if the modify reportablity is changed to Reportable to Non-Reportable and Backup withholding No to Yes send one -ve messages to Taxport.
       Condition 4b) in backup withholding technical test cases.*/
       
   if(msgCheck.BackupWithholdingCheckExt == true && msgCheck.Reportability=="notreportable"){
   var amountToSend : java.math.BigDecimal;
     // amountToSend = -1 * msgCheck.NetAmount; 
      
       for (p in msgCheck.Payments){
        for (l in p.LineItems){
          if (l.LineCategory != null){ // if line category is not null (not specified)									
            for (bn in IRS1099BoxNumber.getTypeKeys(false)){ // loop through all 1099 Box Numbers													
              if(bn.hasCategory( l.LineCategory )){ // if this box number has the line category as a category													
                l.IRS1099BoxNumberExt=bn // set the box number                
                amountToSend = -(l.Amount); 
      var messageContentxx = util.financials.CheckFunctions.generateTaxport1099Message(msgCheck, amountToSend, l.IRS1099BoxNumberExt.Code);
       if (messageContentxx != "") {
       messageContext.createMessage(messageContentxx); 
               }
              }
            }
          }
        }
      }
   }
      
  
    /* Create check to reportable vendor and has no Backup withholding on him send one +ve messages to Taxport.
       The check is non-reportable and vendor has no Backup withholding on him if non-reportable is changed to reporatble send one +ve messages to Taxport.
       Condition 5b) and 1b) in backup withholding technical test cases.*/
       
   if(msgCheck.BackupWithholdingCheckExt == false && msgCheck.Reportability=="reportable"){
      var amountToSend : java.math.BigDecimal;
      amountToSend =  msgCheck.NetAmount;
      
       for (p in msgCheck.Payments){
        for (l in p.LineItems){
          if (l.LineCategory != null){ // if line category is not null (not specified)									
            for (bn in IRS1099BoxNumber.getTypeKeys(false)){ // loop through all 1099 Box Numbers													
              if(bn.hasCategory( l.LineCategory )){ // if this box number has the line category as a category													
                l.IRS1099BoxNumberExt=bn // set the box number                
                amountToSend = l.Amount;  
      var messageContentxx = util.financials.CheckFunctions.generateTaxport1099Message(msgCheck, amountToSend, l.IRS1099BoxNumberExt.Code);
       if (messageContentxx != "") {
         messageContext.createMessage(messageContentxx); 
                }
              }
            }
          }
        }
      }
    }
 
  
  /* if the modify reportablity is changed to Non-Reportable to Reportable and Backup withholding No to YES send two +ve messages to Taxport.
       Condition 7b) in backup withholding technical test cases.*/
       
   if(msgCheck.BackupWithholdingCheckExt == true && msgCheck.Reportability=="reportable"){
   var amountToSend : java.math.BigDecimal;
      amountToSend =  msgCheck.NetAmount;  
      
       for (p in msgCheck.Payments){
        for (l in p.LineItems){
          if (l.LineCategory != null){ // if line category is not null (not specified)									
            for (bn in IRS1099BoxNumber.getTypeKeys(false)){ // loop through all 1099 Box Numbers													
              if(bn.hasCategory( l.LineCategory )){ // if this box number has the line category as a category													
                l.IRS1099BoxNumberExt=bn // set the box number                
                amountToSend = l.Amount;
                
          var messageContent04 = util.financials.CheckFunctions.generateTaxport1099Message(msgCheck, amountToSend, "04");
            if (messageContent04 != "") {
             messageContext.createMessage(messageContent04);
         }
          var messageContentxx = util.financials.CheckFunctions.generateTaxport1099Message(msgCheck, amountToSend,l.IRS1099BoxNumberExt.Code);
           if (messageContentxx != "") {
            messageContext.createMessage(messageContentxx); 
                   }
                 }
               }     
             } 
           }
         }
       }
     } 
     
     
 public static function reportable3( messageContext : MessageContext, msgCheck : Check){  
   
   /* for a reportable vendor has backup withholding on him, modify reportablity is changed Backup withholding YES to NO send one -ve messages to Taxport
      Condition 3a) in backup withholding technical test cases.*/
      
  if(msgCheck.BackupWithholdingCheckExt == false && msgCheck.Reportability=="reportable"){
   var amountToSend : java.math.BigDecimal;
     // amountToSend = -1 * msgCheck.NetAmount;
      
       for (p in msgCheck.Payments){
        for (l in p.LineItems){
          if (l.LineCategory != null){ // if line category is not null (not specified)									
            for (bn in IRS1099BoxNumber.getTypeKeys(false)){ // loop through all 1099 Box Numbers													
              if(bn.hasCategory( l.LineCategory )){ // if this box number has the line category as a category													
                l.IRS1099BoxNumberExt=bn // set the box number                
                amountToSend = -(l.Amount);
                  
       var messageContent04 = util.financials.CheckFunctions.generateTaxport1099Message(msgCheck, amountToSend, "04");
         if (messageContent04 != "") {
           messageContext.createMessage(messageContent04);
               }
             }
           }
         }
       }        
     }
  }
  
 /* for a reportable vendor has backup withholding on him, modify reportablity is changed Backup withholding NO to YES send one -ve messages to Taxport
      Condition 3b) in backup withholding technical test cases.*/
      
  if(msgCheck.BackupWithholdingCheckExt == true && msgCheck.Reportability=="reportable"){
   var amountToSend : java.math.BigDecimal;
      amountToSend =  msgCheck.NetAmount; 
      
       for (p in msgCheck.Payments){
        for (l in p.LineItems){
          if (l.LineCategory != null){ // if line category is not null (not specified)									
            for (bn in IRS1099BoxNumber.getTypeKeys(false)){ // loop through all 1099 Box Numbers													
              if(bn.hasCategory( l.LineCategory )){ // if this box number has the line category as a category													
                l.IRS1099BoxNumberExt=bn // set the box number                
                amountToSend = l.Amount; 
       var messageContent04 = util.financials.CheckFunctions.generateTaxport1099Message(msgCheck, amountToSend, "04");
         if (messageContent04 != "") {
           messageContext.createMessage(messageContent04);
                   }
                 }
              }
            }
          }
        }
      }     
    }
  }
  

  
