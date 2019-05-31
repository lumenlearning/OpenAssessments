import React, { Component, PropTypes } from 'react';

export default class AccordionBody extends Component {

  constructor(props, refs) {
    super(props, refs);
    this.state = {
      maxHeight: props.expanded ? 'none' : 0,
      overflow: props.expanded ? 'visible' : 'hidden',
      transition: 'max-height .3s ease'
    };
  }

  componentDidMount() {
    this.setMaxHeight();

    // Set initial overflow value to visible if section is expanded
    if (this.props.expanded) {
      this.setState({ overflow: 'visible' });
    }

    // Listen for transition to end before setting overflow
    var bodyNode = React.findDOMNode(this.refs.body);

    bodyNode.addEventListener('transitionend', () => {
      this.setState({
        overflow: this.props.expanded ? 'visible' : 'hidden'
      });
    });

  }

  componentDidUpdate(prevProps) {
    if (prevProps.expanded !== this.props.expanded) {
      this.setMaxHeight();
    }
  }

  setMaxHeight() {
    var bodyNode = React.findDOMNode(this.refs.body);

    this.setState({
      maxHeight: this.props.expanded ? bodyNode.scrollHeight + 'px' : 0,
      overflow: 'hidden'
    });
  }

  render() {
    return (
      <div
        aria-labelledby={`react-accordionlly-section-title-${ this.props.reactKey }`}
        className="react-accordionlly-section-body"
        id={`react-accordionlly-section-body-${ this.props.reactKey }`}
        style={this.state}
        ref="body"
        >
        <div className="react-accordionlly-section-body-wrapper">
          {this.props.children}
        </div>
      </div>
    );
  }

}
