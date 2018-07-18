package examples.plugins.management;

import com.guidewire.pl.plugin.management.ManagementAuthorizationCallbackHandler;
import mx4j.tools.naming.NamingService;

import javax.management.MBeanServer;
import javax.management.ObjectName;
import javax.management.remote.JMXConnectorServer;
import javax.management.remote.JMXConnectorServerFactory;
import javax.management.remote.JMXServiceURL;
import javax.naming.Context;
import java.rmi.server.ExportException;
import java.util.HashMap;
import java.util.Map;

/**
 * Guidewire Software
 * <p/>
 * Creator information:
 * User: akeefer
 * Date: Jan 26, 2005 2:18:51 PM
 */
public class JSR160Connector {
  private ObjectName _namingServiceName;
  private NamingService _namingService;
  private JMXConnectorServer _connectorServer;
  private ObjectName _connectorServerName;

  private int _rmiPort;
  private ManagementAuthorizationCallbackHandler _callbackHandler;

  public JSR160Connector(int rmiPort, ManagementAuthorizationCallbackHandler callbackHandler) {
    _rmiPort = rmiPort;
    _callbackHandler = callbackHandler;
  }

  public void registerAdapter(MBeanServer mBeanServer) throws Exception {
    ClassLoader previousLoader = Thread.currentThread().getContextClassLoader();
    Thread.currentThread().setContextClassLoader(getClass().getClassLoader());
    try {
      try {
        _namingService = new NamingService(_rmiPort);
        // Create the naming service bean and start it
        _namingServiceName = new ObjectName("Naming:type=registry");
        _namingService.start();

        mBeanServer.registerMBean(_namingService, _namingServiceName);
      } catch (ExportException e) {
        // This can happen if the naming service, for whatever reason, doesn't properly stop
        // when switching maintenance modes
        _namingService = null;
      }

      JMXServiceURL address = new JMXServiceURL("service:jmx:rmi://localhost:" + _rmiPort + "/jndi/jrmp");
      //JMXServiceURL address = new JMXServiceURL("jmxmp", "localhost", 0, "/jndi/jrmp");

      Map environment = new HashMap();
      environment.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.rmi.registry.RegistryContextFactory");
      environment.put(Context.PROVIDER_URL, "rmi://localhost:" + _rmiPort);
      environment.put(JMXConnectorServer.AUTHENTICATOR, new JMXAuthenticatorImpl(_callbackHandler));

      _connectorServer = JMXConnectorServerFactory.newJMXConnectorServer(address, environment, null);

      _connectorServerName = ObjectName.getInstance("connectors:protocol=rmi");
      mBeanServer.registerMBean(_connectorServer, _connectorServerName);

      _connectorServer.start();
    } finally {
      Thread.currentThread().setContextClassLoader(previousLoader);
    }
  }

  public void unregisterAdapter(MBeanServer mBeanServer) throws Exception {
    // Shut down the RMI Connector
    _connectorServer.stop();
    mBeanServer.unregisterMBean(_connectorServerName);

    // Shut down the naming service bean, if applicable
    if (_namingService != null) {
      _namingService.stop();
      mBeanServer.unregisterMBean(_namingServiceName);
    }
  }
}
