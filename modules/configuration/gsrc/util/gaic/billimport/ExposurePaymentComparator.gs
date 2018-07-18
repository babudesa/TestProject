package util.gaic.billimport
uses java.util.Comparator

class ExposurePaymentComparator implements Comparator<ExposurePaymentPriority>{

  construct() {}

  override function compare(p0 : ExposurePaymentPriority, p1 : ExposurePaymentPriority) : int {
    return p0.Priority.compareTo(p1.Priority)
  }

}
