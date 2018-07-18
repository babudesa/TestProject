package libraries.Contact_Entity
uses java.util.ArrayList

enhancement FilterContactRoles : entity.Contact {
  // getValidRoles returns a list of available roles for a given type of contact.
  public function getValidRoles () : List{
    var roles: List=new ArrayList ()
    var tempRoles: List=new ArrayList()
    // 6/16/2009 - blawless - 1886, added if/else statement so PersonVendor and CompanyVendor Loaded by CMF have all roles added.
    // 6/22/2009 - blawless - 1886 change 2: added foreign versions of personvendor and companyvendors also.
  
    // 8/10/2009 - zjthomas - Defect 2294, removed if conditon to add all roles to a CMF Vendor.  Made changes to only allow all vendor roles on a CMF vendor.
  
  //  if (this.CMFContactExt and (this.Subtype =="PersonVendor" || this.Subtype == "CompanyVendor" || this.Subtype == "Ex_ForeignPersonVndr"|| this.Subtype =="Ex_ForeignCoVendor")){
  //    //add all roles if this was brought in through CMF and is PersonVendor or CompanyVendor
  //    for(rol in ContactRole.TypeKeys){
  //      roles.add(rol)
  //    }
  //  }else{
      //Contacts 
      if (this.Subtype == "Person" or this.Subtype == "InjuredWorkerExt"){
      // 03/05/2009 - zjthomas - Defect 816, Remove coveredparty from availabie roles for a contact.
      //tempRoles.add("coveredparty")
      // 12/15/2010 - llynch - Defect 3773, Add the Guardian Ad Litem as a new role to parties involved for person only.
      // 1.19.16 - Defect 7711 - cmullin - InjuredWorkerExt should have the same roles as Person. 
        tempRoles.add("altcontact")
        tempRoles.add("AlternateTrainer")
        tempRoles.add("claimantdep")
        tempRoles.add("codefendant")
        tempRoles.add("defendant")
        tempRoles.add("driver")
        tempRoles.add("filedby")
        tempRoles.add("injured")
        tempRoles.add("InsuredRep")
        tempRoles.add("judge")
        tempRoles.add("leadparalegal")
        tempRoles.add("passenger")
        tempRoles.add("plaintiff")
        tempRoles.add("PrimaryTrainer")
        tempRoles.add("witness")
        tempRoles.add("guardianadlitem")
        tempRoles.add("other")
        // 5/15/2012  -kepage - Defect 5318, Role additions, removals, changes     
        tempRoles.add("expertplaintiff")
        tempRoles.add("potentiallitigation")
        tempRoles.add("proseplaintiff")
        // Added for medicare
        tempRoles.add("Guardian")
        tempRoles.add("powerofattorneyrole")
        tempRoles.add("beneficiary")
        // 3/7/2014 - kniese - Added for Bonds
        tempRoles.add("claimindemnitor")
    
        tempRoles.add(ContactRole.TC_ARBITRATOR.Code)
        tempRoles.add(ContactRole.TC_CERTIFICATEHOLDER.Code)
        tempRoles.add(ContactRole.TC_CLAIMNAMEDINSURED.Code)
        tempRoles.add(ContactRole.TC_CLAIMADDITIONALINSURED.Code)
        tempRoles.add(ContactRole.TC_CLAIMADDNAMEDINSURED.Code)
        tempRoles.add(ContactRole.TC_INSURERTPA.Code)     
        //3-4-14 Environmental - cdmcdonald
        tempRoles.add("buildingconsultant")   
        // 6/2/15 - kniese - Ocean Marine Avalon
        tempRoles.add(ContactRole.TC_COPRINCIPAL.Code)
        //1-28-15 Workers Comp - cdmcdonald
        tempRoles.add(ContactRole.TC_THDPTYTORTFEASOR.Code)
        tempRoles.add(ContactRole.TC_TPTORTFEASORCARR.Code)
        tempRoles.add(ContactRole.TC_INSURERTPA.Code)
        // 8/11/15 dnmiller - Aviation 
        tempRoles.add(ContactRole.TC_CLAIMLOSSPAYEE.Code)
        tempRoles.add(ContactRole.TC_PILOT.Code)
         
       // 05/12/2016 - sdhakal - Defect 8591 -  Remove Injured worker supervisor role from available roles for person.
       //tempRoles.add(ContactRole.TC_INJWORKERSUPER.Code) 
      }
  
      if (this.Subtype == "Company"){
      // 03/05/2009 - zjthomas - Defect 816, Remove coveredparty from availabie roles for a contact.
      //tempRoles.add("coveredparty")
        tempRoles.add("AlternateTrainer")
        tempRoles.add("codefendant")
        tempRoles.add("defendant")
        tempRoles.add("employer")
        tempRoles.add("plaintiff")
        tempRoles.add("PrimaryTrainer")
        tempRoles.add("other")
        // 5/15/2012  -kepage - Defect 5318, Role additions, removals, changes
        tempRoles.add("expertplaintiff")
        tempRoles.add("potentiallitigation")  
        // 3/7/2014 - kniese - Added for Bonds
        tempRoles.add("claimindemnitor")
        /*COMMENT OUT UNTIL EDW IS READY
        tempRoles.add("constructionmanager")
        tempRoles.add("architect")
        tempRoles.add("subcontractor")
        tempRoles.add("purchaseordersupplier")
        tempRoles.add("inspector")
        tempRoles.add("union")
        tempRoles.add("laborer")
        tempRoles.add("consultant")
        tempRoles.add("governmentalagency")
        */   
        tempRoles.add(ContactRole.TC_ARBITRATOR.Code)
        tempRoles.add(ContactRole.TC_CERTIFICATEHOLDER.Code)
        tempRoles.add(ContactRole.TC_CLAIMNAMEDINSURED.Code)
        tempRoles.add(ContactRole.TC_CLAIMADDITIONALINSURED.Code)
        tempRoles.add(ContactRole.TC_CLAIMADDNAMEDINSURED.Code) 
        tempRoles.add(ContactRole.TC_INSURERTPA.Code)
        tempRoles.add(ContactRole.TC_INSURER.Code)
        //3-4-14 Environmental - cdmcdonald
        tempRoles.add("retailbroker")      
        tempRoles.add("buildingconsultant") 
        // 6/2/15 - kniese - Ocean Marine Avalon
        tempRoles.add(ContactRole.TC_COPRINCIPAL.Code)
        //1-28-15 Workers Comp - cdmcdonald
        tempRoles.add(ContactRole.TC_THDPTYTORTFEASOR.Code)
        tempRoles.add(ContactRole.TC_TPTORTFEASORCARR.Code)
        // 8/11/15 dnmiller - Aviation
        tempRoles.add(ContactRole.TC_CLAIMLOSSPAYEE.Code)
        tempRoles.add(ContactRole.TC_LEADCARRIER.Code)
      }
  
      if (this.Subtype == "NonVendorPayeeCompanyExt"){
        // 5.8.14 - cmullin - Defect 6791 - created two Non-Vendor Payee types to allow for TOMIC bulk invoice 
        // payments for Specialty E&S.
        tempRoles.add(ContactRole.TC_ARBITRATOR.Code)
        tempRoles.add(ContactRole.TC_BUILDINGCONSULTANT.Code)
        //Defect 8060 - Remove role Catastrophic Nurse Case Management
        //tempRoles.add(ContactRole.TC_CATNURSECASEMANAGE.Code)
        tempRoles.add(ContactRole.TC_CERTIFICATEHOLDER.Code)
        tempRoles.add(ContactRole.TC_CLAIMADDITIONALINSURED.Code)
        tempRoles.add(ContactRole.TC_CLAIMADDNAMEDINSURED.Code) 
        tempRoles.add(ContactRole.TC_CLAIMNAMEDINSURED.Code)
        tempRoles.add(ContactRole.TC_COSTCONTROLVENDOR.Code)
        tempRoles.add(ContactRole.TC_ENGINEERBIOMECHANICAL.Code)
        tempRoles.add(ContactRole.TC_ENGINEERHUMANFACTOR.Code)
        tempRoles.add(ContactRole.TC_ENGINEERSTRUCTSOIL.Code)
        tempRoles.add(ContactRole.TC_EXPERTDEFENSE.Code)
        tempRoles.add(ContactRole.TC_INDEPENDENTADJUSTER.Code)
        tempRoles.add(ContactRole.TC_INSURER.Code)
        tempRoles.add(ContactRole.TC_INSURERTPA.Code)
        tempRoles.add(ContactRole.TC_INVESTIGATOR.Code)
        tempRoles.add(ContactRole.TC_LAWENFCAGCY.Code)
        tempRoles.add(ContactRole.TC_LEGALCASEMANAGEMENT.Code)
        tempRoles.add(ContactRole.TC_MEDIATOR.Code)
        //Defect 8060 - Remove role Nurse Case Management
        //tempRoles.add(ContactRole.TC_NURSECASEMANAGEMENT.Code)
        tempRoles.add(ContactRole.TC_OTHER.Code)
        tempRoles.add(ContactRole.TC_REPAIRSHOP.Code)
        tempRoles.add(ContactRole.TC_SALVAGESERVICE.Code)
        tempRoles.add(ContactRole.TC_SUBROGATIONVENDOR.Code)
        tempRoles.add(ContactRole.TC_TOWINGAGCY.Code)
        // WC Defect 8090 - do not allow VOCREHABSPECIALIST in dropdowns
        //tempRoles.add(ContactRole.TC_VOCREHABSPECIALIST.Code)
      }
      
      if (this.Subtype == "NonVendorPayeePersonExt"){
        // 5.8.14 - cmullin - Defect 6791 - created two Non-Vendor Payee types to allow for TOMIC bulk invoice 
        // payments for Specialty E&S.
        tempRoles.add(ContactRole.TC_ACCOUNTANT.Code)
        tempRoles.add(ContactRole.TC_AGRONOMIST.Code)
        tempRoles.add(ContactRole.TC_ARBITRATOR.Code)
        tempRoles.add(ContactRole.TC_BUILDINGCONSULTANT.Code)
        tempRoles.add(ContactRole.TC_CERTIFICATEHOLDER.Code)
        tempRoles.add(ContactRole.TC_CLAIMADDITIONALINSURED.Code)
        tempRoles.add(ContactRole.TC_CLAIMADDNAMEDINSURED.Code) 
        tempRoles.add(ContactRole.TC_CLAIMNAMEDINSURED.Code)
        tempRoles.add(ContactRole.TC_ENGINEERBIOMECHANICAL.Code)
        tempRoles.add(ContactRole.TC_ENGINEERHUMANFACTOR.Code)
        tempRoles.add(ContactRole.TC_ENGINEERSTRUCTSOIL.Code)
        tempRoles.add(ContactRole.TC_EXPERTDEFENSE.Code)
        tempRoles.add(ContactRole.TC_INDEPENDENTADJUSTER.Code)
        tempRoles.add(ContactRole.TC_INSURERTPA.Code)
        tempRoles.add(ContactRole.TC_INVESTIGATOR.Code)
        tempRoles.add(ContactRole.TC_MATTERMANAGER.Code)
        tempRoles.add(ContactRole.TC_MEDIATOR.Code)
        //Defect 8060 - Remove role Nurse case Manager
        //tempRoles.add(ContactRole.TC_NURSECASEMGR.Code)
        //Defect 8060 - Remove role Occupational Therapist
        //tempRoles.add(ContactRole.TC_OCCTHERAPIST.Code)
        tempRoles.add(ContactRole.TC_OTHER.Code)
        //Defect 8060 - Remove role Physical Therapist
        //tempRoles.add(ContactRole.TC_PHYSTHERAPIST.Code)
        tempRoles.add(ContactRole.TC_SUBROGATIONVENDOR.Code)
        // WC Defect 8090 - do not allow VOCREHABSPECIALIST in dropdowns
        //tempRoles.add(ContactRole.TC_VOCREHABSPECIALIST.Code)
      }
      
      //Vendors  
  
      if (this.Subtype == "CompanyVendor" or this.CMFContactExt){
        tempRoles.add("costcontrolvendor")
        tempRoles.add("engineerbiomechanical")
        tempRoles.add("engineerhumanfactor")
        tempRoles.add("engineerstructsoil")
        tempRoles.add("independentadjuster")
        tempRoles.add("investigator")
        tempRoles.add("LawEnfcAgcy")
        tempRoles.add("legalcasemanagement")
        tempRoles.add("mediator")
        tempRoles.add("repairshop")
        tempRoles.add("salvageservice")
        tempRoles.add("subrogationvendor")
        tempRoles.add("TowingAgcy")
        // WC Defect 8090 - do not allow VOCREHABSPECIALIST in dropdowns
        //tempRoles.add("vocrehabspecialist")
        tempRoles.add("other")
        // 5/15/2012  -kepage - Defect 5318, Role additions, removals, changes
        tempRoles.add("expertdefense")
        //3/12/2014 - cmcdonald - Environmental new dev
        tempRoles.add("buildingconsultant") 
        //2-4-15 - cdmcdonald - Workers Comp
        //3/3/16 - bbenson2 - removed per defect 424 requirements
        /*
        tempRoles.add(ContactRole.TC_THDPTYTORTFEASOR.Code)
        tempRoles.add(ContactRole.TC_TPTORTFEASORCARR.Code)
        tempRoles.add(ContactRole.TC_INSURERTPA.Code)
        */
        // 3.26.15 - cmullin - Removed catnursecasemanage and nursecasemanagement, added medcasemgmt
        //tempRoles.add("catnursecasemanage")
        //tempRoles.add("nursecasemanagement")
        tempRoles.add("medcasemgmt")
      }
  
      if (this.Subtype == "Ex_ForeignCoVendor"){
        tempRoles.add("costcontrolvendor")
        tempRoles.add("engineerbiomechanical")
        tempRoles.add("engineerhumanfactor")
        tempRoles.add("engineerstructsoil")
        tempRoles.add("independentadjuster")
        tempRoles.add("investigator")
        tempRoles.add("LawEnfcAgcy")
        tempRoles.add("legalcasemanagement")
        tempRoles.add("mediator")
        tempRoles.add("repairshop")
        tempRoles.add("salvageservice")
        tempRoles.add("subrogationvendor")
        tempRoles.add("TowingAgcy")
        // WC Defect 8090 - do not allow VOCREHABSPECIALIST in dropdowns
        //tempRoles.add("vocrehabspecialist")
        tempRoles.add("other")
        // 5/15/2012  -kepage - Defect 5318, Role additions, removals, changes
        tempRoles.add("expertdefense")
        //3/12/2014 - cmcdonald - Environmental new dev
        tempRoles.add("buildingconsultant")
        //2-4-15 - cdmcdonald - Workers Comp
        //3/3/16 - bbenson2 - removed per defect 424 requirements
        /*
        tempRoles.add(ContactRole.TC_THDPTYTORTFEASOR.Code)
        tempRoles.add(ContactRole.TC_TPTORTFEASORCARR.Code)
        tempRoles.add(ContactRole.TC_INSURERTPA.Code)
        */
        // 3.26.15 - cmullin - Removed catnursecasemanage and nursecasemanagement, added medcasemgmt
        //tempRoles.add("catnursecasemanage")
        //tempRoles.add("nursecasemanagement")
        tempRoles.add("medcasemgmt")
      }
  
      if (this.Subtype == "PersonVendor" or this.CMFContactExt){
        tempRoles.add("accountant")
        tempRoles.add("agronomist")
        tempRoles.add("engineerbiomechanical")
        tempRoles.add("engineerhumanfactor")
        tempRoles.add("engineerstructsoil")
        tempRoles.add("independentadjuster")
        tempRoles.add("investigator")
        tempRoles.add("mattermanager")
        tempRoles.add("mediator")
        tempRoles.add("OccTherapist")
        tempRoles.add("PhysTherapist")
        tempRoles.add("subrogationvendor")
        // WC Defect 8090 - do not allow VOCREHABSPECIALIST in dropdowns
        //tempRoles.add("vocrehabspecialist")
        tempRoles.add("other")
        // 5/15/2012  -kepage - Defect 5318, Role additions, removals, changes
        tempRoles.add("expertdefense")
        //3/12/2014 - cmcdonald - Environmental new dev
        tempRoles.add("buildingconsultant")
        //2-4-15 - cdmcdonald - Workers Comp
        //3/3/16 - bbenson2 - removed per defect 424 requirements
        /*
        tempRoles.add(ContactRole.TC_THDPTYTORTFEASOR.Code)
        tempRoles.add(ContactRole.TC_TPTORTFEASORCARR.Code)
        tempRoles.add(ContactRole.TC_INSURERTPA.Code)
        */
        tempRoles.add(ContactRole.TC_INJWORKERSUPER.Code)
        // 3.26.15 - cmullin - Removed nursecasemgr, added medcasemanager
        //tempRoles.add("nursecasemgr")
        tempRoles.add("medcasemanager")
      }
  
      if (this.Subtype == "Ex_ForeignPersonVndr"){
        tempRoles.add("accountant")
        tempRoles.add("agronomist")
        tempRoles.add("engineerbiomechanical")
        tempRoles.add("engineerhumanfactor")
        tempRoles.add("engineerstructsoil")
        tempRoles.add("independentadjuster")
        tempRoles.add("investigator")
        tempRoles.add("mattermanager")
        tempRoles.add("mediator")
        tempRoles.add("OccTherapist")
        tempRoles.add("PhysTherapist")
        tempRoles.add("subrogationvendor")
        // WC Defect 8090 - do not allow VOCREHABSPECIALIST in dropdowns
        //tempRoles.add("vocrehabspecialist")
        tempRoles.add("other")
        // 5/15/2012  -kepage - Defect 5318, Role additions, removals, changes
        tempRoles.add("expertdefense")
        //3/12/2014 - cmcdonald - Environmental new dev
        tempRoles.add("buildingconsultant")
        //2-4-15 - cdmcdonald - Workers Comp
        //3/3/16 - bbenson2 - removed per defect 424 requirements
        /*
        tempRoles.add(ContactRole.TC_THDPTYTORTFEASOR.Code)
        tempRoles.add(ContactRole.TC_TPTORTFEASORCARR.Code)
        tempRoles.add(ContactRole.TC_INSURERTPA.Code)
        */
        tempRoles.add(ContactRole.TC_INJWORKERSUPER.Code)
        // 3.26.15 - cmullin - Removed nursecasemgr, added medcasemanager
        //tempRoles.add("nursecasemgr")
        tempRoles.add("medcasemanager")
      }
  
      if (this.Subtype == "Attorney" or this.CMFContactExt){
        tempRoles.add("consultingcounsel")
        tempRoles.add("coveragecounsel")
        tempRoles.add("defensecounsel")
        tempRoles.add("insuredpersoncounsel")
        tempRoles.add("recoverycounsel")   
        tempRoles.add("other")
        // 5/15/2012  -kepage - Defect 5318, Role additions, removals, changes
        tempRoles.add("mediator")
        tempRoles.add("opposingcounsel")
        tempRoles.add("expertdefense")
        tempRoles.add("monitoringcounsel")
      }
  
      if (this.Subtype == "Ex_ForeignPerVndrAttny"){
        tempRoles.add("consultingcounsel")
        tempRoles.add("coveragecounsel")
        tempRoles.add("defensecounsel")
        tempRoles.add("insuredpersoncounsel")
        tempRoles.add("recoverycounsel")
        tempRoles.add("other")
        // 5/15/2012  -kepage - Defect 5318, Role additions, removals, changes
        tempRoles.add("mediator")
        tempRoles.add("opposingcounsel")
        tempRoles.add("expertdefense")
        tempRoles.add("monitoringcounsel")
      }
  
      if (this.Subtype == "LawFirm"){
        tempRoles.add("consultingcounsel")
        tempRoles.add("coveragecounsel")
        tempRoles.add("defensecounsel")
        tempRoles.add("insuredpersoncounsel")
        tempRoles.add("recoverycounsel")
        tempRoles.add("other")
        // 5/15/2012  -kepage - Defect 5318, Role additions, removals, changes
        tempRoles.add("mediator")
        tempRoles.add("opposingcounsel")
        tempRoles.add("expertdefense")
        tempRoles.add("monitoringcounsel")
      }
  
      if (this.Subtype == "Ex_ForeignCoVenLawFrm"){
        tempRoles.add("consultingcounsel")
        tempRoles.add("coveragecounsel")
        tempRoles.add("defensecounsel")
        tempRoles.add("insuredpersoncounsel")
        tempRoles.add("recoverycounsel")
        tempRoles.add("other")
        // 5/15/2012  -kepage - Defect 5318, Role additions, removals, changes
        tempRoles.add("mediator")
        tempRoles.add("opposingcounsel")
        tempRoles.add("expertdefense")
        tempRoles.add("monitoringcounsel")
      }
  
      if (this.Subtype == "Doctor" or this.CMFContactExt){
        tempRoles.add("doctor")
        tempRoles.add("other")
        tempRoles.add("expertdefense")
        tempRoles.add("chiropractor")
        tempRoles.add("mednonphysician")
        tempRoles.add("physocctherapist")
      }
  
      if (this.Subtype == "Ex_ForeignPerVndrDoc"){
        tempRoles.add("doctor")
        tempRoles.add("other")
        tempRoles.add("expertdefense")
        tempRoles.add("chiropractor")
        tempRoles.add("mednonphysician")
        tempRoles.add("physocctherapist")
      }
  
      if (this.Subtype == "MedicalCareOrg" or this.CMFContactExt){
        tempRoles.add("hospital")
        tempRoles.add("other")
        tempRoles.add("expertdefense")
        tempRoles.add("mednonphysician")
        tempRoles.add("physocctherapist")
       }
  
      if (this.Subtype == "Ex_ForeignCoVenMedOrg"){
        tempRoles.add("hospital")
        tempRoles.add("other")
        tempRoles.add("expertdefense")
        tempRoles.add("mednonphysician")
        tempRoles.add("physocctherapist")
      }
  
      if (this.Subtype == "Ex_GAIVendor" or this.CMFContactExt){
        tempRoles.add("legalcasemanagement")
        tempRoles.add("other")
      }
  
      if (this.Subtype=="LegacyVendorCompanyExt"){
        tempRoles.add("catnursecasemanage")
        tempRoles.add("costcontrolvendor")
        tempRoles.add("consultingcounsel")
        tempRoles.add("coveragecounsel")
        tempRoles.add("defensecounsel")
        tempRoles.add("defensecounselcumis")
        tempRoles.add("defensecounselmonitor")
        tempRoles.add("engineerbiomechanical")
        tempRoles.add("engineerhumanfactor")
        tempRoles.add("engineerstructsoil")
        tempRoles.add("independentadjuster")
        tempRoles.add("investigator")
        tempRoles.add("LawEnfcAgcy")
        tempRoles.add("legalcasemanagement")
        tempRoles.add("mediator")
        tempRoles.add("nursecasemanagement")
        tempRoles.add("repairshop")
        tempRoles.add("salvageservice")
        tempRoles.add("subrogationvendor")
        tempRoles.add("TowingAgcy")
        // WC Defect 8090 - do not allow VOCREHABSPECIALIST in dropdowns
        //tempRoles.add("vocrehabspecialist")
        tempRoles.add("insuredpersoncounsel")
        tempRoles.add("plaintiffcounsel")
        tempRoles.add("recoverycounsel")
        tempRoles.add("hospital")
        tempRoles.add("other")
      }
   
      if (this.Subtype=="AutoRepairShop" or this.Subtype =="FrgnAutoRepairShopExt"){
        tempRoles.add("repairshop")
        tempRoles.add("expertdefense")
      }
    
      if (this.Subtype=="AutoRepairShop"){
        tempRoles.add("repairshop")
        tempRoles.add("expertdefense")
      }
    
      for(r1 in tempRoles){
        if(!exists(r2 in roles where r1==r2)){
          roles.add( r1 );
        }
      }
      java.util.Collections.sort(roles, String.CASE_INSENSITIVE_ORDER)
    
    return roles
  }
}
