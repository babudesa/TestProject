package gw.api.claim
uses java.util.Date

@ReadOnly
abstract class HealthUpdaterBase {

  function getEarliest(currentEarliest : Date, other : Date) : Date {
    return currentEarliest == null or (other != null and other < currentEarliest)
        ? other : currentEarliest
  }

}

