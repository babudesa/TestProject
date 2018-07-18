package examples.plugins.claimnumgen;

import com.guidewire.cc.plugin.claimnumbergen.IClaimNumGenAdapter;
import com.guidewire.pl.plugin.InitializablePlugin;

import java.util.Map;

public class ClaimNumGenPlugin implements IClaimNumGenAdapter, InitializablePlugin {
  private String _tempChar = "0";
  private String _permChar = "1";

  public void setParameters(Map params) {
    if (params.containsKey("temp")) {
      _tempChar = ((String) params.get("temp")).substring(0, 1);
    }
    if (params.containsKey("perm")) {
      _permChar = ((String) params.get("perm")).substring(0, 1);
    }
  }

  public String generateNewClaimNumber(String templateData) {
    return genClaimNum(false);
  }

  public String generateTempClaimNumber(String templateData) {
    return genClaimNum(true);
  }

  public void cancelNewClaimNumber(String templateData, String claimNumber) {
  }

  // ----------------------------------------------------------- Private Methods

  private String genClaimNum(boolean temp) {
    String inputMask = "###-##-######";
    String claimIDStr = new Long(System.currentTimeMillis()).toString();
    claimIDStr = claimIDStr.substring(claimIDStr.length() - (inputMask.length() - 3));
    String prefix = (temp ? _tempChar : _permChar);
    claimIDStr = prefix + claimIDStr.substring(0, 2) + "-" + claimIDStr.substring(2, 4) + "-" + claimIDStr.substring(4, claimIDStr.length());
    // Force a new time by sleeping
    try { Thread.sleep(10); } catch (InterruptedException e) {}
    return claimIDStr;
  }

  public static void main(String[] args) {
    ClaimNumGenPlugin claimNumGenPlugin = new ClaimNumGenPlugin();
    System.out.println(claimNumGenPlugin.genClaimNum(true));
    System.out.println("");
    System.out.println(claimNumGenPlugin.genClaimNum(false));
  }
}
