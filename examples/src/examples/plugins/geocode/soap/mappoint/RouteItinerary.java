/**
 * RouteItinerary.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class RouteItinerary  implements java.io.Serializable {
    private ArrayOfSegment segments;
    private long tripTime;
    private long drivingTime;
    private double distance;
    private MapViewRepresentations view;

    public RouteItinerary() {
    }

    public RouteItinerary(
           ArrayOfSegment segments,
           long tripTime,
           long drivingTime,
           double distance,
           MapViewRepresentations view) {
           this.segments = segments;
           this.tripTime = tripTime;
           this.drivingTime = drivingTime;
           this.distance = distance;
           this.view = view;
    }


    /**
     * Gets the segments value for this RouteItinerary.
     * 
     * @return segments
     */
    public ArrayOfSegment getSegments() {
        return segments;
    }


    /**
     * Sets the segments value for this RouteItinerary.
     * 
     * @param segments
     */
    public void setSegments(ArrayOfSegment segments) {
        this.segments = segments;
    }


    /**
     * Gets the tripTime value for this RouteItinerary.
     * 
     * @return tripTime
     */
    public long getTripTime() {
        return tripTime;
    }


    /**
     * Sets the tripTime value for this RouteItinerary.
     * 
     * @param tripTime
     */
    public void setTripTime(long tripTime) {
        this.tripTime = tripTime;
    }


    /**
     * Gets the drivingTime value for this RouteItinerary.
     * 
     * @return drivingTime
     */
    public long getDrivingTime() {
        return drivingTime;
    }


    /**
     * Sets the drivingTime value for this RouteItinerary.
     * 
     * @param drivingTime
     */
    public void setDrivingTime(long drivingTime) {
        this.drivingTime = drivingTime;
    }


    /**
     * Gets the distance value for this RouteItinerary.
     * 
     * @return distance
     */
    public double getDistance() {
        return distance;
    }


    /**
     * Sets the distance value for this RouteItinerary.
     * 
     * @param distance
     */
    public void setDistance(double distance) {
        this.distance = distance;
    }


    /**
     * Gets the view value for this RouteItinerary.
     * 
     * @return view
     */
    public MapViewRepresentations getView() {
        return view;
    }


    /**
     * Sets the view value for this RouteItinerary.
     * 
     * @param view
     */
    public void setView(MapViewRepresentations view) {
        this.view = view;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof RouteItinerary)) return false;
        RouteItinerary other = (RouteItinerary) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.segments==null && other.getSegments()==null) || 
             (this.segments!=null &&
              this.segments.equals(other.getSegments()))) &&
            this.tripTime == other.getTripTime() &&
            this.drivingTime == other.getDrivingTime() &&
            this.distance == other.getDistance() &&
            ((this.view==null && other.getView()==null) || 
             (this.view!=null &&
              this.view.equals(other.getView())));
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
        if (getSegments() != null) {
            _hashCode += getSegments().hashCode();
        }
        _hashCode += new Long(getTripTime()).hashCode();
        _hashCode += new Long(getDrivingTime()).hashCode();
        _hashCode += new Double(getDistance()).hashCode();
        if (getView() != null) {
            _hashCode += getView().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(RouteItinerary.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "RouteItinerary"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("segments");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Segments"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfSegment"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("tripTime");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "TripTime"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "long"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("drivingTime");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "DrivingTime"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "long"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("distance");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Distance"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "double"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("view");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "View"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "MapViewRepresentations"));
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

