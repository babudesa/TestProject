package gw.test.pl.archive

uses com.guidewire.pl.system.dependency.PLDependencies
uses com.guidewire.pl.domain.archiving.TableGraph
uses com.guidewire.pl.system.database.query.DeleteBuilder
uses gw.api.database.Query

public class ArchiveTestUtil {
  static function getArchivedCount() : int {
    var q = new Query(com.guidewire.pl.system.dependency.PLDependencies.getDomainGraphSupport().RootInfoType)
    q.compare("ArchiveState", Equals, ArchiveState.TC_ARCHIVED)
    return q.select().Count
  }
  
  static function clearLocal() {
    var domainGrph = PLDependencies.getDomainGraphSupport();
    deleteAll(domainGrph.getDomainGraph(), false);
  }

  private static function deleteAll(graph : TableGraph, processOverlapTable : boolean) {
    for (var table in graph.getTablesInDeleteOrder()) {
      if (processOverlapTable || !graph.isOverlapTable(table)) {
        new DeleteBuilder(table.getEntityType()).execute();
      }
    }
  }
}
