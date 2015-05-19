import React                  from 'react';
import TestUtils              from 'react/lib/ReactTestUtils';
import EditUserForm           from './edit_user_form';

describe('edit_user_form', function() {

  it("renders the form to edit the users", function() {
    var name = "Joseph";
    var email = "test@test.com";
    var id = 1;
    var result = TestUtils.renderIntoDocument(<EditUserForm user={{name: name, id: id, email: email}}/>);
    expect(React.findDOMNode(result).textContent).toContain(name);
  });
  
});