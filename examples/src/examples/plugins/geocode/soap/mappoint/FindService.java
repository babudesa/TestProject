/**
 * FindService.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public interface FindService extends javax.xml.rpc.Service {

/**
 * The Find service allows you to locate addresses, places, latitude/longitude
 * coordinates, and points of interest (from either MapPoint Web Service
 * data or your data that we host for your use).
 */
    public java.lang.String getFindServiceSoapAddress();

    public FindServiceSoap getFindServiceSoap() throws javax.xml.rpc.ServiceException;

    public FindServiceSoap getFindServiceSoap(java.net.URL portAddress) throws javax.xml.rpc.ServiceException;
}

