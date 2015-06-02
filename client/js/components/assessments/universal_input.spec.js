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

  xdescribe('Numerical Input', ()=>{});
  xdescribe('Text Input', ()=>{});
  xdescribe('Drop Down', ()=>{});
  xdescribe('Image Mapped Input', ()=>{});
  xdescribe('Problem with Adaptive Hint', ()=>{});

  it('Renders the solution', ()=>{
    expect(React.findDOMNode(result).textContent).toContain('solution text');
  });

  xit('does not render the solution if the question is not answered', ()=>{
    expect(React.findDOMNode(result).textContent).toContain(item.solution);
  });

});