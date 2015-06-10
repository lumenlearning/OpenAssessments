"use strict";

import React			from 'react';
import TestUtils	from '../../../node_modules/react/lib/ReactTestUtils';
import $					from 'jquery';
import DragDrop		from './drag_and_drop';

describe('Drag and Drop-------------------------------------------------------------------------------------------------', ()=>{
	var instance;
	var item;

	beforeEach(()=>{
		item = {
			id: 0,
			draggables: [],
			targets: [],
			img: ""
		};
		instance = TestUtils.renderIntoDocument(<DragDrop item={item} />);
	});

	it('Renders the Key type components', ()=>{
			expect(instance).toBeDefined();
	});
});