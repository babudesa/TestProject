package gaic.servlet

uses gw.servlet.Servlet
uses java.text.SimpleDateFormat
uses java.util.Calendar
uses java.util.TimeZone
uses java.io.PrintWriter
uses javax.servlet.http.HttpServletRequest
uses javax.servlet.http.HttpServletResponse
uses sun.misc.BASE64Encoder
uses sun.misc.BASE64Decoder
uses java.net.URLEncoder;
uses java.security.KeyFactory;
uses java.security.PrivateKey;
uses java.security.Signature;
uses java.security.spec.PKCS8EncodedKeySpec;
uses com.gaic.claims.crypto.GAIEncryptor
uses java.util.Properties
uses com.gaic.claims.env.Environment
uses com.gaic.claims.util.security.SSOSecurityHeader
uses java.util.HashMap

/**
 * At some point, you're probably going to look this over and think how easy it looks - until someone asks you how the litAdvSSO.key property was derived, or to 
 * regenerate a new certificate for CSC. Then you're going to wonder "How in the world did they come up with that lovely binary?" Well, then this comment is for you!
 * 
 * First we generated a certificate in the local keystore using the command in the JDK bin directory: 
 * keytool -genkey -alias cscsso -keyalg RSA -validity 3650 -keypass <some pass for the key> -storepass <jdk store pass> -keystore ..\jre\lib\security\cacerts
 * 
 * Wow, that was pretty exciting, but what does it do for you? Now you can export the certificate to send to CSC:
 * keytool -export -alias cscsso -file C:\cscsso.cer -storepass <jdk store pass> -keystore ..\jre\lib\security\cacerts
 * 
 * You're probably wondering at this point "Didn't the comment promise to tell me how the property was created?" You're right! Now use the following code to extract 
 * the value needed for the properties file:
 * 
 * KeyStore store = KeyStore.getInstance(KeyStore.getDefaultType());
 * store.load(new FileInputStream("<full path to jdk>\\jre\\lib\\security\\cacerts"), "<jdk store pass>".toCharArray());
 * Key key = store.getKey("cscsso", "<the pass for the key>".toCharArray());
 * 
 * Properties props = new Properties();
 * props.put("algorithm", key.getAlgorithm());
 * props.put("key", new BASE64Encoder().encode(key.getEncoded()));
 * props.put("format", key.getFormat());
 * 
 * FileWriter writer = new FileWriter("data/private.key");
 * props.store(writer,"key for csc test");
 * 
 * Now you can open up the private.key file and see the info you need to copy into the properties file! It's like magic!
 * 
 */
@Servlet( \ path : String ->path.matches("/lasso(/.*)?"))
class LASSOServlet extends javax.servlet.http.HttpServlet{
  override function doGet(req: HttpServletRequest, resp : HttpServletResponse){
    var username : String = getAuth(req);
    var matterid : String = req.getParameter("matterID") 
    var val : String[]

    if (username!=null and username.length>0){
     val= createURL(username);
    }else{
      resp.reset();
      resp.sendError(403);
      return;
    }
 
    var writer : PrintWriter = resp.Writer
    writer.println("<html><body onload=\"document.forms['login'].submit()\"><form name='login' id='login' action=\""+val[0]+"\" method=\"post\">");
    writer.println("<input type='hidden' name='UserID' value='"+username+"'>");
    writer.println("<input type='hidden' name='Timestamp' value='"+val[1]+"'>");
    writer.println("<input type='hidden' name='DigitalSignature' value='"+val[2]+"'>");
    writer.println("<input type='hidden' name='MatterId' value='"+matterid+"'>");
    writer.println("<input type='submit'>");
    writer.println("</form></body></html>");
    writer.flush();
    writer.close();
  }
  
  function createURL(username : String) : String[]{
    var sdf : SimpleDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'kk:mm:ss.SSS'Z'")
    var cal : Calendar = Calendar.getInstance(TimeZone.getTimeZone("UTC"))
    sdf.setTimeZone(cal.TimeZone);
    var timestamp : String = sdf.format(cal.getTime())
    var sign : String = username+"|"+timestamp
    
    var secProps : Properties  = Environment.getInstance().createPropertiesForClass(SSOSecurityHeader, SSOSecurityHeader.PROPERTIES_FILENAME);
    var env = Environment.getInstance().equals(Environment.PROD) ? "." + Environment.PROD.toString() : "";
    //klug to fix prop issue
    var myMap : HashMap = new HashMap();
    myMap.putAll(secProps)
    var cryptor : GAIEncryptor = new GAIEncryptor(myMap.get("pp") as String)
    var cryptKey =  cryptor.decrypt(myMap.get("litAdvSSO.key" + env) as String)
    
    var url = myMap.get("litAdvSSO.url" + env) as String

    var key : byte[] = new BASE64Decoder().decodeBuffer(cryptKey)
    var factory : KeyFactory = KeyFactory.getInstance("RSA")
    var privateKey : PrivateKey = factory.generatePrivate(new PKCS8EncodedKeySpec(key))
    var signature : Signature = Signature.getInstance("SHA1withRSA")
    signature.initSign(privateKey);
    signature.update(sign.getBytes("UTF-8"));
    var bytes : byte[]  = signature.sign();
    
    var tosend : String = (new BASE64Encoder()).encode(bytes)
    tosend = tosend.replace("\n", "").replace("\t", "").replace("\r", "")
    sign = URLEncoder.encode(tosend, "UTF-8");
    
    return {url,timestamp,tosend}
  }

  private function getAuth(req:HttpServletRequest):String {
    var s = req.getSession(false);
    if (s == null) return null;
    var token = s.getAttribute("SVC_TKN") as com.guidewire.pl.system.service.context.ServiceToken;
    if (token == null || !token.AuthenticatedUser) {
      return null;
    }
    return token.User.Credential.UserName;
  }  
}
