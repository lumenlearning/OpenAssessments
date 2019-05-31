import Assessment         from './assessment';
import AssessmentActions  from "../actions/assessment";
import $                  from 'jquery';

describe('assessment', () => {
  
  var settings;

  beforeAll(() => {
    settings = {};
  });

  describe('parseAssessment', () => {
    
    it('parses assessment xml from QTI into an object', () => {
      var data       = readFixtures("assessment.xml");
      var assessment = Assessment.parseAssessment(settings, data);

      expect(assessment).toBeDefined();
      expect(assessment.id).toEqual("ib8d9c142765b2287684aad0b5387e45b");
      expect(assessment.title).toEqual("MIT Questions 1");
      expect(assessment.standard).toEqual("qti");
      expect(assessment.sections.length).toEqual(1);
      expect(assessment.sections[0].items.length).toEqual(10);
      var item = assessment.sections[0].items[0];
      expect(item.assessment_question_identifierref).toEqual("icee9d09b0a2ace374f01019034d68155");
      expect(item.id).toEqual("i3590da31ca486c260f96e955482aca41");
      expect(item.title).toEqual("Question 1");
    });
  });

  describe('parseQti', () => {
    
    it('parses assessment xml from QTI into an object', () => {
      var data          = readFixtures("text.xml");
      var xml           = $(data);
      var assessmentXml = xml.find('assessment').addBack('assessment');
      var assessment = Assessment.parseQti(1, assessmentXml, xml);

      expect(assessment).toBeDefined();
      expect(assessment.id).toEqual("i0886cfce85384de6a5b5394edca8282f_summative");
      expect(assessment.title).toEqual("Financial Markets and System");
      expect(assessment.standard).toEqual("qti");
      expect(assessment.sections.length).toEqual(7);
      expect(assessment.sections[0].items.length).toEqual(44);
      var item = assessment.sections[0].items[0];
      expect(item.id).toEqual("3567");
    });
  });

  describe('CheckAnswer Multiple choice', () => {
    var item;
    var selectedAnswer;
    beforeEach(() => {
      selectedAnswer = "1000"
      item = {id: "0", question_type: "multiple_choice_question", correct: [{id: "1000", score: "100"}]};
    })    
    it('returns true if the selected answer is correct', () => {
      var result = Assessment.checkAnswer(item, selectedAnswer);
      expect(result.correct).toEqual(true);
      expect(result.score).toEqual("100");
    });

    it('returns false if the selected answer is wrong', () => {
      selectedAnswer = "4000"
      var result = Assessment.checkAnswer(item, selectedAnswer);
      expect(result.correct).toEqual(false);
      expect(result.score).toEqual("0");
    });
  });

  describe('CheckAnswer Multiple Answer', () => {
    var item;
    var selectedAnswer;
    beforeEach(() => {
      selectedAnswer = ["1000", "2000"]
      item = {id: "0", question_type: "multiple_answers_question", correct: [{id: ["1000", "2000"], score: "100"}]};
    })    
    it('returns true if the selected answer is correct', () => {
      var result = Assessment.checkAnswer(item, selectedAnswer);
      expect(result.correct).toEqual(true);
      expect(result.score).toEqual("100");
    });

    it('returns false if the one selected answer is wrong', () => {
      selectedAnswer[0] = "4000"
      var result = Assessment.checkAnswer(item, selectedAnswer);
      expect(result.correct).toEqual(false);
      expect(result.score).toEqual("0");
    });

    it('returns false if the two selected answers are wrong', () => {
      selectedAnswer[0] = "4000";
      selectedAnswer[1] = "3000";
      var result = Assessment.checkAnswer(item, selectedAnswer);
      expect(result.correct).toEqual(false);
      expect(result.score).toEqual("0");
    });
  });

  describe('CheckAnswer Matching', () => {
    var item;
    var selectedAnswer;
    beforeEach(() => {
      selectedAnswer = [{id: "match this", answerNumber: "answer-0", selectedAnswer: "i am a match"}, {id: "match this", answerNumber: "answer-1", selectedAnswer: "i am a match also"}]
      item = {id: "0", answers: [{id: "1000", material: "i am a match"},{id: "2000", material: "i am a match also"}],question_type: "matching_question", correct: [{id: "1000", score: "50"}, {id: "2000", score: "50"}]};
    });    
    it('returns true if the selected answer is correct', () => {
      var result = Assessment.checkAnswer(item, selectedAnswer);
      expect(result.correct).toEqual(true);
      expect(result.score).toEqual("100");
    });

    it('returns false if the one selected answer is wrong', () => {
      selectedAnswer[0].selectedAnswer = "i am a match also"
      var result = Assessment.checkAnswer(item, selectedAnswer);
      expect(result.correct).toEqual(false);
      expect(result.score).toEqual("0");
    });

    it('returns false if the two selected answers are wrong', () => {
      selectedAnswer[0].selectedAnswer = "i am a match also"
      selectedAnswer[1].selectedAnswer = "i am a match"
      var result = Assessment.checkAnswer(item, selectedAnswer);
      expect(result.correct).toEqual(false);
      expect(result.score).toEqual("0");
    });
  });

});
