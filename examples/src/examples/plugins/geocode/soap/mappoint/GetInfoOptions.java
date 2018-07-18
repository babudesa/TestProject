/**
 * GetInfoOptions.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class GetInfoOptions  implements java.io.Serializable {
    private java.lang.Boolean includeAddresses;
    private java.lang.Boolean includeAllEntityTypes;
    private ArrayOfString entityTypesToReturn;

    public GetInfoOptions() {
    }

    public GetInfoOptions(
           java.lang.Boolean includeAddresses,
           java.lang.Boolean includeAllEntityTypes,
           ArrayOfString entityTypesToReturn) {
           this.includeAddresses = includeAddresses;
           this.includeAllEntityTypes = includeAllEntityTypes;
           this.entityTypesToReturn = entityTypesToReturn;
    }


    /**
     * Gets the includeAddresses value for this GetInfoOptions.
     * 
     * @return includeAddresses
     */
    public java.lang.Boolean getIncludeAddresses() {
        return includeAddresses;
    }


    /**
     * Sets the includeAddresses value for this GetInfoOptions.
     * 
     * @param includeAddresses
     */
    public void setIncludeAddresses(java.lang.Boolean includeAddresses) {
        this.includeAddresses = includeAddresses;
    }


    /**
     * Gets the includeAllEntityTypes value for this GetInfoOptions.
     * 
     * @return includeAllEntityTypes
     */
    public java.lang.Boolean getIncludeAllEntityTypes() {
        return includeAllEntityTypes;
    }


    /**
     * Sets the includeAllEntityTypes value for this GetInfoOptions.
     * 
     * @param includeAllEntityTypes
     */
    public void setIncludeAllEntityTypes(java.lang.Boolean includeAllEntityTypes) {
        this.includeAllEntityTypes = includeAllEntityTypes;
    }


    /**
     * Gets the entityTypesToReturn value for this GetInfoOptions.
     * 
     * @return entityTypesToReturn
     */
    public ArrayOfString getEntityTypesToReturn() {
        return entityTypesToReturn;
    }


    /**
     * Sets the entityTypesToReturn value for this GetInfoOptions.
     * 
     * @param entityTypesToReturn
     */
    public void setEntityTypesToReturn(ArrayOfString entityTypesToReturn) {
        this.entityTypesToReturn = entityTypesToReturn;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof GetInfoOptions)) return false;
        GetInfoOptions other = (GetInfoOptions) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.includeAddresses==null && other.getIncludeAddresses()==null) || 
             (this.includeAddresses!=null &&
              this.includeAddresses.equals(other.getIncludeAddresses()))) &&
            ((this.includeAllEntityTypes==null && other.getIncludeAllEntityTypes()==null) || 
             (this.includeAllEntityTypes!=null &&
              this.includeAllEntityTypes.equals(other.getIncludeAllEntityTypes()))) &&
            ((this.entityTypesToReturn==null && other.getEntityTypesToReturn()==null) || 
             (this.entityTypesToReturn!=null &&
              this.entityTypesToReturn.equals(other.getEntityTypesToReturn())));
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
        if (getIncludeAddresses() != null) {
            _hashCode += getIncludeAddresses().hashCode();
        }
        if (getIncludeAllEntityTypes() != null) {
            _hashCode += getIncludeAllEntityTypes().hashCode();
        }
        if (getEntityTypesToReturn() != null) {
            _hashCode += getEntityTypesToReturn().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(GetInfoOptions.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "GetInfoOptions"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("includeAddresses");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "IncludeAddresses"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "boolean"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("includeAllEntityTypes");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "IncludeAllEntityTypes"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "boolean"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("entityTypesToReturn");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "EntityTypesToReturn"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfString"));
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

