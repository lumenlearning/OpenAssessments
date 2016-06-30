import React, { Component, PropTypes } from 'react';

export default class AccordionHeader extends Component {

  hr() {
    if (this.props.dividers) {
      return this.props.reactKey !== 0 ? <hr/> : null;
    }
    else {
      return null;
    }
  }

  setHeaderTag() {
    var hTag = '';

    if (!this.props.hTag) {
      hTag = <h3 {...this.returnHeaderProps()}>{this.props.title}</h3>;
    }

    if (this.props.hTag === 'h1') {
      hTag = <h1 {...this.returnHeaderProps()}>{this.props.title}</h1>;
    }
    else if (this.props.hTag === 'h2') {
      hTag = <h2 {...this.returnHeaderProps()}>{this.props.title}</h2>;
    }
    else if (this.props.hTag === 'h3') {
      hTag = <h3 {...this.returnHeaderProps()}>{this.props.title}</h3>;
    }
    else if (this.props.hTag === 'h4') {
      hTag = <h4 {...this.returnHeaderProps()}>{this.props.title}</h4>;
    }
    else if (this.props.hTag === 'h5') {
      hTag = <h5 {...this.returnHeaderProps()}>{this.props.title}</h5>;
    }
    else if (this.props.hTag === 'h6') {
      hTag = <h6 {...this.returnHeaderProps()}>{this.props.title}</h6>;
    }

    return hTag;
  }

  returnHeaderProps() {
    var props = {
      'aria-controls': `react-accordionlly-section-body-${ this.props.reactKey }`,
      'className': "react-accordionlly-section-title",
      'id': `react-accordionlly-section-title-${ this.props.reactKey }`
    }

    return props;
  }

  render() {
    var arrowToggle = {
      transform: this.props.expanded ? 'rotate(90deg)' : 'none',
      transition: 'transform .3s ease'
    }

    return (
      <div style={{display:'block'}}>
        {this.hr()}
        <div
          onClick={this.props.onClick}
          className="react-accordionlly-section-title-wrapper"
          >
          {this.setHeaderTag()}
          <div className="space"></div>
          <div
            className={"react-accordionlly-section-title-toggle-indicator"}
            style={arrowToggle}
            >
            &#10095;
          </div>
        </div>
      </div>
    );
  }

}
