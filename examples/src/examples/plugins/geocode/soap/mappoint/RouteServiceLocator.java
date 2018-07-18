/**
 * RouteServiceLocator.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class RouteServiceLocator extends org.apache.axis.client.Service implements RouteService {

/**
 * The route service allows you to generate routes, driving directions,
 * and calculated route representations (used to render a highlighted
 * route on the map) based on locations or waypoints, set segment and
 * route preferences, and generate map views of segments and directions.
 */

    public RouteServiceLocator() {
    }


    public RouteServiceLocator(org.apache.axis.EngineConfiguration config) {
        super(config);
    }

    public RouteServiceLocator(java.lang.String wsdlLoc, javax.xml.namespace.QName sName) throws javax.xml.rpc.ServiceException {
        super(wsdlLoc, sName);
    }

    // Use to get a proxy class for RouteServiceSoap
    private java.lang.String RouteServiceSoap_address = null;

    public java.lang.String getRouteServiceSoapAddress() {
        return RouteServiceSoap_address;
    }

    // The WSDD service name defaults to the port name.
    private java.lang.String RouteServiceSoapWSDDServiceName = "RouteServiceSoap";

    public java.lang.String getRouteServiceSoapWSDDServiceName() {
        return RouteServiceSoapWSDDServiceName;
    }

    public void setRouteServiceSoapWSDDServiceName(java.lang.String name) {
        RouteServiceSoapWSDDServiceName = name;
    }

    public RouteServiceSoap getRouteServiceSoap() throws javax.xml.rpc.ServiceException {
       java.net.URL endpoint;
        try {
            endpoint = new java.net.URL(RouteServiceSoap_address);
        }
        catch (java.net.MalformedURLException e) {
            throw new javax.xml.rpc.ServiceException(e);
        }
        return getRouteServiceSoap(endpoint);
    }

    public RouteServiceSoap getRouteServiceSoap(java.net.URL portAddress) throws javax.xml.rpc.ServiceException {
        try {
            RouteServiceSoapStub _stub = new RouteServiceSoapStub(portAddress, this);
            _stub.setPortName(getRouteServiceSoapWSDDServiceName());
            return _stub;
        }
        catch (org.apache.axis.AxisFault e) {
            return null;
        }
    }

    public void setRouteServiceSoapEndpointAddress(java.lang.String address) {
        RouteServiceSoap_address = address;
    }

    /**
     * For the given interface, get the stub implementation.
     * If this service has no port for the given interface,
     * then ServiceException is thrown.
     */
    public java.rmi.Remote getPort(Class serviceEndpointInterface) throws javax.xml.rpc.ServiceException {
        try {
            if (RouteServiceSoap.class.isAssignableFrom(serviceEndpointInterface)) {
                RouteServiceSoapStub _stub = new RouteServiceSoapStub(new java.net.URL(RouteServiceSoap_address), this);
                _stub.setPortName(getRouteServiceSoapWSDDServiceName());
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
        if ("RouteServiceSoap".equals(inputPortName)) {
            return getRouteServiceSoap();
        }
        else  {
            java.rmi.Remote _stub = getPort(serviceEndpointInterface);
            ((org.apache.axis.client.Stub) _stub).setPortName(portName);
            return _stub;
        }
    }

    public javax.xml.namespace.QName getServiceName() {
        return new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "RouteService");
    }

    private java.util.HashSet ports = null;

    public java.util.Iterator getPorts() {
        if (ports == null) {
            ports = new java.util.HashSet();
            ports.add(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "RouteServiceSoap"));
        }
        return ports.iterator();
    }

    /**
    * Set the endpoint address for the specified port name.
    */
    public void setEndpointAddress(java.lang.String portName, java.lang.String address) throws javax.xml.rpc.ServiceException {
        
if ("RouteServiceSoap".equals(portName)) {
            setRouteServiceSoapEndpointAddress(address);
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

