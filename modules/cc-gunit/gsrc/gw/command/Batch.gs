package gw.command
uses gw.batchprocess.BatchProcessTestUtil

class Batch extends BaseCommand {

  function financialsEscalation() {
    BatchProcessTestUtil.startAndWaitUntilWorkFinishedEndToEnd(BatchProcessType.TC_FINANCIALSESC, 100000, {})
  }

  function bulkInvoicesEscalation() {
    BatchProcessTestUtil.startAndWaitUntilWorkFinishedEndToEnd(BatchProcessType.TC_BULKINVOICEESC, 100000, {})
  }

  function exchangeRate() {
    BatchProcessTestUtil.startAndWaitUntilWorkFinishedEndToEnd(BatchProcessType.TC_EXCHANGERATE, 100000, {})
  }

  function byName() {
    BatchProcessTestUtil.startAndWaitUntilWorkFinishedEndToEnd(Argument.toLowerCase(), 100000, {})
  }

  // I haven't figured out a way to call the batch processes that require the server to be in
  // maintenance mode, since you can't be logged in through the UI when the server
  // is in maintenance mode.

}
