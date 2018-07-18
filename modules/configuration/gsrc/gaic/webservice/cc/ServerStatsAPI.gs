package gaic.webservice.cc

uses java.lang.management.*
uses java.util.Map
uses java.util.HashMap
uses java.io.File
uses gw.api.util.Logger //Added for logging in Debug - SR

@WebService
class ServerStatsAPI {
  
  private var _opSys : OperatingSystemMXBean
  private var _rt : RuntimeMXBean
  private var _vmMem : MemoryMXBean
  private var _hostStats : Map<String, Object>
  private var _directory : File
  
  construct() {
    _opSys = ManagementFactory.getOperatingSystemMXBean()
    _rt = ManagementFactory.getRuntimeMXBean()
    _vmMem = ManagementFactory.getMemoryMXBean()
    initHostStats()
    _directory = new File("/app")
  }
  
  private function initHostStats(){
    _hostStats = new HashMap<String, Object>()
     for(method in (typeof _opSys).TypeInfo.Methods){
       if(method.Name.startsWith("get") && method.Public){
          var value : Object
          try{
            value = method.CallHandler.handleCall(_opSys, {})
          }catch(e){
            gw.api.util.Logger.logError("Error getting method info in ServerStatsAPI..." + e)
          }
          _hostStats.put(method.Name,value)
       }
     }
  }
  
  function directory() : String {
    return _directory.Path 
  }
  
  function freeDiskSpace() : long {
    return _directory.FreeSpace
  }
  
  function usableDiskSpace() : long {
    return _directory.UsableSpace
  }
  
  function totalDiskSpace() : long {
    return _directory.TotalSpace
  }
  
  function arch() : String {
    return _opSys.Arch 
  }
  
  function procs() : int {
    return _opSys.AvailableProcessors
  }
  
  function osName() : String {
    return _opSys.Name  
  }
  
  function loadAvg() : double {
    //changed to logging in Debug - SR
    Logger.logDebug(_opSys.SystemLoadAverage)
    return _opSys.SystemLoadAverage
  }
  
  function osVersion() : String {
    return _opSys.Version 
  }
  
  function vmName() : String {
    return _rt.VmName 
  }
  
  function vmVendor() : String {
    return _rt.VmVendor 
  }
  
  function vmVersion() : String {
    return _rt.VmVersion 
  }
  
  function uptime() : long {
    return _rt.Uptime
  }
  
  function heapCommitted() : long {
    return _vmMem.HeapMemoryUsage.Committed
  }
  
  function heapInit() : long {
    return _vmMem.HeapMemoryUsage.Init 
  }
  
  function heapMax() : long {
    return _vmMem.HeapMemoryUsage.Max 
  }
  
  function heapUsed() : long {
    return _vmMem.HeapMemoryUsage.Used 
  }
  
  function nonHeapCommitted() : long {
    return _vmMem.NonHeapMemoryUsage.Committed
  }
  
  function nonHeapInit() : long {
    return _vmMem.NonHeapMemoryUsage.Init
  }
  
  function nonHeapMax() : long {
    return _vmMem.NonHeapMemoryUsage.Max
  }
  
  function nonHeapUsed() : long {
    return _vmMem.NonHeapMemoryUsage.Used
  }
  
  function commVirtMem() : Object {
    return _hostStats.get("getCommittedVirtualMemorySize()")
  }
  
  function freePhysMem() : Object {
    return _hostStats.get("getFreePhysicalMemorySize()") 
  }
  
  function freeSwap() : Object {
    return _hostStats.get("getFreeSwapSpaceSize()")
  }
  
  function procCPUTime() : Object {
    return _hostStats.get("getProcessCpuTime()")
  }
  
  function totalPhysMem() : Object {
    return _hostStats.get("getTotalPhysicalMemorySize()")
  }
  
  function totalSwap() : Object {
    return _hostStats.get("getTotalSwapSpaceSize()")
  }
  
}
