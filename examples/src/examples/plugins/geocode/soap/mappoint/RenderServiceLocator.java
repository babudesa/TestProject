/**
 * RenderServiceLocator.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class RenderServiceLocator extends org.apache.axis.client.Service implements RenderService {

/**
 * The render service allows you to render maps of routes and found
 * locations, place pushpins (using the MapPoint Web Service stock set
 * of icons or your icons that we host for your use), set the map size
 * and map view, select points on a map, get location information about
 * points on a map, pan and zoom a rendered map, and create clickable
 * maps.
 */

    public RenderServiceLocator() {
    }


    public RenderServiceLocator(org.apache.axis.EngineConfiguration config) {
        super(config);
    }

    public RenderServiceLocator(java.lang.String wsdlLoc, javax.xml.namespace.QName sName) throws javax.xml.rpc.ServiceException {
        super(wsdlLoc, sName);
    }

    // Use to get a proxy class for RenderServiceSoap
    private java.lang.String RenderServiceSoap_address = null;

    public java.lang.String getRenderServiceSoapAddress() {
        return RenderServiceSoap_address;
    }

    // The WSDD service name defaults to the port name.
    private java.lang.String RenderServiceSoapWSDDServiceName = "RenderServiceSoap";

    public java.lang.String getRenderServiceSoapWSDDServiceName() {
        return RenderServiceSoapWSDDServiceName;
    }

    public void setRenderServiceSoapWSDDServiceName(java.lang.String name) {
        RenderServiceSoapWSDDServiceName = name;
    }

    public RenderServiceSoap getRenderServiceSoap() throws javax.xml.rpc.ServiceException {
       java.net.URL endpoint;
        try {
            endpoint = new java.net.URL(RenderServiceSoap_address);
        }
        catch (java.net.MalformedURLException e) {
            throw new javax.xml.rpc.ServiceException(e);
        }
        return getRenderServiceSoap(endpoint);
    }

    public RenderServiceSoap getRenderServiceSoap(java.net.URL portAddress) throws javax.xml.rpc.ServiceException {
        try {
            RenderServiceSoapStub _stub = new RenderServiceSoapStub(portAddress, this);
            _stub.setPortName(getRenderServiceSoapWSDDServiceName());
            return _stub;
        }
        catch (org.apache.axis.AxisFault e) {
            return null;
        }
    }

    public void setRenderServiceSoapEndpointAddress(java.lang.String address) {
        RenderServiceSoap_address = address;
    }

    /**
     * For the given interface, get the stub implementation.
     * If this service has no port for the given interface,
     * then ServiceException is thrown.
     */
    public java.rmi.Remote getPort(Class serviceEndpointInterface) throws javax.xml.rpc.ServiceException {
        try {
            if (RenderServiceSoap.class.isAssignableFrom(serviceEndpointInterface)) {
                RenderServiceSoapStub _stub = new RenderServiceSoapStub(new java.net.URL(RenderServiceSoap_address), this);
                _stub.setPortName(getRenderServiceSoapWSDDServiceName());
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
        if ("RenderServiceSoap".equals(inputPortName)) {
            return getRenderServiceSoap();
        }
        else  {
            java.rmi.Remote _stub = getPort(serviceEndpointInterface);
            ((org.apache.axis.client.Stub) _stub).setPortName(portName);
            return _stub;
        }
    }

    public javax.xml.namespace.QName getServiceName() {
        return new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "RenderService");
    }

    private java.util.HashSet ports = null;

    public java.util.Iterator getPorts() {
        if (ports == null) {
            ports = new java.util.HashSet();
            ports.add(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "RenderServiceSoap"));
        }
        return ports.iterator();
    }

    /**
    * Set the endpoint address for the specified port name.
    */
    public void setEndpointAddress(java.lang.String portName, java.lang.String address) throws javax.xml.rpc.ServiceException {
        
if ("RenderServiceSoap".equals(portName)) {
            setRenderServiceSoapEndpointAddress(address);
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

