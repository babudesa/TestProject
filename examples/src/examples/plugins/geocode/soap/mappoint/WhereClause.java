/**
 * WhereClause.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class WhereClause  implements java.io.Serializable {
    private ArrayOfEntityPropertyValue searchProperties;
    private SearchOperatorFlag searchOperator;

    public WhereClause() {
    }

    public WhereClause(
           ArrayOfEntityPropertyValue searchProperties,
           SearchOperatorFlag searchOperator) {
           this.searchProperties = searchProperties;
           this.searchOperator = searchOperator;
    }


    /**
     * Gets the searchProperties value for this WhereClause.
     * 
     * @return searchProperties
     */
    public ArrayOfEntityPropertyValue getSearchProperties() {
        return searchProperties;
    }


    /**
     * Sets the searchProperties value for this WhereClause.
     * 
     * @param searchProperties
     */
    public void setSearchProperties(ArrayOfEntityPropertyValue searchProperties) {
        this.searchProperties = searchProperties;
    }


    /**
     * Gets the searchOperator value for this WhereClause.
     * 
     * @return searchOperator
     */
    public SearchOperatorFlag getSearchOperator() {
        return searchOperator;
    }


    /**
     * Sets the searchOperator value for this WhereClause.
     * 
     * @param searchOperator
     */
    public void setSearchOperator(SearchOperatorFlag searchOperator) {
        this.searchOperator = searchOperator;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof WhereClause)) return false;
        WhereClause other = (WhereClause) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.searchProperties==null && other.getSearchProperties()==null) || 
             (this.searchProperties!=null &&
              this.searchProperties.equals(other.getSearchProperties()))) &&
            ((this.searchOperator==null && other.getSearchOperator()==null) || 
             (this.searchOperator!=null &&
              this.searchOperator.equals(other.getSearchOperator())));
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
        if (getSearchProperties() != null) {
            _hashCode += getSearchProperties().hashCode();
        }
        if (getSearchOperator() != null) {
            _hashCode += getSearchOperator().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(WhereClause.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "WhereClause"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("searchProperties");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "SearchProperties"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfEntityPropertyValue"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("searchOperator");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "SearchOperator"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "SearchOperatorFlag"));
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

