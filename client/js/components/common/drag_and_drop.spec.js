"use strict";

import React			from 'react';
import TestUtils	from '../../../node_modules/react/lib/ReactTestUtils';
import $					from 'jquery';
import DragAndDrop		from './drag_and_drop';

describe('Drag and Drop', ()=>{
	var instance;
	var item;

	beforeEach(()=>{
		item = {
			id: 0,
			draggables: [{id:'0', label:'drag1'},{id:'1', label:'drag2'},{id:'2', label:'drag3'}],
			targets: [{id:'0', height:'100', width:'180', xPos:'10', yPos:'10'}],
			img: 'http://www.bealecorner.com/trv900/respat/eia1956-small.jpg'
		};
		instance = TestUtils.renderIntoDocument(<DragAndDrop item={item} />);
	});

	describe('Key type', ()=>{
		beforeEach(()=>{
			item.type = 'key';
			instance = TestUtils.renderIntoDocument(<DragAndDrop item={item} />);
		});

		it('Renders the image', ()=>{
			expect(instance).toBeDefined();
			expect(TestUtils.findRenderedDOMComponentWithTag(instance, 'img')).toBeDefined();
			expect(TestUtils.findRenderedDOMComponentWithTag(instance, 'img').props.src).toEqual('http://www.bealecorner.com/trv900/respat/eia1956-small.jpg');
		});
		it('Renders the draggable objects', ()=>{
			expect(TestUtils.scryRenderedDOMComponentsWithTag(instance, 'Draggable')).toBeDefined();
		});
		it('renders the dropzones', ()=>{
			expect(TestUtils.scryRenderedDOMComponentsWithTag(instance, 'DropZone')).toBeDefined();
		});
	});

	describe('Index Type', ()=>{
		beforeEach(()=>{
			item.type = 'index';
			instance = TestUtils.renderIntoDocument(<DragAndDrop item={item} />);
		});
		it('Renders the image', ()=>{
			expect(instance).toBeDefined();
			expect(TestUtils.findRenderedDOMComponentWithTag(instance, 'img')).toBeDefined();
			expect(TestUtils.findRenderedDOMComponentWithTag(instance, 'img').props.src).toEqual('http://www.bealecorner.com/trv900/respat/eia1956-small.jpg');
		});
		it('Renders the draggable objects', ()=>{
			expect(TestUtils.scryRenderedDOMComponentsWithTag(instance, 'Draggable')).toBeDefined();
		});
		it('renders the dropzone', ()=>{
			expect(TestUtils.scryRenderedDOMComponentsWithTag(instance, 'DropZoneIndex')).toBeDefined();
		});
	});


});