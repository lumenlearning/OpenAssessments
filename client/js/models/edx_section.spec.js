"use strict";

import EdxSection				from './edx_section.js';

describe('Parses edX Sequential', function(){
	var url;
	var xml;
	var res;
	var resWContentType;
	var id = "97cc2d1812204294b5fcbb91a1157368";

	beforeAll(function(){
    jasmine.getFixtures().fixturesPath = "base/fixtures/";
		url = `https://dl.dropboxusercontent.com/u/7594429/edXCourse/sequential/${id}.xml`;
		xml = readFixtures(`edXCourse/sequential/${id}.xml`);

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
		var sequential = EdxSection.fromEdX(id, url, res);
		expect(sequential).toBeDefined();
		expect(sequential.id).toEqual(id);
		expect(sequential.url).toEqual(url);
		expect(sequential.xml).toBeDefined();
	});

	it('generates a section from edX xml with content-type set', () => {
		var sequential = EdxSection.fromEdX(id, url, resWContentType);
		expect(sequential).toBeDefined();
		expect(sequential.id).toEqual(id);
		expect(sequential.url).toEqual(url);
		expect(sequential.xml).toBeDefined();
	});

});