package gw.util

@ReadOnly
enhancement GWBaseURLEnhancement : java.net.URL
{

  /**
   * Connects to this URL and fetches the content.
   *
   * @return the content at this URL
   */
  property get ContentBytes() : byte[]
  {
    return gw.util.StreamUtil.getContent( this.openConnection().InputStream )
  }
  
}
