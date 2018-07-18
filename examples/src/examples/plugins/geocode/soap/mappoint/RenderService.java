/**
 * RenderService.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public interface RenderService extends javax.xml.rpc.Service {

/**
 * The render service allows you to render maps of routes and found
 * locations, place pushpins (using the MapPoint Web Service stock set
 * of icons or your icons that we host for your use), set the map size
 * and map view, select points on a map, get location information about
 * points on a map, pan and zoom a rendered map, and create clickable
 * maps.
 */
    public java.lang.String getRenderServiceSoapAddress();

    public RenderServiceSoap getRenderServiceSoap() throws javax.xml.rpc.ServiceException;

    public RenderServiceSoap getRenderServiceSoap(java.net.URL portAddress) throws javax.xml.rpc.ServiceException;
}

