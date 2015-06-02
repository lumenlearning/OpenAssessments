"use strict";

import React              from 'react';
import TestUtils          from 'react/lib/ReactTestUtils';
import UniversalInput      from './universal_input';

describe('Assessment Questions --------------------------------------------------------------------------', ()=> {
  var result;
  var item;

  beforeEach(()=>{
    item = {
      id       : 0,
      url      : "www.iamcool.com",
      title    : "title",
      xml      : null,
      standard : 'edX',
      edXMaterial : "<p>hello world</p>",
      answers  : [{material: "test1"}, {material: "test2"}],
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

  xdescribe('Drag and Drop', ()=>{});

  describe('Multiple Choice', ()=>{

    beforeEach(()=>{
      item.question_type = 'multiple_choice_question';
      result = TestUtils.renderIntoDocument(<UniversalInput item={item} />);
    });

    it('It Renders the radio buttons', ()=>{
      expect(TestUtils.scryRenderedDOMComponentsWithTag(result, 'input')).toBeDefined();
    });

    it('It Renders the question text', ()=>{
      expect(React.findDOMNode(result).textContent).toContain(item.answers[0].material);
    });
  });

  describe('Numerical Input', ()=>{

    beforeEach(()=>{
      item.question_type = 'edx_numerical_input';
      result = TestUtils.renderIntoDocument(<UniversalInput item={item} />);
    });

    it('Renders the question text', ()=>{
      expect(React.findDOMNode(result).textContent).toContain(item.answers[0].material);
      expect(React.findDOMNode(result).textContent).toContain(item.answers[1].material);
    });

    it('Renders the text input', ()=>{
      expect(TestUtils.scryRenderedDOMComponentsWithTag(result, 'input')).toBeDefined();
    });
  });

  xdescribe('Text Input', ()=>{});

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

  xdescribe('Image Mapped Input', ()=>{});
  xdescribe('Problem with Adaptive Hint', ()=>{});

  it('Renders the solution', ()=>{
    expect(React.findDOMNode(result).textContent).toContain('solution text');
  });

  xit('does not render the solution if the question is not answered', ()=>{
    expect(React.findDOMNode(result).textContent).toContain(item.solution);
  });

});