"use strict";
import Communicator from "./communicator";

describe("Communicator", () => {

  describe("enableListener", () => {
    it("initializes the communicator", () => {
      var handler = {
        handleComm: () => {
        }
      }
      Communicator.enableListener(handler);
    });
  });

  describe("enableListener", () => {

    beforeEach(() => {
      spyOn(parent, 'postMessage');
    });

    it("sends a message to the parent", (done) => {
      Communicator.commMsg("test", { test: "test" });
      expect(parent.postMessage).toHaveBeenCalled();
      done();
    });
  });

});