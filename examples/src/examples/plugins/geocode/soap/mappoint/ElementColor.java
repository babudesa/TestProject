/**
 * ElementColor.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class ElementColor  implements java.io.Serializable {
    private org.apache.axis.types.UnsignedByte a;
    private org.apache.axis.types.UnsignedByte r;
    private org.apache.axis.types.UnsignedByte g;
    private org.apache.axis.types.UnsignedByte b;

    public ElementColor() {
    }

    public ElementColor(
           org.apache.axis.types.UnsignedByte a,
           org.apache.axis.types.UnsignedByte r,
           org.apache.axis.types.UnsignedByte g,
           org.apache.axis.types.UnsignedByte b) {
           this.a = a;
           this.r = r;
           this.g = g;
           this.b = b;
    }


    /**
     * Gets the a value for this ElementColor.
     * 
     * @return a
     */
    public org.apache.axis.types.UnsignedByte getA() {
        return a;
    }


    /**
     * Sets the a value for this ElementColor.
     * 
     * @param a
     */
    public void setA(org.apache.axis.types.UnsignedByte a) {
        this.a = a;
    }


    /**
     * Gets the r value for this ElementColor.
     * 
     * @return r
     */
    public org.apache.axis.types.UnsignedByte getR() {
        return r;
    }


    /**
     * Sets the r value for this ElementColor.
     * 
     * @param r
     */
    public void setR(org.apache.axis.types.UnsignedByte r) {
        this.r = r;
    }


    /**
     * Gets the g value for this ElementColor.
     * 
     * @return g
     */
    public org.apache.axis.types.UnsignedByte getG() {
        return g;
    }


    /**
     * Sets the g value for this ElementColor.
     * 
     * @param g
     */
    public void setG(org.apache.axis.types.UnsignedByte g) {
        this.g = g;
    }


    /**
     * Gets the b value for this ElementColor.
     * 
     * @return b
     */
    public org.apache.axis.types.UnsignedByte getB() {
        return b;
    }


    /**
     * Sets the b value for this ElementColor.
     * 
     * @param b
     */
    public void setB(org.apache.axis.types.UnsignedByte b) {
        this.b = b;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof ElementColor)) return false;
        ElementColor other = (ElementColor) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.a==null && other.getA()==null) || 
             (this.a!=null &&
              this.a.equals(other.getA()))) &&
            ((this.r==null && other.getR()==null) || 
             (this.r!=null &&
              this.r.equals(other.getR()))) &&
            ((this.g==null && other.getG()==null) || 
             (this.g!=null &&
              this.g.equals(other.getG()))) &&
            ((this.b==null && other.getB()==null) || 
             (this.b!=null &&
              this.b.equals(other.getB())));
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
        if (getA() != null) {
            _hashCode += getA().hashCode();
        }
        if (getR() != null) {
            _hashCode += getR().hashCode();
        }
        if (getG() != null) {
            _hashCode += getG().hashCode();
        }
        if (getB() != null) {
            _hashCode += getB().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(ElementColor.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ElementColor"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("a");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "A"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "unsignedByte"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("r");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "R"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "unsignedByte"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("g");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "G"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "unsignedByte"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("b");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "B"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "unsignedByte"));
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

