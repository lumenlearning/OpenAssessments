"use strict";

import React				from 'react';
import TestUtils		from 'react/lib/ReactTestUtils';
import TextArea			from'./text_area';

describe('Text area', function(){

	var textArea;

	beforeEach(function(){
		textArea = TestUtils.renderIntoDocument(<TextArea />);
	});

	it('It renders the text area', function(){
		expect(textArea).toBeDefined();
	});

});