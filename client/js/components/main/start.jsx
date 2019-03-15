"use strict";

// Dependencies
import React from 'react';
import $ from "jquery";
// Actions
import AssessmentActions from "../../actions/assessment";
import ReviewAssessmentActions from "../../actions/review_assessment";
// Stores
import AssessmentStore from "../../stores/assessment";
import SettingsStore from "../../stores/settings";
import ReviewAssessmentStore from "../../stores/review_assessment";
//Subcomponents
import BaseComponent from "../base_component";
import CheckUnderstanding from "../assessments/check_understanding";
import CommHandler from "../../utils/communication_handler";
import FullPostNav from "../post_nav/full_post_nav.jsx";
import Item from "../assessments/item";
import Loading from "../assessments/loading";
import ProgressDropdown from "../common/progress_dropdown";
import WaitModal from "../assessments/summative/feature/WaitModal.jsx";

// Start Component
export default class Start extends BaseComponent {

  constructor(props, context) {
    super(props, context);

    this.state = this.getState(context);
    this.stores = [AssessmentStore, SettingsStore, ReviewAssessmentStore];
    this.context = context;

    ReviewAssessmentActions.loadAssessmentForStudentReview(SettingsStore.current(), SettingsStore.current().assessmentId, SettingsStore.current().userAssessmentId);
    ReviewAssessmentActions.loadAssessmentXmlForStudentReview(SettingsStore.current(), SettingsStore.current().assessmentId, SettingsStore.current().userAssessmentId);

    // Rebindings
    this._bind["getStyles"];
  }

  getState(context) {
    let showStart = SettingsStore.current().enableStart && !AssessmentStore.isStarted();

    if (!showStart && !AssessmentStore.isStarted()) {
      AssessmentActions.start(SettingsStore.current().eId, SettingsStore.current().assessmentId, SettingsStore.current().externalContextId);
      AssessmentActions.loadAssessment(window.DEFAULT_SETTINGS, $('#srcData').text());
      context.router.transitionTo("assessment");
    }

    return {
      showStart: showStart,
      showModal: false,
      assessmentAttemptsOutcomes: ReviewAssessmentStore.outcomes(),
      assessmentAttempts: this.orderBySequence(ReviewAssessmentStore.getAttemptedAssessments()),
      questionCount: AssessmentStore.questionCount(),
      settings: SettingsStore.current()
    }
  }

  render() {
    let styles = this.getStyles(this.context.theme);

    return (
      <div className="assessment" style={styles.assessment}>
        {this.renderWaitModal()}
        {this.renderTitleBar(styles)}
        <div className="section_list">
          <div className="section_container">
            {this.renderContent()}
          </div>
        </div>
        <FullPostNav/>
      </div>
    );
  }

  componentDidMount() {
    super.componentDidMount();

    if (this.state.isLoaded) {
      // Trigger action to indicate the assessment was viewed
      AssessmentActions.assessmentViewed(this.state.settings, this.state.assessment);
    }

    CommHandler.sendSize();
  }

  renderWaitModal() {
    if (this.state.showModal) {
      return (
        <WaitModal
          hideModal={() => this.hideModal()}
          showModal={this.state.showModal}
          />
      );
    }
  }

  renderTitleBar(styles) {
    // If this is any assessment type *other* than formative, render title bar
    if (this.state.settings.assessmentKind.toUpperCase() !== "FORMATIVE") {
      return (
        <div className="assessment-header" style={styles.titleBar}>
          {this.state.settings ? this.state.settings.assessmentTitle : ""}
        </div>
      );
    }
  }

  renderContent() {
    if (this.state.showStart) {
      return (
        <CheckUnderstanding
          accountId={this.state.settings.accountId}
          assessmentAttempts={this.state.assessmentAttempts}
          assessmentAttemptsOutcomes={this.state.assessmentAttemptsOutcomes}
          assessmentId={this.state.settings.assessmentId}
          assessmentKind={this.state.settings.assessmentKind}
          eid={this.state.settings.lisUserId}
          externalContextId={this.state.settings.externalContextId}
          icon={this.state.settings.images.QuizIcon_svg}
          isLti={this.state.settings.isLti}
          ltiRole={this.state.settings.ltiRole}
          maxAttempts={this.state.settings.allowedAttempts}
          showModal={() => this.showModal()}
          studyAndMasteryFeedback={this.studyAndMasteryFeedback()}
          title={this.state.settings.assessmentTitle}
          userAttempts={this.state.settings.userAttempts}
          userId={this.state.settings.userId}
          />
      );
    }
  }

  studyAndMasteryFeedback() {
    if (this.state.settings.assessmentKind.toUpperCase() === "SUMMATIVE") {
      let positiveList = _.clone(this.state.assessmentAttemptsOutcomes);
      let negativeList = [];

      if (this.state.assessmentAttempts) {
        let lastAttempt = this.state.assessmentAttempts[this.state.assessmentAttempts.length - 1];

        if (lastAttempt) {
          lastAttempt.assessment_result_items.forEach((chosenAnswer, index) => {
            if (chosenAnswer.correct !== true) {
              negativeList = negativeList.concat(_.filter(positiveList, 'outcomeGuid', chosenAnswer.outcome_guid));
              positiveList = _.reject(positiveList, 'outcomeGuid', chosenAnswer.outcome_guid);
            }
          });
        }
      }

      return ({
        positiveList: positiveList,
        negativeList: negativeList
      });
    }
  }

  orderBySequence(list) {
    if (list) {
      return [...list].sort((a, b) => {
        return a.assessment_result_attempt - b.assessment_result_attempt
      });
    }
  }

  showModal() {
    this.setState({showModal: true});
  }

  hideModal() {
    this.setState({showModal: false});
  }

  getStyles(theme) {
    let minWidth = this.state.settings.assessmentKind.toUpperCase()  == "FORMATIVE" ? "480px" : "635px";

    return {
      progressBar: {
        backgroundColor: theme.progressBarColor,
        height: theme.progressBarHeight,
      },
      progressDiv: {
        height: theme.progressBarHeight
      },
      assessment: {
        padding: this.state.settings.assessmentKind.toUpperCase()  == "FORMATIVE" ? "" : theme.assessmentPadding,
        backgroundColor: theme.assessmentBackground,
        minWidth: minWidth
      },
      progressContainer: {
        padding: "10px 20px 10px 20px",
        position: "absolute",
        left: "0px",
        top: "44px",
        width: "100%",
        minWidth: minWidth,
        backgroundColor: theme.titleBarBackgroundColor,
      },
      titleBar: {
        borderBottom: "2px solid #003136",
        padding: "22px 40px 22px 0",
        fontFamily: "Arial",
        fontSize: "28px",
        fontWeight: "400",
        color: "#212b36",
        lineHeight: "1.4"
      }
    }
  }
}

Start.contextTypes = {
  router: React.PropTypes.func,
  theme: React.PropTypes.object,
};
