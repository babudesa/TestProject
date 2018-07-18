package libraries.ClaimsUI
uses java.util.ArrayList

class LossDetailsUIHelper {

   
    construct() {    
                 
    }
   
    
    /**
    * Gets valid roles to choose given the selected contact.  Person contacts
    * can't have insurer role.  Currently only used on the EditibleTPAInfoLV.pcf
    * used on LossDetailsDV.SPECIALTYES
    * 
    * @return valid roles to choose given the selected contact
    */
    function getValidRolesForInsurerTPA(contact : Contact) : List<ContactRole> {    
    
        if(typeof contact == Person){
            return ContactRole.TF_INSURER_TPA.TypeKeys.where(\ c -> c != ContactRole.TC_INSURER)
        }else {
            return ContactRole.TF_INSURER_TPA.TypeKeys.toList() 
        }
    }
    
    
    /**
    * Gets all contacts that are valid to use as a TPA.Currently only used on 
    * the EditibleTPAInfoLV.pcf used on LossDetailsDV.SPECIALTYES
    * 
    * @return contacts that are valid to use as a TPA
    */
    function getValidTPAContacts(claim : Claim) : ArrayList<Contact> {
      
        var contacts = new ArrayList<Contact>()
        
        contacts = claim.getContacts().where(\ c -> !exists(ccRole in c.Roles where 
            ccRole.Role == ContactRole.TC_AGENCY || 
            ccRole.Role == ContactRole.TC_AGENT ||
            ccRole.Role == ContactRole.TC_UNDERWRITER ||
            ccRole.Role == ContactRole.TC_FORMERUNDERWRITER)
            && (typeof c.Contact == Person || typeof c.Contact == Company) 
            && !exists(cont in claim.ThirdPartyAdminsExt*.InsurerTPA where c.Contact == cont))*.Contact as java.util.ArrayList<entity.Contact>
        
        return contacts
    }
    
    
    
    /**
    * Gets all contacts that are valid to use as a Certificate Holder.  Currently only used on 
    * the CertificateInfoInputSet.pcf on LossDetailsDV.SPECIALTYES
    * 
    * @return contacts that are valid to use as a Certificate Holder
    */
    function getValidCertHolderContacts(claim : Claim) : ArrayList<Contact> {
      
        var contacts = new ArrayList<Contact>()
        
        contacts = claim.getContacts().where(\ c -> !exists(ccRole in c.Roles where 
            ccRole.Role == ContactRole.TC_AGENCY || 
            ccRole.Role == ContactRole.TC_AGENT ||
            ccRole.Role == ContactRole.TC_UNDERWRITER ||
            ccRole.Role == ContactRole.TC_FORMERUNDERWRITER)
            && (typeof c.Contact == Person || typeof c.Contact == Company))*.Contact as java.util.ArrayList<entity.Contact>
        
        return contacts
    }    

       
    /**
    * Set the certificate holder role for the certificate holder on the claim claim
    * 
    * @param the claim
    */
    function addCertificateHolderRole(claim : Claim) {
         var originalClaim = claim.OriginalVersion as Claim
  
         //set previous certificate holder to former and remove original role
         if(originalClaim.CertHolderExt != null){

             claim.addRole(ContactRole.TC_FMRCERTIFICATEHOLDER, originalClaim.CertHolderExt)
             claim.removeRole(ContactRole.TC_CERTIFICATEHOLDER, originalClaim.CertHolderExt)
         }

         //if there is a certificate holder 
         //add the correct new roles and remove corresponding former roles 
         if(claim.CertHolderExt!= null){      

             claim.addRole(ContactRole.TC_CERTIFICATEHOLDER, claim.CertHolderExt)
             claim.removeRole(ContactRole.TC_FMRCERTIFICATEHOLDER, claim.CertHolderExt)   
         }  
    }

    
    /**
    * Function added for Specialty E&S which adds an additional filter for Detail Loss Cause field. 
    * The original in-page filter was expanded because E&S and P&IM use some of the same Loss Cause 
    * codes and each business has different requirements for which Loss Cause codes should 
    * display 'Other' as a valid Detail Loss Cause. So the filter was expanded to remove
    * the Detail Loss Cause field for E&S if 'Other' is the only available Detail Loss Cause
    * (except in the case of Wind and Unknown). Currently only used on LossDetailsDV.SPECIALTYES and
    * NewClaimLossDetailsDV.SPECIALTYES.
    * 
    * 4/24/14 - cmullin - added block for Loss Cause = Smoke. Smoke has both Detail Loss Cause and Product
    * Detail dropdowns and was conflicting with PIM Detail Loss Cause List.
    * 
    * @return LossCauseDetails that are valid "Detail Loss Cause" items
    */
    function getDetailLossCauseList (lc : LossCause) : List<LossCauseDetails> {
        var detailLossCauseList : List<LossCauseDetails> = null
        if (lc == LossCause.TC_SMOKE){
               detailLossCauseList = LossCauseDetails.TF_SMOKEDETAILFILTER.TypeKeys   
        } else if (lc == LossCause.TC_CONTAMINATION){
          detailLossCauseList = LossCauseDetails.TF_CONTAMINATIONFILTER.TypeKeys
        } else if (lc == LossCause.TC_MALICIOUSPRODTAMPER){
          detailLossCauseList = LossCauseDetails.TF_MALICIOUSPRODTAMPERFILTER.TypeKeys
        }else if(lc != null){
               detailLossCauseList = LossCauseDetails.getTypeKeys(false).where(\ l -> l.hasCategory(lc) && l.hasCategory(LossType.TC_SPECIALTYES))
                
               if(detailLossCauseList.Count == 1 && !LossCause.TF_SPECESOTHERLOSSCAUSE.TypeKeys.contains(lc)){
                   detailLossCauseList = null       
               }
        }
        return detailLossCauseList
    }
    
      
    /**
    * Filters the LossCauseDetails typelist as specified by Specialty E&S and returns a List to be
    * displayed in the "Product Detail" dropdown. This value is stored as DetailLossCause2Ext. 
    * Currently only used on LossDetailsDV.SPECIALTYES and NewClaimLossDetailsDV.SPECIALTYES.
    * 
    * @return LossCauseDetails that are valid "Product Detail" items
    */
    function getProductDetailList (lc : LossCause) : List<LossCauseDetails> {
        var productDetailList : List<LossCauseDetails>
        switch(lc){
          case LossCause.TC_CONSTRUCDEFECT:
            productDetailList = LossCauseDetails.TF_CONSTRUCTDEFECTFILTER.TypeKeys
            break;
          case LossCause.TC_ELECTRICALOTHLIGHT:
            productDetailList = LossCauseDetails.TF_ELECTRICALOTHERFILTER.TypeKeys
            break;
          case LossCause.TC_EXPLOSION:
            productDetailList = LossCauseDetails.TF_EXPLOSIONFILTER.TypeKeys
            break;
          case LossCause.TC_FIRE:
            productDetailList = LossCauseDetails.TF_FIREFILTER.TypeKeys
            break;
          case LossCause.TC_PRODUCTMALFUNCTION:
            productDetailList = LossCauseDetails.TF_PRODUCTFAILUREFILTER.TypeKeys
            break;
          case LossCause.TC_SMOKE:
            productDetailList = LossCauseDetails.TF_SMOKEFILTER.TypeKeys
            break;
          case LossCause.TC_CONTAMINATION:
            productDetailList = LossCauseDetails.TF_CONTAMINATIONPRODUCTFILTER.TypeKeys
            break;
          default:
            productDetailList = null   
        }
        return productDetailList
    }
    
    /**
     * Typelist filter for Workers Comp. Returns true if the value has a WC LossType category and false
     * if the item is included in the WorkCompFilter on the LossCauseDetails typlist. This value is stored 
     * as ex_DetailLossCause. 
     * 
     * @return LossCauseDetail that is a valid "Detailed Cause of Injury" item
     */
     function filterWCDetailCauseOfInjuryList(value : String) : Boolean {
       return !LossCauseDetails.TF_WORKCOMPFILTER.TypeKeys.contains(value)
     }
     
     static function claimContactDisconnectCheck(claim : Claim) :boolean {
       var flag = false
       if (claim != null){
         if (!claim.checkDisconnectedFeatures()){
           flag = true
         }
       }else{
          flag = true
       }
       return flag
     }
         
}// end LossDetailsUIHelper