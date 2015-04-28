import React    from 'react';
import Router   from 'react-router';

import MessagesStore   from './messages';

describe('MessagesStore', function () {
  describe('current', function () {
    it('returns current messages', function (done) {
      var messages = MessagesStore.current();
      expect(messages).toEqual([]);
      done();
    });
  });
  describe('hasMessages', function () {
    it('returns false', function (done) {
      expect(MessagesStore.hasMessages()).toBe(false);
      done();
    });
  });
});
