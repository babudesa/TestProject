/**
 * RouteServiceSoapStub.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class RouteServiceSoapStub extends org.apache.axis.client.Stub implements RouteServiceSoap {
    private java.util.Vector cachedSerClasses = new java.util.Vector();
    private java.util.Vector cachedSerQNames = new java.util.Vector();
    private java.util.Vector cachedSerFactories = new java.util.Vector();
    private java.util.Vector cachedDeserFactories = new java.util.Vector();

    static org.apache.axis.description.OperationDesc [] _operations;

    static {
        _operations = new org.apache.axis.description.OperationDesc[2];
        _initOperationDesc1();
    }

    private static void _initOperationDesc1(){
        org.apache.axis.description.OperationDesc oper;
        org.apache.axis.description.ParameterDesc param;
        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("CalculateSimpleRoute");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "latLongs"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfLatLong"), ArrayOfLatLong.class, false, false);
        oper.addParameter(param);
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "dataSourceName"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"), java.lang.String.class, false, false);
        oper.addParameter(param);
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "preference"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "SegmentPreference"), SegmentPreference.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Route"));
        oper.setReturnClass(Route.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "CalculateSimpleRouteResult"));
        oper.setStyle(org.apache.axis.constants.Style.WRAPPED);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[0] = oper;

        oper = new org.apache.axis.description.OperationDesc();
        oper.setName("CalculateRoute");
        param = new org.apache.axis.description.ParameterDesc(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "specification"), org.apache.axis.description.ParameterDesc.IN, new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "RouteSpecification"), RouteSpecification.class, false, false);
        oper.addParameter(param);
        oper.setReturnType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Route"));
        oper.setReturnClass(Route.class);
        oper.setReturnQName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "CalculateRouteResult"));
        oper.setStyle(org.apache.axis.constants.Style.WRAPPED);
        oper.setUse(org.apache.axis.constants.Use.LITERAL);
        _operations[1] = oper;

    }

    public RouteServiceSoapStub() throws org.apache.axis.AxisFault {
         this(null);
    }

    public RouteServiceSoapStub(java.net.URL endpointURL, javax.xml.rpc.Service service) throws org.apache.axis.AxisFault {
         this(service);
         super.cachedEndpoint = endpointURL;
    }

    public RouteServiceSoapStub(javax.xml.rpc.Service service) throws org.apache.axis.AxisFault {
        if (service == null) {
            super.service = new org.apache.axis.client.Service();
        } else {
            super.service = service;
        }
        ((org.apache.axis.client.Service)super.service).setTypeMappingVersion("1.2");
            java.lang.Class cls;
            javax.xml.namespace.QName qName;
            javax.xml.namespace.QName qName2;
            java.lang.Class beansf = org.apache.axis.encoding.ser.BeanSerializerFactory.class;
            java.lang.Class beandf = org.apache.axis.encoding.ser.BeanDeserializerFactory.class;
            java.lang.Class enumsf = org.apache.axis.encoding.ser.EnumSerializerFactory.class;
            java.lang.Class enumdf = org.apache.axis.encoding.ser.EnumDeserializerFactory.class;
            java.lang.Class arraysf = org.apache.axis.encoding.ser.ArraySerializerFactory.class;
            java.lang.Class arraydf = org.apache.axis.encoding.ser.ArrayDeserializerFactory.class;
            java.lang.Class simplesf = org.apache.axis.encoding.ser.SimpleSerializerFactory.class;
            java.lang.Class simpledf = org.apache.axis.encoding.ser.SimpleDeserializerFactory.class;
            java.lang.Class simplelistsf = org.apache.axis.encoding.ser.SimpleListSerializerFactory.class;
            java.lang.Class simplelistdf = org.apache.axis.encoding.ser.SimpleListDeserializerFactory.class;
        addBindings0();
        addBindings1();
    }

    private void addBindings0() {
            java.lang.Class cls;
            javax.xml.namespace.QName qName;
            javax.xml.namespace.QName qName2;
            java.lang.Class beansf = org.apache.axis.encoding.ser.BeanSerializerFactory.class;
            java.lang.Class beandf = org.apache.axis.encoding.ser.BeanDeserializerFactory.class;
            java.lang.Class enumsf = org.apache.axis.encoding.ser.EnumSerializerFactory.class;
            java.lang.Class enumdf = org.apache.axis.encoding.ser.EnumDeserializerFactory.class;
            java.lang.Class arraysf = org.apache.axis.encoding.ser.ArraySerializerFactory.class;
            java.lang.Class arraydf = org.apache.axis.encoding.ser.ArrayDeserializerFactory.class;
            java.lang.Class simplesf = org.apache.axis.encoding.ser.SimpleSerializerFactory.class;
            java.lang.Class simpledf = org.apache.axis.encoding.ser.SimpleDeserializerFactory.class;
            java.lang.Class simplelistsf = org.apache.axis.encoding.ser.SimpleListSerializerFactory.class;
            java.lang.Class simplelistdf = org.apache.axis.encoding.ser.SimpleListDeserializerFactory.class;
            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Address");
            cachedSerQNames.add(qName);
            cls = Address.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfAnyType");
            cachedSerQNames.add(qName);
            cls = ArrayOfAnyType.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfCountryRegionInfo");
            cachedSerQNames.add(qName);
            cls = ArrayOfCountryRegionInfo.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfDataSource");
            cachedSerQNames.add(qName);
            cls = ArrayOfDataSource.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfDirection");
            cachedSerQNames.add(qName);
            cls = ArrayOfDirection.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfDouble");
            cachedSerQNames.add(qName);
            cls = ArrayOfDouble.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfEntityProperty");
            cachedSerQNames.add(qName);
            cls = ArrayOfEntityProperty.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfEntityPropertyValue");
            cachedSerQNames.add(qName);
            cls = ArrayOfEntityPropertyValue.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfEntityType");
            cachedSerQNames.add(qName);
            cls = ArrayOfEntityType.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfFindResult");
            cachedSerQNames.add(qName);
            cls = ArrayOfFindResult.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfHotArea");
            cachedSerQNames.add(qName);
            cls = ArrayOfHotArea.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfInt");
            cachedSerQNames.add(qName);
            cls = ArrayOfInt.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfLatLong");
            cachedSerQNames.add(qName);
            cls = ArrayOfLatLong.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfLineDriveMapImage");
            cachedSerQNames.add(qName);
            cls = ArrayOfLineDriveMapImage.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfLocation");
            cachedSerQNames.add(qName);
            cls = ArrayOfLocation.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfMapImage");
            cachedSerQNames.add(qName);
            cls = ArrayOfMapImage.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfMapView");
            cachedSerQNames.add(qName);
            cls = ArrayOfMapView.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfPixelCoord");
            cachedSerQNames.add(qName);
            cls = ArrayOfPixelCoord.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfPolygon");
            cachedSerQNames.add(qName);
            cls = ArrayOfPolygon.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfPushpin");
            cachedSerQNames.add(qName);
            cls = ArrayOfPushpin.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfSegment");
            cachedSerQNames.add(qName);
            cls = ArrayOfSegment.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfSegmentSpecification");
            cachedSerQNames.add(qName);
            cls = ArrayOfSegmentSpecification.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfSortProperty");
            cachedSerQNames.add(qName);
            cls = ArrayOfSortProperty.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfString");
            cachedSerQNames.add(qName);
            cls = ArrayOfString.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfVersionInfo");
            cachedSerQNames.add(qName);
            cls = ArrayOfVersionInfo.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "CalculatedRouteRepresentation");
            cachedSerQNames.add(qName);
            cls = CalculatedRouteRepresentation.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "CountryRegionContext");
            cachedSerQNames.add(qName);
            cls = CountryRegionContext.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "CountryRegionInfo");
            cachedSerQNames.add(qName);
            cls = CountryRegionInfo.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "CultureInfo");
            cachedSerQNames.add(qName);
            cls = CultureInfo.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "CustomerInfoFindHeader");
            cachedSerQNames.add(qName);
            cls = CustomerInfoFindHeader.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "CustomerInfoHeader");
            cachedSerQNames.add(qName);
            cls = CustomerInfoHeader.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "CustomerInfoRenderHeader");
            cachedSerQNames.add(qName);
            cls = CustomerInfoRenderHeader.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "CustomerInfoRouteHeader");
            cachedSerQNames.add(qName);
            cls = CustomerInfoRouteHeader.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "DataSource");
            cachedSerQNames.add(qName);
            cls = DataSource.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "DataSourceCapability");
            cachedSerQNames.add(qName);
            cls = java.lang.String[].class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(simplelistsf);
            cachedDeserFactories.add(simplelistdf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "DataSourceCapability>null");
            cachedSerQNames.add(qName);
            cls = DataSourceCapabilityNull.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(enumsf);
            cachedDeserFactories.add(enumdf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Direction");
            cachedSerQNames.add(qName);
            cls = Direction.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "DirectionAction");
            cachedSerQNames.add(qName);
            cls = DirectionAction.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(enumsf);
            cachedDeserFactories.add(enumdf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "DirectionType");
            cachedSerQNames.add(qName);
            cls = DirectionType.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(enumsf);
            cachedDeserFactories.add(enumdf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "DistanceUnit");
            cachedSerQNames.add(qName);
            cls = DistanceUnit.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(enumsf);
            cachedDeserFactories.add(enumdf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "DriverProfile");
            cachedSerQNames.add(qName);
            cls = DriverProfile.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ElementColor");
            cachedSerQNames.add(qName);
            cls = ElementColor.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Entity");
            cachedSerQNames.add(qName);
            cls = Entity.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "EntityProperty");
            cachedSerQNames.add(qName);
            cls = EntityProperty.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "EntityPropertyValue");
            cachedSerQNames.add(qName);
            cls = EntityPropertyValue.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "EntityType");
            cachedSerQNames.add(qName);
            cls = EntityType.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "FilterExpression");
            cachedSerQNames.add(qName);
            cls = FilterExpression.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "FindAddressSpecification");
            cachedSerQNames.add(qName);
            cls = FindAddressSpecification.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "FindByIDSpecification");
            cachedSerQNames.add(qName);
            cls = FindByIDSpecification.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "FindByPropertySpecification");
            cachedSerQNames.add(qName);
            cls = FindByPropertySpecification.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "FindFilter");
            cachedSerQNames.add(qName);
            cls = FindFilter.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "FindNearbySpecification");
            cachedSerQNames.add(qName);
            cls = FindNearbySpecification.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "FindNearRouteSpecification");
            cachedSerQNames.add(qName);
            cls = FindNearRouteSpecification.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "FindOptions");
            cachedSerQNames.add(qName);
            cls = FindOptions.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "FindPolygonSpecification");
            cachedSerQNames.add(qName);
            cls = FindPolygonSpecification.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "FindRange");
            cachedSerQNames.add(qName);
            cls = FindRange.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "FindResult");
            cachedSerQNames.add(qName);
            cls = FindResult.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "FindResultMask");
            cachedSerQNames.add(qName);
            cls = java.lang.String[].class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(simplelistsf);
            cachedDeserFactories.add(simplelistdf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "FindResultMask>null");
            cachedSerQNames.add(qName);
            cls = FindResultMaskNull.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(enumsf);
            cachedDeserFactories.add(enumdf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "FindResults");
            cachedSerQNames.add(qName);
            cls = FindResults.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "FindSpecification");
            cachedSerQNames.add(qName);
            cls = FindSpecification.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "GetInfoOptions");
            cachedSerQNames.add(qName);
            cls = GetInfoOptions.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "HotArea");
            cachedSerQNames.add(qName);
            cls = HotArea.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ImageFormat");
            cachedSerQNames.add(qName);
            cls = ImageFormat.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "LatLong");
            cachedSerQNames.add(qName);
            cls = LatLong.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "LatLongRectangle");
            cachedSerQNames.add(qName);
            cls = LatLongRectangle.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "LatLongRectangleSpatialFilter");
            cachedSerQNames.add(qName);
            cls = LatLongRectangleSpatialFilter.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "LatLongSpatialFilter");
            cachedSerQNames.add(qName);
            cls = LatLongSpatialFilter.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "LineDriveMapImage");
            cachedSerQNames.add(qName);
            cls = LineDriveMapImage.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "LineDriveMapOptions");
            cachedSerQNames.add(qName);
            cls = LineDriveMapOptions.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "LineDriveMapSpecification");
            cachedSerQNames.add(qName);
            cls = LineDriveMapSpecification.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Location");
            cachedSerQNames.add(qName);
            cls = Location.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "MapFontSize");
            cachedSerQNames.add(qName);
            cls = MapFontSize.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(enumsf);
            cachedDeserFactories.add(enumdf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "MapImage");
            cachedSerQNames.add(qName);
            cls = MapImage.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "MapOptions");
            cachedSerQNames.add(qName);
            cls = MapOptions.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "MapPointConstants");
            cachedSerQNames.add(qName);
            cls = MapPointConstants.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "MapReturnType");
            cachedSerQNames.add(qName);
            cls = MapReturnType.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(enumsf);
            cachedDeserFactories.add(enumdf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "MapSpecification");
            cachedSerQNames.add(qName);
            cls = MapSpecification.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "MapStyle");
            cachedSerQNames.add(qName);
            cls = MapStyle.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(enumsf);
            cachedDeserFactories.add(enumdf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "MapView");
            cachedSerQNames.add(qName);
            cls = MapView.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "MapViewRepresentations");
            cachedSerQNames.add(qName);
            cls = MapViewRepresentations.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "MimeData");
            cachedSerQNames.add(qName);
            cls = MimeData.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "PaletteType");
            cachedSerQNames.add(qName);
            cls = PaletteType.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(enumsf);
            cachedDeserFactories.add(enumdf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "PixelCoord");
            cachedSerQNames.add(qName);
            cls = PixelCoord.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "PixelRectangle");
            cachedSerQNames.add(qName);
            cls = PixelRectangle.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Polygon");
            cachedSerQNames.add(qName);
            cls = Polygon.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Pushpin");
            cachedSerQNames.add(qName);
            cls = Pushpin.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Route");
            cachedSerQNames.add(qName);
            cls = Route.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "RouteHighlightColor");
            cachedSerQNames.add(qName);
            cls = RouteHighlightColor.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(enumsf);
            cachedDeserFactories.add(enumdf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "RouteItinerary");
            cachedSerQNames.add(qName);
            cls = RouteItinerary.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "RouteResultMask");
            cachedSerQNames.add(qName);
            cls = java.lang.String[].class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(simplelistsf);
            cachedDeserFactories.add(simplelistdf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "RouteResultMask>null");
            cachedSerQNames.add(qName);
            cls = RouteResultMaskNull.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(enumsf);
            cachedDeserFactories.add(enumdf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "RouteSpecification");
            cachedSerQNames.add(qName);
            cls = RouteSpecification.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "SearchOperatorFlag");
            cachedSerQNames.add(qName);
            cls = SearchOperatorFlag.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(enumsf);
            cachedDeserFactories.add(enumdf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Segment");
            cachedSerQNames.add(qName);
            cls = Segment.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "SegmentOptions");
            cachedSerQNames.add(qName);
            cls = SegmentOptions.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "SegmentPreference");
            cachedSerQNames.add(qName);
            cls = SegmentPreference.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(enumsf);
            cachedDeserFactories.add(enumdf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "SegmentSpecification");
            cachedSerQNames.add(qName);
            cls = SegmentSpecification.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "SnapType");
            cachedSerQNames.add(qName);
            cls = SnapType.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(enumsf);
            cachedDeserFactories.add(enumdf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "SortDirection");
            cachedSerQNames.add(qName);
            cls = SortDirection.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(enumsf);
            cachedDeserFactories.add(enumdf);

    }
    private void addBindings1() {
            java.lang.Class cls;
            javax.xml.namespace.QName qName;
            javax.xml.namespace.QName qName2;
            java.lang.Class beansf = org.apache.axis.encoding.ser.BeanSerializerFactory.class;
            java.lang.Class beandf = org.apache.axis.encoding.ser.BeanDeserializerFactory.class;
            java.lang.Class enumsf = org.apache.axis.encoding.ser.EnumSerializerFactory.class;
            java.lang.Class enumdf = org.apache.axis.encoding.ser.EnumDeserializerFactory.class;
            java.lang.Class arraysf = org.apache.axis.encoding.ser.ArraySerializerFactory.class;
            java.lang.Class arraydf = org.apache.axis.encoding.ser.ArrayDeserializerFactory.class;
            java.lang.Class simplesf = org.apache.axis.encoding.ser.SimpleSerializerFactory.class;
            java.lang.Class simpledf = org.apache.axis.encoding.ser.SimpleDeserializerFactory.class;
            java.lang.Class simplelistsf = org.apache.axis.encoding.ser.SimpleListSerializerFactory.class;
            java.lang.Class simplelistdf = org.apache.axis.encoding.ser.SimpleListDeserializerFactory.class;
            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "SortProperty");
            cachedSerQNames.add(qName);
            cls = SortProperty.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "SpatialFilter");
            cachedSerQNames.add(qName);
            cls = SpatialFilter.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "SpatialRelation");
            cachedSerQNames.add(qName);
            cls = SpatialRelation.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(enumsf);
            cachedDeserFactories.add(enumdf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "UserInfoFindHeader");
            cachedSerQNames.add(qName);
            cls = UserInfoFindHeader.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "UserInfoHeader");
            cachedSerQNames.add(qName);
            cls = UserInfoHeader.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "UserInfoRenderHeader");
            cachedSerQNames.add(qName);
            cls = UserInfoRenderHeader.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "UserInfoRouteHeader");
            cachedSerQNames.add(qName);
            cls = UserInfoRouteHeader.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "VersionInfo");
            cachedSerQNames.add(qName);
            cls = VersionInfo.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ViewByBoundingLocations");
            cachedSerQNames.add(qName);
            cls = ViewByBoundingLocations.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ViewByBoundingRectangle");
            cachedSerQNames.add(qName);
            cls = ViewByBoundingRectangle.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ViewByHeightWidth");
            cachedSerQNames.add(qName);
            cls = ViewByHeightWidth.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ViewByScale");
            cachedSerQNames.add(qName);
            cls = ViewByScale.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Waypoint");
            cachedSerQNames.add(qName);
            cls = Waypoint.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

            qName = new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "WhereClause");
            cachedSerQNames.add(qName);
            cls = WhereClause.class;
            cachedSerClasses.add(cls);
            cachedSerFactories.add(beansf);
            cachedDeserFactories.add(beandf);

    }

    protected org.apache.axis.client.Call createCall() throws java.rmi.RemoteException {
        try {
            org.apache.axis.client.Call _call = super._createCall();
            if (super.maintainSessionSet) {
                _call.setMaintainSession(super.maintainSession);
            }
            if (super.cachedUsername != null) {
                _call.setUsername(super.cachedUsername);
            }
            if (super.cachedPassword != null) {
                _call.setPassword(super.cachedPassword);
            }
            if (super.cachedEndpoint != null) {
                _call.setTargetEndpointAddress(super.cachedEndpoint);
            }
            if (super.cachedTimeout != null) {
                _call.setTimeout(super.cachedTimeout);
            }
            if (super.cachedPortName != null) {
                _call.setPortName(super.cachedPortName);
            }
            java.util.Enumeration keys = super.cachedProperties.keys();
            while (keys.hasMoreElements()) {
                java.lang.String key = (java.lang.String) keys.nextElement();
                _call.setProperty(key, super.cachedProperties.get(key));
            }
            // All the type mapping information is registered
            // when the first call is made.
            // The type mapping information is actually registered in
            // the TypeMappingRegistry of the service, which
            // is the reason why registration is only needed for the first call.
            synchronized (this) {
                if (firstCall()) {
                    // must set encoding style before registering serializers
                    _call.setEncodingStyle(null);
                    for (int i = 0; i < cachedSerFactories.size(); ++i) {
                        java.lang.Class cls = (java.lang.Class) cachedSerClasses.get(i);
                        javax.xml.namespace.QName qName =
                                (javax.xml.namespace.QName) cachedSerQNames.get(i);
                        java.lang.Object x = cachedSerFactories.get(i);
                        if (x instanceof Class) {
                            java.lang.Class sf = (java.lang.Class)
                                 cachedSerFactories.get(i);
                            java.lang.Class df = (java.lang.Class)
                                 cachedDeserFactories.get(i);
                            _call.registerTypeMapping(cls, qName, sf, df, false);
                        }
                        else if (x instanceof javax.xml.rpc.encoding.SerializerFactory) {
                            org.apache.axis.encoding.SerializerFactory sf = (org.apache.axis.encoding.SerializerFactory)
                                 cachedSerFactories.get(i);
                            org.apache.axis.encoding.DeserializerFactory df = (org.apache.axis.encoding.DeserializerFactory)
                                 cachedDeserFactories.get(i);
                            _call.registerTypeMapping(cls, qName, sf, df, false);
                        }
                    }
                }
            }
            return _call;
        }
        catch (java.lang.Throwable _t) {
            throw new org.apache.axis.AxisFault("Failure trying to get the Call object", _t);
        }
    }

    public Route calculateSimpleRoute(ArrayOfLatLong latLongs, java.lang.String dataSourceName, SegmentPreference preference) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[0]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://s.mappoint.net/mappoint-30/CalculateSimpleRoute");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "CalculateSimpleRoute"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {latLongs, dataSourceName, preference});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (Route) _resp;
            } catch (java.lang.Exception _exception) {
                return (Route) org.apache.axis.utils.JavaUtils.convert(_resp, Route.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

    public Route calculateRoute(RouteSpecification specification) throws java.rmi.RemoteException {
        if (super.cachedEndpoint == null) {
            throw new org.apache.axis.NoEndPointException();
        }
        org.apache.axis.client.Call _call = createCall();
        _call.setOperation(_operations[1]);
        _call.setUseSOAPAction(true);
        _call.setSOAPActionURI("http://s.mappoint.net/mappoint-30/CalculateRoute");
        _call.setEncodingStyle(null);
        _call.setProperty(org.apache.axis.client.Call.SEND_TYPE_ATTR, Boolean.FALSE);
        _call.setProperty(org.apache.axis.AxisEngine.PROP_DOMULTIREFS, Boolean.FALSE);
        _call.setSOAPVersion(org.apache.axis.soap.SOAPConstants.SOAP11_CONSTANTS);
        _call.setOperationName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "CalculateRoute"));

        setRequestHeaders(_call);
        setAttachments(_call);
 try {        java.lang.Object _resp = _call.invoke(new java.lang.Object[] {specification});

        if (_resp instanceof java.rmi.RemoteException) {
            throw (java.rmi.RemoteException)_resp;
        }
        else {
            extractAttachments(_call);
            try {
                return (Route) _resp;
            } catch (java.lang.Exception _exception) {
                return (Route) org.apache.axis.utils.JavaUtils.convert(_resp, Route.class);
            }
        }
  } catch (org.apache.axis.AxisFault axisFaultException) {
  throw axisFaultException;
}
    }

}

