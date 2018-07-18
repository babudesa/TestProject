package libraries.Negotiation_Entity

enhancement Negotiation : entity.Negotiation {
  function filterRelatedTo() : List {
    return this.Claim.Exposures as java.util.List<java.lang.Object>;
  }
}
