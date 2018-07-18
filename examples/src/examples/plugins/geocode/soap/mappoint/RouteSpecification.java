/**
 * RouteSpecification.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class RouteSpecification  implements java.io.Serializable {
    private ArrayOfSegmentSpecification segments;
    private java.lang.String[] resultMask;
    private java.lang.String dataSourceName;
    private DriverProfile driverProfile;

    public RouteSpecification() {
    }

    public RouteSpecification(
           ArrayOfSegmentSpecification segments,
           java.lang.String[] resultMask,
           java.lang.String dataSourceName,
           DriverProfile driverProfile) {
           this.segments = segments;
           this.resultMask = resultMask;
           this.dataSourceName = dataSourceName;
           this.driverProfile = driverProfile;
    }


    /**
     * Gets the segments value for this RouteSpecification.
     * 
     * @return segments
     */
    public ArrayOfSegmentSpecification getSegments() {
        return segments;
    }


    /**
     * Sets the segments value for this RouteSpecification.
     * 
     * @param segments
     */
    public void setSegments(ArrayOfSegmentSpecification segments) {
        this.segments = segments;
    }


    /**
     * Gets the resultMask value for this RouteSpecification.
     * 
     * @return resultMask
     */
    public java.lang.String[] getResultMask() {
        return resultMask;
    }


    /**
     * Sets the resultMask value for this RouteSpecification.
     * 
     * @param resultMask
     */
    public void setResultMask(java.lang.String[] resultMask) {
        this.resultMask = resultMask;
    }


    /**
     * Gets the dataSourceName value for this RouteSpecification.
     * 
     * @return dataSourceName
     */
    public java.lang.String getDataSourceName() {
        return dataSourceName;
    }


    /**
     * Sets the dataSourceName value for this RouteSpecification.
     * 
     * @param dataSourceName
     */
    public void setDataSourceName(java.lang.String dataSourceName) {
        this.dataSourceName = dataSourceName;
    }


    /**
     * Gets the driverProfile value for this RouteSpecification.
     * 
     * @return driverProfile
     */
    public DriverProfile getDriverProfile() {
        return driverProfile;
    }


    /**
     * Sets the driverProfile value for this RouteSpecification.
     * 
     * @param driverProfile
     */
    public void setDriverProfile(DriverProfile driverProfile) {
        this.driverProfile = driverProfile;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof RouteSpecification)) return false;
        RouteSpecification other = (RouteSpecification) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.segments==null && other.getSegments()==null) || 
             (this.segments!=null &&
              this.segments.equals(other.getSegments()))) &&
            ((this.resultMask==null && other.getResultMask()==null) || 
             (this.resultMask!=null &&
              java.util.Arrays.equals(this.resultMask, other.getResultMask()))) &&
            ((this.dataSourceName==null && other.getDataSourceName()==null) || 
             (this.dataSourceName!=null &&
              this.dataSourceName.equals(other.getDataSourceName()))) &&
            ((this.driverProfile==null && other.getDriverProfile()==null) || 
             (this.driverProfile!=null &&
              this.driverProfile.equals(other.getDriverProfile())));
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
        if (getSegments() != null) {
            _hashCode += getSegments().hashCode();
        }
        if (getResultMask() != null) {
            for (int i=0;
                 i<java.lang.reflect.Array.getLength(getResultMask());
                 i++) {
                java.lang.Object obj = java.lang.reflect.Array.get(getResultMask(), i);
                if (obj != null &&
                    !obj.getClass().isArray()) {
                    _hashCode += obj.hashCode();
                }
            }
        }
        if (getDataSourceName() != null) {
            _hashCode += getDataSourceName().hashCode();
        }
        if (getDriverProfile() != null) {
            _hashCode += getDriverProfile().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(RouteSpecification.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "RouteSpecification"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("segments");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Segments"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfSegmentSpecification"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("resultMask");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ResultMask"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "RouteResultMask"));
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
        elemField.setFieldName("driverProfile");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "DriverProfile"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "DriverProfile"));
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

