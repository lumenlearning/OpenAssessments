import Assessment         from './assessment';
import AssessmentActions  from "../actions/assessment";
import $                  from 'jquery';

describe('assessment', () => {
  
  var settings;
  var sequential;
  var vertical;
  var problem1;
  var problem2;
  var problem3;
  var problem4;
  var problem5;
  var problem6;
  var problem7;

  beforeAll(() => {
    jasmine.getFixtures().fixturesPath = "base/fixtures/";
    settings = {};

    // 'jasmine.Ajax.install();'' prevents readFixtures from executing successfully so we have to read them here.
    sequential = readFixtures("edXCourse/sequential/97cc2d1812204294b5fcbb91a1157368.xml");
    vertical = readFixtures("edXCourse/vertical/04735103fe064c9da3a1a758bcda2692.xml");
    problem1 = readFixtures('edXCourse/problem/1bdd2690346d437eacc85567ed79702f.xml');
    problem2 = readFixtures('edXCourse/problem/d0ef2adedeba45038d69b24517892d1d.xml');
    problem3 = readFixtures('edXCourse/problem/78934fbb26f44b2b85d252a4f3c52d54.xml');
    problem4 = readFixtures('edXCourse/problem/d649f04c5979438fbe82334f07b7d6fe.xml');
    problem5 = readFixtures('edXCourse/problem/8d6900d170f34deeb718866c2954c75f.xml');
    problem6 = readFixtures('edXCourse/problem/da63a43c68024407aab8ca0f7c790b12.xml');
    problem7 = readFixtures('edXCourse/problem/c34a20e2f1e24890baffcfc9ac68dcfc.xml');
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
      var data          = readFixtures("biology.xml");
      var xml           = $(data);
      var assessmentXml = xml.find('assessment').addBack('assessment');
    
      var assessment = Assessment.parseQti(assessmentXml, xml);

      expect(assessment).toBeDefined();
      expect(assessment.id).toEqual("ch01");
      expect(assessment.title).toEqual("ch01");
      expect(assessment.standard).toEqual("qti");
      expect(assessment.sections.length).toEqual(1);
      expect(assessment.sections[0].items.length).toEqual(4);
      var item = assessment.sections[0].items[0];
      expect(item.id).toEqual("ch01sec1q0");
      expect(item.title).toEqual("1.1 Exercise 2.");
    });
  });

  describe('parseEdX', () => {
    
    beforeEach(() => {
      jasmine.Ajax.install();

      // Stub request to load problems
      jasmine.Ajax.stubRequest('edXCourse/problem/1bdd2690346d437eacc85567ed79702f.xml').andReturn({
        "status": 200,
        "contentType": "application/xml",
        "statusText": "OK",
        "responseText": problem1
      });

      jasmine.Ajax.stubRequest('edXCourse/problem/d0ef2adedeba45038d69b24517892d1d.xml').andReturn({
        "status": 200,
        "contentType": "application/xml",
        "statusText": "OK",
        "responseText": problem2
      });

      jasmine.Ajax.stubRequest('edXCourse/problem/78934fbb26f44b2b85d252a4f3c52d54.xml').andReturn({
        "status": 200,
        "contentType": "application/xml",
        "statusText": "OK",
        "responseText": problem3
      });

      jasmine.Ajax.stubRequest('edXCourse/problem/d649f04c5979438fbe82334f07b7d6fe.xml').andReturn({
        "status": 200,
        "contentType": "application/xml",
        "statusText": "OK",
        "responseText": problem4
      });

      jasmine.Ajax.stubRequest('edXCourse/problem/8d6900d170f34deeb718866c2954c75f.xml').andReturn({
        "status": 200,
        "contentType": "application/xml",
        "statusText": "OK",
        "responseText": problem5
      });

      jasmine.Ajax.stubRequest('edXCourse/problem/da63a43c68024407aab8ca0f7c790b12.xml').andReturn({
        "status": 200,
        "contentType": "application/xml",
        "statusText": "OK",
        "responseText": problem6
      });

      jasmine.Ajax.stubRequest('edXCourse/problem/c34a20e2f1e24890baffcfc9ac68dcfc.xml').andReturn({
        "status": 200,
        "contentType": "application/xml",
        "statusText": "OK",
        "responseText": problem7
      });

      spyOn(AssessmentActions, 'edXLoadItem');

    });
    
    afterEach(() => {
      jasmine.Ajax.uninstall();
    });

    it('parses assessment xml from EdX into an object', () => {
      settings = {
        srcUrl: "edXCourse/sequential/97cc2d1812204294b5fcbb91a1157368.xml"
      };

      var assessment = Assessment.parseEdX(settings, $(sequential));

      expect(assessment).toBeDefined();
      expect(assessment.id).toEqual("sequential/97cc2d1812204294b5fcbb91a1157368");
      expect(assessment.title).toEqual("Subsection One");
      expect(assessment.standard).toEqual("edX");
      expect(assessment.sections.length).toEqual(1);
      expect(assessment.sections[0]).toEqual("04735103fe064c9da3a1a758bcda2692");

      expect(jasmine.Ajax.requests.mostRecent().url).toBe('edXCourse/vertical/04735103fe064c9da3a1a758bcda2692.xml');
      jasmine.Ajax.requests.mostRecent().respondWith({
        "status": 200,
        "contentType": "application/xml",
        "statusText": "OK",
        "responseText": vertical
      });

      expect(AssessmentActions.edXLoadItem).toHaveBeenCalled();

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
