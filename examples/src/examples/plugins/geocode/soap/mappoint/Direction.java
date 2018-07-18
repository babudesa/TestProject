/**
 * Direction.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class Direction  implements java.io.Serializable {
    private LatLong latLong;
    private DirectionType directionType;
    private DirectionAction action;
    private float bearingOutOfTurn;
    private float bearingIntoTurn;
    private long duration;
    private double distance;
    private java.lang.String towards;
    private java.lang.String instruction;
    private java.lang.String formattedInstruction;
    private int ID;
    private MapViewRepresentations view;

    public Direction() {
    }

    public Direction(
           LatLong latLong,
           DirectionType directionType,
           DirectionAction action,
           float bearingOutOfTurn,
           float bearingIntoTurn,
           long duration,
           double distance,
           java.lang.String towards,
           java.lang.String instruction,
           java.lang.String formattedInstruction,
           int ID,
           MapViewRepresentations view) {
           this.latLong = latLong;
           this.directionType = directionType;
           this.action = action;
           this.bearingOutOfTurn = bearingOutOfTurn;
           this.bearingIntoTurn = bearingIntoTurn;
           this.duration = duration;
           this.distance = distance;
           this.towards = towards;
           this.instruction = instruction;
           this.formattedInstruction = formattedInstruction;
           this.ID = ID;
           this.view = view;
    }


    /**
     * Gets the latLong value for this Direction.
     * 
     * @return latLong
     */
    public LatLong getLatLong() {
        return latLong;
    }


    /**
     * Sets the latLong value for this Direction.
     * 
     * @param latLong
     */
    public void setLatLong(LatLong latLong) {
        this.latLong = latLong;
    }


    /**
     * Gets the directionType value for this Direction.
     * 
     * @return directionType
     */
    public DirectionType getDirectionType() {
        return directionType;
    }


    /**
     * Sets the directionType value for this Direction.
     * 
     * @param directionType
     */
    public void setDirectionType(DirectionType directionType) {
        this.directionType = directionType;
    }


    /**
     * Gets the action value for this Direction.
     * 
     * @return action
     */
    public DirectionAction getAction() {
        return action;
    }


    /**
     * Sets the action value for this Direction.
     * 
     * @param action
     */
    public void setAction(DirectionAction action) {
        this.action = action;
    }


    /**
     * Gets the bearingOutOfTurn value for this Direction.
     * 
     * @return bearingOutOfTurn
     */
    public float getBearingOutOfTurn() {
        return bearingOutOfTurn;
    }


    /**
     * Sets the bearingOutOfTurn value for this Direction.
     * 
     * @param bearingOutOfTurn
     */
    public void setBearingOutOfTurn(float bearingOutOfTurn) {
        this.bearingOutOfTurn = bearingOutOfTurn;
    }


    /**
     * Gets the bearingIntoTurn value for this Direction.
     * 
     * @return bearingIntoTurn
     */
    public float getBearingIntoTurn() {
        return bearingIntoTurn;
    }


    /**
     * Sets the bearingIntoTurn value for this Direction.
     * 
     * @param bearingIntoTurn
     */
    public void setBearingIntoTurn(float bearingIntoTurn) {
        this.bearingIntoTurn = bearingIntoTurn;
    }


    /**
     * Gets the duration value for this Direction.
     * 
     * @return duration
     */
    public long getDuration() {
        return duration;
    }


    /**
     * Sets the duration value for this Direction.
     * 
     * @param duration
     */
    public void setDuration(long duration) {
        this.duration = duration;
    }


    /**
     * Gets the distance value for this Direction.
     * 
     * @return distance
     */
    public double getDistance() {
        return distance;
    }


    /**
     * Sets the distance value for this Direction.
     * 
     * @param distance
     */
    public void setDistance(double distance) {
        this.distance = distance;
    }


    /**
     * Gets the towards value for this Direction.
     * 
     * @return towards
     */
    public java.lang.String getTowards() {
        return towards;
    }


    /**
     * Sets the towards value for this Direction.
     * 
     * @param towards
     */
    public void setTowards(java.lang.String towards) {
        this.towards = towards;
    }


    /**
     * Gets the instruction value for this Direction.
     * 
     * @return instruction
     */
    public java.lang.String getInstruction() {
        return instruction;
    }


    /**
     * Sets the instruction value for this Direction.
     * 
     * @param instruction
     */
    public void setInstruction(java.lang.String instruction) {
        this.instruction = instruction;
    }


    /**
     * Gets the formattedInstruction value for this Direction.
     * 
     * @return formattedInstruction
     */
    public java.lang.String getFormattedInstruction() {
        return formattedInstruction;
    }


    /**
     * Sets the formattedInstruction value for this Direction.
     * 
     * @param formattedInstruction
     */
    public void setFormattedInstruction(java.lang.String formattedInstruction) {
        this.formattedInstruction = formattedInstruction;
    }


    /**
     * Gets the ID value for this Direction.
     * 
     * @return ID
     */
    public int getID() {
        return ID;
    }


    /**
     * Sets the ID value for this Direction.
     * 
     * @param ID
     */
    public void setID(int ID) {
        this.ID = ID;
    }


    /**
     * Gets the view value for this Direction.
     * 
     * @return view
     */
    public MapViewRepresentations getView() {
        return view;
    }


    /**
     * Sets the view value for this Direction.
     * 
     * @param view
     */
    public void setView(MapViewRepresentations view) {
        this.view = view;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof Direction)) return false;
        Direction other = (Direction) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.latLong==null && other.getLatLong()==null) || 
             (this.latLong!=null &&
              this.latLong.equals(other.getLatLong()))) &&
            ((this.directionType==null && other.getDirectionType()==null) || 
             (this.directionType!=null &&
              this.directionType.equals(other.getDirectionType()))) &&
            ((this.action==null && other.getAction()==null) || 
             (this.action!=null &&
              this.action.equals(other.getAction()))) &&
            this.bearingOutOfTurn == other.getBearingOutOfTurn() &&
            this.bearingIntoTurn == other.getBearingIntoTurn() &&
            this.duration == other.getDuration() &&
            this.distance == other.getDistance() &&
            ((this.towards==null && other.getTowards()==null) || 
             (this.towards!=null &&
              this.towards.equals(other.getTowards()))) &&
            ((this.instruction==null && other.getInstruction()==null) || 
             (this.instruction!=null &&
              this.instruction.equals(other.getInstruction()))) &&
            ((this.formattedInstruction==null && other.getFormattedInstruction()==null) || 
             (this.formattedInstruction!=null &&
              this.formattedInstruction.equals(other.getFormattedInstruction()))) &&
            this.ID == other.getID() &&
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
        if (getLatLong() != null) {
            _hashCode += getLatLong().hashCode();
        }
        if (getDirectionType() != null) {
            _hashCode += getDirectionType().hashCode();
        }
        if (getAction() != null) {
            _hashCode += getAction().hashCode();
        }
        _hashCode += new Float(getBearingOutOfTurn()).hashCode();
        _hashCode += new Float(getBearingIntoTurn()).hashCode();
        _hashCode += new Long(getDuration()).hashCode();
        _hashCode += new Double(getDistance()).hashCode();
        if (getTowards() != null) {
            _hashCode += getTowards().hashCode();
        }
        if (getInstruction() != null) {
            _hashCode += getInstruction().hashCode();
        }
        if (getFormattedInstruction() != null) {
            _hashCode += getFormattedInstruction().hashCode();
        }
        _hashCode += getID();
        if (getView() != null) {
            _hashCode += getView().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(Direction.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Direction"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("latLong");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "LatLong"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "LatLong"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("directionType");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "DirectionType"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "DirectionType"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("action");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Action"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "DirectionAction"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("bearingOutOfTurn");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "BearingOutOfTurn"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "float"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("bearingIntoTurn");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "BearingIntoTurn"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "float"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("duration");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Duration"));
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
        elemField.setFieldName("towards");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Towards"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("instruction");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Instruction"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("formattedInstruction");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "FormattedInstruction"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("ID");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ID"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
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

