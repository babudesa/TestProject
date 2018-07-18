package gw.api.profiler
uses java.util.Date
uses com.guidewire.pl.web.controller.UserDisplayableException
uses gw.api.database.Query
uses gw.api.database.IQueryBuilder

class TimeSearchProfilerPageHelper
{
  construct()
  {
  }

  public static function getProfilerDataSource(beginTime : Date, endTime : Date) : gw.api.profiler.ProfilerDataSource {
    var sources = new java.util.ArrayList<ProfilerDataSource>();
    var f1 = getProcessHistoryInTimeRange( beginTime, endTime )
    for (f in f1) {
      sources.add(f)
    }
    var f2 = getInboundHistoryInTimeRange( beginTime, endTime )
    for (f in f2) {
      sources.add(f)
    }
    var f3 = getInstrumentedWorkerInTimeRange( beginTime, endTime )
    for (f in f3) {
      sources.add(f)
    }
    var f4 = getInstrumentedWorkerTaskInTimeRange( beginTime, endTime )
    for (f in f4) {
      sources.add(f)
    }
    var f5 = getInstrumentedMessageInTimeRange( beginTime, endTime )
    for (f in f5) {
      sources.add(f)
    }
    if (sources.Empty) {
      throw new UserDisplayableException(displaykey.Java.Search.NoResults)
    }
    return new com.guidewire.pl.system.profiler.MergedProfilerDataSource(displaykey.Java.Search.Date.From + " " + beginTime + " " +
                                                                         displaykey.Java.Search.Date.To + " " + endTime, 
                                                                         sources)
  }
  
  internal static function getProcessHistoryInTimeRange(beginTimeOfSearch : Date, endTimeOfSearch : Date) : ProcessHistoryQuery {
    return Query.make(ProcessHistory)
      .and(\ r -> {
        r.compare("ProfilerData", NotEquals, null)
        r.or(\ r2 -> {
          r2.and(\ r3 -> {
            r3.compare("StartDate", LessThanOrEquals, beginTimeOfSearch)
            r3.or(\ r4 -> {
              r4.compare("CompleteDate", Equals, null)
              r4.compare("CompleteDate", GreaterThan, beginTimeOfSearch)
            })
          })
          r2.between("StartDate", beginTimeOfSearch, endTimeOfSearch)
        })
      }).select()
  }

  internal static function getInboundHistoryInTimeRange(beginTimeOfSearch : Date, endTimeOfSearch : Date) : InboundHistoryQuery {
    return Query.make(InboundHistory)
      .or(\ r -> {
        r.and(\ r2 -> {
          r2.compare("StartDate", LessThanOrEquals, beginTimeOfSearch)
          r2.compare("CompleteDate", GreaterThan, beginTimeOfSearch)
        })
        r.between("StartDate", beginTimeOfSearch, endTimeOfSearch)
      }).select()
  }

  internal static function getInstrumentedWorkerTaskInTimeRange(beginTimeOfSearch : Date, endTimeOfSearch : Date) : InstrumentedWorkerTaskQuery {
    return applyRestrictionsToInstrumentedWhateverQuery(InstrumentedWorkerTask, beginTimeOfSearch, endTimeOfSearch).select()
  }

  internal static function getInstrumentedWorkerInTimeRange(beginTimeOfSearch : Date, endTimeOfSearch : Date) : InstrumentedWorkerQuery {
    return applyRestrictionsToInstrumentedWhateverQuery(InstrumentedWorker, beginTimeOfSearch, endTimeOfSearch).select()
  }

  internal static function getInstrumentedMessageInTimeRange(beginTimeOfSearch : Date, endTimeOfSearch : Date) : InstrumentedMessageQuery {
    return applyRestrictionsToInstrumentedWhateverQuery(InstrumentedMessage, beginTimeOfSearch, endTimeOfSearch).select()
  }

  private static function applyRestrictionsToInstrumentedWhateverQuery<T extends KeyableBean>(t : Type<T>, beginTimeOfSearch : Date, endTimeOfSearch : Date) : IQueryBuilder<T> {
    return Query.make(t)
      .and(\ r -> {
        r.compare("ProfilerData", NotEquals, null)
        r.or(\ r2 -> {
          r2.and(\ r3 -> {
            r3.compare("StartTime", LessThanOrEquals, beginTimeOfSearch)
            r3.or(\ r4 -> {
              r4.compare("EndTime", Equals, null)
              r4.compare("EndTime", GreaterThan, beginTimeOfSearch)
            })
          })
          r2.between("StartTime", beginTimeOfSearch, endTimeOfSearch)
        })
      })
  }
}
