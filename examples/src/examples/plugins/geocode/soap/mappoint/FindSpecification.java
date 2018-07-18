/**
 * FindSpecification.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class FindSpecification  implements java.io.Serializable {
    private java.lang.String dataSourceName;
    private java.lang.String inputPlace;
    private ArrayOfString entityTypeNames;
    private FindOptions options;

    public FindSpecification() {
    }

    public FindSpecification(
           java.lang.String dataSourceName,
           java.lang.String inputPlace,
           ArrayOfString entityTypeNames,
           FindOptions options) {
           this.dataSourceName = dataSourceName;
           this.inputPlace = inputPlace;
           this.entityTypeNames = entityTypeNames;
           this.options = options;
    }


    /**
     * Gets the dataSourceName value for this FindSpecification.
     * 
     * @return dataSourceName
     */
    public java.lang.String getDataSourceName() {
        return dataSourceName;
    }


    /**
     * Sets the dataSourceName value for this FindSpecification.
     * 
     * @param dataSourceName
     */
    public void setDataSourceName(java.lang.String dataSourceName) {
        this.dataSourceName = dataSourceName;
    }


    /**
     * Gets the inputPlace value for this FindSpecification.
     * 
     * @return inputPlace
     */
    public java.lang.String getInputPlace() {
        return inputPlace;
    }


    /**
     * Sets the inputPlace value for this FindSpecification.
     * 
     * @param inputPlace
     */
    public void setInputPlace(java.lang.String inputPlace) {
        this.inputPlace = inputPlace;
    }


    /**
     * Gets the entityTypeNames value for this FindSpecification.
     * 
     * @return entityTypeNames
     */
    public ArrayOfString getEntityTypeNames() {
        return entityTypeNames;
    }


    /**
     * Sets the entityTypeNames value for this FindSpecification.
     * 
     * @param entityTypeNames
     */
    public void setEntityTypeNames(ArrayOfString entityTypeNames) {
        this.entityTypeNames = entityTypeNames;
    }


    /**
     * Gets the options value for this FindSpecification.
     * 
     * @return options
     */
    public FindOptions getOptions() {
        return options;
    }


    /**
     * Sets the options value for this FindSpecification.
     * 
     * @param options
     */
    public void setOptions(FindOptions options) {
        this.options = options;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof FindSpecification)) return false;
        FindSpecification other = (FindSpecification) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.dataSourceName==null && other.getDataSourceName()==null) || 
             (this.dataSourceName!=null &&
              this.dataSourceName.equals(other.getDataSourceName()))) &&
            ((this.inputPlace==null && other.getInputPlace()==null) || 
             (this.inputPlace!=null &&
              this.inputPlace.equals(other.getInputPlace()))) &&
            ((this.entityTypeNames==null && other.getEntityTypeNames()==null) || 
             (this.entityTypeNames!=null &&
              this.entityTypeNames.equals(other.getEntityTypeNames()))) &&
            ((this.options==null && other.getOptions()==null) || 
             (this.options!=null &&
              this.options.equals(other.getOptions())));
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
        if (getDataSourceName() != null) {
            _hashCode += getDataSourceName().hashCode();
        }
        if (getInputPlace() != null) {
            _hashCode += getInputPlace().hashCode();
        }
        if (getEntityTypeNames() != null) {
            _hashCode += getEntityTypeNames().hashCode();
        }
        if (getOptions() != null) {
            _hashCode += getOptions().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(FindSpecification.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "FindSpecification"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("dataSourceName");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "DataSourceName"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("inputPlace");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "InputPlace"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("entityTypeNames");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "EntityTypeNames"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfString"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("options");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Options"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "FindOptions"));
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

