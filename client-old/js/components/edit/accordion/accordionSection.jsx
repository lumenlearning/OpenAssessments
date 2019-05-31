import React, { Component, PropTypes } from 'react';
import AccordionHeader                 from './accordionHeader.jsx';
import AccordionBody                   from './accordionBody.jsx';

export default class AccordionSection extends Component {

  constructor(props) {
    super(props);
    this.state = {
      active: props.show
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      active: !this.state.active
    });
  }

  getProps() {
    var props = {
      className: 'react-accordionlly-section',
      role: 'tabpanel'
    }

    if (this.state.active) {
      props['aria-expanded'] = true;
    }
    else {
      props['aria-hidden'] = true;
    }

    return props;
  }

  render() {
    const expanded = this.state.active ? true : false;

    return (
      <div {...this.getProps()} ref="section">
        <AccordionHeader
          reactKey={this.props.reactKey}
          title={this.props.title}
          onClick={this.toggle}
          expanded={expanded}
          hTag={this.props.hTag}
          dividers={this.props.dividers}
          />
        <AccordionBody
          reactKey={this.props.reactKey}
          expanded={expanded}
          >
          {this.props.children}
        </AccordionBody>
      </div>
    );
  }
}
