package util;
uses java.util.ArrayList

@Export
class QuestionUtils{

  public static function getAppropriateQuestionSet(claimInput : Claim) : QuestionSet[] {
    var questionSetTypes = new ArrayList<QuestionSetType>()
    questionSetTypes.add("siugen");
    if (claimInput.LossType == "AUTO"){
      questionSetTypes.add("siucar");
    } else if (claimInput.LossType == "WC") {
      questionSetTypes.add("siuwork");
    }
    var query = find (q in QuestionSet where q.QuestionSetType in (questionSetTypes as typekey.QuestionSetType[]))
    query.addAscendingSortColumn("QuestionSet.QuestionSetType")
    query.addAscendingSortColumn("QuestionSet.Priority")
    var questionSets = new ArrayList<QuestionSet>()
    for (questionSet in query) {
      questionSets.add(questionSet)
    }
    return questionSets.toTypedArray()
  }

  public static function getQuestionSetTotalScore(answerContainer : gw.api.question.AnswerContainer, questionSetsTemp : QuestionSet[]) : int {
    var result = 0;
    for (questionSetTemp in questionSetsTemp){
       result = result + questionSetTemp.getPointTotal(answerContainer);
    }
    return result;
  }
}
