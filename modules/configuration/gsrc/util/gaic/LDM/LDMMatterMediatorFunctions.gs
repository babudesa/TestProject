package util.gaic.LDM
uses java.util.ArrayList


/**
* This class performs the functions to check for changes to the MatterMediatorExt
* entity.
* 
* @author kepage
* @since 2013-01-22
*/
class LDMMatterMediatorFunctions {

    private construct() {

    }
    
    
    /**
    * Gets a new instance of the LDMMatterMediatorFunctions class.
    * 
    * @return a new instance of LDMMatterMediatorFunctions class.
    */
    static function getInstance() : LDMMatterMediatorFunctions {
        return new LDMMatterMediatorFunctions();
    }
  
  
    /**
    * Returns true if the MatterMediatorExt entity has changed.
    * 
    * @param mediator MatterMediatorExt entity to check for changes.
    * @return changed status of the MatterMediatorExt entity.
    */  
    protected function mediatorChanged(mediator : MatterMediatorExt) : boolean {
      
        if(this.mediatorFieldChanged(mediator)){
            return true;
        }else{
            return false
        }     
    }
    
   
    /**
    * Checks to see if specific fields have changed on the MatterMediatorExt entitiy.
    * 
    * @param mediator the MatterMediatorExt entity to check for changes.
    * @return changed status of the MatterMediatorExt entity.
    */
    protected function mediatorFieldChanged(mediator : MatterMediatorExt) : boolean {
        var fields = new String[] {"MediatorExt", "RecommendMediatorExt","AdditionalCommentsExt"};

        if (util.gaic.CommonFunctions.fieldFromListChanged(mediator, fields) || mediator.Matter.isFieldChanged("MediationDate")){
            return true;
        }else{
            return false
        }      
    }
  
  
    /**
    * Finds any added  MatterMediatorExt entities on a specific Matter entity
    * 
    * @param matter the Matter entity to check for added  MatterMediatorExt entities.
    * @return the added  MatterMediatorExt entities.
    */
    protected function getNewMediators(matter : Matter) : ArrayList<MatterMediatorExt>{
         var originalMatter = matter.OriginalVersion as Matter
         var newMediators = new ArrayList<MatterMediatorExt>()
     
         for(mediator in matter.MediatorsExt){     
             if(!exists(med in originalMatter.MediatorsExt where med.ID == mediator.ID)){               
                 newMediators.add(mediator)
             }
         }      
         return newMediators 
    }
    
   
    /**
    * Finds any deleted MatterMediatorExt entities on a specific Matter entity
    * 
    * @param matter the Matter entity to check for deleted MatterMediatorExt entities.
    * @return the deleted MatterMediatorExt entities.
    */
    protected function getDeletedMediators(matter : Matter) : ArrayList<MatterMediatorExt>{
         var originalMatter = matter.OriginalVersion as Matter
         var deletedMediators = new ArrayList<MatterMediatorExt>()
     
         for(mediator in originalMatter.MediatorsExt){     
             if(!exists(med in matter.MediatorsExt where med.ID == mediator.ID)){               
                 deletedMediators.add(mediator)
             }
         }        
         return deletedMediators 
    }
  
  
    /**
    * Finds any changed MatterMediatorExt entities on a specific Matter entity
    * 
    * @param matter the Matter entity to check for changed MatterMediatorExt entities.
    * @return the changed MatterMediatorExt entities.
    */
    protected function getChangedMediators(matter : Matter) : ArrayList<MatterMediatorExt>{  
       var changedMediators = new ArrayList<MatterMediatorExt>()
   
       for(mediator in matter.MediatorsExt){   
           if(!mediator.New && this.mediatorChanged(mediator)){             
               changedMediators.add(mediator)
           }
       }    
       return changedMediators 
    }


}//End LDMMatterMediatorFunctions class
