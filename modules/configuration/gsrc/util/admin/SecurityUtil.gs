package util.admin
uses java.util.Map
uses java.util.HashMap
uses java.util.Set
uses java.util.HashSet
uses java.util.ArrayList
uses java.util.Collection
uses gw.api.database.Query
uses util.user.GroupsHelper
uses gw.api.database.Relop


class SecurityUtil {

  construct() {

  }
  
  /* Function used for policy search criteria for security access */
  static function initPolicySearchCriteria(crit: PolicySearchCriteria, user: User){
    var sz = user.GroupUsers[0].Group.SecurityZone;
    if (sz.IsSecurityZoneTPAExt) {
      for (var r in sz.SecurityFilters) {
        if (r typeis entity.ProfitCenterSecurityFilterExt) {
          var pcg = r.ProfitCenterGrouping
          if (pcg == null) continue;
            for (var bu in pcg.BusinessUnitItemExt) {
              if (bu.BusinessUnit == null) continue;
                for (var prmid in util.admin.SecurityUtil.convertBusinessUnitToPRMId(bu.BusinessUnit)) {
                var s = new entity.PolicySearchSecureReferenceValuesExt();
                s.AccessTypeExt = typekey.AccessTypeExt.TC_BUSINESSUNIT;
                s.Value = prmid;
                crit.addToPolicySearchSecureReferenceValuesExt(s);
              }
            }
            for (var pc in pcg.ProfitCenterItemExt) {
              if (pc.ProfitCenter == null) continue;
              var s = new entity.PolicySearchSecureReferenceValuesExt();
              s.AccessTypeExt = typekey.AccessTypeExt.TC_PROFITCENTER;
              s.Value = pc.ProfitCenter;
              crit.addToPolicySearchSecureReferenceValuesExt(s);
            }
        }
      }
    }
    crit.CorporateAccountsExt = user.hasUserRole("Corporate Accounts") or user.hasUserRole("Ignore ACLs"); 
    /* 9/29/16:  Defect 8683 include role IgnoreACL to be able to create claims using corp policies */
  }

  /* 4/13/17 erawe: Used to add or remove user to or from claims with a batch process doing the work*/
  static function addUserToClaim(claim:Claim, user:User, usergroup:Group, role:typekey.UserRole) {
    var r = claim.RoleAssignments.firstWhere(\ r -> r.AssignedUser == user and r.AssignedGroup == usergroup and r.Role == role);
    if (r != null) return;
    batchIt(BatchOperationExt.TC_ADD,claim,user, usergroup, role);
  }
  
  static function removeUserFromClaim(claim:Claim, user:User, usergroup:Group, role:typekey.UserRole) {
    batchIt(BatchOperationExt.TC_REMOVE, claim, user, usergroup,role)
  }
  
  static function batchIt(op:BatchOperationExt, claim:Claim, user:User, usergroup:Group, role:typekey.UserRole) {
    var x = new  SecurityBatchItemExt()
    x.Claim = claim
    x.GenericUser = user
    x.GenericGroup = usergroup
    x.UserRole = role
    x.BatchOperation = op   
  }
  
   /* Non Batch process for adding/removing user to/from claims */
   public static function addUserToClaimNow(claim:Claim, user:User, usergroup:Group, role:typekey.UserRole) {
    var r = claim.RoleAssignments.firstWhere(\ r -> r.AssignedUser == user and r.AssignedGroup == usergroup and r.Role == role);
    if (r != null) return;
    claim.assignUserRole(user, usergroup, role);
   }
  
   public static function removeUserFromClaimNow(claim:Claim, user:User, usergroup:Group, role:typekey.UserRole) {
    var r = claim.RoleAssignments.firstWhere(\ r -> r.AssignedUser == user and r.AssignedGroup == usergroup and r.Role == role);
    if (r != null) {
      claim.removeFromRoleAssignments(r);
      //this may already trip the pre-update rule that rebuilds the claim, so this may not be necessary: c.rebuildClaimACL();
    }
   }
  
  static function clearRoles(claim:Claim) {
    for(rolassign in claim.RoleAssignments){
      if(rolassign.Role == typekey.UserRole.TC_SENSITIVECLAIM or rolassign.Role == typekey.UserRole.TC_SECUREADJUSTER
        or rolassign.Role == typekey.UserRole.TC_TRANSFERCLAIM){
          claim.removeFromRoleAssignments(rolassign)
      }
    }
  }
  /*-------------------------------------------------------------------*/
  static function findProducingZone(c:Claim):entity.SecurityZone {
    var q = gw.api.database.Query.make(entity.SecurityZone);
    var g = q.join(Group, "SecurityZone");
    var smv = g.join(SecureManageValuesExt, "ProducingUnitExt");
    smv.compare("BusinessUnitExt", equals, c.ProducingBusinessUnitExt);
    return q.select().AtMostOneRow;
  }
  
  static function findAllGenericUsersWhichCanSeeUnsecuredClaims(pzs:entity.SecurityZone[]) : User[] {
    var q = gw.api.database.Query.make(User);
    var sz = q.join(SecurityZone, "GenericUserExt");
    sz.compare("CanSeeUnsecureClaimsExt", Equals, true);
    //don't add the producing zone. If it's assinged to them, then they're already there. If not, then transferred rule will catch them.
    //don't add the handling zone either.
    sz.compareNotIn("ID", pzs);
    return q.select().toTypedArray();
  }

  
  static function findAllGenericUsersRelatedByFilters(c:Claim, z:entity.SecurityZone) : User[] {
    var query = gw.api.database.Query.make(User);
    var sz = query.join(entity.SecurityZone, "GenericUserExt");
    sz.compare("IsSecurityZoneTPAExt", equals, true)
    sz.or(\ szo -> {
      { //profit center grouping
        var pcsf = szo.subselect("ID", CompareIn, ProfitCenterSecurityFilterExt, "SecurityZone").cast(ProfitCenterSecurityFilterExt);
        pcsf.compare("SecurityZone", equals, sz.getColumnRef("ID"));
        var pcg = pcsf.join("ProfitCenterGrouping");
        pcg.or(\ pcgo -> {
          var pci = pcgo.subselect("ID", CompareIn, ProfitCenterItemExt, "ProfitCenterGrouping");
          pci.compare("ProfitCenter", equals, c.Policy.ex_Agency.ex_AgencyProfitCenter);
          pci.compare("ProfitCenterGrouping", Equals, pcg.getColumnRef("ID"));
      
          var bui = pcgo.subselect("ID", CompareIn, BusinessUnitItemExt, "ProfitCenterGrouping");
          bui.compare("ProfitCenterGrouping", Equals, pcg.getColumnRef("ID"));
          bui.compare("BusinessUnit", equals, c.ProducingBusinessUnitExt);
        })
        pcsf.compare("SecurityZone", notEquals, z)
      }
      { //claim business unit
        var cbu = szo.subselect("ID", CompareIn, ClaimsBusinessUnitSecurityFilterExt, "SecurityZone").cast(ClaimsBusinessUnitSecurityFilterExt);
        cbu.compare("SecurityZone", equals, sz.getColumnRef("ID"));
        cbu.compare("ClaimsBusinessUnit", Equals, c.getClaimBusinessUnitGroup());
      }
    });
    
    return query.select().toTypedArray();
  }
  
  static function findAllCorporateAccountsUsers() : User[] {
    var q = gw.api.database.Query.make(User);
    var ur = q.join(UserRole, "User")
    var r = ur.join("Role")
    r.compare("Name", Equals, "Corporate Accounts")
    return q.select().toTypedArray() 
  }

   static function isClaimCorporateAccount(policynumber:String) : boolean{
     var query = gw.api.database.Query.make(CorporateAccountPolicyExt)
     query.compare("PolicyNumber", Equals, policynumber)
     return !query.select().Empty
   }

//----------------------------------------------------------------------------

Static function getCurrentRoles(c:Claim):Map<User, Map<typekey.UserRole, UserRoleAssignment>> {
    var userMap = new HashMap<User, Map<typekey.UserRole, UserRoleAssignment>>();

    for (ra in c.RoleAssignments) {
      if (ra.Role == typekey.UserRole.TC_SENSITIVECLAIM or
        ra.Role == typekey.UserRole.TC_SECUREADJUSTER or
        ra.Role == typekey.UserRole.TC_TRANSFERCLAIM or
        ra.Role == typekey.UserRole.TC_CORPORATEACCOUNT) {
        var roleMap = userMap.get(ra.AssignedUser);
        if (roleMap == null) {
          roleMap = new HashMap<typekey.UserRole, UserRoleAssignment>();
          userMap.put(ra.AssignedUser, roleMap);
        }
        roleMap.put(ra.Role, ra);
      }
    }
    return userMap;
  }
  
Static  function addUserRoleToMap(map:Map<User, Set<typekey.UserRole>>, u:User, r:typekey.UserRole) {
    var list = map.get(u);
      if (list == null) {
        list = new HashSet<typekey.UserRole>();
        map.put(u, list);
      }
      list.add(r);
  }
  

Static  function resolveUserRoles(current:Map<User, Map<typekey.UserRole, UserRoleAssignment>>, newer:Map<User, Set<typekey.UserRole>>, c:Claim) {
    {//resolve exact matches
      var nit = newer.entrySet().iterator();
      while (nit.hasNext()) {
        var ni = nit.next();
      
        var ci = current.get(ni.Key);
        if (ci == null) continue; //the user currently doesn't have access
        //the user does have some access, lets check the roles
        var nirit = ni.Value.iterator();
        while (nirit.hasNext()) {
          var nir = nirit.next();
          if (ci.Keys.contains(nir)) {
            print("---exact match------"+nir+", "+ni.Key);
            nirit.remove();
            ci.remove(nir);
          }
        }
        //if a user has no more roles, remove that user
        if (ni.Value.Empty) {
          nit.remove();
        }
        if (ci.Empty) {
          current.remove(ni.Key);
        }
      }
    }
    
    {//remove extra roles
      for (var ci in current.entrySet()) {
        for (var cir in ci.Value.entrySet()) {
          print("------removing---"+cir.Key+", "+ci.Key);
          c.removeFromRoleAssignments(cir.Value);
        }
      }
    }
    
    { //add the new roles
      for (var ni in newer.entrySet()) {
        for (var nir in ni.Value) {
          print("-------addding----"+nir+", "+ni.Key);
          addUserToClaimNow(c, ni.Key, ni.Key.GroupUsers[0].Group, nir);
        }
      }
    }
  }

//---------------------------------------------------------------------------
  static function getFilteredClaimUserModel(ClaimUserModelList :ClaimUserModel[], showSecure:boolean) :ClaimUserModel[] {
    var list = new ArrayList<ClaimUserModel>()
    print("show secure = " + showSecure)
    for(ClaimUserModel in ClaimUserModelList){
      print("user=" + ClaimUserModel.User)
    
      //can be both, not mutually exclusive
      var isNotSecure = !ClaimUserModel.BeansAssignedToUser.IsEmpty;
      var isSecure = ClaimUserModel.UserRoleAssignments.hasMatch(\ rolassign -> 
        rolassign.Role == typekey.UserRole.TC_SENSITIVECLAIM 
        or rolassign.Role == typekey.UserRole.TC_TEMPCLAIMEDITOR 
        or rolassign.Role == typekey.UserRole.TC_TRANSFERCLAIM 
        or rolassign.Role == typekey.UserRole.TC_SECUREADJUSTER
        or rolassign.Role == typekey.UserRole.TC_CORPORATEACCOUNT);
      
     print("isSecure="+isSecure);
     print("isNotSecure="+isNotSecure);
     if (isSecure == showSecure || !showSecure == isNotSecure) list.add(ClaimUserModel);
    }
     return list.toTypedArray()
  }
  
//----------------------------------------------------------------------------

  private static function getAllChildGroups(g:Group, list:ArrayList<Group>) {
    if (g == null) return;
    list.add(g);
    for (var c in g.ChildGroups) {
      if(c.GroupType == GroupType.TC_TPA || c.GroupType == GroupType.TC_TPAPROCESSING) continue;
      getAllChildGroups(c, list);
    }
  }

  private static function findAllClaimsMatching(claimsBusinessUnits:Set<Group>, exclude:SecurityZone):Query<Claim> {
    var children = new ArrayList<Group>();
    for (var g in claimsBusinessUnits) {
      getAllChildGroups(g, children)
    }
    
    var q = Query.make(Claim);
    filterOutClosedSuspendedAndCoverageSecureClaims(q, true);
    q.compareIn("AssignedGroup", children.toTypedArray());
    filterOutPBUAndCBUClaims(q, exclude);
    
    return q;
  }
  
  private static function filterOutPBUAndCBUClaims(q:Query<Claim>, exclude:SecurityZone) {
    if (exclude == null) return;
    //check the claims business unit
    q.and(\ a2 -> {
      a2.or(\ o -> {
        o.and(\ a -> {
          a.compare("PermissionRequired", Equals, ClaimSecurityType.TC_UNSECUREDCLAIM);
          var g = a.subselect("AssignedGroup", CompareIn, Group, "ID");
          g.compare("ID", Equals, q.getColumnRef("AssignedGroup"));
          g.compare("SecurityZone", NotEquals, exclude);
        });
      
        o.compare("PermissionRequired", NotEquals, ClaimSecurityType.TC_UNSECUREDCLAIM);
      
      });
    });
    
    q.and(\ a -> {
      a.or(\ o -> {
        o.and(\ aOldPBU -> {
          //for the old way for finding producing business unit
          var p = aOldPBU.subselect("Policy", CompareIn, Policy, "ID");
          p.compare("ID", Equals, aOldPBU.getColumnRef("Policy"));
          var ag = p.join("ex_Agency");
          
          ag.or(\ o2 -> {
            o2.compare("ProducingBusinessUnitExt", Equals, null);
            var gaibu = o2.subselect("ProducingBusinessUnitExt", CompareIn, GAIBusinessUnitExt, "ID");
            gaibu.compare("ID", Equals, o2.getColumnRef("ProducingBusinessUnitExt"));
            gaibu.compare("BusinessUnit", Equals, null);
          });
          
          //check the producing business unit
          var smv = aOldPBU.subselect("NCWOnlyBusinessUnitExt", CompareIn, SecureManageValuesExt, "BusinessUnitExt");
          smv.compare("BusinessUnitExt", Equals, aOldPBU.getColumnRef("NCWOnlyBusinessUnitExt"));
          var g = smv.join("ProducingUnitExt");
          g.compare("SecurityZone", NotEquals, exclude);
        });
        o.and(\ aNewPBU -> {
          //for the new way for finding the producing business unit
          var p = aNewPBU.subselect("Policy", CompareIn, Policy, "ID");
          p.compare("ID", Equals, aNewPBU.getColumnRef("Policy"));
          var ag = p.join("ex_Agency");
          var gaibu = ag.join("ProducingBusinessUnitExt");
          
          //check the producing business unit
          var smv = gaibu.subselect("BusinessUnit", CompareIn, SecureManageValuesExt, "BusinessUnitExt");
          smv.compare("BusinessUnitExt", Equals, gaibu.getColumnRef("BusinessUnit"));
          var g = smv.join("ProducingUnitExt");
          g.compare("SecurityZone", NotEquals, exclude);
          
        });
      });
    });
  }
  
  private static function filterOutClosedSuspendedAndCoverageSecureClaims(q:Query<Claim>, excludeCoverageSecure:boolean) {
    q.compare("State", Equals, typekey.ClaimState.TC_OPEN);
    if (excludeCoverageSecure) q.compare("PermissionRequired", NotEquals, ClaimSecurityType.TC_COVERAGESECURE);
    var e = q.subselect("ID", compareNotIn, Exposure,"Claim");
    e.compare("ReconnectFailExt", Equals, True);
    e.compare("Claim", Equals, q.getColumnRef("ID"));
  }
  
  private static function findAllClaimsMatching(profitCenterGroups:Set<ProfitCenterGroupingExt>, exclude:SecurityZone):Query<Claim> {
    var pcs = profitCenterGroups*.ProfitCenterItemExt*.ProfitCenter
    var bus = profitCenterGroups*.BusinessUnitItemExt*.BusinessUnit;
    if (pcs.IsEmpty and bus.IsEmpty) return null;
    return findAllClaimsMatching(pcs, bus, exclude);
  }

  private static function getOriginalValue<E>(bean:KeyableBean, field:String, t:Type<E>):E {
    var o = bean.getOriginalValue(field);
    if (o == null) return null;
    if (o typeis Key) {
      return bean.Bundle.loadByKey(o) as E;
    } else {
      return o as E;
    }
  }

  public static function updateAllClaimsForSecurityZoneChange(z: SecurityZone){
    print("updateAllClaimsForSecurityZoneChange()");
    //todo this probably needs to handle if the securityzone is external or not/if the type has been changed then everything is removed or added
    if (z.IsSecurityZoneTPAExt == null ||  !z.IsSecurityZoneTPAExt) return;
    
    //adding them to a set first removes any duplicates they may have entered
    var addedPC = new HashSet<ProfitCenterGroupingExt>();
    var removedPC = new HashMap<ProfitCenterGroupingExt, List<ProfitCenterSecurityFilterExt>>();
    var addedCBU = new HashSet<Group>();
    var removedCBU = new HashMap<Group, List<ClaimsBusinessUnitSecurityFilterExt>>();

    //removed
    for (var srv in z.getRemovedArrayElements("SecurityFilters") as SecurityFilterExt[]) {
      if (srv typeis ProfitCenterSecurityFilterExt) {
        var list = removedPC.get(srv.ProfitCenterGrouping);
        if (list == null) {
          list = new ArrayList<ProfitCenterSecurityFilterExt>();
          removedPC.put(srv.ProfitCenterGrouping, list);
        }
        list.add(srv);
      } else if (srv typeis ClaimsBusinessUnitSecurityFilterExt) {
        var list = removedCBU.get(srv.ClaimsBusinessUnit);
        if (list == null) {
          list = new ArrayList<ClaimsBusinessUnitSecurityFilterExt>();
          removedCBU.put(srv.ClaimsBusinessUnit, list);
        }
        list.add(srv);
      }
    }

    //added
    for (var srv in z.getAddedArrayElements("SecurityFilters") as SecurityFilterExt[]) {
      if (srv typeis ProfitCenterSecurityFilterExt) {
        addedPC.add(srv.ProfitCenterGrouping);
      } else if (srv typeis ClaimsBusinessUnitSecurityFilterExt) {
        addedCBU.add(srv.ClaimsBusinessUnit);
      }
    }
  
    //changed
    for (var srv in z.getChangedArrayElements("SecurityFilters") as SecurityFilterExt[]) {
      if (srv typeis ProfitCenterSecurityFilterExt) {
        addedPC.add(srv.ProfitCenterGrouping);
        {//remove
          var opc = getOriginalValue(srv, "ProfitCenterGrouping", ProfitCenterGroupingExt);
          var list = removedPC.get(opc);
          if (list == null) {
            list = new ArrayList<ProfitCenterSecurityFilterExt>();
            removedPC.put(opc, list);
          }
          list.add(srv);
        }
      } else if (srv typeis ClaimsBusinessUnitSecurityFilterExt) {
        addedCBU.add(srv.ClaimsBusinessUnit);
        {//remove
          var opc = getOriginalValue(srv, "ClaimsBusinessUnit", Group);
          var list = removedCBU.get(opc);
          if (list == null) {
            list = new ArrayList<ClaimsBusinessUnitSecurityFilterExt>();
            removedCBU.put(opc, list);
          }
          list.add(srv);
        }
      }
    }
  
    //get rid of adds that are deletes?
    var commonPC = removedPC.Keys.intersect(addedPC)
    addedPC.removeAll(commonPC)
    removedPC.keySet().removeAll(commonPC)
    
    var commonCBU = removedCBU.Keys.intersect(addedCBU);
    addedCBU.removeAll(commonCBU);
    removedCBU.keySet().removeAll(commonCBU);
    
    var removeFromClaims:Query<Claim> = null;
    
    if (!removedPC.Empty) {
      removeFromClaims = findAllClaimsMatching(removedPC.Keys, z);
    }
    
    if (!removedCBU.Empty) {
      var q = findAllClaimsMatching(removedCBU.Keys, z);
      if (removeFromClaims == null) {
        removeFromClaims = q;
      } else {
        var q2 = Query.make(Claim);
        q2.or(\ o -> {
          o.subselect("ID", CompareIn, q, "ID");
          o.subselect("ID", CompareIn, removeFromClaims, "ID");
        });
        removeFromClaims = q2;
      }
    }
    
    var addToClaims:Query<Claim> = null;
    
    if (!addedPC.Empty) {
      addToClaims = findAllClaimsMatching(addedPC, z);
    }
    
    if (!addedCBU.Empty) {
      var q = findAllClaimsMatching(addedCBU, z);
      if (addToClaims == null) {
        addToClaims = q;
      } else {
        var q2 = Query.make(Claim);
        q2.or(\ o -> {
          o.subselect("ID", CompareIn, q, "ID");
          o.subselect("ID", CompareIn, addToClaims, "ID");
        });
        addToClaims = q2;
      }
    }
    
    
    //do the actual work
    if (removeFromClaims != null) {
      var user = z.GenericUserExt;
      var group = user.GroupUsers[0].Group;
      var q = removeFromClaims.select(); //this could be optimized to not remove things that are going to be re-added, using a compareNotIn, but you'd need to clone the query somehow
      
      for (var c in q) {
        if (grantedByAnotherFilter(c, user, null, null, flatten(removedPC.Values), flatten(removedCBU.Values))) continue;
        //c = z.Bundle.add(c) //now being processed in SyncSecurityZonesBatch.gs
        /* using the model
        var model = UserUtils.getClaimUserModelIfExist(c, group, user);
        var r = model.UserRoleAssignments.firstWhere(\ r -> r.Role == typekey.UserRole.TC_TRANSFERCLAIM); //we only want to remove the same type that we added above
        */
        //not using the model, prob faster
        print("Removing pc for " +  c.ClaimNumber)
        removeUserFromClaim(c, user, group, typekey.UserRole.TC_TRANSFERCLAIM);
      }
    }
  
/*script used when we ran script tool, can be used if new batch process does not work*/
//        var processedCount = 0
//        var errorcount = 0
//        var c = q.keyIterator()
//        while (c.hasNext()){
//          var claim : Claim
//          try {
//          gw.transaction.Transaction.runWithNewBundle(\ innerBundle -> {
//            claim = innerBundle.loadByKey(c.next()) as Claim
//            gw.api.util.Logger.logInfo("removeUserFromClaim (" + processedCount + "/" + errorCount + "): " + claim.ClaimNumber)
//            removeUserFromClaim(claim, user, group, typekey.UserRole.TC_TRANSFERCLAIM);
//          })
//          processedCount++
//           } catch(e) {
//             e.printStackTrace() 
//             errorcount++
//           }
//           java.lang.Thread.sleep(10)
//           gw.api.util.Logger.logInfo("Script finished with processed/error: " + processedCount + "/" + errorcount)
//        }
//    }

   
    if (addToClaims != null) {
      var user = z.GenericUserExt;
      var group = user.GroupUsers[0].Group;
      var q = addToClaims.select();
      
      for (var c in q) {
        //c = z.Bundle.add(c) //now being processed in SyncSecurityZonesBatch.gs
        print("Adding pc for " +  c.ClaimNumber)
        addUserToClaim(c, user, group, typekey.UserRole.TC_TRANSFERCLAIM);
        //this may already trip the pre-update rule that rebuilds the claim, so this may not be necessary: c.rebuildClaimACL();
      }
    }
  } //end of function updateAllClaimsForSecurityZoneChange()
      
/*script used when we ran script tool, can be used if new batch process does not work*/
//        var processedCount = 0
//        var errorCount = 0
//        var c = q.keyIterator()
//        while(c.hasNext()){
//          var claim : Claim
//          try {
//            gw.transaction.Transaction.runWithNewBundle(\ innerBundle -> {
//              claim = innerBundle.loadByKey(c.next()) as Claim
//              gw.api.util.Logger.logInfo("addUserToClaim (" + processedCount + "/" + errorCount + "): " + claim.ClaimNumber)
//              addUserToClaim(claim, user, group, typekey.UserRole.TC_TRANSFERCLAIM)
//            })
//            processedCount++
//           } catch(e) {
//             e.printStackTrace() 
//             errorCount++
//           }
//           java.lang.Thread.sleep(10)
//           gw.api.util.Logger.logInfo("Script finished with processed/error: " + processedCount + "/" + errorCount)
//        }
//    }
//  } //end of function updateAllClaimsForSecurityZoneChange()
 
//----------------------------------------------------------------------------

  private static function findAllClaimsMatching(profitCenters:String[], businessUnits:BusinessUnitExt[], exclude:SecurityZone):Query<Claim> {
    var q = Query.make(Claim);
    filterOutClosedSuspendedAndCoverageSecureClaims(q, true);
    q.or(\ o -> {
      if (profitCenters != null and profitCenters.length != 0) {
        var p = o.subselect("Policy", CompareIn, Policy, "ID");
        p.compare("ID", Equals, q.getColumnRef("Policy"));
        var profitcenter = p.join("ex_Agency");
        profitcenter.compareIn("ex_AgencyProfitCenter", profitCenters.where(\ s -> s != null and !s.Empty));
      }
    
      if (businessUnits != null and businessUnits.length != 0) {
        o.and(\ aOldPBU -> {
          //for the old way for finding producing business unit
          var p = aOldPBU.subselect("Policy", CompareIn, Policy, "ID");
          p.compare("ID", Equals, aOldPBU.getColumnRef("Policy"));
          var ag = p.join("ex_Agency");
          
          ag.or(\ o2 -> {
            o2.compare("ProducingBusinessUnitExt", Equals, null);
            var gaibu = o2.subselect("ProducingBusinessUnitExt", CompareIn, GAIBusinessUnitExt, "ID");
            gaibu.compare("ID", Equals, o2.getColumnRef("ProducingBusinessUnitExt"));
            gaibu.compare("BusinessUnit", Equals, null);
          });
          
          //check the producing business unit
          aOldPBU.compareIn("NCWOnlyBusinessUnitExt", businessUnits.where(\ b -> b != null));
        });
        o.and(\ aNewPBU -> {
          //for the new way for finding the producing business unit
          var p = aNewPBU.subselect("Policy", CompareIn, Policy, "ID");
          p.compare("ID", Equals, aNewPBU.getColumnRef("Policy"));
          var ag = p.join("ex_Agency");
          var gaibu = ag.join("ProducingBusinessUnitExt");
          gaibu.compare("BusinessUnit", NotEquals, null);
          
          //check the producing business unit
          gaibu.compareIn("BusinessUnit", businessUnits.where(\ b -> b != null));
        });
      }
    });
    filterOutPBUAndCBUClaims(q, exclude);
    return q;
  }

  public static function updateAllClaimsForProfitCenterChange(pcg:ProfitCenterGroupingExt) {
    print("updateAllClaimsForProfitCenterChange()");
    if (pcg == null) return;
    
    //adding them to a set first removes any duplicates they may have entered
    var addedPC = new HashSet<String>();
    var removedPC = new HashMap<String, List<ProfitCenterItemExt>>();
    var addedBU = new HashSet<BusinessUnitExt>();
    var removedBU = new HashMap<BusinessUnitExt, List<BusinessUnitItemExt>>();
    
    //removed
    for (var pci in pcg.getRemovedArrayElements("ProfitCenterItemExt") as ProfitCenterItemExt[]) {
      var list = removedPC.get(pci.ProfitCenter);
      if (list == null) {
        list = new ArrayList<ProfitCenterItemExt>();
        removedPC.put(pci.ProfitCenter, list);
      }
      list.add(pci);
    }
    for (var bui in pcg.getRemovedArrayElements("BusinessUnitItemExt") as BusinessUnitItemExt[]) {
      var list = removedBU.get(bui.BusinessUnit);
      if (list == null) {
        list = new ArrayList<BusinessUnitItemExt>();
        removedBU.put(bui.BusinessUnit, list);
      }
      list.add(bui);
    }

    //added
    for (var pci in pcg.getAddedArrayElements("ProfitCenterItemExt") as ProfitCenterItemExt[]) {
      addedPC.add(pci.ProfitCenter);
    }
    for (var bui in pcg.getAddedArrayElements("BusinessUnitItemExt") as BusinessUnitItemExt[]) {
      addedBU.add(bui.BusinessUnit);
    }
  
    //changed
    for (var pci in pcg.getChangedArrayElements("ProfitCenterItemExt") as ProfitCenterItemExt[]) {
      addedPC.add(pci.ProfitCenter);
      {//remove
        var opc = getOriginalValue(pci, "ProfitCenter", String);
        var list = removedPC.get(opc);
        if (list == null) {
          list = new ArrayList<ProfitCenterItemExt>();
          removedPC.put(opc, list);
        }
        list.add(pci);
      }
    }
    for (var bui in pcg.getChangedArrayElements("BusinessUnitItemExt") as BusinessUnitItemExt[]) {
      addedBU.add(bui.BusinessUnit);
      {//remove
        var obu = getOriginalValue(bui, "BusinessUnit", BusinessUnitExt);
        var list = removedBU.get(obu);
        if (list == null) {
          list = new ArrayList<BusinessUnitItemExt>();
          removedBU.put(obu, list);
        }
        list.add(bui);
      }
    }
    
    //get rid of adds that are deletes?
    var commonPC = removedPC.Keys.intersect(addedPC)
    addedPC.removeAll(commonPC)
    removedPC.keySet().removeAll(commonPC)
    
    var commonCBU = removedBU.Keys.intersect(addedBU);
    addedBU.removeAll(commonCBU);
    removedBU.keySet().removeAll(commonCBU);
    
    var zones = Query.make(SecurityZone);
    zones.compare("IsSecurityZoneTPAExt", Equals, true);
    var pcsf = zones.join(ProfitCenterSecurityFilterExt, "SecurityZone").cast(ProfitCenterSecurityFilterExt);
    pcsf.compare("ProfitCenterGrouping", Equals, pcg);
    
    for (var zone in zones.select()) {
      var user = zone.GenericUserExt;
      var group = user.GroupUsers[0].Group;
      
      if (!removedPC.Empty || !removedBU.Empty) {
        for (var c in findAllClaimsMatching(removedPC.Keys.toTypedArray(), removedBU.Keys.toTypedArray(), zone).select()) {
          if (grantedByAnotherFilter(c, user, flatten(removedPC.Values), flatten(removedBU.Values), null, null)) continue;
          //c = pcg.Bundle.add(c) //now being processed in SyncSecurityZonesBatch.gs
          //not using the model, prob faster
          print("Removing pc for " +  c.ClaimNumber)
          removeUserFromClaim(c, user, group, typekey.UserRole.TC_TRANSFERCLAIM);
        }
      }
      
/*script used when we ran script tool, can be used if new batch process does not work*/
//      if (!removedPC.Empty || !removedBU.Empty) {
//        var processedCount = 0
//        var errorCount = 0
//        var c = findAllClaimsMatching(removedPC.Keys.toTypedArray(), removedBU.Keys.toTypedArray(), zone).select().keyIterator()
//        while (c.hasNext()){
//          var claim : Claim
//          try {
//            gw.transaction.Transaction.runWithNewBundle(\ innerBundle -> {
//              claim = innerBundle.loadByKey(c.next()) as Claim
//              gw.api.util.Logger.logInfo("removeUserFromClaim (" + processedCount + "/" + errorCount + "): " + claim.ClaimNumber)
//              removeUserFromClaim(claim, user, group, typekey.UserRole.TC_TRANSFERCLAIM);
//            })
//            processedCount++
//           } catch(e) {
//             e.printStackTrace() 
//             errorCount++
//           }
//           java.lang.Thread.sleep(10)
//           gw.api.util.Logger.logInfo("Script finished with processed/error: " + processedCount + "/" + errorCount)
//        }
//      }

      if (!addedPC.Empty || !addedBU.Empty) {
        for (var c in findAllClaimsMatching(addedPC.toTypedArray(), addedBU.toTypedArray(), zone).select()) {
          //c = pcg.Bundle.add(c) //now being processed in SyncSecurityZonesBatch.gs
          print("Adding pc for " +  c.ClaimNumber)
          addUserToClaim(c, user, group, typekey.UserRole.TC_TRANSFERCLAIM);
          //this may already trip the pre-update rule that rebuilds the claim, so this may not be necessary: c.rebuildClaimACL();
        }
      }
    }// end of var zone
  }//end of function updateAllClaimsForProfitCenterChange

/*script used when we ran script tool, can be used if new batch process does not work*/  
//      if (!addedPC.Empty || !addedBU.Empty) {
//        var processedCount = 0
//        var errorCount = 0
//        var c = findAllClaimsMatching(addedPC.toTypedArray(), addedBU.toTypedArray(), zone).select().keyIterator()
//        while (c.hasNext()){
//          var claim : Claim
//          try {
//            gw.transaction.Transaction.runWithNewBundle(\ innerBundle -> {
//              claim = innerBundle.loadByKey(c.next()) as Claim
//              gw.api.util.Logger.logInfo("addUserToClaim (" + processedCount + "/" + errorCount + "): " + claim.ClaimNumber)
//              addUserToClaim(claim, user, group, typekey.UserRole.TC_TRANSFERCLAIM);
//            })
//            processedCount++
//           } catch(e) {
//             e.printStackTrace() 
//             errorCount++
//           }
//           java.lang.Thread.sleep(10)
//           gw.api.util.Logger.logInfo("Script finished with processed/error: " + processedCount + "/" + errorCount)
//        }
//      }
//    }// end of var zone
//  }//end of function updateAllClaimsForProfitCenterChange
//      
  
  //----------------------------------------------------------------------------------------//
  public static function updateAllClaimsForUserChange(u:User) {
    //print("updateAllClaimsForUserChange()");
    if (u == null) return;
    var corpaccountrole = find(var r in Role where r.Name == "Corporate Accounts").AtMostOneRow
    if(corpaccountrole == null) return
    
    //adding them to a set first removes any duplicates they may have entered
    var added = new HashSet<Role>();
    var removed = new HashSet<Role>();
    
    //removed
    for (var ur in u.getRemovedArrayElements("Roles") as UserRole[]) {
      removed.add(ur.Role);
    }

    //added
    for (var ur in u.getAddedArrayElements("Roles") as UserRole[]) {
      added.add(ur.Role);
    }
  
    //changed
    for (var ur in u.getChangedArrayElements("Roles") as UserRole[]) {
      added.add(ur.Role);
      var role = getOriginalValue(ur, "Role", Role);
      removed.add(role);
    }
    
    //get rid of adds that are deletes?
    var common = removed.intersect(added);
    added.removeAll(common);
    removed.removeAll(common);
    
      
    var q = Query.make(Claim)
    filterOutClosedSuspendedAndCoverageSecureClaims(q, false);
    var p = q.join("Policy")
    p.subselect("PolicyNumber", comparein, CorporateAccountPolicyExt, "PolicyNumber")
    
    for(var c in q.select()){
      //c = u.Bundle.add(c) //now being processed in SyncSecurityZonesBatch.gs
      if(!removed.Empty and removed.contains(corpaccountrole)){
        //need to remove this user from all corp account claims
        removeUserFromClaim(c, u, u.GroupUsers[0].Group, typekey.UserRole.TC_CORPORATEACCOUNT);
      }
      
      if(!added.Empty and added.contains(corpaccountrole)){
        //need to add this user to all corp account claims
        addUserToClaim(c, u,u.GroupUsers[0].Group, typekey.UserRole.TC_CORPORATEACCOUNT)
      }
    }

  }
  //----------------------------------------------------------------------------------------------//
  static function updateClaim(claim:Claim){
    print("updateClaim()");
    
    if (claim.Policy.New || claim.Policy.isFieldChanged("ProducerCode")){
      setInitialSecurityTypeValue(claim)
    }
   
    var producingZone = findProducingZone(claim);
    var handlingZone = claim.AssignedGroup.SecurityZone;

    //clear the existing records
    var current = getCurrentRoles(claim);
    var newRoles = new java.util.HashMap<User, java.util.Set<typekey.UserRole>>();

    var secure = (claim.PermissionRequired == typekey.ClaimSecurityType.TC_SECURECLAIM || claim.PermissionRequired == typekey.ClaimSecurityType.TC_SECUREEXTERNAL);
    var coverageSecure = (claim.PermissionRequired == typekey.ClaimSecurityType.TC_COVERAGESECURE);
    var unsecure = (!secure and !coverageSecure);
    var needToAddAdjusterPlusTwo = false;

    if (isClaimCorporateAccount(claim.Policy.PolicyNumber)) {
        var users = findAllCorporateAccountsUsers()
        for (var user in users) {
          addUserRoleToMap(newRoles, user, typekey.UserRole.TC_CORPORATEACCOUNT)
        }
    }

    if (unsecure) {
      { //add generic users for all zones which can see into unsecure
        var users = findAllGenericUsersWhichCanSeeUnsecuredClaims({producingZone, handlingZone});
        for (var user in users) {
          addUserRoleToMap(newRoles, user, typekey.UserRole.TC_SENSITIVECLAIM)
        }
      }
    }

    if (coverageSecure) {
      needToAddAdjusterPlusTwo = true;
    } else {
      //not coverage secure
      if (producingZone != handlingZone) {
        //is transfered
        { //add the generic user for the producing zone
          var genuser = producingZone.GenericUserExt;
          addUserRoleToMap(newRoles, genuser, typekey.UserRole.TC_TRANSFERCLAIM)
        }
        if (secure) {
          claim.PermissionRequired = "secureexternal";
          needToAddAdjusterPlusTwo = true;
        }
      } else {
        //not transferred
        if (secure) {
          claim.PermissionRequired = "secureclaim";
        }
      }
  
      //I'm going to assume that we don't add TPAs for coverage secure, so I'm moved this code inside the else  
      { //add any generic users for profit center access
        var users = findAllGenericUsersRelatedByFilters(claim, producingZone);
        for (var user in users) {
          var group = user.GroupUsers[0].Group;
          if(unsecure and group.SecurityZone == handlingZone) continue //so back to the for loop
          addUserRoleToMap(newRoles, user, typekey.UserRole.TC_TRANSFERCLAIM)
        }
      }
    }

    if (needToAddAdjusterPlusTwo) {
      //add the adjuster and 2 supervisors ONLY
      var adjuster = claim.AssignedUser;
      var user = util.user.GroupsHelper.getDirectSupervisor(adjuster);
      var supervisor = util.user.GroupsHelper.getDirectSupervisor(user);
      addUserRoleToMap(newRoles, user, typekey.UserRole.TC_SENSITIVECLAIM)
      if (supervisor != null and user != supervisor) {
        //for top level people, they are they're own supervisor....
        addUserRoleToMap(newRoles, supervisor, typekey.UserRole.TC_SENSITIVECLAIM)
      }
      addUserRoleToMap(newRoles, adjuster, typekey.UserRole.TC_SECUREADJUSTER)
    }
    
      
    resolveUserRoles(current, newRoles, claim);
    
    purgeItemsFromBatchProcess(claim);
        
  }
  
  /*This will remove any items for the current claim so batch process does not try to process things it does not need to*/
  static function purgeItemsFromBatchProcess(claim :Claim){
    var q = Query.make(SecurityBatchItemExt)
      q.compare("Claim", Equals, claim)
      for (var item in q.select()) {
        item = claim.Bundle.add(item)
        item.remove()
      }
  }
  
  /* 3/10/15 Gets the proper claim security types(permissionRequired) for the proper Business Unit */
   static function getValueRange(claim:Claim):ClaimSecurityType[] {
     var producingZone = util.admin.SecurityUtil.findProducingZone(claim);
     var corpaccnts = util.admin.SecurityUtil.isClaimCorporateAccount(claim.Policy.PolicyNumber)
     if (corpaccnts)
       return {ClaimSecurityType.TC_COVERAGESECURE};
        if (producingZone.Name.toLowerCase().containsIgnoreCase("default security zone") and claim.LossType == typekey.LossType.TC_OMAVALON){
          return {ClaimSecurityType.TC_UNSECUREDCLAIM};
          }else if (producingZone.Name.toLowerCase().containsIgnoreCase("default security zone")) {
            return {ClaimSecurityType.TC_UNSECUREDCLAIM, ClaimSecurityType.TC_COVERAGESECURE};
          } else {
            return {ClaimSecurityType.TC_SECURECLAIM};
          }
    }
  /* 1/16/16 sets the proper claim Security Type based on the getValueRange() */
   static function setInitialSecurityTypeValue (claim:Claim){
     var x = getValueRange(claim)
     if (x.contains(claim.PermissionRequired)) return
       if (x.length >= 1){
         claim.PermissionRequired = x[0]
       }
   }
    
//----------------------------------------------------------------------------
  
  public static function updateAllClaimsForCorporateAccountChange() {
    print("updateAllClaimsForCorporateAccountChange()");
    var bundle = gw.transaction.Transaction.getCurrent();
    
    //adding them to a set first removes any duplicates they may have entered
    var added = new HashSet<String>();
    var removed = new HashSet<String>();
    
    for (var b in bundle.getInsertedBeansOfType(CorporateAccountPolicyExt)) {
      if (b.PolicyNumber == null) continue;
      added.add(b.PolicyNumber);
    }
    
    for (var b in bundle.getRemovedBeansOfType(CorporateAccountPolicyExt)) {
      if (b.PolicyNumber == null) continue;
      removed.add(b.PolicyNumber);
    }
    
    for (var b in bundle.getUpdatedBeansOfType(CorporateAccountPolicyExt)) {
      if (b.PolicyNumber != null) {
        added.add(b.PolicyNumber);
      }
      var original:String = getOriginalValue(b, "PolicyNumber", String);
      if (original != null) {
        removed.add(original);
      }
    }
    
    //get rid of adds that are deletes?
    var common = removed.intersect(added);
    added.removeAll(common);
    removed.removeAll(common);
    
    if (!removed.Empty) {
      var q = Query.make(Claim);
      filterOutClosedSuspendedAndCoverageSecureClaims(q, false);
      var p = q.join("Policy");
      p.compareIn("PolicyNumber", removed.toTypedArray());
      
      for (var claim in q.select()) {
        //claim = bundle.add(claim); //now being processed in SyncSecurityZonesBatch.gs
        var users = findAllCorporateAccountsUsers();
        for (var user in users) {
          removeUserFromClaim(claim, user, user.GroupUsers[0].Group, typekey.UserRole.TC_CORPORATEACCOUNT);
        }
      }
    }
    
    if (!added.Empty) {
      var q = Query.make(Claim);
      filterOutClosedSuspendedAndCoverageSecureClaims(q, false);
      var p = q.join("Policy");
      p.compareIn("PolicyNumber", added.toTypedArray());

      for (var claim in q.select()) {
        if (claim.PermissionRequired != ClaimSecurityType.TC_COVERAGESECURE) {
          //This has to be in a separate bundle, since if the claim pre-update rules run now it will clobber change we're currently trying to commit.
          gw.transaction.Transaction.runWithNewBundle(\ bundle2 -> {
            var claim2 = bundle2.add(claim);
            claim2.PermissionRequired = ClaimSecurityType.TC_COVERAGESECURE;
          })
        }
      }
      for (var claim in q.select()) {
        //claim = bundle.add(claim); //now being processed in SyncSecurityZonesBatch.gs
        var users = findAllCorporateAccountsUsers();
        for (var user in users) {
          print("----Adding user: "+user+" to corp account on claim "+claim.ClaimNumber);
          addUserToClaim(claim, user, user.GroupUsers[0].Group, typekey.UserRole.TC_CORPORATEACCOUNT);
        }
      }
    }
  }

//----------------------------------------------------------------------------------------------------------------

  private static function flatten<E>(col:Collection<Collection<E>>):Collection<E> {
    var list = new ArrayList<E>();
    for (var c in col) {
      list.addAll(c);
    }
    return list;
  }

  private static function grantedByAnotherFilter(c:Claim, user:User, removedPC:Collection<ProfitCenterItemExt>, removedBU:Collection<BusinessUnitItemExt>, removedPCG:Collection<ProfitCenterSecurityFilterExt>, removedCBU:Collection<ClaimsBusinessUnitSecurityFilterExt>):boolean {
    var producingZone = findProducingZone(c);
    var handlingZone = c.AssignedGroup.SecurityZone;

    //not coverage secure
    if (producingZone != handlingZone and c.PermissionRequired != ClaimSecurityType.TC_COVERAGESECURE and user == producingZone.GenericUserExt) {
      //transferred
      return true;
    }

    { //profit center grouping
      {
        var pci = Query.make(ProfitCenterItemExt);
        var pcg = pci.join("ProfitCenterGrouping");
        var pcsf = pcg.join(ProfitCenterSecurityFilterExt, "ProfitCenterGrouping");
        if (removedPCG != null and !removedPCG.Empty) {
          pcsf.compareNotIn("ID", removedPCG.toTypedArray());
        }
        var sz = pcsf.join("SecurityZone");
        sz.compare("IsSecurityZoneTPAExt", equals, true);
        pci.compare("ProfitCenter", equals, c.Policy.ex_Agency.ex_AgencyProfitCenter);
        sz.compare("GenericUserExt", Equals, user);
        if (removedPC != null and !removedPC.Empty) {
          pci.compareNotIn("ID", removedPC.toTypedArray());
        }
        if (!pci.select().Empty) return true;
      }
  
      {
        var bui = Query.make(BusinessUnitItemExt);
        var pcg = bui.join("ProfitCenterGrouping");
        var pcsf = pcg.join(ProfitCenterSecurityFilterExt, "ProfitCenterGrouping");
        if (removedPCG != null and !removedPCG.Empty) {
          pcsf.compareNotIn("ID", removedPCG.toTypedArray());
        }
        var sz = pcsf.join("SecurityZone");
        sz.compare("IsSecurityZoneTPAExt", equals, true);
        bui.compare("BusinessUnit", equals, c.ProducingBusinessUnitExt);
        sz.compare("GenericUserExt", Equals, user);
        if (removedBU != null and !removedBU.Empty) {
          bui.compareNotIn("ID", removedBU.toTypedArray());
        }
        if (!bui.select().Empty) return true;
      }
    }
    { //claim business unit
      var cbu = Query.make(ClaimsBusinessUnitSecurityFilterExt);
      if (removedCBU != null and !removedCBU.Empty) {
        cbu.compareNotIn("ID", removedCBU.toTypedArray());
      }
      var sz = cbu.join("SecurityZone");
      sz.compare("IsSecurityZoneTPAExt", equals, true);
      cbu.compare("ClaimsBusinessUnit", Equals, c.getClaimBusinessUnitGroup());
      sz.compare("GenericUserExt", Equals, user);
      if (!cbu.select().Empty) return true;
    }
    return false;
  }
  //------------------------------------------------------------------------------------------
  //This method replaces previous method on UserUtils - Defect#7294 Restricting access to Insured and Claimant columns
  static function restrictBasedOnSecurityZoneAndRole(clm:Claim) :boolean{
    var u = gw.plugin.util.CurrentUserUtil.getCurrentUser().User
       return restrictBasedOnSecurityZoneAndRole(clm,u)
  }
   
  static function restrictBasedOnSecurityZoneAndRole(clm:Claim,usr:User) :boolean{
     var CLAIM_TABLE = "Claim"
     var USER_TABLE = "User"
     var PERMISSION_COLUMN = "Permission"
     var SECURITY_ZONE_TABLE = "SecurityZone"
     var ID = "ID"
     var userGroup = GroupsHelper.getUsersGroup(usr)
     var usersSecurityZone = userGroup.SecurityZone

     if(!usr.hasPermission("ignoreacl")){    
       var q = Query.make(Claim)
          q.compare("ID", Equals, clm)         
          q.or(\ or1 ->{
          //User has permission in claim access table to view the claim
            or1.subselect(ID, CompareIn, ClaimAccess, CLAIM_TABLE)
            .compare(USER_TABLE, Relop.Equals, usr)
            .compare(PERMISSION_COLUMN, Relop.Equals, ClaimAccessType.TC_VIEW)                    
            //or User is in a security zone associated with the claim
              or1.subselect(ID, CompareIn, ClaimAccess, CLAIM_TABLE)
              .compare(SECURITY_ZONE_TABLE, Equals, usersSecurityZone)
          })
          //print(q)
          return !q.select().Empty        
     }else{
       return true 
    }
  }
  
  static function retrictCanViewUnsecureButton(z:SecurityZone) {
    if(z.IsSecurityZoneTPAExt==true){
      z.CanSeeUnsecureClaimsExt = false
    }
  }
  
  //---------------------------------------------------------------------------------------------------------------
  
  private static function findAllProfitCenterSecurityFilters(bu:BusinessUnitExt):Query<ProfitCenterSecurityFilterExt> {
    var q = Query.make(ProfitCenterSecurityFilterExt)
    var f = q.cast(ProfitCenterSecurityFilterExt);
    var sz = f.join("SecurityZone");
    sz.compare("IsSecurityZoneTPAExt", equals, true)
    var pcg = f.join("ProfitCenterGrouping");
    var bui = pcg.join(BusinessUnitItemExt, "ProfitCenterGrouping");
    bui.compare("BusinessUnit", equals, bu);
    return q;
  }
  
  private static function findAllClaimsThatNeedUpdated(current:GAIBusinessUnitExt):Query<Claim> {
    var q = Query.make(Claim);
    filterOutClosedSuspendedAndCoverageSecureClaims(q, true);
    var p = q.join("Policy");
    var agency = p.join("ex_Agency");
    agency.compare("ProducingBusinessUnitExt", Equals, current);
    var bu = agency.join("ProducingBusinessUnitExt");
    
    q.or(\ o -> {
      if (current.BusinessUnit != null) {
        //it wasn't null, is not null now, and is different
        o.and(\ a2 -> {
          a2.compare(bu.getColumnRef("BusinessUnit"), NotEquals, current.BusinessUnit);
          a2.compare(bu.getColumnRef("BusinessUnit"), NotEquals, null);
        });
        //it was null, is not null now, and is different
        o.and(\ a2 -> {
          a2.compare(bu.getColumnRef("BusinessUnit"), Equals, null);
          a2.compare(q.getColumnRef("NCWOnlyBusinessUnitExt"), NotEquals, current.BusinessUnit);
        });
      } else {
        //it wasn't null, but is null now, and the previous value didn't match
        o.and(\ a2 -> {
          a2.compare(bu.getColumnRef("BusinessUnit"), NotEquals, null);
          a2.compare(bu.getColumnRef("BusinessUnit"), NotEquals, q.getColumnRef("NCWOnlyBusinessUnitExt"));
        });
      }
      
      //check if the claim is transferred and not coverage secure
      o.and(\ a3 -> {
        var a3p = a3.subselect("Policy", CompareIn, Policy, "ID");
        a3p.compare("ID", Equals, q.getColumnRef("Policy"));
        var a3a = a3p.join("ex_Agency");
        a3a.compare("ProducingBusinessUnitExt", Equals, current);
        var a3bu = a3a.join("ProducingBusinessUnitExt");
        var smv = a3bu.subselect("BusinessUnit", CompareIn, SecureManageValuesExt, "BusinessUnitExt")
        smv.compare("BusinessUnitExt", Equals, a3bu.getColumnRef("BusinessUnit"));
        var pg = smv.join("ProducingUnitExt");
        var cg = pg.subselect("SecurityZone", CompareNotIn, Group, "SecurityZone");
        cg.compare("ID", Equals, q.getColumnRef("AssignedGroup"));
      });
    });
    
    return q;
  }
  
  public static function updateAllClaimsForGAIBusinessUnitChange() {
    print("updateAllClaimsForGAIBusinessUnitChange()");
    var bundle = gw.transaction.Transaction.getCurrent();
    
    var updated = bundle.getUpdatedBeansOfType(GAIBusinessUnitExt);
    for (var up in updated) {
      var originalValue = getOriginalValue(up, "BusinessUnit", BusinessUnitExt);
      var value = up.BusinessUnit;
      if (value == originalValue) continue; //if they're the same, don't do anything, no change
      
      for (var claim in findAllClaimsThatNeedUpdated(up).select()) {
        //claim = bundle.add(claim); //now being processed in SyncSecurityZonesBatch.gs
        var computedOriginal = (originalValue == null)?claim.NCWOnlyBusinessUnitExt:originalValue;
        var computedValue = (value == null)?claim.NCWOnlyBusinessUnitExt:value;
        
        if (computedOriginal != computedValue) {
          //remove the user from the old values
          for (var filter in findAllProfitCenterSecurityFilters(computedOriginal).select()) {
            var user = filter.SecurityZone.GenericUserExt;
            if (grantedByAnotherFilter(claim, user, null, null, {filter}, null)) continue;
            print("Removing "+user+" from "+claim.ClaimNumber);
            removeUserFromClaim(claim, user, user.GroupUsers[0].Group, typekey.UserRole.TC_TRANSFERCLAIM);
          }
        
          //add the user from the new values
          for (var filter in findAllProfitCenterSecurityFilters(computedValue).select()) {
            var user = filter.SecurityZone.GenericUserExt;
            print("Adding "+user+" to "+claim.ClaimNumber);
            addUserToClaim(claim, user, user.GroupUsers[0].Group, typekey.UserRole.TC_TRANSFERCLAIM);
          }
        
          //fix the producing bu if the claims is transferred
          if (claim.PermissionRequired != ClaimSecurityType.TC_COVERAGESECURE) {
            var producingZone = findProducingZone(claim);
            var handlingZone = claim.AssignedGroup.SecurityZone;

            var q = gw.api.database.Query.make(entity.SecurityZone);
            var g = q.join(Group, "SecurityZone");
            var smv = g.join(SecureManageValuesExt, "ProducingUnitExt");
            smv.compare("BusinessUnitExt", equals, computedOriginal);
            var oldProducingZone = q.select().AtMostOneRow;
            
            if (oldProducingZone != producingZone) {
              if (oldProducingZone != handlingZone) {
                //it was transferred
                var user = oldProducingZone.GenericUserExt;
                print("Removing zone generic user "+user+" from "+claim.ClaimNumber);
                removeUserFromClaim(claim, user, user.GroupUsers[0].Group, typekey.UserRole.TC_TRANSFERCLAIM);
              }
          
              if (producingZone != handlingZone) {
                //it's transferred now
                var user = producingZone.GenericUserExt;
                print("Adding zone generic user "+user+" to "+claim.ClaimNumber);
                addUserToClaim(claim, user, user.GroupUsers[0].Group, typekey.UserRole.TC_TRANSFERCLAIM);
              }
            }
          }
        }
      }
      
    }
  }
  
 //-------------------------------------------------------------------------------------------------------------------------------------------
 
  public static function convertBusinessUnitToPRMId(bu:BusinessUnitExt):List<String> {
    var q = Query.make(GAIBusinessUnitExt);
    q.compare("BusinessUnit", Equals, bu);
    var list = new ArrayList<String>();
    for (var gbu in q.select()) {
      list.add(gbu.PRM_ID);
    }
    if (list.Empty) {
      gw.api.util.Logger.logError("Couldn't not find PRM id for TPA with bu: "+ bu);
      list.add("-1");
    }
    return list;
  }
  
  public static function convertBusinessUnitToPRMName(bu:BusinessUnitExt):List<String> {
    var q = Query.make(GAIBusinessUnitExt);
    q.compare("BusinessUnit", Equals, bu);
    var list = new ArrayList<String>();
    for (var gbu in q.select()) {
      list.add(gbu.Name);
    }
    if (list.Empty) {
      gw.api.util.Logger.logError("Couldn't not find PRM id for TPA with bu: "+ bu);
      list.add("Unknown");
    }
    return list;
  }
  
  public static function removePCGIfExternalNo(z: SecurityZone){
    if(z.isFieldChanged("IsSecurityZoneTPAExt")){
      if(z.IsSecurityZoneTPAExt==false and z.getOriginalValue("IsSecurityZoneTPAExt")==true){
        for(var f in z.SecurityFilters){
          f.remove()
        }
      }
    }  
  }
  
} // end SecurityUtil