/**
 * UserInfoHeader.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class UserInfoHeader  implements java.io.Serializable {
    private CultureInfo culture;
    private DistanceUnit defaultDistanceUnit;
    private CountryRegionContext context;

    public UserInfoHeader() {
    }

    public UserInfoHeader(
           CultureInfo culture,
           DistanceUnit defaultDistanceUnit,
           CountryRegionContext context) {
           this.culture = culture;
           this.defaultDistanceUnit = defaultDistanceUnit;
           this.context = context;
    }


    /**
     * Gets the culture value for this UserInfoHeader.
     * 
     * @return culture
     */
    public CultureInfo getCulture() {
        return culture;
    }


    /**
     * Sets the culture value for this UserInfoHeader.
     * 
     * @param culture
     */
    public void setCulture(CultureInfo culture) {
        this.culture = culture;
    }


    /**
     * Gets the defaultDistanceUnit value for this UserInfoHeader.
     * 
     * @return defaultDistanceUnit
     */
    public DistanceUnit getDefaultDistanceUnit() {
        return defaultDistanceUnit;
    }


    /**
     * Sets the defaultDistanceUnit value for this UserInfoHeader.
     * 
     * @param defaultDistanceUnit
     */
    public void setDefaultDistanceUnit(DistanceUnit defaultDistanceUnit) {
        this.defaultDistanceUnit = defaultDistanceUnit;
    }


    /**
     * Gets the context value for this UserInfoHeader.
     * 
     * @return context
     */
    public CountryRegionContext getContext() {
        return context;
    }


    /**
     * Sets the context value for this UserInfoHeader.
     * 
     * @param context
     */
    public void setContext(CountryRegionContext context) {
        this.context = context;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof UserInfoHeader)) return false;
        UserInfoHeader other = (UserInfoHeader) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.culture==null && other.getCulture()==null) || 
             (this.culture!=null &&
              this.culture.equals(other.getCulture()))) &&
            ((this.defaultDistanceUnit==null && other.getDefaultDistanceUnit()==null) || 
             (this.defaultDistanceUnit!=null &&
              this.defaultDistanceUnit.equals(other.getDefaultDistanceUnit()))) &&
            ((this.context==null && other.getContext()==null) || 
             (this.context!=null &&
              this.context.equals(other.getContext())));
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
        if (getCulture() != null) {
            _hashCode += getCulture().hashCode();
        }
        if (getDefaultDistanceUnit() != null) {
            _hashCode += getDefaultDistanceUnit().hashCode();
        }
        if (getContext() != null) {
            _hashCode += getContext().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(UserInfoHeader.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "UserInfoHeader"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("culture");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Culture"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "CultureInfo"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("defaultDistanceUnit");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "DefaultDistanceUnit"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "DistanceUnit"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("context");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Context"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "CountryRegionContext"));
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

