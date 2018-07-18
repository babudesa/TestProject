/**
 * FindServiceSoap.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public interface FindServiceSoap extends java.rmi.Remote {

    /**
     * Finds places based on the find options.
     */
    public FindResults find(FindSpecification specification) throws java.rmi.RemoteException;

    /**
     * Finds a list of addresses that match the input address.
     */
    public FindResults findAddress(FindAddressSpecification specification) throws java.rmi.RemoteException;

    /**
     * Parses Address.FormattedAddress into its component Address
     * pieces.
     */
    public Address parseAddress(java.lang.String inputAddress, java.lang.String countryRegion) throws java.rmi.RemoteException;

    /**
     * Searches around a LatLong for nearest addresses and entities.
     */
    public ArrayOfLocation getLocationInfo(LatLong location, java.lang.String dataSourceName, GetInfoOptions options) throws java.rmi.RemoteException;

    /**
     * Find a list of POI, within a circle around a lat/long.
     */
    public FindResults findNearby(FindNearbySpecification specification) throws java.rmi.RemoteException;

    /**
     * Finds points of interest based on pre-defined or custom properties.
     * This method is independent of the location information such as distance
     * and latitude/logitude.
     */
    public FindResults findByProperty(FindByPropertySpecification specification) throws java.rmi.RemoteException;

    /**
     * Finds points of interest for a given entity ID.
     */
    public FindResults findByID(FindByIDSpecification specification) throws java.rmi.RemoteException;

    /**
     * Finds points of interest locations within a specified distance
     * from a route.
     */
    public FindResults findNearRoute(FindNearRouteSpecification specification) throws java.rmi.RemoteException;

    /**
     * Finds polygons containing a point or intersecting a rectangle.
     */
    public FindResults findPolygon(FindPolygonSpecification specification) throws java.rmi.RemoteException;
}

