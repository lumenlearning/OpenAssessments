import Settings from "./settings";

describe("Settings", function(){

  it("returns a settings object with default values", function (done) {
    var globalSettings = {
      srcUrl: "http://www.example.com"
    };
    var settings = Settings.load(globalSettings);
    expect(settings.srcUrl).toBe(globalSettings.srcUrl);
    done();
  });
  
  it("throws an exception if src_url value is not present", function (done) {
  	expect(Settings.load).toThrow("No src_url specified: specify a src_url in the url query params.");
    done();
  });
 
});
