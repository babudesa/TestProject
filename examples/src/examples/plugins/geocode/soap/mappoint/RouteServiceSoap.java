/**
 * RouteServiceSoap.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public interface RouteServiceSoap extends java.rmi.Remote {
    public Route calculateSimpleRoute(ArrayOfLatLong latLongs, java.lang.String dataSourceName, SegmentPreference preference) throws java.rmi.RemoteException;
    public Route calculateRoute(RouteSpecification specification) throws java.rmi.RemoteException;
}

