"use strict";

import React            from 'react';
import UniversalInput   from '../assessments/universal_input';
import ResultConfidence from '../common/result_confidence';
import ResultOutcome    from "../common/result_outcome";

export default class ItemResult extends React.Component{
  
  getStyles(props, theme){
    var color;
    var border;
    var labelColor;
    if(props.isCorrect == "partial"){
      color = theme.partialBackgroundColor;
      border = theme.partialBorder;
      labelColor = theme.partialColor;
    } else if (props.isCorrect == false){
      border = theme.correctBorder;
      color = theme.incorrectBackgroundColor;
      labelColor = theme.incorrectColor;
    } else if (props.isCorrect){
      color = theme.correctBackgroundColor;
      border = theme.correctBorder;
      labelColor = theme.correctColor;
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
        marginTop: "10px",
        backgroundColor: theme.confidenceWrapperBackgroundColor,
      },
      correctLabel: {
        backgroundColor: labelColor,
        textAlign: "center",
        padding: "10px",
        color: "white",
        fontWeight: "bold",
        borderRadius: "4px"
      }
    };
  }
  render() {
    var styles = this.getStyles(this.props, this.context.theme);
    var correctMessage = "You were incorrect."; 
    if(this.props.isCorrect == "partial"){
      correctMessage = "You were partially correct."
    } else if(this.props.isCorrect === true){
      correctMessage = "You were correct.";
    }
    return (
      <div>
        <div className="row">
          <div className="col-md-9" style={styles.resultContainer}>
            <div className="row">
              <div className="col-md-9">
              <div
                dangerouslySetInnerHTML={{
              __html: this.props.question.material
              }}></div>
              </div>
              <div className="col-md-3">
                <div style={styles.correctLabel}>{correctMessage}</div>
              </div>
            </div>
            <div>
              <UniversalInput item={this.props.question} isResult={true}/>
            </div>
            <div style={styles.confidenceWrapper}>
              <ResultConfidence level={this.props.confidence} />
            </div>
          </div>
          <div className="col-md-3">
            <ResultOutcome outcomes={this.props.question.outcomes} correct={this.props.isCorrect}/>
          </div>
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
  isCorrect: React.PropTypes.bool.isRequired, 
}