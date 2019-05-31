import React             from 'react';
import Router            from 'react-router';
import AssessmentsStore  from './assessment';
import AssessmentActions from '../actions/assessment';
import Dispatcher        from '../dispatcher';

describe('AssessmentsStore', () => {

  var settings;
  var srcData;

  beforeAll(function(){
    jasmine.getFixtures().fixturesPath = "base/fixtures/";
    srcData = readFixtures("text.xml");
    settings = {
      srcUrl: "asdf"
    };
  });

  beforeEach(() => {
    jasmine.clock().install(); // Mock out the built in timers
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });
  
  describe("Loaded Assessment", () => {
    
    beforeEach(() => {
      AssessmentActions.loadAssessment(settings, srcData);
      jasmine.clock().tick(); // Advance the clock to the next tick
    });

    describe("current", () => {
      it("returns current the current assessment", (done) => {
        var assessment = AssessmentsStore.current();
        expect(assessment).toBeDefined();
        expect(assessment.id).toEqual("i0886cfce85384de6a5b5394edca8282f_summative");
        done();
      });
    });
    
    describe("isLoaded", () => {
      it("returns true", (done) => {
        expect(AssessmentsStore.isLoaded()).toBe(true);
        done(); 
      });
    });

  });

});