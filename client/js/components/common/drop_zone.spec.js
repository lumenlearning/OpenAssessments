"use strict";

import React				from 'react';
import TestUtils    from 'react/lib/ReactTestUtils';
import DropZone			from './drop_zone';

describe('Drop Zone', ()=>{
	var instance;
	var item;
	var zone;

	beforeEach(()=>{
		item = {
			id: 0,
			width: 128,
			height: 64,
			xPos: 10,
			yPos: 20
		};
		instance = TestUtils.renderIntoDocument(<DropZone item={item} />);
		zone = TestUtils.findRenderedDOMComponentWithClass(instance, 'dropZone');
	});

	it('Renders', ()=>{
		expect(zone).toBeDefined();
		expect(zone.props.style.top).toEqual('20');
		expect(zone.props.style.left).toEqual('10');
		expect(zone.props.style.height).toEqual('64');
		expect(zone.props.style.width).toEqual('128');
	});
	it('Is droppable', ()=>{
		spyOn(instance, 'drop');
		TestUtils.Simulate.drop(zone);
		expect(instance.drop).toHaveBeenCalled();
	});
	it('Has drag over', ()=>{
		spyOn(instance, 'allowDrop');
		TestUtils.Simulate.dragOver(zone);
		expect(instance.allowDrop).toHaveBeenCalled();
	});
});