package gw.api.claim.indicator

/**
 * This is the main interface implemented by ClaimIndicators. It provides a way to
 * update the indicator, which will be called by ClaimHealthUpdater.update(). It
 * also provides the common UI features shared by all indicators - icon, text label
 * and hover text
 */
@ReadOnly
interface ClaimIndicatorMethods {
   
  /**
   * Update the indicator. This will typically update the IsOn flag according to
   * the state of the indicator
   */
  function update()
  
  /**
   * The icon used for this indicator in the UI
   */
  property get Icon() : String
  
  /**
   * The text label used for this indicator in the UI
   */
  property get Text() : String
  
  /**
   * The hover text, displayed if the user "hovers" over the icon
   */
  property get HoverText() : String

}
