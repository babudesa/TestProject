/**
 * CommonServiceSoap.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public interface CommonServiceSoap extends java.rmi.Remote {

    /**
     * Get the MapPoint Web Service version.
     */
    public ArrayOfVersionInfo getVersionInfo() throws java.rmi.RemoteException;

    /**
     * Retrieve information about countries or national regions.
     */
    public ArrayOfCountryRegionInfo getCountryRegionInfo(ArrayOfInt entityIDs) throws java.rmi.RemoteException;

    /**
     * Retrieve the list types and their properties in a DataSource.
     */
    public ArrayOfEntityType getEntityTypes(java.lang.String dataSourceName) throws java.rmi.RemoteException;

    /**
     * Get a general description of data sources.
     */
    public ArrayOfDataSource getDataSourceInfo(ArrayOfString dataSourceNames) throws java.rmi.RemoteException;

    /**
     * Calculate pair-wise distances
     */
    public ArrayOfDouble getGreatCircleDistances(ArrayOfLatLong latLongs) throws java.rmi.RemoteException;
}

