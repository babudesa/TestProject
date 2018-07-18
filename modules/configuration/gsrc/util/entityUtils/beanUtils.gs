package util.entityUtils;
uses gw.api.util.Logger //Added for logging in Debug - SR

class beanUtils
{
  public static function isBeanUpdated(bean : Bean):Boolean{
    var BeanVers:java.lang.Integer = 0;
    var DBBeanVers:java.lang.Integer = 0;
    if(bean typeis Claim){
       var result = find(entity in Claim where entity.PublicID == bean.PublicID)
       BeanVers = result.getAtMostOneRow().BeanVersion
       DBBeanVers = bean.BeanVersion;
    }
    if(bean typeis Policy){
       var result = find(entity in Policy where entity.PublicID == bean.PublicID)
       BeanVers = result.getAtMostOneRow().BeanVersion
       DBBeanVers = bean.BeanVersion;
    }
    if(bean typeis Contact){
       var result = find(entity in Contact where entity.PublicID == bean.PublicID)
       BeanVers = result.getAtMostOneRow().BeanVersion
       DBBeanVers = bean.BeanVersion;
    }
    if(bean typeis Exposure){
       var result = find(entity in Exposure where entity.PublicID == bean.PublicID)
       BeanVers = result.getAtMostOneRow().BeanVersion
       DBBeanVers = bean.BeanVersion;
    }
    //changed to logging in Debug - SR
    Logger.logDebug(BeanVers + " " +DBBeanVers);
    return !(BeanVers == DBBeanVers);
  }
  public static function getUpdatedBeanMessage(bean : Bean) : String{
    //var user:User;
    var updateMessage:String = "" 
    if(bean typeis Claim){
       var result = find(entity in Claim where entity.PublicID == bean.PublicID)
       var clm = result.getAtMostOneRow()
       if(clm.BeanVersion != bean.BeanVersion){
         updateMessage = displaykey.NewDocFromTemplateScreen.DocumentError.BeanVersionDiff("claim", clm.UpdateUser, clm.UpdateTime)
       }
    }
    if(bean typeis Policy){
       var result = find(entity in Policy where entity.PublicID == bean.PublicID)
       var pol = result.getAtMostOneRow()
       if(pol.BeanVersion != bean.BeanVersion){
         updateMessage = displaykey.NewDocFromTemplateScreen.DocumentError.BeanVersionDiff("policy", pol.UpdateUser, pol.UpdateTime)
       }
    }
    if(bean typeis Contact){
       var result = find(entity in Contact where entity.PublicID == bean.PublicID)
       var cont:Contact = result.getAtMostOneRow()
       if(cont.BeanVersion != bean.BeanVersion){
         updateMessage = displaykey.NewDocFromTemplateScreen.DocumentError.BeanVersionDiff("contact: " + cont.DisplayName, cont.UpdateUser, cont.UpdateTime)
       }
    }
    if(bean typeis Exposure){
       var result = find(entity in Exposure where entity.PublicID == bean.PublicID)
       var exp = result.getAtMostOneRow()
       if(exp.BeanVersion != bean.BeanVersion){
         updateMessage = displaykey.NewDocFromTemplateScreen.DocumentError.BeanVersionDiff("exposure", exp.UpdateUser, exp.UpdateTime)
       }
    }
    return updateMessage;
  }
}
