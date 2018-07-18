/**
 * ArrayOfSortProperty.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class ArrayOfSortProperty  implements java.io.Serializable {
    private SortProperty[] sortProperty;

    public ArrayOfSortProperty() {
    }

    public ArrayOfSortProperty(
           SortProperty[] sortProperty) {
           this.sortProperty = sortProperty;
    }


    /**
     * Gets the sortProperty value for this ArrayOfSortProperty.
     * 
     * @return sortProperty
     */
    public SortProperty[] getSortProperty() {
        return sortProperty;
    }


    /**
     * Sets the sortProperty value for this ArrayOfSortProperty.
     * 
     * @param sortProperty
     */
    public void setSortProperty(SortProperty[] sortProperty) {
        this.sortProperty = sortProperty;
    }

    public SortProperty getSortProperty(int i) {
        return this.sortProperty[i];
    }

    public void setSortProperty(int i, SortProperty _value) {
        this.sortProperty[i] = _value;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof ArrayOfSortProperty)) return false;
        ArrayOfSortProperty other = (ArrayOfSortProperty) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.sortProperty==null && other.getSortProperty()==null) || 
             (this.sortProperty!=null &&
              java.util.Arrays.equals(this.sortProperty, other.getSortProperty())));
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
        if (getSortProperty() != null) {
            for (int i=0;
                 i<java.lang.reflect.Array.getLength(getSortProperty());
                 i++) {
                java.lang.Object obj = java.lang.reflect.Array.get(getSortProperty(), i);
                if (obj != null &&
                    !obj.getClass().isArray()) {
                    _hashCode += obj.hashCode();
                }
            }
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(ArrayOfSortProperty.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfSortProperty"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("sortProperty");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "SortProperty"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "SortProperty"));
        elemField.setMinOccurs(0);
        elemField.setNillable(true);
        elemField.setMaxOccursUnbounded(true);
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

