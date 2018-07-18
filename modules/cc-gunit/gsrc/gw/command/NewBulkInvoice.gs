package gw.command
uses gw.api.databuilder.ClaimBuilder
uses gw.api.databuilder.BulkInvoiceItemBuilder
uses gw.api.databuilder.BulkInvoiceBuilder

class NewBulkInvoice extends BaseCommand {

  function withDefault() {
    BulkInvoiceBuilder.uiReadyBulkInvoice()
                  .withItem( new BulkInvoiceItemBuilder()
                                        .withClaim(ClaimBuilder.uiReadyAuto()
                                                             .withNonConflictingClaimNumber())
                                        .withPaymentType(PaymentType.TC_FINAL)
                                        .withUnspecifiedCostTypeCostCategory()
                                        .withAmount(100.00) )
                  .create(Bundle)
    Bundle.commit()
    pcf.BulkPay.go()
  }

}
