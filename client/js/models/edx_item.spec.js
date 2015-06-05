"use strict";

import EdxItem       from './edx_item.js';

describe('Parses edX Problem', function(){
  var url;
  var xml;
  var res;
  var resWContentType;

  describe('Parses edX Drag and Drop', function(){
    var id = "1bdd2690346d437eacc85567ed79702f";

    beforeAll(function(){
      jasmine.getFixtures().fixturesPath = "base/fixtures/";
      url = `https://dl.dropboxusercontent.com/u/7594429/edXCourse/problem/${id}.xml`;
      xml = readFixtures(`edXCourse/problem/${id}.xml`);

      // A response without a responseType will set the xml on the text. ie a request from Dropbox
      res = {
        text: xml
      };

      // A response a responseType 'application/xml' will parse the xml into a document. We want
      // direct access to the text so we can use jquery to parse. In this case we access responseText
      resWContentType = {
        xhr: {
          responseText: xml
        }
      };
    });

    it('generates a item from edX xml without content-type set', () => {
      var item = EdxItem.fromEdX(id, url, res);
      expect(item).toBeDefined();
      expect(item.title).toEqual("Drag and Drop");
      expect(item.id).toEqual(id);
      expect(item.url).toEqual(url);
      expect(item.xml).toBeDefined();
      expect(item.edXMaterial).toBeDefined();
      expect(item.answers.length).toBe(2);
    });

    it('generates a item from edX xml with content-type set', () => {
      var item = EdxItem.fromEdX(id, url, resWContentType);
      expect(item).toBeDefined();
      expect(item.title).toEqual("Drag and Drop");
      expect(item.id).toEqual(id);
      expect(item.url).toEqual(url);
      expect(item.xml).toBeDefined();
      expect(item.edXMaterial).toBeDefined();
      expect(item.answers.length).toBe(2);
    });

  });

  describe('Parses edX Multple Choice', function(){
    var id = "d0ef2adedeba45038d69b24517892d1d";

    beforeAll(function(){
      jasmine.getFixtures().fixturesPath = "base/fixtures/";
      url = `https://dl.dropboxusercontent.com/u/7594429/edXCourse/problem/${id}.xml`;
      xml = readFixtures(`edXCourse/problem/${id}.xml`);

      // A response without a responseType will set the xml on the text. ie a request from Dropbox
      res = {
        text: xml
      };

      // A response a responseType 'application/xml' will parse the xml into a document. We want
      // direct access to the text so we can use jquery to parse. In this case we access responseText
      resWContentType = {
        xhr: {
          responseText: xml
        }
      };
    });

    it('generates a section from edX xml without content-type set', () => {
      var item = EdxItem.fromEdX(id, url, res);
      expect(item).toBeDefined();
      expect(item.title).toEqual("Multiple Choice");
      expect(item.id).toEqual(id);
      expect(item.url).toEqual(url);
      expect(item.xml).toBeDefined();
      expect(item.edXMaterial).toBeDefined();
      expect(item.answers.length).toBe(4);
    });

    it('generates a section from edX xml with content-type set', () => {
      var item = EdxItem.fromEdX(id, url, resWContentType);
      expect(item).toBeDefined();
      expect(item.title).toEqual("Multiple Choice");
      expect(item.id).toEqual(id);
      expect(item.url).toEqual(url);
      expect(item.xml).toBeDefined();
      expect(item.edXMaterial).toBeDefined();
      expect(item.answers.length).toBe(4);
    });

  });

});