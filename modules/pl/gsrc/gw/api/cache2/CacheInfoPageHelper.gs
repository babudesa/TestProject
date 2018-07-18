package gw.api.cache2

uses com.guidewire.pl.system.cache2.CacheStatisticsSnapshot
uses com.guidewire.pl.system.cache2.impl.CacheStatisticsRollupSnapshotImpl
uses com.guidewire.pl.system.cache2.CacheStatisticsRollupSnapshotData
uses com.guidewire.pl.system.cache2.CacheStatisticsRollupSnapshotDataImpl
uses com.guidewire.pl.system.cache2.CentipedeCacheStatisticsRollup
uses com.guidewire.pl.system.cache2.GlobalCacheImpl
uses com.guidewire.pl.system.cache2.CacheContentsUtil
uses com.guidewire.pl.system.dependency.PLDependencies
uses gw.api.system.PLConfigParameters
uses gw.util.Pair
uses java.lang.Integer
uses java.lang.Math
uses java.util.ArrayList
uses java.lang.StringBuilder
uses com.guidewire.pl.web.util.WebFileUtil
uses gw.util.StreamUtil
uses java.util.Map
uses com.guidewire.commons.util.MutableReference
uses java.util.Collections
uses java.util.Date
uses java.util.Calendar
uses java.util.HashMap

final class CacheInfoPageHelper {
  public static final var INSTANCE : CacheInfoPageHelper = new CacheInfoPageHelper()
  
  var _timestamp : Date
  var _snapshots : CacheStatisticsSnapshot[]
  var _numAges : int 
  var _cacheContentsRaw : HashMap<String,MutableReference<Integer>>[]
  var _cacheContentsProcessed : ArrayList<Pair<Integer, ArrayList<Pair<String, Integer>>>>
  var _cacheContentsAcrossAges : Pair<Integer, ArrayList<Pair<String, Integer>>> = null;
  var _lastWeekRollupSnapshot : ArrayList<CacheStatisticsRollupSnapshotData>
  var _numDaysOfRollupData : int
  var _todayRollupSnapshot : ArrayList<CacheStatisticsRollupSnapshotData>
  var _timesOfDay : Date[]

  private construct() {
    reload();
    _timesOfDay = new Date[CentipedeCacheStatisticsRollup.NUM_ROLLUPS_PER_DAY]
    var today = Calendar.getInstance() // In case this gets initialized right before midnight...
    for (var i in CentipedeCacheStatisticsRollup.NUM_ROLLUPS_PER_DAY) {
      var cal = Calendar.getInstance()
      var minutesSinceMidnight = (CentipedeCacheStatisticsRollup.ROLLUP_TIME_MINS * i)
      var hourPastMidnight = minutesSinceMidnight / 60
      var minutesPastTheHour = minutesSinceMidnight - (hourPastMidnight * 60)
      cal.set(Calendar.YEAR, today.get(Calendar.YEAR))
      cal.set(Calendar.MONTH, today.get(Calendar.MONTH))
      cal.set(Calendar.DAY_OF_MONTH, today.get(Calendar.DAY_OF_MONTH))
      cal.set(Calendar.HOUR_OF_DAY, hourPastMidnight)
      cal.set(Calendar.MINUTE, minutesPastTheHour)
      _timesOfDay[i] = cal.Time
    }
  }
  
  public final function reload() {
    _timestamp = new Date()
    _snapshots = (PLDependencies.getGlobalCache() as GlobalCacheImpl).CacheStatistics;
    _numAges = Math.min(_snapshots.length, PLConfigParameters.GlobalCacheStatsWindowMinutes.Value + 1)
    _cacheContentsRaw = (PLDependencies.getGlobalCache() as GlobalCacheImpl).getWhatIsInTheCache()
    _cacheContentsProcessed = null
    _lastWeekRollupSnapshot = new ArrayList<CacheStatisticsRollupSnapshot>(CentipedeCacheStatisticsRollup.NUM_ROLLUPS_PER_DAY)
    _numDaysOfRollupData = 0
    var lastWeekRollup = (PLDependencies.getGlobalCache() as GlobalCacheImpl).LastRetentionPeriodRollup
    for (var timeOfDayIndex in CentipedeCacheStatisticsRollup.NUM_ROLLUPS_PER_DAY) {
      var numDays = 0
      var averageSpaceRetained = 0 as long
      var averageNumHits = 0 as long
      var averageNumMisses = 0 as long
      var averageNumMissesBecauseEvictedWhenCacheFull = 0 as long
      for (var dayRollup in lastWeekRollup) {
        if (dayRollup != null) {
          if (dayRollup[timeOfDayIndex] != null) {
            averageSpaceRetained += dayRollup[timeOfDayIndex].AverageSpaceRetained
            averageNumHits += dayRollup[timeOfDayIndex].AverageNumHits
            averageNumMisses += dayRollup[timeOfDayIndex].AverageNumMisses
            averageNumMissesBecauseEvictedWhenCacheFull += dayRollup[timeOfDayIndex].AverageNumMissesWhenCacheFull
            numDays++
          }
        }
      }
      if (_numDaysOfRollupData < numDays) {
        _numDaysOfRollupData = numDays
      }
      if (numDays > 0) {
        var snapshot = new CacheStatisticsRollupSnapshotDataImpl(_timesOfDay[timeOfDayIndex],
                                                                averageSpaceRetained / numDays,
                                                                averageNumHits / numDays,
                                                                averageNumMisses / numDays,
                                                                averageNumMissesBecauseEvictedWhenCacheFull / numDays)
        _lastWeekRollupSnapshot.add(snapshot)
      }
    }
    var todayRollup = (PLDependencies.getGlobalCache() as GlobalCacheImpl).TodayRollup
    _todayRollupSnapshot = new ArrayList<CacheStatisticsRollupSnapshot>(CentipedeCacheStatisticsRollup.NUM_ROLLUPS_PER_DAY)
    for (var timeOfDayIndex in CentipedeCacheStatisticsRollup.NUM_ROLLUPS_PER_DAY) {
      if (todayRollup[timeOfDayIndex] != null) {
        var snapshot = new CacheStatisticsRollupSnapshotDataImpl(_timesOfDay[timeOfDayIndex],
                                                                 todayRollup[timeOfDayIndex].AverageSpaceRetained,
                                                                 todayRollup[timeOfDayIndex].AverageNumHits,
                                                                 todayRollup[timeOfDayIndex].AverageNumMisses,
                                                                 todayRollup[timeOfDayIndex].AverageNumMissesWhenCacheFull)
        _todayRollupSnapshot.add(snapshot)
      }
    }
  }

  property get Timestamp() : Date {
    return _timestamp
  }

  property get Snapshots() : CacheStatisticsSnapshot[] {
    return _snapshots
  }

  property get NumAges() : int {
    return _numAges
  }
  
  property get LatestSnapshot() : CacheStatisticsSnapshot {
    return _snapshots[_snapshots.length - 1]
  }
  
  property get ContentsMapByAge() : ArrayList<Pair<Integer, ArrayList<Pair<String, Integer>>>> {
    if (_cacheContentsProcessed == null) {
      _cacheContentsProcessed = CacheContentsUtil.filterByLargestAndPutRestInOtherBucket(_cacheContentsRaw)
      _cacheContentsAcrossAges = CacheContentsUtil.combinedCacheInfoInOrder(_cacheContentsProcessed)
    }
    return _cacheContentsProcessed
  }
  
  property get YoungestContentsMap() : Pair<Integer, ArrayList<Pair<String, Integer>>> {
    if (ContentsMapByAge.Empty) {
      return new Pair<Integer, ArrayList<Pair<String, Integer>>>(0, new ArrayList<Pair<String, Integer>>())
    } else {
      return ContentsMapByAge.get(0)
    }
  }
    
  property get CombinedContentsMap() : Pair<Integer, ArrayList<Pair<String, Integer>>> {
    var dummy = ContentsMapByAge // make sure we calculate the combined contents list
    if (_cacheContentsAcrossAges == null) {
      return new Pair<Integer, ArrayList<Pair<String, Integer>>>(-1, new ArrayList<Pair<String, Integer>>())
    } else {
      return _cacheContentsAcrossAges
    }
  }

  function getSnapshotIndex(snapshot : CacheStatisticsSnapshot) : int {
    for (i in _snapshots.length) {
      if (_snapshots[i] == snapshot) {
        return i;
      }
    }
    // Shouldn't happen
    throw "Invalid snapshot";
  }

  function getCategoryLabel(snapshot : CacheStatisticsSnapshot) : String {
    var ageIndex = getAgeIndex(snapshot)
    return ageIndex == 0 ? displaykey.Web.InternalTools.InfoPages.CacheInfo.Now : ageIndex as String
  }

  function getAgeIndex(snapshot : CacheStatisticsSnapshot) : int {
    return getSnapshotIndex(snapshot) - _numAges + 1;
  }

  function getAgeDistributionLabel(snapshot : CacheStatisticsSnapshot) : String {
    var age = getAgeIndex(snapshot)
    return age == 0 ? displaykey.Web.InternalTools.InfoPages.CacheInfo.AgeDistributionTime0 : displaykey.Web.InternalTools.InfoPages.CacheInfo.AgeDistribution(- age)
  }

  static function getCacheContentsLabel(contentsMap : Pair<Integer, ArrayList<Pair<String, Integer>>>) : String {
    if (contentsMap.First < 0) {
      return displaykey.Web.InternalTools.InfoPages.CacheInfo.WhatIsInTheCache(displaykey.Java.Select.All, contentsMap.Second.size())
    }
    return displaykey.Web.InternalTools.InfoPages.CacheInfo.WhatIsInTheCache(contentsMap.First, contentsMap.Second.size())
  }

  function getNumAgesInSizeDistribution(snapshot : CacheStatisticsSnapshot) : int {
    return java.lang.Math.min(snapshot.SizeDistributionByAgeFromCurrentTime.length, PLConfigParameters.GlobalCacheReapingTimeMinutes.Value)
  }

  function getDataSeriesForSizeDistribution(snapshot : CacheStatisticsSnapshot) : ArrayList<Pair<String, Integer>> {
    return makeDataSeriesFromIntArray(snapshot.SizeDistributionByAgeFromCurrentTime);
  }

  function makeDataSeriesFromIntArray(arr : int[]) : ArrayList<Pair<String, Integer>> {
    var dataSeries = new ArrayList<Pair<String, Integer>>(arr.length)
    var i = 0
    for (value in arr) {
      dataSeries.add(new Pair<String, Integer>(i as String, value))
      i++
    }
    return dataSeries;
  }

  function download() {
    var output = getStatisticsAsCSV()
    WebFileUtil.copyStreamToClient("text/csv", 
                                   displaykey.Web.InternalTools.InfoPages.CacheInfo + ".csv", 
                                   StreamUtil.getStringInputStream(output), 
                                   output.length)
  }

  private function getStatisticsAsCSV() : String {
    // Use rough approximation of size
    var output = new StringBuilder(_snapshots.length * 200 + 250)
    appendSnapshotData(output)
    appendWhatIsInTheCacheData(output)

    output.append(getLastWeekLabel()).append("\n")
    output.append(CacheStatisticsRollupSnapshotImpl.getCSVHeader())
    appendRollup(output, _lastWeekRollupSnapshot)

    output.append(displaykey.Web.InternalTools.InfoPages.CacheInfo.TodayRollup).append("\n")
    output.append(CacheStatisticsRollupSnapshotImpl.getCSVHeader())
    appendRollup(output, _todayRollupSnapshot)

    return output.toString()
  }
  
  private function appendSnapshotData(output : StringBuilder)  {
    output.append(CacheStatisticsSnapshot.getCSVHeader())
    var i = 0
    for (snapshot in _snapshots) {
      output.append(snapshot.getCSVLine())
      i++
    }
    output.append("\n\n")
  }
  
  private function appendWhatIsInTheCacheData(output : StringBuilder) {
    var i = 0;
    output.append(displaykey.Web.InternalTools.InfoPages.CacheInfo.WhatIsInTheCacheTitle).append("\n")
    for (var cacheContentsByAge in _cacheContentsRaw) {
      if (!cacheContentsByAge.Empty) {
        var contents = new ArrayList<Map.Entry<String, MutableReference<Integer>>>(cacheContentsByAge.entrySet())
        output.append(displaykey.Web.InternalTools.InfoPages.CacheInfo.WhatIsInTheCache(i as String, contents.size()))
        output.append("\n")
        Collections.sort(contents, \ x, y -> {
          return (y as Map.Entry<String, MutableReference<Integer>>).Value.get().compareTo((x as Map.Entry<String, MutableReference<Integer>>).Value.get())
        })
        for (var data in contents) {
          output.append(data.Key).append(",").append(data.Value.get()).append("\n");
        }        
      }
      i++  
    }
    output.append("\n\n")
  }
  
  private function appendRollup(output : StringBuilder, rollupSnapshots : ArrayList<CacheStatisticsRollupSnapshotData>) {
    for (var rollupSnapshot in rollupSnapshots) {
      output.append(rollupSnapshot.getCSVLine())
    }
    output.append("\n\n")
  }
  
  property get LastWeekRollupSnapshot() : ArrayList<CacheStatisticsRollupSnapshotData> {
    return _lastWeekRollupSnapshot
  }

  property get NumDaysOfRollupData() : int {
    return _numDaysOfRollupData
  }

  property get TodayRollupSnapshot() : ArrayList<CacheStatisticsRollupSnapshotData> {
    return _todayRollupSnapshot
  }
  
  function getLastWeekLabel() : String {
    return (NumDaysOfRollupData == 1) ? displaykey.Web.InternalTools.InfoPages.CacheInfo.Yesterday : displaykey.Web.InternalTools.InfoPages.CacheInfo.LastWeekDays(NumDaysOfRollupData)   
  }
}
