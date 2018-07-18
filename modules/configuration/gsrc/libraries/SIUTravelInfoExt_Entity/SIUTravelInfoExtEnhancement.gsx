package libraries.SIUTravelInfoExt_Entity

enhancement SIUTravelInfoExtEnhancement : entity.SIUTravelInfoExt {
  function setCountry(){
    this.TravelAddress.Country = Country.TC_US
  }
}
