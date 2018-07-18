/**
 * Route.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class Route  implements java.io.Serializable {
    private RouteSpecification specification;
    private RouteItinerary itinerary;
    private CalculatedRouteRepresentation calculatedRepresentation;

    public Route() {
    }

    public Route(
           RouteSpecification specification,
           RouteItinerary itinerary,
           CalculatedRouteRepresentation calculatedRepresentation) {
           this.specification = specification;
           this.itinerary = itinerary;
           this.calculatedRepresentation = calculatedRepresentation;
    }


    /**
     * Gets the specification value for this Route.
     * 
     * @return specification
     */
    public RouteSpecification getSpecification() {
        return specification;
    }


    /**
     * Sets the specification value for this Route.
     * 
     * @param specification
     */
    public void setSpecification(RouteSpecification specification) {
        this.specification = specification;
    }


    /**
     * Gets the itinerary value for this Route.
     * 
     * @return itinerary
     */
    public RouteItinerary getItinerary() {
        return itinerary;
    }


    /**
     * Sets the itinerary value for this Route.
     * 
     * @param itinerary
     */
    public void setItinerary(RouteItinerary itinerary) {
        this.itinerary = itinerary;
    }


    /**
     * Gets the calculatedRepresentation value for this Route.
     * 
     * @return calculatedRepresentation
     */
    public CalculatedRouteRepresentation getCalculatedRepresentation() {
        return calculatedRepresentation;
    }


    /**
     * Sets the calculatedRepresentation value for this Route.
     * 
     * @param calculatedRepresentation
     */
    public void setCalculatedRepresentation(CalculatedRouteRepresentation calculatedRepresentation) {
        this.calculatedRepresentation = calculatedRepresentation;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof Route)) return false;
        Route other = (Route) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.specification==null && other.getSpecification()==null) || 
             (this.specification!=null &&
              this.specification.equals(other.getSpecification()))) &&
            ((this.itinerary==null && other.getItinerary()==null) || 
             (this.itinerary!=null &&
              this.itinerary.equals(other.getItinerary()))) &&
            ((this.calculatedRepresentation==null && other.getCalculatedRepresentation()==null) || 
             (this.calculatedRepresentation!=null &&
              this.calculatedRepresentation.equals(other.getCalculatedRepresentation())));
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
        if (getSpecification() != null) {
            _hashCode += getSpecification().hashCode();
        }
        if (getItinerary() != null) {
            _hashCode += getItinerary().hashCode();
        }
        if (getCalculatedRepresentation() != null) {
            _hashCode += getCalculatedRepresentation().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(Route.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Route"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("specification");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Specification"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "RouteSpecification"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("itinerary");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Itinerary"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "RouteItinerary"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("calculatedRepresentation");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "CalculatedRepresentation"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "CalculatedRouteRepresentation"));
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

