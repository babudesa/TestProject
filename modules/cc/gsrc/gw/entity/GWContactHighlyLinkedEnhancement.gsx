package gw.entity
uses gw.api.system.CCConfigParameters
uses gw.api.database.Query

@ReadOnly
enhancement GWContactHighlyLinkedEnhancement : entity.Contact {
  
  /**
   * Does this contact have enough links to be considered "highly linked"? If there are a total of more than
   * "HighlyLinkedContactThreshold" contacts with the same address book UID as this contact (including this
   * contact) then return true, otherwise return false. HighlyLinkedContactThreshold is a configuration
   * parameter. This property only considers contacts that have been committed to the database, so it will
   * ignore any newly inserted contacts in the current bundle that have the same address book UID. If the
   * configurable threshold is set to zero this method will never return true.
   */
  public property get IsHighlyLinked() : boolean {
    var threshold = CCConfigParameters.HighlyLinkedContactThreshold.Value;
    return threshold != 0 and this.AddressBookUID.HasContent and hasMoreThanNLinks(threshold)
  }
  
  private function hasMoreThanNLinks(n : int) : boolean {
    var q = Query.make(Contact)
    q.compare("AddressBookUID", Equals, this.AddressBookUID)
    return q.select().getCountLimitedBy(n + 1) > n
  }
}
