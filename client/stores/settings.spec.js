"use strict";

import React           from "react";
import Router          from "react-router";
import assign          from "object-assign";
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
      apiUrl: "http://www.example.com/api",
      srcUrl: "http://www.example.com/src",
      enableStart: 'true'
    };

    beforeEach(() => {
      SettingsActions.load(defaultSettings);
      jasmine.clock().tick(); // Advance the clock to the next tick
    });

    describe("current", () => {
      it("returns current settings", (done) => {
        var settings = SettingsStore.current();
        expect(settings.apiUrl).toEqual(defaultSettings.apiUrl);
        expect(settings.srcUrl).toEqual(defaultSettings.srcUrl);
        done();
      });

      it("sets a boolean value for enableStart", (done) => {
        var settings = SettingsStore.current();
        expect(settings.enableStart).toBe(true);
        done();
      });
    });

    describe("errors", () => {
      it("doesn't have errors", function (done) {
        expect(SettingsStore.errors()).toEqual({});
        done();
      });
    });

  });

  describe("missing srcUrl", () => {

    var defaultSettings = {
      apiUrl: "http://www.example.com/api"
    };

    beforeEach(() => {
      SettingsActions.load(defaultSettings);
      jasmine.clock().tick(); // Advance the clock to the next tick
    });

    describe("errors", () => {
      it("has errors if src_url value is not present", function (done) {
        expect(SettingsStore.errors().srcUrl.length > 0).toBe(true);
        done();
      });
    });

  });

});