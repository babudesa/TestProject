package libraries.ContactISOMedicareExt
uses java.util.PriorityQueue
uses java.util.Comparator

enhancement ContactISOMedicareExtEnhancement : entity.ContactISOMedicareExt {
    
  property get InjuredPartyRep() : ContactContact {
    var injPartyRepQueue = new PriorityQueue<ContactContact>(4,
    new Comparator<ContactContact>() {
      override function compare(c1 : ContactContact, c2 : ContactContact) : int{
        return c1.Relationship.Priority - c2.Relationship.Priority
      }
    })
    
    for(contCont in this.Contact.AllContactContacts.where(\ c -> c.InjuredPartyFlagExt)){
      injPartyRepQueue.add(contCont)
    }
    
    return injPartyRepQueue.poll()
  }
  
  property get PersonClaimant() : Person{
    return this.Contact as Person 
  }
}
