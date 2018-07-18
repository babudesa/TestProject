/**
 * PixelRectangle.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class PixelRectangle  implements java.io.Serializable {
    private int bottom;
    private int left;
    private int right;
    private int top;

    public PixelRectangle() {
    }

    public PixelRectangle(
           int bottom,
           int left,
           int right,
           int top) {
           this.bottom = bottom;
           this.left = left;
           this.right = right;
           this.top = top;
    }


    /**
     * Gets the bottom value for this PixelRectangle.
     * 
     * @return bottom
     */
    public int getBottom() {
        return bottom;
    }


    /**
     * Sets the bottom value for this PixelRectangle.
     * 
     * @param bottom
     */
    public void setBottom(int bottom) {
        this.bottom = bottom;
    }


    /**
     * Gets the left value for this PixelRectangle.
     * 
     * @return left
     */
    public int getLeft() {
        return left;
    }


    /**
     * Sets the left value for this PixelRectangle.
     * 
     * @param left
     */
    public void setLeft(int left) {
        this.left = left;
    }


    /**
     * Gets the right value for this PixelRectangle.
     * 
     * @return right
     */
    public int getRight() {
        return right;
    }


    /**
     * Sets the right value for this PixelRectangle.
     * 
     * @param right
     */
    public void setRight(int right) {
        this.right = right;
    }


    /**
     * Gets the top value for this PixelRectangle.
     * 
     * @return top
     */
    public int getTop() {
        return top;
    }


    /**
     * Sets the top value for this PixelRectangle.
     * 
     * @param top
     */
    public void setTop(int top) {
        this.top = top;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof PixelRectangle)) return false;
        PixelRectangle other = (PixelRectangle) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            this.bottom == other.getBottom() &&
            this.left == other.getLeft() &&
            this.right == other.getRight() &&
            this.top == other.getTop();
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
        _hashCode += getBottom();
        _hashCode += getLeft();
        _hashCode += getRight();
        _hashCode += getTop();
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(PixelRectangle.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "PixelRectangle"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("bottom");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Bottom"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("left");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Left"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("right");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Right"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("top");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Top"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
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

