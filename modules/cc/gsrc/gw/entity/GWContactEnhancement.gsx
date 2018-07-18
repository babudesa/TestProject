package gw.entity

/**
 * Add a Country enhancement to Contact for use by the field validator mechanism. The Country property is called to 
 * determine the country to use when selecting a country specific field validator, such as for a phone number or
 * postal code.
 */
enhancement GWContactEnhancement : entity.Contact {
  
  /**
   * The country for this contact; uses the primary address country or, if that is null, the default country from
   * the global configuration.
   */
  property get Country() : Country {
    return this.PrimaryAddress.Country != null ? this.PrimaryAddress.Country : gw.api.admin.BaseAdminUtil.getDefaultCountry()
  }
}
