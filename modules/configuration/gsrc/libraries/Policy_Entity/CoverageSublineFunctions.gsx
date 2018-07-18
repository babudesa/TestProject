package libraries.Policy_Entity

enhancement CoverageSublineFunctions : entity.Policy {
  /*uses com.gaic.integration.cc.subline.GSublineSearchAdapter;
    uses com.gaic.claims.cc.plugins.subline.SublinePlugin;
   public function getSublineCodePropCov(propertyCoverage : PropertyCoverage, returnCode : String, returnMessage : String) : Subline
  {
    //var gsl = new com.gaic.integration.cc.subline.GSublineSearchAdapter (); 
    var gsl = new com.gaic.claims.cc.plugins.subline.SublinePlugin();
    var i = 0;
    try {
           print ("Subline Int Call " + this.LossType); 
           propertyCoverage.SublineExt = gsl.searchSubline(propertyCoverage, returnCode, returnMessage);
           gw.api.util.Logger.logError( strMessage )
           gw.api.util.Logger.logError("Subline Plugin failed for coverage: " + propertyCoverage.);
           if (returnCode == "0") {
                  print ("Subline Re.turn: " + propertyCoverage.SublineExt);
             	return propertyCoverage.SublineExt;
           }
  		 else
  		 {
  		    print ("Subline Int Return code = " + returnCode); 
             	    print ("Subline Int Return Message = " + returnMessage);
  		 }
    }
    catch (e)
    {
           print("Caught exception while calling subline search: " + e.localizedMessage ); 
           
           returnCode = " ";
    }
    finally
    {    
           return propertyCoverage.SublineExt; //This will be displayed to the user, so if it&apos;s ugly, the user will see it!
    }
    return null;
    //var x = new com.gaic.integration.cc.gscript.subline.SublinePlugin();
    //return x.someMethod("My Input String yeah !");
  }
    public function getSublineCodePolCov(policyCoverage : PolicyCoverage, returnCode : String, returnMessage : String) : Subline
  {
    //var gsl = new com.gaic.integration.cc.subline.GSublineSearchAdapter (); 
    var gsl = new com.gaic.claims.cc.plugins.subline.SublinePlugin();
    var i = 0;
    try {
           policyCoverage.SublineExt = gsl.searchSubline(policyCoverage, returnCode, returnMessage);
           if (returnCode == "0") {
              print ("Subline Return: " + policyCoverage.SublineExt);
           	return policyCoverage.SublineExt;
           }
  		 else
  		 {
  		    print ("Subline Int Return code = " + returnCode); 
             	    print ("Subline Int Return Message = " + returnMessage);
  		 }

    }
    catch (e)
    {
           print("Caught exception while calling subline search: " + e.localizedMessage ); 
           returnCode = " ";
    }
    finally
    {    
           return policyCoverage.SublineExt; //This will be displayed to the user, so if it&apos;s ugly, the user will see it!
    }
    return null;
    //var x = new com.gaic.integration.cc.gscript.subline.SublinePlugin();
    //return x.someMethod("My Input String yeah !");
  }*/
}
