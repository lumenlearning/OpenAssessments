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
    srcData = readFixtures("assessment.xml");
    settings = {
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
        console.log()
        expect(assessment).toBeDefined();
        expect(assessment.id).toEqual("ib8d9c142765b2287684aad0b5387e45b");
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