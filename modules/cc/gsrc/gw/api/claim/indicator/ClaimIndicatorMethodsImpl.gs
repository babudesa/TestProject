package gw.api.claim.indicator
uses java.lang.UnsupportedOperationException
uses java.util.Date

/**
 * Common superclass for ClaimIndicator method implementations. Indicators are not
 * required to extend this class (though they must implement ClaimIndicatorMethods)
 * but it provides some convenience methods and properties.
 * <p>
 * Unfortunately this implemenation cannot be declared abstract, though it is never
 * instantiated directly. That's because it is used as the delegate class for the
 * abstract ClaimIndicator base class, and that class must be non abstract. So we
 * are forced to provide implementations of all the ClaimIndicatorMethods properties,
 * and methods even though these base implementations just throw UnsupportedOperationException
 */
@ReadOnly
class ClaimIndicatorMethodsImpl implements ClaimIndicatorMethods {

  /** The actual indicator entity */
  var _indicator : ClaimIndicator as readonly Indicator

  var _icon : String as readonly Icon

  /**
   * Create the indicator methods. This constructor is called whenever an indicator
   * is created or read from the database.
   */  
  construct(claimIndicator : ClaimIndicator, inIcon : String) {
    _indicator = claimIndicator
    _icon = inIcon
  }

  /**
   * Alternative constructor. This version of the constructor is never used in practice
   * but it has to be declared to keep the entity layer happy.
   */
  construct(claimIndicator : ClaimIndicator) {
    this(claimIndicator, null)
  }
  
  override function update() {
    throw new UnsupportedOperationException("Please add your custom ClaimIndicatorMethods implementation in package gw.claim.indicator")
  }
  
  override property get Text() : String {
    throw new UnsupportedOperationException("Please add your custom ClaimIndicatorMethods implementation in package gw.claim.indicator")
  }

  override property get HoverText() : String {
    throw new UnsupportedOperationException("Please add your custom ClaimIndicatorMethods implementation in package gw.claim.indicator")
  }

  /**
   * Utility method; changes the IsOn field to the given value. If changing from false to
   * true, stores the current date in Indicator.WhenOn
   */
  function setOn(newValue : boolean) {
    if (newValue != Indicator.IsOn) {
      Indicator.IsOn = newValue
      Indicator.WhenOn = newValue ? Date.CurrentDate : null
    }
  }
}
