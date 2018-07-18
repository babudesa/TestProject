package gaic.plugin.cc.contact
uses gw.processes.BatchProcessBase
uses gw.api.database.Query
uses java.util.ArrayList


class AutoSyncUpdateBatch extends BatchProcessBase {

  construct() {
    super("UpdateAutoSync");
  }
  
  override function requestTermination() : boolean {
    super.requestTermination();
    return true;
  }
  
  override function doWork() : void {
    
    /*Auto Sync: Clean up old contacts for AutoSync *
*                                               *
* Defect # 3340 
*/

var errors = new ArrayList();
var open = 0;
var closed = 0;
var limit = 1000;
var indx = 0;

print(now() + "UpdateAutoSync process Started")
var claimContacts = gw.api.database.Query.make(ClaimContact)
var con=claimContacts.join("Contact")
con.compare("AddressBookUID", NotEquals, null)
con.compare("AutoSync", Equals, null)
con.or( \or1 -> {
                      or1.compare("Subtype", Equals, typekey.Contact.TC_ATTORNEY);
                      or1.compare("Subtype", Equals, typekey.Contact.TC_AUTOREPAIRSHOP);
                      or1.compare("Subtype", Equals, typekey.Contact.TC_DOCTOR);
                      or1.compare("Subtype", Equals, typekey.Contact.TC_EX_FOREIGNCOVENDOR);
                      or1.compare("Subtype", Equals, typekey.Contact.TC_EX_FOREIGNPERSONVNDR);
                      or1.compare("Subtype", Equals, typekey.Contact.TC_LAWFIRM);                      
                      or1.compare("Subtype", Equals, typekey.Contact.TC_MEDICALCAREORG);
                      or1.compare("Subtype", Equals, typekey.Contact.TC_COMPANYVENDOR);
                      or1.compare("Subtype", Equals, typekey.Contact.TC_PERSONVENDOR);
                      or1.compare("Subtype", Equals, typekey.Contact.TC_EX_FOREIGNPERVNDRATTNY);
                      or1.compare("Subtype", Equals, typekey.Contact.TC_EX_FOREIGNPERVNDRDOC);
                      or1.compare("Subtype", Equals, typekey.Contact.TC_EX_FOREIGNCOVENLAWFRM);
                      or1.compare("Subtype", Equals, typekey.Contact.TC_EX_FOREIGNCOVENMEDORG);
                      or1.compare("Subtype", Equals, typekey.Contact.TC_EX_GAIVENDOR);
                      or1.compare("Subtype", Equals, typekey.Contact.TC_LEGACYVENDORCOMPANYEXT);
                      or1.compare("Subtype", Equals, typekey.Contact.TC_FRGNAUTOREPAIRSHOPEXT);
                     }
           )

claimContacts.join("Claim")

print("ClaimContacts: " + claimContacts.select().Count)

var iter =claimContacts.select().keyIterator();
var claimNumber : String;
while (iter.hasNext() && indx <= limit) {  
  var claimContactID = iter.next();
  try{
     gw.transaction.Transaction.runWithNewBundle(\ b ->  {
       var claimContact = b.loadByKey(claimContactID) as ClaimContact; 
       claimNumber = claimContact.Claim.ClaimNumber;
       if (claimContact.Claim.State == ClaimState.TC_OPEN) {             
           if (claimContact.Contact.AutoSync != AutoSync.TC_ALLOW) {
             //print("Claim Open (Allow): " + claimContact.Contact.AutoSync)
             claimContact.Contact.AutoSync = AutoSync.TC_ALLOW
             open++;
             indx++;
           }
         } else if (claimContact.Contact.AutoSync != AutoSync.TC_DISALLOW) {
             //print("Claim Closed(Suspend): " + claimContact.Contact.AutoSync)
             claimContact.Contact.AutoSync = AutoSync.TC_DISALLOW       
             closed++;
             indx++;
           }
     })
   } catch(ex){
     errors.add("Claim: " + claimNumber  + " Error: "  + ex.toString())
   }
}
print(now() + " Done!")
for(err in errors) {
  print(err.toString()+ "\n"); 
}
print("Open: " + open)
print("Closed: " + closed);
    
  }
}
