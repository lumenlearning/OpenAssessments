'use strict'

import React from 'react';
import Style from './css/style.js';
import Tooltip from '../../common/tooltip/tooltip.jsx';

export default class FeedbackLabels extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let style = Style.styles();
    let mergeStyle = this.props.styles || {};
    let message = "The ability to show the feedback you enter below to students who select the corresponding answer choice is coming.";

    return (
        <div style={_.merge(mergeStyle, style.label)}>
          <Tooltip message={message} position='top-right' style={{maxWidth: "300px"}}>
            Feedback <img style={style.warningImg} src="/assets/warning-32.png" alt={message} />
          </Tooltip>
        </div>
    )
  }

}
