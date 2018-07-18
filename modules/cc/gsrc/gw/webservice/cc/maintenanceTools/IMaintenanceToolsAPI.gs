package gw.webservice.cc.maintenanceTools

uses gw.api.webservice.WSRunlevel
uses gw.api.tools.ProcessID
uses gw.api.webservice.exception.PermissionException
uses gw.api.webservice.exception.SOAPServerException
uses gw.api.webservice.exception.SOAPException
uses java.lang.IllegalArgumentException
uses java.util.Calendar
uses gw.api.webservice.exception.SOAPSenderException;
uses gw.api.webservice.maintenanceTools.ProcessStatus
uses gw.api.webservice.maintenanceTools.WorkQueueConfig
uses gw.api.webservice.maintenanceTools.UpdateTableStatisticsData
uses gw.api.webservice.maintenanceTools.QueueWorkerStatus
uses gw.api.webservice.cc.maintenanceTools.CCMaintenanceToolsImpl
uses gw.api.webservice.cc.maintenanceTools.ICCMaintenanceToolsAPI
uses gw.api.webservice.maintenanceTools.WorkQueueStatus

@WebService(WSRunlevel.NODAEMONS)
@ReadOnly
class IMaintenanceToolsAPI
{
  construct(){
  }

  /**
   * Return the set of valid batch process names
   *
   * @return String[]
   */
  @Throws(SOAPException, "if there is an exception thrown during the processing")
  public function getValidBatchProcessNames() : String[] {
    return getMaintenanceImpl().ValidBatchProcessNames.toTypedArray();
  }
  
  /**
   * Overridde to ensure correct permission checking.  Starts the given batch process.  If the process is already running on the server,
   * an exception will be thrown.
   *
   * @param processName The name of the process to start
   * @return The process ID that the caller can use to query for status
   */
  @Throws(PermissionException, "If the user does not have SOAP ADMIN permissions or if the process is a Purge and the user does not have PURGE permissions.")
  @Throws(SOAPServerException, "")
  @Throws(IllegalArgumentException, "If no process exists with the given process name.")
  function startBatchProcess(processName : String) : ProcessID {
    return getMaintenanceImpl().startBatchProcess(processName);
  }
  
  /**
   * Return the date when the current statistics were calculated.
   *
   * @return date of the when the current statistics were calculated
   */
  @Throws(SOAPException, "if there is an exception thrown during the processing")
  public function whenStatsCalculated() : Calendar {
    return getMaintenanceImpl().whenStatsCalculated();
  }
  
  /**
   * Marks the claims represented by the claim numbers for purge.  Does not actually
   * do the purge.  Can be run in maintainence or multi-user mode.
   *
   * @param claimNumbers The list of claim numbers corresponding to the claims
   *                     to be marked for purge.
   * @return the results indicates if the claims were successfully marked for purged or not.
   * @deprecated To be retired and replaced with #markPurgeReady in bedrock
   */   
  @Throws(SOAPException, "If there is exception thrown during the processing")
  @Throws(PermissionException, "If the user does not have both SOAP ADMIN and PURGE permissions.")
  @WebServiceMethod(WSRunlevel.NODAEMONS, {SystemPermissionType.TC_PURGE, SystemPermissionType.TC_SOAPADMIN})
  public function markForPurge(claimNumbers : String[]) : String {
    return markPurgeReady( claimNumbers )
  }
  
  /**
   * Marks the purge ready flag on claim for the claim purging batch process
   * @param claimNumbers The array of the claim numbers to be marked
   * @return The results indicates if the claims were successuflly marked
   */
  @Throws(SOAPException, "Upon any error")
  @WebServiceMethod(WSRunlevel.NODAEMONS, {SystemPermissionType.TC_SOAPADMIN, SystemPermissionType.TC_PURGE})
  public function markPurgeReady(claimNumbers : String[]) : String {
    return getMaintenanceImpl().markPurgeReady(claimNumbers)
  }
  
  /**
   * Schedules the claims with the given claim numbers for archive. This method is
   * only present for backwards compatibility; new code should use scheduleForArchive.
   * This method actually calls scheduleForArchive internally. Scheduling a claim
   * archive is the closest equivalent to marking a claim as archive ready in pre
   * 5.0.6 versions of ClaimCenter.
   *
   * @param claimNumbers Claim numbers of the claims to schedule for archive
   * @return A string containing the numbers of the claims that were scheduled for archive
   */
  @Deprecated("Use scheduleForArchive instead")
  @Throws(SOAPException, "If claims cannot be found or cannot be scheduled for archive")  
  public function markArchiveReady(claimNumbers : String[]) : String {
    return getMaintenanceImpl().scheduleForArchive(claimNumbers)
  }
  
  /**
   * Schedules the claims with the given claim numbers for archive. The claims are looked up and,
   * providing they are closed, are immediately scheduled for archive by creating a high priority
   * work item that will be picked up by the archiving work queue. Note that the archiving work
   * queue is processed asynchronously so it is unlikely that any of the claims will actually be
   * archived by the time this call returns.
   * <p>
   * There is a race condition that can affect this call. If a claim to be archived references a
   * newly created admin object, such as a new user, there is a chance the archiving of the claim
   * will fail because the new admin object has not yet been copied to the archiving database. This
   * is a rare edge case as most claims to be archived are old, closed, claims which have not been
   * altered for a long time. The chances of hitting this race condition can be minimized by
   * explicitly running the archive batch process before calling this method, though this is
   * expensive and is not recommended as a general practice.
   * <p>
   * Throws SOAPException if claims cannot be scheduled for archive because they cannot be found,
   * are closed or because an archive work item could not be created. If any of the claims is not
   * found or is not closed then the call fails before attempting to archive any other claims.
   * However if all the claims are present and closed it is possible, though very unlikely, for
   * some work items to be created successfully and others to fail.
   * <p>
   * This call is, internally, identical to IClaimAPI.scheduleForArchive and is only included here
   * for convenience, so it can be called by the command line maintenance tools.
   *
   * @param claimNumbers Claim numbers of the claims to schedule for archive
   * @return A string containing the numbers of the claims that were scheduled for archive
   */
  @Throws(SOAPException, "If claims cannot be found or cannot be scheduled for archive")  
  public function scheduleForArchive(claimNumbers : String[]) : String {
    return getMaintenanceImpl().scheduleForArchive(claimNumbers)
  }

  /**
   * Restore the claim
   * @param claimNumber The claim numbers used to look up the claim
   * @return The result indicates the claims processed and skipped
   */
  @Throws(SOAPException, "Upon any error")
  public function restore(claimNumbers : String[], comment : String) : String {
    return getMaintenanceImpl().restore(claimNumbers, comment)
  }

  //----------------------------------------------------------------- base methods from IMaintenanceToolsAPI


  /**
   * Note: All methods are overriden to ensure that the javadoc and execptions for this web service are properly generated.
   */

  /**
   * Requests termination of the given batch process, if it's currently running.
   *
   * This method does not wait for the batch process to actually terminate
   *
   * @param processName the name of the batch process for which to request termination
   * @return true if the request was successful, false if the process could not be terminated
   */
  @Throws(PermissionException, "")
  @Throws(SOAPServerException, "")
  @Deprecated("Use requestTerminationOfBatchProcessByName() instead")
  function terminateBatchProcessByName(processName : String) : boolean {
    return getMaintenanceImpl().requestTerminationOfBatchProcess( processName )
  }

  /**
   * Requests termination of the given batch process, if it's currently running. Note that it's possible that
   * this particular invocation could have finished and another invocation of the same process
   * begun, in which case this won't request the termination of the current invocation.
   *
   * This method does not wait for the batch process to actually terminate
   *
   * @param pid the process ID of the process for which to request termination
   * @return true if the request was successful, false if the process could not be terminated
   */
  @Throws(PermissionException, "")
  @Throws(SOAPSenderException, "")
  @Throws(SOAPServerException, "")
  @Deprecated("Use requestTerminationOfBatchProcessByID() instead")
  function terminateBatchProcessByID(pid : ProcessID) : boolean {
    return getMaintenanceImpl().requestTerminationOfBatchProcess( pid )
  }

  /**
   * Requests termination of the given batch process, if it's currently running.
   *
   * This method does not wait for the batch process to actually terminate
   *
   * @param processName the name of the batch process for which to request termination
   * @return true if the request was successful, false if the process could not be terminated
   */
  @Throws(PermissionException, "")
  @Throws(SOAPServerException, "")
  function requestTerminationOfBatchProcessByName(processName : String) : boolean {
    return getMaintenanceImpl().requestTerminationOfBatchProcess( processName )
  }

  /**
   * Requests termination of the given batch process, if it's currently running. Note that it's possible that
   * this particular invocation could have finished and another invocation of the same process
   * begun, in which case this won't request the termination of the current invocation.
   *
   * This method does not wait for the batch process to actually terminate
   *
   * @param pid the process ID of the process for which to request termination
   * @return true if the request was successful, false if the process could not be terminated
   */
  @Throws(PermissionException, "")
  @Throws(SOAPSenderException, "")
  @Throws(SOAPServerException, "")
  function requestTerminationOfBatchProcessByID(pid : ProcessID) : boolean {
    return getMaintenanceImpl().requestTerminationOfBatchProcess( pid )
  }

  /**
   * Gets the status of the given batch process, indicating whether or not the process is running and,
   * if so, its current progress.
   *
   * @param processName the name of the process to retrieve the status of
   * @return the status of that particular process
   */
  @Throws(PermissionException, "")
  @Throws(SOAPServerException, "")
  function batchProcessStatusByName(processName : String) : ProcessStatus {
    return getMaintenanceImpl().batchProcessStatusByName( processName )
  }

  /**
   * Gets the status of a particular batch process invocation.  If that invocation is still running,
   * the status will indicate as much, and only the startDate and opsCompleted fields will be filled in.
   * Otherwise the returned object will contain information about
   * the completed run (see ProcessStatus for information about all the fields returned).
   *
   * @param pid the process ID to retrieve the status of
   * @return the status of that particular process invocation
   */
  @Throws(PermissionException, "")
  @Throws(SOAPSenderException, "")
  @Throws(SOAPServerException, "")
  function batchProcessStatusByID(pid : ProcessID) : ProcessStatus {
    return getMaintenanceImpl().batchProcessStatusByID( pid )
  }

  /**
   * Obtains the set of SQL statements that are required to update database statistics
   *
   * @return An array of UpdateTableStatisticsData items, one for each table that has
   *         updateable statistics
   */
  @Throws(PermissionException, "")
  @Throws(SOAPServerException, "")
  function getUpdateTableStatisticsData() : UpdateTableStatisticsData[] {
    return getMaintenanceImpl().getUpdateTableStatisticsData()
  }

  /**
   * Obtains the set of SQL statements that are required to update database statistics
   * based on user specific threshold value that specifies percentage of table has been
   * modified
   *
   * @return An array of UpdateTableStatisticsData items, one for each table that has
   *         updateable statistics
   */
  @Throws(PermissionException, "")
  @Throws(SOAPServerException, "")
  function getIncrementalUpdateTableStatisticsData() : UpdateTableStatisticsData[] {
    return getMaintenanceImpl().getIncrementalUpdateTableStatisticsData()
  }

  /**
   * Get the current configuration of distributed workers for the
   * specified work queue.
   * @param queueName Name of the queue to query
   * @return A WorkQueueConfig instance containing the current settings
   */
  @Throws(PermissionException, "")
  @Throws(SOAPServerException, "")
  function getWorkQueueConfig(queueName : String) : WorkQueueConfig {
    return getMaintenanceImpl().getWorkQueueConfig( queueName )
  }

  /**
   * Sets the configuration for distributed workers for the
   * specified work queue.  Any currently running worker
   * instances will be stopped after the current workitem in process
   * is completed.  New worker instances as specified by the passed
   * in config will be created and started.  Note that the
   * changes made here are temporary; if the server is restarted,
   * the initial values from config.xml will be used when creating
   * and starting workers.
   * @param queueName Name of the queue to modify
   * @param config The configuration to establish.
   */
  @Throws(PermissionException, "")
  @Throws(SOAPServerException, "")
  function setWorkQueueConfig(queueName : String, config : WorkQueueConfig){
    getMaintenanceImpl().setWorkQueueConfig( queueName, config )
  }

  /**
   * Returns the list of work queue names for this product.
   * These names may be used in {@link #getWorkQueueConfig}
   * and {@link #setWorkQueueConfig}.
   */
  @Throws(PermissionException, "")
  @Throws(SOAPServerException, "")
  function getWorkQueueNames() : String[]{
    return getMaintenanceImpl().getWorkQueueNames()
  }

  /**
   * Wakes up all workers for the specified queue across the cluster.
   * Workers will check for workitems and will continue
   * processing any found until the workitem table for the
   * queue is empty.
   * @param queueName Name of the queue to notify workers
   */
  @Throws(PermissionException, "")
  @Throws(SOAPServerException, "")
  @Throws(IllegalArgumentException, "If an invalid queue name is provided.")
  function notifyQueueWorkers(queueName : String){
    getMaintenanceImpl().notifyQueueWorkers( queueName )
  }

  /**
   * Retrieves the worker status for a paticular server.
   *
   * @param queueName name of the queue
   * @return The status of the queue
   *
   * @deprecated use the method {@link #getWorkQueueStatus(String)} instead.  It returns more detailed and accurate
   * information about a worker queue across a clustered environment.
   */
  @Throws(PermissionException, "")
  @Throws(SOAPServerException, "")
  function getQueueWorkerStatus(queueName : String) : QueueWorkerStatus{
    return getMaintenanceImpl().getQueueWorkerStatus( queueName )
  }

  /**
   * Retrieves the worker status with information about work queues across a cluster.
   *
   * @param queueName name of the queue
   * @return The status of the queue
   */
  @Throws(PermissionException, "")
  @Throws(SOAPServerException, "")
  function getWorkQueueStatus(queueName : String) : WorkQueueStatus {
    return getMaintenanceImpl().getWorkQueueStatus( queueName )
  }

  /**
   * Retrieves the number of active work items for a queue
   *
   * @param queueName name of the queue
   * @return The status of the queue
   */
  @Throws(PermissionException, "")
  @Throws(SOAPServerException, "")
  function getNumActiveWorkItems(queueName : String) : int {
    return getMaintenanceImpl().getNumActiveWorkItems( queueName )
  }

  /**
   * Wait on the active work items for a queue
   *
   * @param queueName name of the queue
   * @return true if the queue is now empty
   */
  @Throws(PermissionException, "")
  @Throws(SOAPServerException, "")
  function waitOnActiveWorkItems(queueName : String) : boolean {
    return getMaintenanceImpl().waitOnActiveWorItems( queueName, 60, 200)
  }

  //----------------------------------------------------------------- private helper

  private function getMaintenanceImpl() : ICCMaintenanceToolsAPI {
    return new CCMaintenanceToolsImpl()
  }
}

