import React    from "react";
import Router   from "react-router";

import SettingsStore   from "./settings";
import SettingsActions from "../actions/settings";
import Dispatcher      from "../dispatcher";

describe("SettingsStore", () => {

  beforeEach(() => {
    jasmine.clock().install(); // Mock out the built in timers
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });
  
  describe("with initial state", () => {

    var defaultSettings = {
      apiUrl: "http://www.example.com/api"
    };

    beforeEach(() => {
      SettingsActions.load(defaultSettings);
      jasmine.clock().tick(); // Advance the clock to the next tick
    });

    describe("current", () => {
      it("returns current settings", (done) => {
        var settings = SettingsStore.current();
        expect(settings).toEqual(defaultSettings);
        done();
      });
    });

  });

});