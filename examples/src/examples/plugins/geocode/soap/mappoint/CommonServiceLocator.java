/**
 * CommonServiceLocator.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class CommonServiceLocator extends org.apache.axis.client.Service implements CommonService {

/**
 * The common service contains classes, methods, and properties that
 * are common to the find, route, and render services.  The common service
 * also provides basic utility functions that can be used in the Microsoft
 * MapPoint Web Service applications.</p><p class="intro">Read the <a
 * href="default.htm">formal description</a> of the MapPoint Web Service
 * for more information.
 */

    public CommonServiceLocator() {
    }


    public CommonServiceLocator(org.apache.axis.EngineConfiguration config) {
        super(config);
    }

    public CommonServiceLocator(java.lang.String wsdlLoc, javax.xml.namespace.QName sName) throws javax.xml.rpc.ServiceException {
        super(wsdlLoc, sName);
    }

    // Use to get a proxy class for CommonServiceSoap
    private java.lang.String CommonServiceSoap_address = null;

    public java.lang.String getCommonServiceSoapAddress() {
        return CommonServiceSoap_address;
    }

    // The WSDD service name defaults to the port name.
    private java.lang.String CommonServiceSoapWSDDServiceName = "CommonServiceSoap";

    public java.lang.String getCommonServiceSoapWSDDServiceName() {
        return CommonServiceSoapWSDDServiceName;
    }

    public void setCommonServiceSoapWSDDServiceName(java.lang.String name) {
        CommonServiceSoapWSDDServiceName = name;
    }

    public CommonServiceSoap getCommonServiceSoap() throws javax.xml.rpc.ServiceException {
       java.net.URL endpoint;
        try {
            endpoint = new java.net.URL(CommonServiceSoap_address);
        }
        catch (java.net.MalformedURLException e) {
            throw new javax.xml.rpc.ServiceException(e);
        }
        return getCommonServiceSoap(endpoint);
    }

    public CommonServiceSoap getCommonServiceSoap(java.net.URL portAddress) throws javax.xml.rpc.ServiceException {
        try {
            CommonServiceSoapStub _stub = new CommonServiceSoapStub(portAddress, this);
            _stub.setPortName(getCommonServiceSoapWSDDServiceName());
            return _stub;
        }
        catch (org.apache.axis.AxisFault e) {
            return null;
        }
    }

    public void setCommonServiceSoapEndpointAddress(java.lang.String address) {
        CommonServiceSoap_address = address;
    }

    /**
     * For the given interface, get the stub implementation.
     * If this service has no port for the given interface,
     * then ServiceException is thrown.
     */
    public java.rmi.Remote getPort(Class serviceEndpointInterface) throws javax.xml.rpc.ServiceException {
        try {
            if (CommonServiceSoap.class.isAssignableFrom(serviceEndpointInterface)) {
                CommonServiceSoapStub _stub = new CommonServiceSoapStub(new java.net.URL(CommonServiceSoap_address), this);
                _stub.setPortName(getCommonServiceSoapWSDDServiceName());
                return _stub;
            }
        }
        catch (java.lang.Throwable t) {
            throw new javax.xml.rpc.ServiceException(t);
        }
        throw new javax.xml.rpc.ServiceException("There is no stub implementation for the interface:  " + (serviceEndpointInterface == null ? "null" : serviceEndpointInterface.getName()));
    }

    /**
     * For the given interface, get the stub implementation.
     * If this service has no port for the given interface,
     * then ServiceException is thrown.
     */
    public java.rmi.Remote getPort(javax.xml.namespace.QName portName, Class serviceEndpointInterface) throws javax.xml.rpc.ServiceException {
        if (portName == null) {
            return getPort(serviceEndpointInterface);
        }
        java.lang.String inputPortName = portName.getLocalPart();
        if ("CommonServiceSoap".equals(inputPortName)) {
            return getCommonServiceSoap();
        }
        else  {
            java.rmi.Remote _stub = getPort(serviceEndpointInterface);
            ((org.apache.axis.client.Stub) _stub).setPortName(portName);
            return _stub;
        }
    }

    public javax.xml.namespace.QName getServiceName() {
        return new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "CommonService");
    }

    private java.util.HashSet ports = null;

    public java.util.Iterator getPorts() {
        if (ports == null) {
            ports = new java.util.HashSet();
            ports.add(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "CommonServiceSoap"));
        }
        return ports.iterator();
    }

    /**
    * Set the endpoint address for the specified port name.
    */
    public void setEndpointAddress(java.lang.String portName, java.lang.String address) throws javax.xml.rpc.ServiceException {
        
if ("CommonServiceSoap".equals(portName)) {
            setCommonServiceSoapEndpointAddress(address);
        }
        else 
{ // Unknown Port Name
            throw new javax.xml.rpc.ServiceException(" Cannot set Endpoint Address for Unknown Port" + portName);
        }
    }

    /**
    * Set the endpoint address for the specified port name.
    */
    public void setEndpointAddress(javax.xml.namespace.QName portName, java.lang.String address) throws javax.xml.rpc.ServiceException {
        setEndpointAddress(portName.getLocalPart(), address);
    }

}

