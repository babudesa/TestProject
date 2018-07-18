package xsd.AdminDataSyncTool

uses typekey.GenderType
uses entity.Credential
uses typekey.ISOAgencyIDExt
uses typekey.NameSuffix
uses xsd.AdminDataSyncTool.Importer
uses entity.GroupRegion
uses entity.Address
uses typekey.NamePrefix
uses typekey.BusinessType
uses entity.UserContact
uses entity.DivisionNameExt
uses entity.GroupUser
uses entity.Organization
uses typekey.LanguageType
uses entity.Contact
uses entity.SecurityZone
uses entity.Person
uses typekey.UserExperienceType
uses entity.User

class UnfinishedMethods {

  function loadOrganization(){
    var organization = new Organization()
    organization.PublicID = null
    organization.Carrier= false
    organization.Contact = null
    organization.MasterAdmin=false
    organization.setNameAndRootGroupName("Default Organization")
    //organization.RootGroup = public-id="cc_systemTables:1"
    organization.Type = null//OrganizationType.TC_CITY
  }
  function loadGroup(){
    var group = new Group()
    group.PublicID = null
    group.Users = null//loadGroupUsers()
    group.CompanyNameExt = null
    group.DivisionNameExt = null
    group.GroupAddressExt = null
    group.GroupType  = null //>general</GroupType>
    group.ISOAgencyIDExt = null
    group.LoadFactor = 100
    group.Name = "Default Root Group"
    group.Organization = null //"public-id="cc_systemTables:1"/>
    group.Parent = null
    group.Regions = null
    group.SecurityZone  = null//public-id="default_data:1"/>
    group.Supervisor  = null//public-id="default_data:1"/>
    group.VisibilityZone  = null
    //group.WorldVisible = true
  }
  function loadGroupUsers() : User[] {
    /*
	<GroupUser public-id="cclu:1">
		<Group public-id="cc_systemTables:1"/>
		<LoadFactor>0</LoadFactor>
		<LoadFactorType/>
		<Manager>false</Manager>
		<Member>true</Member>
		<TextField1/>
		<TextField2/>
		<TextField3/>
		<User public-id="default_data:1"/>
	</GroupUser>
	<GroupUser public-id="cclu:2">
		<Group public-id="cc_systemTables:1"/>
		<LoadFactor>0</LoadFactor>
		<LoadFactorType/>
		<Manager>false</Manager>
		<Member>true</Member>
		<TextField1/>
		<TextField2/>
		<TextField3/>
		<User public-id="cc_systemTables:1"/>
	</GroupUser>
	<GroupUser public-id="cclu:2001">
		<Group public-id="cc_systemTables:1"/>
		<LoadFactor/>
		<LoadFactorType/>
		<Manager>false</Manager>
		<Member>true</Member>
		<TextField1/>
		<TextField2/>
		<TextField3/>
		<User public-id="cclu:2003"/>
	</GroupUser>
	<GroupUser public-id="cclu:2201">
		<Group public-id="cc_systemTables:1"/>
		<LoadFactor/>
		<LoadFactorType/>
		<Manager>false</Manager>
		<Member>true</Member>
		<TextField1/>
		<TextField2/>
		<TextField3/>
		<User public-id="cclu:2103"/>
	</GroupUser>*/
	return null
  }
  function loadSecurityZone(){
  var securityZone = new SecurityZone()
  securityZone.PublicID = null
  securityZone.CanSeeUnsecureClaimsExt = null//>true</CanSeeUnsecureClaimsExt>
  securityZone.Description = null//>Default Security Zone</Description>
  securityZone.GenericUserExt  = null// public-id="cc:12366"/>
  //securityZone.IsSecurityZoneTPAExt = false//>false</IsSecurityZoneTPAExt>
  //securityZone.Name = null//>Default Security Zone</Name>
  }
  
  // TODO: pass a bundle to the function for the load user
  function loadUser(userXSD: xsd.UserModel.User){
    
    //var user : User = User.finder.findUserByUserName(userXSD.Credential.UserName) 
    //if (user == null) user = new User()
    var user : User = new User()
    
      //user.PublicID = userXSD.PublicID
      //user.Attributes = loadAttributes(userXSD)
      //user.AuthorityProfile = loadUserAuthorityProfile(userXSD.AuthorityProfile)
      //user.BackupUsers = loadUserBackupUsers(userXSD)
      user.Contact = Importer.loadUserContact(userXSD.Contact)
      user.Department = userXSD.Department
      
      switch(userXSD.ExperienceLevel){
        case userXSD.ExperienceLevel.high :
          user.ExperienceLevel = UserExperienceType.TC_HIGH
        case userXSD.ExperienceLevel.mid :
          user.ExperienceLevel = UserExperienceType.TC_MID
        case userXSD.ExperienceLevel.low :
          user.ExperienceLevel = UserExperienceType.TC_LOW
      }
        
      user.ExternalUser = userXSD.ExternalUser
      user.JobTitle = userXSD.JobTitle
      
      user.Language = LanguageType.TC_EN_US
          print(5)
		//<NewlyAssignedActivities/>
		//<OffsetStatsUpdateTime/>
		//<Organization public-id="cc_systemTables:1"/>
		//<PolicyType/>
		//<QuickClaim/>
		//<Regions/>
		//<Roles/>
		//<SystemUserType>defaultowner</SystemUserType>
		//<TimeZone/>
		//<UserSettings public-id="cc_systemTables:1"/>
		//<VacationStatus>atwork</VacationStatus>
		//<ValidationLevel/>
		//<ex_Signature/>
		//<ex_TollFreePhone/>
		//<ignoreACLDenormIndExt>false</ignoreACLDenormIndExt>
  }
  /*
  function loadUserAuthorityProfile(authorityProfileXSD: xsd.UserModel.User_AuthorityProfile) : AuthorityLimitProfile{
    var _authorityLimitProfile = new AuthorityLimitProfile()
    _authorityLimitProfile.PublicID = authorityProfileXSD.PublicID
    print("loadUserAuthorityProfile is incomplete")
    
    return _authorityLimitProfile
  }*/
}
//-------------------------------------------------------------------------------------

/*
	<User public-id="cc_systemTables:1">
		<Attributes/>
		<AuthorityProfile/>
		<BackupUsers/>
		<Contact public-id="cc_systemTables:1"/>
		<Credential public-id="cc_systemTables:1"/>
		<Department/>
		<ExperienceLevel/>
		<ExternalUser>false</ExternalUser>
		<JobTitle/>
		<Language/>
		<LossType/>
		<NewlyAssignedActivities/>
		<OffsetStatsUpdateTime/>
		<Organization public-id="cc_systemTables:1"/>
		<PolicyType/>
		<QuickClaim/>
		<Regions/>
		<Roles/>
		<SystemUserType>defaultowner</SystemUserType>
		<TimeZone/>
		<UserSettings public-id="cc_systemTables:1"/>
		<VacationStatus>atwork</VacationStatus>
		<ValidationLevel/>
		<ex_Signature/>
		<ex_TollFreePhone/>
		<ignoreACLDenormIndExt>false</ignoreACLDenormIndExt>
	</User>
	<UserContact public-id="cc_systemTables:1">
		<ABPartyIndExt>false</ABPartyIndExt>
		<AddressBookFingerprint/>
		<AddressBookUID/>
		<Admin/>
		<ArchivePartition/>
		<AutoSync/>
		<BelowThresholdExt/>
		<CMFContactExt>false</CMFContactExt>
		<CategoryScores/>
		<CellPhone/>
		<CellPhoneExt/>
		<ChildSupportOrderExt/>
		<ClaimantFatalityExt>false</ClaimantFatalityExt>
		<CloseDateExt/>
		<CloseIndicatorExt/>
		<ContactAddresses/>
		<ContactEBIExt/>
		<ContactEBIInstExt/>
		<ContactPersonExt/>
		<DateOfBirth/>
		<DateOfDeathExt/>
		<DateOfMedicareEligibleExt/>
		<DeleteFromCMSIndicatorExt/>
		<DependentsExt/>
		<DoingBusinessAsExt/>
		<DominantHandExt/>
		<DriverNumExt/>
		<EducationLevelExt/>
		<EmailAddress1/>
		<EmailAddress2/>
		<EmployeeNumber/>
		<Ex_LoggedInUserID/>
		<Ex_TaxReportingName/>
		<Ex_TaxStatusCode/>
		<EyeColorExt/>
		<FaxPhone/>
		<FirstName>Default</FirstName>
		<FormerName/>
		<FormerVerifiedContactExt>false</FormerVerifiedContactExt>
		<Gender/>
		<GlassesExt/>
		<HICNExt/>
		<HairColorExt/>
		<HeightExt/>
		<HomePhone/>
		<InterpreterReqExt/>
		<LastName>Owner</LastName>
		<LegalCategoryExt/>
		<LegalFNameExt/>
		<LegalLNameExt/>
		<LegalMNameExt/>
		<LicenseNumber/>
		<LicenseState/>
		<LoadRelatedContacts>false</LoadRelatedContacts>
		<LoggedInUserBUNameEXT/>
		<LoggedInUserCompAcctExt/>
		<MaritalStatus/>
		<MedicareEligibleExt/>
		<MiddleName/>
		<Name/>
		<Name2Ext/>
		<Notes/>
		<NumDependents/>
		<NumDependentsU18/>
		<NumDependentsU25/>
		<ObsoletePolicyContactExt>false</ObsoletePolicyContactExt>
		<Occupation/>
		<OrganizationType/>
		<Preferred>false</Preferred>
		<PreferredCurrency/>
		<Prefix/>
		<PrimaryAddress/>
		<PrimaryLanguage/>
		<PrimaryLanguageExt/>
		<PrimaryPhone/>
		<RefuseProvideExt/>
		<Score/>
		<SendPartyToCMSExt/>
		<SpecialtyType/>
		<StopSendPartyToCMSExt/>
		<Suffix/>
		<TaxFilingStatus/>
		<TaxID/>
		<TaxStatus>unconfirmed</TaxStatus>
		<TollFreeNumberExt/>
		<USCitizenExt/>
		<ValidationLevel/>
		<VendorNumber/>
		<VendorType/>
		<VerifiedPolicyContactExt>false</VerifiedPolicyContactExt>
		<W8ReceivedDateExt/>
		<W8ReceivedExt>false</W8ReceivedExt>
		<W9ForwardedExt/>
		<W9Received>false</W9Received>
		<W9ReceivedDate/>
		<W9ValidFrom/>
		<W9ValidTo/>
		<WeightExt/>
		<WithholdingRate/>
		<WorkPhone/>
		<driverStatusExt/>
		<ex_CloseDate/>
	</UserContact>
	<Credential public-id="cc_systemTables:1">
		<Active>false</Active>
		<FailedAttempts>0</FailedAttempts>
		<FailedTime/>
		<LockDate/>
		<Password>PPNxQmp1UdWbZrn2G1Tj8+w01rI=</Password>
		<UserName>defaultowner</UserName>
	</Credential>
	<Organization public-id="cc_systemTables:1">
		<Carrier>false</Carrier>
		<Contact/>
		<MasterAdmin>false</MasterAdmin>
		<Name>Default Organization</Name>
		<RootGroup public-id="cc_systemTables:1"/>
		<Type>agency</Type>
	</Organization>
	<Group public-id="cc_systemTables:1">
		<CompanyNameExt/>
		<DivisionNameExt/>
		<GroupAddressExt/>
		<GroupType>general</GroupType>
		<ISOAgencyIDExt/>
		<LoadFactor>100</LoadFactor>
		<Name>Default Root Group</Name>
		<Organization public-id="cc_systemTables:1"/>
		<Parent/>
		<Regions/>
		<SecurityZone public-id="default_data:1"/>
		<Supervisor public-id="default_data:1"/>
		<Users>
			<GroupUser public-id="cclu:1">
				<Group public-id="cc_systemTables:1"/>
				<LoadFactor>0</LoadFactor>
				<LoadFactorType/>
				<Manager>false</Manager>
				<Member>true</Member>
				<TextField1/>
				<TextField2/>
				<TextField3/>
				<User public-id="default_data:1"/>
			</GroupUser>
			<GroupUser public-id="cclu:2">
				<Group public-id="cc_systemTables:1"/>
				<LoadFactor>0</LoadFactor>
				<LoadFactorType/>
				<Manager>false</Manager>
				<Member>true</Member>
				<TextField1/>
				<TextField2/>
				<TextField3/>
				<User public-id="cc_systemTables:1"/>
			</GroupUser>
			<GroupUser public-id="cclu:2001">
				<Group public-id="cc_systemTables:1"/>
				<LoadFactor/>
				<LoadFactorType/>
				<Manager>false</Manager>
				<Member>true</Member>
				<TextField1/>
				<TextField2/>
				<TextField3/>
				<User public-id="cclu:2003"/>
			</GroupUser>
			<GroupUser public-id="cclu:2201">
				<Group public-id="cc_systemTables:1"/>
				<LoadFactor/>
				<LoadFactorType/>
				<Manager>false</Manager>
				<Member>true</Member>
				<TextField1/>
				<TextField2/>
				<TextField3/>
				<User public-id="cclu:2103"/>
			</GroupUser>
		</Users>
		<ValidationLevel>payment</ValidationLevel>
		<VisibilityZone/>
		<WorldVisible>true</WorldVisible>
	</Group>
	<SecurityZone public-id="default_data:1">
		<CanSeeUnsecureClaimsExt>true</CanSeeUnsecureClaimsExt>
		<Description>Default Security Zone</Description>
		<GenericUserExt public-id="cc:12366"/>
		<IsSecurityZoneTPAExt>false</IsSecurityZoneTPAExt>
		<Name>Default Security Zone</Name>
	</SecurityZone>
*/