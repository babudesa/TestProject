/**
 * CommonService.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public interface CommonService extends javax.xml.rpc.Service {

/**
 * The common service contains classes, methods, and properties that
 * are common to the find, route, and render services.  The common service
 * also provides basic utility functions that can be used in the Microsoft
 * MapPoint Web Service applications.</p><p class="intro">Read the <a
 * href="default.htm">formal description</a> of the MapPoint Web Service
 * for more information.
 */
    public java.lang.String getCommonServiceSoapAddress();

    public CommonServiceSoap getCommonServiceSoap() throws javax.xml.rpc.ServiceException;

    public CommonServiceSoap getCommonServiceSoap(java.net.URL portAddress) throws javax.xml.rpc.ServiceException;
}

