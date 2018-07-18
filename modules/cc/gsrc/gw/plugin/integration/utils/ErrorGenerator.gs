package gw.plugin.integration.utils

/**
 * Interface for generating error objects.
 */
interface ErrorGenerator {

  /**
   * Creates a ValidationResult with a message constructed from the given
   * parameters. Used for user-recoverable errors.
   *
   * @param errorMessageKey
   * @param errorMessageArgs
   * @return
   */
  function createGeneralError(errorMessageKey : String, errorMessageArgs : Object[]) : ValidationResult 

  /**
   * Overloading the above function. This function accepts an already formatted error message (usually
   * the error message directly from the exception) and create a ValidationResult out of it.
   * @param formattedErrorMessage
   * @return
   */
  function createGeneralError(formattedErrorMessage : String) : ValidationResult

}
