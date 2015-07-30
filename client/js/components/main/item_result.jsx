"use strict";

import React            from 'react';
import UniversalInput   from '../assessments/universal_input';
import ResultConfidence from '../common/result_confidence';
export default class ItemResult extends React.Component{
  
  getStyles(props, theme){
    var color;
    var border;
    if(props.isCorrect == "partial"){
      color = theme.partialBackgroundColor;
      border = theme.partialBorder;
    } else if (props.isCorrect == false){
      border = theme.correctBorder;
      color = theme.incorrectBackgroundColor;
    } else if (props.isCorrect){
      color = theme.correctBackgroundColor;
      border = theme.correctBorder
    }
    return {
      resultContainer: {
        backgroundColor: color,
        border: border,
        borderRadius : "4px",
        padding: "20px",
      },
      confidenceWrapper: {
        width: theme.confidenceWrapperWidth,
        height: theme.confidenceWrapperHeight,
        padding: theme.confidenceWrapperPadding,
        marginTop: "50px",
        backgroundColor: theme.confidenceWrapperBackgroundColor,
      },
    };
  }
  render() {
    console.log(this.props.isCorrect)
    var styles = this.getStyles(this.props, this.context.theme)
    return (
      <div>
        <div className="row">
          <div className="col-md-9" style={styles.resultContainer}>
            <div>
              {this.props.question.material}
            </div>
            <div>
              <UniversalInput item={this.props.question} isResult={true}/>
            </div>
            <div style={styles.confidenceWrapper}>
              <ResultConfidence level={this.props.confidence} />
            </div>
          </div>
          <div className="col-md-3"></div>
        </div> 
        <div className="row">
          
        </div>
        <hr />
      </div>
    );
  }

}

ItemResult.contextTypes = {
  theme: React.PropTypes.object
}

ItemResult.propTypes = {
  question: React.PropTypes.object.isRequired,
  confidence: React.PropTypes.string.isRequired,
  isCorrect: React.PropTypes.bool.isRequired
}