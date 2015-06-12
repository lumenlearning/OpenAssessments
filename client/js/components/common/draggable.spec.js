"use strict";

import React				from 'react';
import TestUtils    from 'react/lib/ReactTestUtils';
import Draggable		from './draggable';

describe('Draggable Object', ()=>{
	var instance;
	var item;
	var zone;
	var object;

	beforeEach(()=>{
		item = {
			id: 0,
			label: 'A Label'
		};
		instance = TestUtils.renderIntoDocument(<Draggable item={item} />);
		zone = TestUtils.findRenderedDOMComponentWithClass(instance, 'dropZone');
		object = TestUtils.findRenderedDOMComponentWithClass(instance, 'draggable');
	});

	it('Renders', ()=>{
		expect(instance).toBeDefined();
		expect(React.findDOMNode(instance).textContent).toContain('A Label');
		expect(zone).toBeDefined();
	});
	it('Is draggable', ()=>{
		expect(object.props.draggable).toBeTruthy();
		spyOn(instance, 'drag');
		TestUtils.Simulate.dragStart(object);
		expect(instance.drag).toHaveBeenCalled();
	});
	it('Is droppable', ()=>{
		spyOn(instance, 'drop');
		TestUtils.Simulate.drop(zone);
		expect(instance.drop).toHaveBeenCalled();
	});
	it('Has drag over', ()=>{
		expect(object.props.onDragOver).toBeDefined();
	});
});