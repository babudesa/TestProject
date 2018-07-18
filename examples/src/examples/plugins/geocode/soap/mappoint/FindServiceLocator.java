/**
 * FindServiceLocator.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class FindServiceLocator extends org.apache.axis.client.Service implements FindService {

/**
 * The Find service allows you to locate addresses, places, latitude/longitude
 * coordinates, and points of interest (from either MapPoint Web Service
 * data or your data that we host for your use).
 */

    public FindServiceLocator() {
    }


    public FindServiceLocator(org.apache.axis.EngineConfiguration config) {
        super(config);
    }

    public FindServiceLocator(java.lang.String wsdlLoc, javax.xml.namespace.QName sName) throws javax.xml.rpc.ServiceException {
        super(wsdlLoc, sName);
    }

    // Use to get a proxy class for FindServiceSoap
    private java.lang.String FindServiceSoap_address = null;

    public java.lang.String getFindServiceSoapAddress() {
        return FindServiceSoap_address;
    }

    // The WSDD service name defaults to the port name.
    private java.lang.String FindServiceSoapWSDDServiceName = "FindServiceSoap";

    public java.lang.String getFindServiceSoapWSDDServiceName() {
        return FindServiceSoapWSDDServiceName;
    }

    public void setFindServiceSoapWSDDServiceName(java.lang.String name) {
        FindServiceSoapWSDDServiceName = name;
    }

    public FindServiceSoap getFindServiceSoap() throws javax.xml.rpc.ServiceException {
       java.net.URL endpoint;
        try {
            endpoint = new java.net.URL(FindServiceSoap_address);
        }
        catch (java.net.MalformedURLException e) {
            throw new javax.xml.rpc.ServiceException(e);
        }
        return getFindServiceSoap(endpoint);
    }

    public FindServiceSoap getFindServiceSoap(java.net.URL portAddress) throws javax.xml.rpc.ServiceException {
        try {
            FindServiceSoapStub _stub = new FindServiceSoapStub(portAddress, this);
            _stub.setPortName(getFindServiceSoapWSDDServiceName());
            return _stub;
        }
        catch (org.apache.axis.AxisFault e) {
            return null;
        }
    }

    public void setFindServiceSoapEndpointAddress(java.lang.String address) {
        FindServiceSoap_address = address;
    }

    /**
     * For the given interface, get the stub implementation.
     * If this service has no port for the given interface,
     * then ServiceException is thrown.
     */
    public java.rmi.Remote getPort(Class serviceEndpointInterface) throws javax.xml.rpc.ServiceException {
        try {
            if (FindServiceSoap.class.isAssignableFrom(serviceEndpointInterface)) {
                FindServiceSoapStub _stub = new FindServiceSoapStub(new java.net.URL(FindServiceSoap_address), this);
                _stub.setPortName(getFindServiceSoapWSDDServiceName());
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
        if ("FindServiceSoap".equals(inputPortName)) {
            return getFindServiceSoap();
        }
        else  {
            java.rmi.Remote _stub = getPort(serviceEndpointInterface);
            ((org.apache.axis.client.Stub) _stub).setPortName(portName);
            return _stub;
        }
    }

    public javax.xml.namespace.QName getServiceName() {
        return new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "FindService");
    }

    private java.util.HashSet ports = null;

    public java.util.Iterator getPorts() {
        if (ports == null) {
            ports = new java.util.HashSet();
            ports.add(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "FindServiceSoap"));
        }
        return ports.iterator();
    }

    /**
    * Set the endpoint address for the specified port name.
    */
    public void setEndpointAddress(java.lang.String portName, java.lang.String address) throws javax.xml.rpc.ServiceException {
        
if ("FindServiceSoap".equals(portName)) {
            setFindServiceSoapEndpointAddress(address);
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

