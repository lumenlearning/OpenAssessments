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

    return (
        <div style={_.merge(mergeStyle, style.label)}>
            Feedback
        </div>
    )
  }

}
