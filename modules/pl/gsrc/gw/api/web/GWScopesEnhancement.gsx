package gw.api.web
uses java.util.Map

enhancement GWScopesEnhancement : gw.api.web.Scopes {

  /**
   * <p>Returns a Map that can be used to store and retrieve values whose lifespan should
   * be bound up with the lifespan of the request.  This map is not synchronized since
   * multiple threads should not be able to get to the same request object
   *
   * <p><b>Note</b> This map is only available in execution contexts that are associated with a
   * web request.  If it is accessed in other contexts an IllegalStateException will be thrown.
   * Also be aware that how this data is stored is dependent on the servlet container you are
   * running in, and your data must satisfy any constraints put on the data by that container (e.g.
   * it might be necessary to make your objects Serializable)
   */
  static property get Request() : Map {
    return Scopes.getRequest()
  }

  /**
   * <p>Returns a Map that can be used to store and retrieve values whose lifespan should
   * be bound up with the lifespan of the users session.  This map is synchronized since
   * multiple threads can access the session simultaneously (e.g. AJAX requests.)
   *
   * <p><b>Note</b> This map is only available in execution contexts that are associated with a
   * web request.  If it is accessed in other contexts an IllegalStateException will be thrown.
   * Also be aware that how this data is stored is dependent on the servlet container you are
   * running in, and your data must satisfy any constraints put on the data by that container (e.g.
   * it might be necessary to make your objects Serializable)
   */
  static property get Session() : Map {
    return Scopes.getSession()
  }

  /**
   * <p>Returns a Map that can be used to store and retrieve values whose lifespan should
   * be bound up with the lifespan of the web application.  This is almost identical to static variables,
   * but the map will be cleared when a servlet is torn down and restarted.
   *
   * <p><b>Note</b> This map is only available in execution contexts that are associated with a
   * servlet container.  If it is accessed in other contexts an IllegalStateException will be thrown.
   * Also be aware that how this data is stored is dependent on the servlet container you are
   * running in, and your data must satisfy any constraints put on the data by that container (e.g.
   * it might be necessary to make your objects Serializable)
   */
  static property get Application() : Map {
    return Scopes.getApplication()
  }

}
