/**
 * RouteService.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public interface RouteService extends javax.xml.rpc.Service {

/**
 * The route service allows you to generate routes, driving directions,
 * and calculated route representations (used to render a highlighted
 * route on the map) based on locations or waypoints, set segment and
 * route preferences, and generate map views of segments and directions.
 */
    public java.lang.String getRouteServiceSoapAddress();

    public RouteServiceSoap getRouteServiceSoap() throws javax.xml.rpc.ServiceException;

    public RouteServiceSoap getRouteServiceSoap(java.net.URL portAddress) throws javax.xml.rpc.ServiceException;
}

