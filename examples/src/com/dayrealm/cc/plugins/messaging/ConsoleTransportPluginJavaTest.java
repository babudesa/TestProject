package com.dayrealm.cc.plugins.messaging;

/**
 * Created by IntelliJ IDEA.
 * User: sshi
 * Date: Apr 30, 2009
 * Time: 3:56:00 PM
 * To change this template use File | Settings | File Templates.
 */

import com.guidewire.cc.external.entity.Check;
import com.guidewire.cc.external.entity.BulkInvoice;
import com.guidewire.cc.external.entity.Message;
import com.guidewire.cc.external.typelist.TransactionStatus;
import com.guidewire.cc.plugin.messaging.MessageTransport;
import com.guidewire.cc.external.typelist.BulkInvoiceStatus;

import java.util.Calendar;
import java.util.Map;

public class ConsoleTransportPluginJavaTest implements MessageTransport {
     int _destinationID;
     //This is created for CC-44861
      public void send(Message message, String transformedPayload) {
        System.out.println("###Destination " + _destinationID + " SEND (Msg ID = " + message.getID() + " Payload = \"" + transformedPayload + "\")");

        Calendar cal = Calendar.getInstance();
         
         
        // Need to set millisecond to 0 as a workaround to a Timestamp rounding issue
        // Otheriwse, the date we get back from the db could be off by 1 millisecond.
        cal.set(java.util.Calendar.MILLISECOND, 0);

        TransactionStatus checkStatus_void = TransactionStatus.VOIDED;
        TransactionStatus checkStatus_stop = TransactionStatus.STOPPED;

       BulkInvoiceStatus bulkInvoiceStatus_void = BulkInvoiceStatus.VOIDED;
       BulkInvoiceStatus bulkInvoiceStatus_stop = BulkInvoiceStatus.STOPPED;
                                                                                          

        String eventname  = message.getEventName();
        if (eventname.equals("CheckStatusChanged")) {
           Check check = (Check) message.getMessageRoot() ;
           String status = check.getStatus().getCode();

            if (status.equals("pendingtransfer")) {
                message.transferringCheck(check);
             }
            else if (status.equals("pendingvoid"))
            {
            try{

                check.updateCheckStatus("testCheckNumber",cal, checkStatus_void );
               }
             catch (Exception e )   {
               }
            }
            else if (status.equals("pendingstop")) {
              try{
                check.updateCheckStatus("testCheckNumber",cal, checkStatus_stop );
             }

            catch (Exception e )   {
                  }
             }
         }

          if (eventname.equals("BulkInvoiceStatusChanged")) {
          BulkInvoice bulkInvoice = (BulkInvoice) message.getMessageRoot() ;
          String status = bulkInvoice.getStatus().getCode();

           if (status.equals("pendingvoid")) {
             try{

              bulkInvoice.updateBulkInvoiceStatus("BulkInvoiceNumber",cal, bulkInvoiceStatus_void );
                  }
             catch (Exception e )   {
               }
           }
           else if (status.equals("pendingstop")) {
               try{

                 bulkInvoice.updateBulkInvoiceStatus("BulkInvoiceNumber", cal, bulkInvoiceStatus_stop );
                                }
             catch (Exception e )   {
               }
           }
        }
         
          message.reportAck();
      }

      public void shutdown() {
        System.out.println("Destination " + _destinationID + " SHUTDOWN");
      }

      public void suspend() {
        System.out.println("Destination " + _destinationID + " SUSPEND");
      }

      public void resume() {
        System.out.println("Destination " + _destinationID + " RESUME");
      }

      public void setParameters(Map params) {
      }

      public void setDestinationID(int destinationID) {
        _destinationID = destinationID;
      }




}
