import React, { Component, PropTypes } from 'react';

export default class Accordion extends Component {

  constructor(props) {
    super(props);
  }

  renderSections() {
    if (!this.props.children) {
      return null;
    }

    return this.props.children.map((section, index) => {
      return React.cloneElement(section, {
        show: this.props.showAll,
        reactKey: index,
        hTag: this.props.hTag,
        dividers: this.props.dividers
      });
    });
  }

  render() {
    return (
      <div className="react-accordionlly" role="tablist">
        {this.renderSections()}
      </div>
    )
  }
}
