package gw.entity

enhancement GWLargeLossThresholdEnhancement : entity.LargeLossThreshold
{
  public static function getThreshold(policyType : PolicyType, notificationType : LargeLossNotificationType) : LargeLossThreshold {
    return find (var l in LargeLossThreshold where l.PolicyType == policyType and l.NotificationType == notificationType).getFirstResult()
  }
}
