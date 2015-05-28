"use strict";

import EdxSection				from './edx_section.js';

describe('Parses edX Sequential', function(){
	var sequential;

	beforeEach(function(){
		sequential = EdxSection.fromEdX(1, "https://dl.dropboxusercontent.com/u/7594429/edXCourse/sequential/97cc2d1812204294b5fcbb91a1157368.xml",
			"<sequential display_name='Subsection One'><vertical url_name='04735103fe064c9da3a1a758bcda2692'/></sequential>");
	});

	it('loads the xml', function () {
		expect(sequential).toBeDefined();
	});

	//xit('Parses xml to object', function(){
	//	expect(sequential.url).toEqual('04735103fe064c9da3a1a758bcda2692');
	//});
});