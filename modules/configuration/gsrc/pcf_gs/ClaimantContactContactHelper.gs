package pcf_gs

class ClaimantContactContactHelper {

  private var _contactContact : ContactContact as conContact

  construct( contactISO: ContactISOMedicareExt) {
    _contactContact = new ContactContact()
    _contactContact.ClaimantFlagExt = true
    
  }
  construct(conCon : ContactContact, contactISO: ContactISOMedicareExt){
    _contactContact = conCon
  }

}
