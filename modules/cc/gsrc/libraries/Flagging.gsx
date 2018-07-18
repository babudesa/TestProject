package libraries

@ReadOnly
enhancement Flagging : entity.Claim
{
  function setFlagExt(flagReasonToSet : String) : Boolean {
    // set flag if it does not already exist
    if (!this.FlaggedReason.HasContent || !this.FlaggedReason.contains( flagReasonToSet )){
      this.setFlag( flagReasonToSet )
      return true
    }
    return false;
  }

  function removeFlagExt(flagReasonToRemove : String) : Boolean {
    return this.removeFlagReason( flagReasonToRemove )
  }
}