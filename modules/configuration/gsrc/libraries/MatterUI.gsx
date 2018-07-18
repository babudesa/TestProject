package libraries
uses libraries.MattersUI.MattersUIHelper

@Export
enhancement MatterUI : entity.Matter
{

  /*
  *  Property stores the Matters UI Helper Class
  */
  property get UIHelper(): MattersUIHelper{
    return new MattersUIHelper(this)
  }
    

}