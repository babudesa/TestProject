package gw.api.financials
uses gw.api.util.DisplayableException
uses java.math.BigDecimal

enhancement GWCheckWizardInfoEnhancement : gw.api.financials.CheckWizardInfo
{
  /**
   * Validates the check payees for every check in the checkset being edited.  Throws a UserDisplayableException with
   * relevant error message if a problem is found.
   *
   */
  public function validateAllCheckPayees() {
    validateCheckPayeeFields()
    var checks = this.CheckSet.Checks
    for (check in checks) {
      this.validateCheckPayees(check)
    }
  }
  
    private function validateCheckPayeeFields() {
    var checks = this.CheckSet.Checks
    for (check in checks) {
      if (!check.Primary && check.Portion.FixedTransactionAmount == null && check.Portion.Percentage == null) {
        check.Portion.setFixedAmount(BigDecimal.ZERO)
      }
      if (check.PaymentMethod != PaymentMethod.TC_EFT) {
        if (check.PayTo == null) {
          throw new DisplayableException(displaykey.Java.Financials.CheckWizard.Error.PayeeValidation.NoPayTo)
        }
        if (check.MailTo == null) {
          throw new DisplayableException(displaykey.Java.Financials.CheckWizard.Error.PayeeValidation.NoRecipient)
        }
      }
      if (!check.Primary && check.DeductionType == null) {
        throw new DisplayableException(displaykey.Java.Financials.CheckWizard.Error.PayeeValidation.NoDeductionType)
      }

      var payees = check.Payees
      for (checkPayee in payees) {
        if (checkPayee.Payee == null) {
          throw new DisplayableException(displaykey.Java.Financials.CheckWizard.Error.PayeeValidation.NoPayee)
        }
        if (checkPayee.PayeeType == null) {
          throw new DisplayableException(displaykey.Java.Financials.CheckWizard.Error.PayeeValidation.NoType)
        }
      }
    }
  }
}
