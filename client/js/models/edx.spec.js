import EdX           from './edx';
import $             from 'jquery';

describe('EdX', () => {
  
  var settings;

  beforeAll(function(){
    jasmine.getFixtures().fixturesPath = "base/fixtures/";

  });

  beforeEach(function() {
    jasmine.Ajax.install();
  });
  
  afterEach(function() {
    jasmine.Ajax.uninstall();
  });
  
  describe('buildProblemMaterial', () => {
    
    it('builds html for a drag and drop using the provided material', () => {
      var xml  = readFixtures("edXCourse/problem/1bdd2690346d437eacc85567ed79702f.xml");
      var html = EdX.buildProblemMaterial($(xml));
    });

    it('builds html for a numeric input using the provided material', () => {
      var xml  = readFixtures("edXCourse/problem/78934fbb26f44b2b85d252a4f3c52d54.xml");
      var html = EdX.buildProblemMaterial($(xml));
    });

    it('builds html for a dropdown input using the provided material', () => {
      var xml  = readFixtures("edXCourse/problem/8d6900d170f34deeb718866c2954c75f.xml");
      var html = EdX.buildProblemMaterial($(xml));
    });

  });

});
