package pcf_gs

class InjPartyRepContactContactHelper {
  
  private var _contactContact : ContactContact as conContact

  construct( contactISO: ContactISOMedicareExt) {
    _contactContact = new ContactContact()
    _contactContact.InjuredPartyFlagExt = true
    
  }
  construct(conCon : ContactContact, contactISO: ContactISOMedicareExt){
    _contactContact = conCon
  }
  
  
}
