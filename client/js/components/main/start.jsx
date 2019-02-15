"use strict";

// Dependencies
import React from 'react';
import $ from "jquery";
// Actions
import AssessmentActions from "../../actions/assessment";
import UserAssessmentActions from "../../actions/user_assessments";
// Stores
import AssessmentStore from "../../stores/assessment";
import SettingsStore from "../../stores/settings";
import UserAssessmentStore from "../../stores/user_assessment";
//Subcomponents
import BaseComponent from "../base_component";
import CheckUnderstanding from "../assessments/check_understanding";
import CommHandler from "../../utils/communication_handler";
import FullPostNav from "../post_nav/full_post_nav.jsx";
import Item from "../assessments/item";
import Loading from "../assessments/loading";
import ProgressDropdown from "../common/progress_dropdown";

// Start Component
export default class Start extends BaseComponent {

  constructor(props, context) {
    super(props, context);

    this.state = this.getState(context);
    this.stores = [AssessmentStore, SettingsStore, UserAssessmentStore];
    this.context = context;

    UserAssessmentActions.loadUserAttempts(SettingsStore.current().userAssessmentId, SettingsStore.current().externalContextId, SettingsStore.current().assessmentId);

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
      questionCount: AssessmentStore.questionCount(),
      settings: SettingsStore.current(),
      attemptsData: UserAssessmentStore.currentAttempts()
    }
  }

  render() {
    let styles = this.getStyles(this.context.theme);

    return (
      <div className="assessment" style={styles.assessment}>
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
          title={this.state.settings.assessmentTitle}
          maxAttempts={this.state.settings.allowedAttempts}
          userAttempts={this.state.settings.userAttempts}
          attemptsData={this.state.attemptsData}
          eid={this.state.settings.lisUserId}
          userId={this.state.settings.userId}
          isLti={this.state.settings.isLti}
          assessmentId={this.state.settings.assessmentId}
          assessmentKind={this.state.settings.assessmentKind}
          ltiRole={this.state.settings.ltiRole}
          externalContextId={this.state.settings.externalContextId}
          accountId={this.state.settings.accountId}
          icon={this.state.settings.images.QuizIcon_svg}
          />
      );
    }
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
        borderTop: "2px solid #003136",
        borderBottom: "1px solid #c4cdd5",
        padding: "22px 40px 22px 0",
        fontSize: "20px",
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
