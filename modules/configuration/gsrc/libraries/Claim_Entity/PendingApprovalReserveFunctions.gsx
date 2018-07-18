package libraries.Claim_Entity
uses java.util.ArrayList;

enhancement PendingApprovalReserveFunctions : entity.Claim {
  function hasPendingApprovalReserves() : boolean
  {
    var returnValue : boolean = false;
  
    var reserveLines = this.ReservesQuery.iterator();
    // var reserve : Reserve;
  
    foreach(reserve in reserveLines)
    {
      if((reserve as ReserveView).Status == "pendingapproval")
      {
        returnValue = true;
        break;
      }
    }
  
    return returnValue;
  }

  function getPendingApprovalReserves() : Reserve[]
  {
    var reserveList : List = new ArrayList();
    var reserveLines = this.ReservesQuery.iterator();
  
    foreach(reserve in reserveLines)
    {
      if((reserve as ReserveView).Status == "pendingapproval")
      {
        reserveList.add(((reserve as ReserveView).Transaction) as Reserve);
      }
    }
  
    return (reserveList.toArray() as Reserve[]);
  }
}
