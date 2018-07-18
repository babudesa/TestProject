/**
 * MapSpecification.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class MapSpecification  implements java.io.Serializable {
    private ArrayOfPolygon polygons;
    private java.lang.String dataSourceName;
    private ArrayOfInt highlightedEntityIDs;
    private ArrayOfString hideEntityTypes;
    private MapOptions options;
    private ArrayOfPushpin pushpins;
    private Route route;
    private ArrayOfMapView views;

    public MapSpecification() {
    }

    public MapSpecification(
           ArrayOfPolygon polygons,
           java.lang.String dataSourceName,
           ArrayOfInt highlightedEntityIDs,
           ArrayOfString hideEntityTypes,
           MapOptions options,
           ArrayOfPushpin pushpins,
           Route route,
           ArrayOfMapView views) {
           this.polygons = polygons;
           this.dataSourceName = dataSourceName;
           this.highlightedEntityIDs = highlightedEntityIDs;
           this.hideEntityTypes = hideEntityTypes;
           this.options = options;
           this.pushpins = pushpins;
           this.route = route;
           this.views = views;
    }


    /**
     * Gets the polygons value for this MapSpecification.
     * 
     * @return polygons
     */
    public ArrayOfPolygon getPolygons() {
        return polygons;
    }


    /**
     * Sets the polygons value for this MapSpecification.
     * 
     * @param polygons
     */
    public void setPolygons(ArrayOfPolygon polygons) {
        this.polygons = polygons;
    }


    /**
     * Gets the dataSourceName value for this MapSpecification.
     * 
     * @return dataSourceName
     */
    public java.lang.String getDataSourceName() {
        return dataSourceName;
    }


    /**
     * Sets the dataSourceName value for this MapSpecification.
     * 
     * @param dataSourceName
     */
    public void setDataSourceName(java.lang.String dataSourceName) {
        this.dataSourceName = dataSourceName;
    }


    /**
     * Gets the highlightedEntityIDs value for this MapSpecification.
     * 
     * @return highlightedEntityIDs
     */
    public ArrayOfInt getHighlightedEntityIDs() {
        return highlightedEntityIDs;
    }


    /**
     * Sets the highlightedEntityIDs value for this MapSpecification.
     * 
     * @param highlightedEntityIDs
     */
    public void setHighlightedEntityIDs(ArrayOfInt highlightedEntityIDs) {
        this.highlightedEntityIDs = highlightedEntityIDs;
    }


    /**
     * Gets the hideEntityTypes value for this MapSpecification.
     * 
     * @return hideEntityTypes
     */
    public ArrayOfString getHideEntityTypes() {
        return hideEntityTypes;
    }


    /**
     * Sets the hideEntityTypes value for this MapSpecification.
     * 
     * @param hideEntityTypes
     */
    public void setHideEntityTypes(ArrayOfString hideEntityTypes) {
        this.hideEntityTypes = hideEntityTypes;
    }


    /**
     * Gets the options value for this MapSpecification.
     * 
     * @return options
     */
    public MapOptions getOptions() {
        return options;
    }


    /**
     * Sets the options value for this MapSpecification.
     * 
     * @param options
     */
    public void setOptions(MapOptions options) {
        this.options = options;
    }


    /**
     * Gets the pushpins value for this MapSpecification.
     * 
     * @return pushpins
     */
    public ArrayOfPushpin getPushpins() {
        return pushpins;
    }


    /**
     * Sets the pushpins value for this MapSpecification.
     * 
     * @param pushpins
     */
    public void setPushpins(ArrayOfPushpin pushpins) {
        this.pushpins = pushpins;
    }


    /**
     * Gets the route value for this MapSpecification.
     * 
     * @return route
     */
    public Route getRoute() {
        return route;
    }


    /**
     * Sets the route value for this MapSpecification.
     * 
     * @param route
     */
    public void setRoute(Route route) {
        this.route = route;
    }


    /**
     * Gets the views value for this MapSpecification.
     * 
     * @return views
     */
    public ArrayOfMapView getViews() {
        return views;
    }


    /**
     * Sets the views value for this MapSpecification.
     * 
     * @param views
     */
    public void setViews(ArrayOfMapView views) {
        this.views = views;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof MapSpecification)) return false;
        MapSpecification other = (MapSpecification) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.polygons==null && other.getPolygons()==null) || 
             (this.polygons!=null &&
              this.polygons.equals(other.getPolygons()))) &&
            ((this.dataSourceName==null && other.getDataSourceName()==null) || 
             (this.dataSourceName!=null &&
              this.dataSourceName.equals(other.getDataSourceName()))) &&
            ((this.highlightedEntityIDs==null && other.getHighlightedEntityIDs()==null) || 
             (this.highlightedEntityIDs!=null &&
              this.highlightedEntityIDs.equals(other.getHighlightedEntityIDs()))) &&
            ((this.hideEntityTypes==null && other.getHideEntityTypes()==null) || 
             (this.hideEntityTypes!=null &&
              this.hideEntityTypes.equals(other.getHideEntityTypes()))) &&
            ((this.options==null && other.getOptions()==null) || 
             (this.options!=null &&
              this.options.equals(other.getOptions()))) &&
            ((this.pushpins==null && other.getPushpins()==null) || 
             (this.pushpins!=null &&
              this.pushpins.equals(other.getPushpins()))) &&
            ((this.route==null && other.getRoute()==null) || 
             (this.route!=null &&
              this.route.equals(other.getRoute()))) &&
            ((this.views==null && other.getViews()==null) || 
             (this.views!=null &&
              this.views.equals(other.getViews())));
        __equalsCalc = null;
        return _equals;
    }

    private boolean __hashCodeCalc = false;
    public synchronized int hashCode() {
        if (__hashCodeCalc) {
            return 0;
        }
        __hashCodeCalc = true;
        int _hashCode = 1;
        if (getPolygons() != null) {
            _hashCode += getPolygons().hashCode();
        }
        if (getDataSourceName() != null) {
            _hashCode += getDataSourceName().hashCode();
        }
        if (getHighlightedEntityIDs() != null) {
            _hashCode += getHighlightedEntityIDs().hashCode();
        }
        if (getHideEntityTypes() != null) {
            _hashCode += getHideEntityTypes().hashCode();
        }
        if (getOptions() != null) {
            _hashCode += getOptions().hashCode();
        }
        if (getPushpins() != null) {
            _hashCode += getPushpins().hashCode();
        }
        if (getRoute() != null) {
            _hashCode += getRoute().hashCode();
        }
        if (getViews() != null) {
            _hashCode += getViews().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(MapSpecification.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "MapSpecification"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("polygons");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Polygons"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfPolygon"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("dataSourceName");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "DataSourceName"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("highlightedEntityIDs");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "HighlightedEntityIDs"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfInt"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("hideEntityTypes");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "HideEntityTypes"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfString"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("options");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Options"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "MapOptions"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("pushpins");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Pushpins"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfPushpin"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("route");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Route"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Route"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("views");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Views"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfMapView"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
    }

    /**
     * Return type metadata object
     */
    public static org.apache.axis.description.TypeDesc getTypeDesc() {
        return typeDesc;
    }

    /**
     * Get Custom Serializer
     */
    public static org.apache.axis.encoding.Serializer getSerializer(
           java.lang.String mechType, 
           java.lang.Class _javaType,  
           javax.xml.namespace.QName _xmlType) {
        return 
          new  org.apache.axis.encoding.ser.BeanSerializer(
            _javaType, _xmlType, typeDesc);
    }

    /**
     * Get Custom Deserializer
     */
    public static org.apache.axis.encoding.Deserializer getDeserializer(
           java.lang.String mechType, 
           java.lang.Class _javaType,  
           javax.xml.namespace.QName _xmlType) {
        return 
          new  org.apache.axis.encoding.ser.BeanDeserializer(
            _javaType, _xmlType, typeDesc);
    }

}

