package examples.plugins.management;

import com.guidewire.pl.plugin.management.AttributeInfo;
import com.guidewire.pl.plugin.management.GWMBean;
import com.guidewire.pl.plugin.management.GWMBeanInfo;
import com.guidewire.pl.plugin.management.NotificationInfo;
import com.guidewire.pl.plugin.management.OperationInfo;
import com.guidewire.logging.LoggerCategory;

import javax.management.Attribute;
import javax.management.AttributeNotFoundException;
import javax.management.InvalidAttributeValueException;
import javax.management.Notification;
import javax.management.AttributeList;
import javax.management.DynamicMBean;
import javax.management.ListenerNotFoundException;
import javax.management.MBeanException;
import javax.management.MBeanInfo;
import javax.management.MBeanNotificationInfo;
import javax.management.MBeanOperationInfo;
import javax.management.NotificationBroadcaster;
import javax.management.NotificationBroadcasterSupport;
import javax.management.NotificationFilter;
import javax.management.NotificationListener;
import javax.management.ReflectionException;
import javax.management.openmbean.OpenMBeanAttributeInfo;
import javax.management.openmbean.OpenMBeanAttributeInfoSupport;
import javax.management.openmbean.OpenMBeanConstructorInfo;
import javax.management.openmbean.OpenMBeanInfoSupport;
import javax.management.openmbean.OpenMBeanOperationInfo;
import javax.management.openmbean.OpenMBeanOperationInfoSupport;
import javax.management.openmbean.OpenMBeanParameterInfo;
import javax.management.openmbean.OpenType;
import javax.management.openmbean.SimpleType;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.lang.reflect.Method;

/**
 * Guidewire Software
 * <p/>
 * Creator information:
 * User: akeefer
 * Date: Apr 18, 2005 3:18:16 PM
 */
public class GWMBeanWrapper implements DynamicMBean, NotificationBroadcaster {
  private GWMBean _wrappedBean;
  private NotificationBroadcasterSupport _broadcasterSupport;

  public GWMBeanWrapper(GWMBean wrappedBean) {
    _wrappedBean = wrappedBean;
    _broadcasterSupport = new NotificationBroadcasterSupport();
  }

  public MBeanInfo getMBeanInfo() {
    GWMBeanInfo info = _wrappedBean.getMBeanInfo();
    List<String> errors = new ArrayList<String>();

    List<OpenMBeanAttributeInfo> attributes = new ArrayList<OpenMBeanAttributeInfo>();
    for (int i = 0; i < info.getAttributes().size(); i++) {
      AttributeInfo attributeInfo = info.getAttributes().get(i);
      try {
        attributes.add(new OpenMBeanAttributeInfoSupport(attributeInfo.getName(), attributeInfo.getDesc(),
                getOpenType(attributeInfo.getType()), attributeInfo.isReadable(), attributeInfo.isWritable(), false));
      } catch (Exception e) {
        errors.add("On attribute[" + i + "] '" + attributeInfo.getName() + "': " + e.getMessage());
      }
    }

    List<MBeanNotificationInfo> notifications = new ArrayList<MBeanNotificationInfo>();
    for (int i = 0; i < info.getNotifications().size(); i++) {
      NotificationInfo notificationInfo = info.getNotifications().get(i);
      try {
        notifications.add(new MBeanNotificationInfo(notificationInfo.getNotificationTypes(), notificationInfo.getName(), notificationInfo.getDescription()));
      } catch (Exception e) {
        errors.add("On notification[" + i + "] '" + notificationInfo.getName() + "': " + e.getMessage());
      }
    }

    List<OpenMBeanOperationInfo> operations = new ArrayList<OpenMBeanOperationInfo>();
    for (int i = 0; i < info.getOperations().size(); i++) {
      OperationInfo operationInfo = info.getOperations().get(i);
      try {
        OpenMBeanParameterInfo[] signature = new OpenMBeanParameterInfo[0];
        OpenType type = getOpenType(operationInfo.getReturnType());
        int impact = (operationInfo.isAction() && operationInfo.isInfo()) ? MBeanOperationInfo.ACTION_INFO
            : operationInfo.isAction() ? MBeanOperationInfo.ACTION
            : operationInfo.isInfo() ? MBeanOperationInfo.INFO
            : MBeanOperationInfo.UNKNOWN;
        operations.add(new OpenMBeanOperationInfoSupport(operationInfo.getName(), operationInfo.getDesc(), signature, type, impact));
      } catch (Exception e) {
        errors.add("On operation[" + i + "] '" + operationInfo.getName() + "': " + e.getMessage());
      }
    }

    if (!errors.isEmpty()) {
      LoggerCategory.PLUGIN.error("On bean " + _wrappedBean.getBeanName() + ": " + errors); // the throw is swallowed
      throw new RuntimeException("On bean " + _wrappedBean.getBeanName() + ": " + errors);
    }
    return new OpenMBeanInfoSupport(info.getName(), info.getDescription(),
            attributes.toArray(new OpenMBeanAttributeInfo[attributes.size()]),
            new OpenMBeanConstructorInfo[0],
            operations.toArray(new OpenMBeanOperationInfo[operations.size()]),
            notifications.toArray(new MBeanNotificationInfo[notifications.size()]));
  }

  public Object getAttribute(String s) throws AttributeNotFoundException, MBeanException, ReflectionException {
    try {
      return _wrappedBean.getAttribute(s);
    } catch (com.guidewire.pl.plugin.management.AttributeNotFoundException e) {
      throw new AttributeNotFoundException(e.getMessage());
    }
  }

  public void setAttribute(Attribute attribute) throws AttributeNotFoundException, InvalidAttributeValueException, MBeanException, ReflectionException {
    try {
      _wrappedBean.setAttribute(new com.guidewire.pl.plugin.management.Attribute(attribute.getName(), attribute.getValue()));
    } catch (com.guidewire.pl.plugin.management.AttributeNotFoundException e) {
      throw new AttributeNotFoundException(e.getMessage());
    } catch (com.guidewire.pl.plugin.management.InvalidAttributeValueException e) {
      throw new InvalidAttributeValueException(e.getMessage());
    }
  }

  public AttributeList getAttributes(String[] attributes) {
    AttributeList list = new AttributeList();
    for (String attribute : attributes) {
      try {
        list.add(new Attribute(attribute, getAttribute(attribute)));
      } catch (Exception e) {
        // TODO: Log it?
      }
    }

    return list;
  }

  public AttributeList setAttributes(AttributeList attributes) {
    AttributeList list = new AttributeList();
    for (int i = 0; i < attributes.size(); i++) {
      Attribute attribute = (Attribute) attributes.get(i);
      try {
        setAttribute(attribute);
        list.add(new Attribute(attribute.getName(), getAttribute(attribute.getName())));
      } catch (Exception e) {
        // TODO: Log it?
      }
    }

    return list;
  }

  public MBeanNotificationInfo[] getNotificationInfo() {
    return getMBeanInfo().getNotifications();
  }

  public void addNotificationListener(NotificationListener notificationListener, NotificationFilter notificationFilter, Object o) throws IllegalArgumentException {
    _broadcasterSupport.addNotificationListener(notificationListener, notificationFilter, o);
  }

  public void removeNotificationListener(NotificationListener notificationListener) throws ListenerNotFoundException {
    _broadcasterSupport.removeNotificationListener(notificationListener);
  }

  public void sendNotification(Notification notification) {
    _broadcasterSupport.sendNotification(notification);
  }

  public Object invoke(String methodName, Object[] paramObjs, String[] paramNames) throws MBeanException, ReflectionException {
    try {
      final Method method = _wrappedBean.getClass().getMethod(methodName);
      return method.invoke(_wrappedBean, paramObjs);
    } catch (Exception e) {
      LoggerCategory.PLUGIN.error("On bean " + _wrappedBean.getBeanName() + ": ", e); // the throw is passed to client
      throw new MBeanException(e);
    }
  }

  private static final Map<Class,SimpleType> CLASS_TO_OPEN_TYPE_MAP = new HashMap<Class,SimpleType>();
  static {
    CLASS_TO_OPEN_TYPE_MAP.put(Integer.class, SimpleType.INTEGER);
    CLASS_TO_OPEN_TYPE_MAP.put(String.class, SimpleType.STRING);
    CLASS_TO_OPEN_TYPE_MAP.put(Double.class, SimpleType.DOUBLE);
    CLASS_TO_OPEN_TYPE_MAP.put(Date.class, SimpleType.DATE);
    CLASS_TO_OPEN_TYPE_MAP.put(Boolean.class, SimpleType.BOOLEAN);
    CLASS_TO_OPEN_TYPE_MAP.put(Long.class, SimpleType.LONG);
    CLASS_TO_OPEN_TYPE_MAP.put(int.class, SimpleType.INTEGER);
    CLASS_TO_OPEN_TYPE_MAP.put(long.class, SimpleType.LONG);
    CLASS_TO_OPEN_TYPE_MAP.put(boolean.class, SimpleType.BOOLEAN);
    CLASS_TO_OPEN_TYPE_MAP.put(byte.class, SimpleType.BYTE);
    CLASS_TO_OPEN_TYPE_MAP.put(void.class, SimpleType.VOID);
  }

  private OpenType getOpenType(Class type) {
    if (CLASS_TO_OPEN_TYPE_MAP.containsKey(type)) {
      return CLASS_TO_OPEN_TYPE_MAP.get(type);
    } else {
      throw new IllegalArgumentException("Class " + type + " hasn't been mapped to an appropriate open type");
    }
  }
}
