/**
 * CountryRegionContext.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class CountryRegionContext  implements java.io.Serializable {
    private java.lang.Integer entityID;
    private java.lang.String iso2;

    public CountryRegionContext() {
    }

    public CountryRegionContext(
           java.lang.Integer entityID,
           java.lang.String iso2) {
           this.entityID = entityID;
           this.iso2 = iso2;
    }


    /**
     * Gets the entityID value for this CountryRegionContext.
     * 
     * @return entityID
     */
    public java.lang.Integer getEntityID() {
        return entityID;
    }


    /**
     * Sets the entityID value for this CountryRegionContext.
     * 
     * @param entityID
     */
    public void setEntityID(java.lang.Integer entityID) {
        this.entityID = entityID;
    }


    /**
     * Gets the iso2 value for this CountryRegionContext.
     * 
     * @return iso2
     */
    public java.lang.String getIso2() {
        return iso2;
    }


    /**
     * Sets the iso2 value for this CountryRegionContext.
     * 
     * @param iso2
     */
    public void setIso2(java.lang.String iso2) {
        this.iso2 = iso2;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof CountryRegionContext)) return false;
        CountryRegionContext other = (CountryRegionContext) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.entityID==null && other.getEntityID()==null) || 
             (this.entityID!=null &&
              this.entityID.equals(other.getEntityID()))) &&
            ((this.iso2==null && other.getIso2()==null) || 
             (this.iso2!=null &&
              this.iso2.equals(other.getIso2())));
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
        if (getEntityID() != null) {
            _hashCode += getEntityID().hashCode();
        }
        if (getIso2() != null) {
            _hashCode += getIso2().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(CountryRegionContext.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "CountryRegionContext"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("entityID");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "EntityID"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("iso2");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Iso2"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
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

