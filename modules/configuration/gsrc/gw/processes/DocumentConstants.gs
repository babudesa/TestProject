package gw.processes

public class DocumentConstants {

  construct(batchProcessType : BatchProcessBase) {
    this(batchProcessType)
  }
  
	public static var CC_ENV_PROPERTY : String = "cc.env"
	public static var MAIL_HOST : String = "doc.mail.host"
	public static var FROM_ADDRESS : String= "doc.mail.from"
	public static var TO : String = "doc.mail.to"
	public static var SUBJECT : String = "doc.mail.subject"
	public static var MESSAGE : String = "doc.mail.message"
	public static var NOERRMSG : String = "doc.mail.noerrmsg"
	public static var META_ATTACH_NAME : String = "doc.metaAttachName"
	public static var META_MIME_TYPE : String = "doc.metaMimeType"
	public static var ECF_URL : String = "doc.ecf.url"

	private function DocumentConstants() {
	}
}
