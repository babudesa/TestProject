/**
 * RenderServiceSoap.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public interface RenderServiceSoap extends java.rmi.Remote {

    /**
     * Renders map images of the given MapViews
     */
    public ArrayOfMapImage getMap(MapSpecification specification) throws java.rmi.RemoteException;

    /**
     * Convert individual LatLongs into PixelCoords as they would
     * appear in the given MapView
     */
    public ArrayOfPixelCoord convertToPoint(ArrayOfLatLong latLong, MapView view, int width, int height) throws java.rmi.RemoteException;

    /**
     * Convert individual PixelCoords into LatLongs as they would
     * appear in the given MapView
     */
    public ArrayOfLatLong convertToLatLong(ArrayOfPixelCoord pixels, MapView view, int width, int height) throws java.rmi.RemoteException;

    /**
     * Get a MapView that encompasses the given locations
     */
    public MapViewRepresentations getBestMapView(ArrayOfLocation locations, java.lang.String dataSourceName) throws java.rmi.RemoteException;

    /**
     * Renders LineDrive map images of the given Route
     */
    public ArrayOfLineDriveMapImage getLineDriveMap(LineDriveMapSpecification specification) throws java.rmi.RemoteException;
}

