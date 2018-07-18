/**
 * ArrayOfFindResult.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class ArrayOfFindResult  implements java.io.Serializable {
    private FindResult[] findResult;

    public ArrayOfFindResult() {
    }

    public ArrayOfFindResult(
           FindResult[] findResult) {
           this.findResult = findResult;
    }


    /**
     * Gets the findResult value for this ArrayOfFindResult.
     * 
     * @return findResult
     */
    public FindResult[] getFindResult() {
        return findResult;
    }


    /**
     * Sets the findResult value for this ArrayOfFindResult.
     * 
     * @param findResult
     */
    public void setFindResult(FindResult[] findResult) {
        this.findResult = findResult;
    }

    public FindResult getFindResult(int i) {
        return this.findResult[i];
    }

    public void setFindResult(int i, FindResult _value) {
        this.findResult[i] = _value;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof ArrayOfFindResult)) return false;
        ArrayOfFindResult other = (ArrayOfFindResult) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.findResult==null && other.getFindResult()==null) || 
             (this.findResult!=null &&
              java.util.Arrays.equals(this.findResult, other.getFindResult())));
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
        if (getFindResult() != null) {
            for (int i=0;
                 i<java.lang.reflect.Array.getLength(getFindResult());
                 i++) {
                java.lang.Object obj = java.lang.reflect.Array.get(getFindResult(), i);
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
        new org.apache.axis.description.TypeDesc(ArrayOfFindResult.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfFindResult"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("findResult");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "FindResult"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "FindResult"));
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

