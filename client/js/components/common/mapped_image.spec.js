"use strict";

import React					from 'react';
import TestUtils			from '../../../node_modules/react/lib/ReactTestUtils';
import MappedImage		from './mapped_image';

describe ('Mapped Image', ()=>{
	var result;
	var item;

	beforeEach(()=>{
		item = {
			id: 0,
			coordinates: [0,0,5,5],
			material: 'http://www.bealecorner.com/trv900/respat/eia1956-small.jpg',
			width: 640,
			height: 480
		};

		result = TestUtils.renderIntoDocument(<MappedImage item={item} />);
	});

	it('Renders the img', ()=>{
		expect(TestUtils.findRenderedDOMComponentWithTag(result, 'img').props.src).toEqual('http://www.bealecorner.com/trv900/respat/eia1956-small.jpg');
		expect(TestUtils.findRenderedDOMComponentWithTag(result, 'img').props.width).toEqual(640);
		expect(TestUtils.findRenderedDOMComponentWithTag(result, 'img').props.height).toEqual(480);
	});

	it('Renders the Map', ()=>{
		var coords = item.coordinates.toString();
		expect(TestUtils.findRenderedDOMComponentWithTag(result, 'map')).toBeDefined();
		expect(TestUtils.findRenderedDOMComponentWithTag(result, 'area')).toBeDefined();
		expect(TestUtils.findRenderedDOMComponentWithTag(result, 'area').props.coords).toEqual(coords);
	});

	xit('Calls the onClick', ()=>{
		spyOn(result, 'onclickFunction');
		var clickableArea = TestUtils.findRenderedDOMComponentWithTag(result, 'area');
		TestUtils.Simulate.click(clickableArea);
		expect(result.onclickFunction).toHaveBeenCalled();
	});
});