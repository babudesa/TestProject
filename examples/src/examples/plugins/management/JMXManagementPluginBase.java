package examples.plugins.management;

import com.guidewire.pl.plugin.InitializablePlugin;
import com.guidewire.pl.plugin.management.ManagementAuthorizationCallbackHandler;
import com.guidewire.pl.plugin.management.GWMBean;
import com.guidewire.pl.plugin.management.NotificationSenderMarker;
import com.guidewire.pl.plugin.management.Notification;
import com.guidewire.logging.LoggerCategory;

import javax.management.MBeanServer;
import javax.management.MBeanServerFactory;
import javax.management.ObjectName;
import java.util.Map;
import java.util.Set;
import java.util.ArrayList;

/**
 * Guidewire Software
 * <p/>
 * Creator information:
 * User: akeefer
 * Date: Apr 18, 2005 5:55:29 PM
 */
public class JMXManagementPluginBase implements InitializablePlugin {
  protected MBeanServer _mBeanServer;
  protected GWMBeanWrapper _notificationSender;
  protected int _rmiPort = 1099; // Default to 1099
  protected JSR160Connector _connector;
  protected ManagementAuthorizationCallbackHandler _callbackHandler;

  public void start() {
    _mBeanServer = MBeanServerFactory.createMBeanServer();
    startConnectors();
  }

  public void stop() {
    if (_mBeanServer != null) {
      stopConnectors();
      MBeanServerFactory.releaseMBeanServer(_mBeanServer);
    }
  }

  public void setParameters(Map params) {
    if (params.containsKey("rmiPort")) {
      _rmiPort = Integer.parseInt((String) params.get("rmiPort"));
    } else {
       LoggerCategory.PLUGIN.error("No rmiPort parameter defined for JMXManagementPlugin");
    }

    LoggerCategory.PLUGIN.info("Starting JSR 160 connector on port " + _rmiPort);
  }

  public void setAuthorizationCallbackHandler(ManagementAuthorizationCallbackHandler handler) {
    _callbackHandler = handler;
  }

  public void registerBean(GWMBean bean) {
    ArrayList<MBeanServer> mBeanServers = MBeanServerFactory.findMBeanServer(null);
    for (MBeanServer mBeanServer : mBeanServers) {
      try {
        GWMBeanWrapper beanWrapper = new GWMBeanWrapper(bean);
        if (bean instanceof NotificationSenderMarker) {
          _notificationSender = beanWrapper;
        }
        mBeanServer.registerMBean(beanWrapper, ObjectName.getInstance(bean.getBeanName()));
      } catch (Exception e) {
        LoggerCategory.PLUGIN.error("Error registering MBean " + bean.getBeanName()  + " on port " + _rmiPort, e);
      }
    }
  }

  public void unregisterBean(GWMBean bean) {
    ArrayList<MBeanServer> mBeanServers = MBeanServerFactory.findMBeanServer(null);
    for (MBeanServer mBeanServer : mBeanServers) {
      try {
        mBeanServer.unregisterMBean(ObjectName.getInstance(bean.getBeanName()));
      } catch (Exception e) {
        LoggerCategory.PLUGIN.error("Error unregistering MBean " + bean.getBeanName() + " on port " + _rmiPort, e);
      }
    }
  }

  public void unregisterBeanByNamePrefix(String pattern) {
    ArrayList<MBeanServer> mBeanServers = MBeanServerFactory.findMBeanServer(null);
    for (MBeanServer mBeanServer : mBeanServers) {
      try {
        Set<ObjectName> names = mBeanServer.queryNames(new ObjectName(pattern + "*"), null);
        for (ObjectName name : names) {
          mBeanServer.unregisterMBean(name);
        }
      } catch (Exception e) {
        LoggerCategory.PLUGIN.error("Error unregistering beans with pattern " + pattern + "*" + " on port " + _rmiPort, e);
      }
    }
  }

  public void sendNotification(Notification notification) {
    if (_notificationSender != null) {
      _notificationSender.sendNotification(new javax.management.Notification(notification.getType(), notification.getSource(), notification.getSequenceNumber(), notification.getMessage()));
    }
  }

  /**
   * Subclasser hook for starting additional connectors.  By default this just starts the JSR160 connector, but it
   * can be overridden to do something else instead or in addition to that.
   */
  protected void startConnectors() {
    startJSR160Connector();
  }

  /**
   * Subclasser hook for stopping additional connectors.  By default this just stops the JSR160 connector, but it
   * can be overridden to do something else instead or in addition to that.  This ought to stop anything started
   * in the startConnectors method.
   */
  protected void stopConnectors() {
    stopJSR160Connector();
  }

  protected void startJSR160Connector() {
    try {
      _connector = new JSR160Connector(_rmiPort, _callbackHandler);
      _connector.registerAdapter(_mBeanServer);
    } catch (Exception e) {
      throw new RuntimeException("Error registering JSR160 connector on port " + _rmiPort, e);
    }
  }

  protected void stopJSR160Connector() {
   try {
      _connector.unregisterAdapter(_mBeanServer);
    } catch (Exception e) {
      throw new RuntimeException("Error unregistering JSR160 connector on port " + _rmiPort, e);
    }
  }
}
