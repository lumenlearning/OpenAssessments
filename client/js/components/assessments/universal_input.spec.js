"use strict";

import React              from 'react';
import TestUtils          from 'react/lib/ReactTestUtils';
import UniversalInput      from './universal_input';

describe('Assessment Questions', ()=> {
  var result;
  var item;

  beforeEach(()=>{
    item = {
      id       : 0,
      question_type: "multiple_choice_question",
      answers  : ["Hello", "You", "Check"],
      url      : "www.iamcool.com",
      title    : "title",
      xml      : null,
      standard : 'edX',
      edXMaterial : "<p>hello world</p>",
      answers  : [{id: "0", material: "test1"}, {id: "1", material: "test2"}],
      isGraded : true,
      messages : ["My Message1", "My Message2"],
      solution : "<p>solution text</p>"
    };

    result = TestUtils.renderIntoDocument(<UniversalInput item={item} />);
  });

  it('It Renders the page', ()=>{
    expect(React.findDOMNode(result)).toBeDefined();
  });

  it('It renders the title', ()=>{
    expect(React.findDOMNode(result).textContent).toContain('title');
  });

  it('It renders the question text', ()=>{
    expect(React.findDOMNode(result).textContent).toContain(item.messages[0]);
    expect(React.findDOMNode(result).textContent).toContain(item.messages[1]);
  });

  xdescribe('Drag and Drop', ()=>{
    beforeEach(()=>{
      item.answers = [{
        id: 0,
        type: 'key',
        draggables: [{id:'0', label:'drag1'},{id:'1', label:'drag2'},{id:'2', label:'drag3'}],
        targets: [{id:'0', height:'100', width:'180', xPos:'10', yPos:'10'}],
        img: 'http://www.bealecorner.com/trv900/respat/eia1956-small.jpg'
      },{
        id: 0,
        type: 'value',
        draggables: [{id:'0', label:'drag1'},{id:'1', label:'drag2'},{id:'2', label:'drag3'}],
        img: 'http://www.bealecorner.com/trv900/respat/eia1956-small.jpg'
      }];
      item.question_type = 'edx_drag_and_drop';
      result = TestUtils.renderIntoDocument(<UniversalInput item={item} />);
    });

    it('Renders the components', ()=>{
      expect(TestUtils.scryRenderedDOMComponentsWithTag(result, 'DragAndDrop')).toBeDefined();
    });
  });

  describe('Multiple Choice', ()=>{

    beforeEach(()=>{
      item.question_type = 'multiple_choice_question';
      result = TestUtils.renderIntoDocument(<UniversalInput item={item} />);
    });

    it('It Renders the radio buttons', ()=>{
      expect(TestUtils.scryRenderedComponentsWithType(result, 'radio')).toBeDefined();
    });

    it('It Renders the option text', ()=>{
      expect(React.findDOMNode(result).textContent).toContain(item.answers[0].material);
      expect(React.findDOMNode(result).textContent).toContain(item.answers[1].material);
    });
  });

  describe('Numerical Input', ()=>{

    beforeEach(()=>{
      item.question_type = 'edx_numerical_input';
      result = TestUtils.renderIntoDocument(<UniversalInput item={item} />);
    });

    it('Renders the sub-question text', ()=>{
      expect(React.findDOMNode(result).textContent).toContain(item.answers[0].material);
      expect(React.findDOMNode(result).textContent).toContain(item.answers[1].material);
    });

    it('Renders the text input', ()=>{
      expect(TestUtils.scryRenderedDOMComponentsWithTag(result, 'input')).toBeDefined();
    });
  });

  describe('Text Input', ()=>{
    beforeEach(()=>{
      item.question_type = 'edx_numerical_input';
      result = TestUtils.renderIntoDocument(<UniversalInput item={item} />);
    });

    it('Renders the sub-question text', ()=>{
      expect(React.findDOMNode(result).textContent).toContain(item.answers[0].material);
      expect(React.findDOMNode(result).textContent).toContain(item.answers[1].material);
    });

    it('Renders the text input', ()=>{
      expect(TestUtils.scryRenderedDOMComponentsWithTag(result, 'input')).toBeDefined();
    });
  });

  describe('Drop Down', ()=>{

    beforeEach(()=>{
      item.question_type = 'edx_dropdown';
      item.answers = [{ id: 0, material: ['option1', 'option2', 'option3']}];
      result = TestUtils.renderIntoDocument(<UniversalInput item={item} />);
    });

    it('Renders the drop down element', ()=>{
      expect(TestUtils.scryRenderedDOMComponentsWithTag(result, 'select')).toBeDefined();
    });

    it('All the options are in the dropdown', ()=>{
        var options = TestUtils.scryRenderedDOMComponentsWithTag(result, 'option');
        expect(options[0].getDOMNode().textContent).toContain('option1');
        expect(options[1].getDOMNode().textContent).toEqual('option2');
        expect(options[2].getDOMNode().textContent).toEqual('option3');
      }
    );
  });

  describe('Image Mapped Input', ()=>{

    beforeEach(()=>{
      item.question_type = 'edx_image_mapped_input';
      item.answers = [{ id: 0, material:['100','100','100','100'], coordinates: ['200','200','200','200'], height: 100, width: 100}];
      result = TestUtils.renderIntoDocument(<UniversalInput item={item} />);
    });
    it('Renders the image to the page', ()=>{
      expect(TestUtils.scryRenderedDOMComponentsWithTag(result, 'img')).toBeDefined();
    });

  });

  xdescribe('Problem with Adaptive Hint', ()=>{});

  describe('Multiple Answer', ()=>{

    beforeEach(()=>{
      item.question_type = 'multiple_answers_question';
      result = TestUtils.renderIntoDocument(<UniversalInput item={item} />);
    });

    it('Renders the checkboxes', ()=>{
      expect(TestUtils.scryRenderedComponentsWithType(result,'checkbox')).toBeDefined();
    });

    it('Checkbox text is rendered', ()=>{
      expect(React.findDOMNode(result).textContent).toContain(item.answers[0].material);
      expect(React.findDOMNode(result).textContent).toContain(item.answers[1].material);
    });
  });

  it('Renders the solution', ()=>{
    expect(React.findDOMNode(result).textContent).toContain('solution text');
  });

  xit('Does not render the solution if the question is not answered', ()=>{
    expect(React.findDOMNode(result).textContent).toContain(item.answers);
  });

});