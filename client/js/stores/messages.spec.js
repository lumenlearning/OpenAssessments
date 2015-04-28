import React    from 'react';
import Router   from 'react-router';

import MessagesStore   from './messages';
import MessageActions  from '../actions/messages';
import Dispatcher      from '../dispatcher';

describe('MessagesStore', () => {

  beforeEach(() => {
    jasmine.clock().install(); // Mock out the built in timers
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });
  
  describe("No messages", () => {
    
    describe("current", () => {
      it("returns current messages", (done) => {
        var messages = MessagesStore.current();
        expect(messages).toEqual({});
        done();
      });
    });
    
    describe("hasMessages", () => {
      it("returns false", (done) => {
        expect(MessagesStore.hasMessages()).toBe(false);
        done();
      });
    });

  });
  
  describe("Has messages", () => {

    var message = "A message";

    beforeEach(() => {
      MessageActions.addMessage(message);
      jasmine.clock().tick(); // Advance the clock to the next tick
    });

    describe("current", () => {
      it("returns current messages", (done) => {
        var messages = MessagesStore.current();
        expect(messages).toEqual({ 1: message });
        done();
      });
    }); 
    
    describe("hasMessages", () => {
      it("returns true", (done) => {
        expect(MessagesStore.hasMessages()).toBe(true);
        done();
      });
    });

  });

});