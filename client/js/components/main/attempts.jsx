"use strict";
// Dependencies
import moment from 'moment';
import React from 'react';
import { Table, Tr, Td } from 'reactable';
// Actions
import ReviewAssessmentActions from "../../actions/review_assessment";
import UserAssessmentActions from "../../actions/user_assessments";
// Stores
import ReviewAssessmentStore from "../../stores/review_assessment";
import SettingsStore from "../../stores/settings";
import UserAssessmentsStore from "../../stores/user_assessment";
// Subcomponents
import BaseComponent from "../base_component";
import TeacherOptions from "../assessments/teacher_options/TeacherOptions";
import TitleBar from "../common/TitleBar";

export default class Attempts extends BaseComponent {
  constructor(props, context) {
    super(props, context);

    this.stores = [UserAssessmentsStore];
    this.context = context;
    this.state = this.getState();

    UserAssessmentActions.loadUserAssessments(props.params.contextId, props.params.assessmentId);

    if (!ReviewAssessmentStore.isLoaded() && !ReviewAssessmentStore.isLoading()) {
      ReviewAssessmentActions.loadAssessment(window.DEFAULT_SETTINGS);
    }
  }

  getState() {
    return {
      userAssessments: UserAssessmentsStore.current(),
      settings: SettingsStore.current(),
    };
  }

  render() {
    let assessmentTitle = this.state.settings ? this.state.settings.assessmentTitle : "";
    let styles = this.getStyles();
    let that = this;

    return (
      <div style={styles.componentWrapper}>
        <TitleBar
          title={assessmentTitle}
          assessmentKind={this.state.settings.assessmentKind}
          assessmentLoaded={this.state.isLoaded}
          />
        <TeacherOptions
          assessmentId={this.props.params.assessmentId}
          context={this.context}
          externalContextId={this.state.settings.externalContextId}
          />

        <div style={styles.attemptsWrapper}>
          <h2>Attempts for <span>{this.quiz_name()}</span></h2>
          {this.no_quizzes()}
        </div>

        <Table
          className="small-12 columns"
          id="attempts_table"
          role="grid"
          style={{tableLayout:"fixed", width: "100%"}}
          filterPlaceholder="Filter by student name..."
          sortable={["Student Name"]}
          defaultSort="Student Name"
          filterable={["Student Name"]}
          >
            {this.state.userAssessments.map((ua) => {
              return (
                <Tr key={ua.id}>
                  <Td column="Student Name" value={ua.user.name}>
                    <span title={ua.user.email}>{ua.user.name}</span>
                  </Td>
                  <Td column="Attempts">{that.attemptsStuff(ua)}</Td>
                  <Td column="Attempts Remaining">{ua.attempts_left}</Td>
                  <Td column="Actions">{that.actions(ua)}</Td>
                </Tr>
              );
            })}
        </Table>
      </div>
    );
  }

  setAttempts(id, count) {
    UserAssessmentActions.updateUserAssessment(
      id,
      {
        attempts: count,
        context_id: this.props.params.contextId
      }
    );
  }

  reviewAttempt(id) {
    this.context.router.transitionTo(
      "teacher-review",
      {
        contextId: this.props.params.externalContextId,
        assessmentId: this.props.params.assessmentId,
        attempdId: id
      }
    );
  }

  attemptsStuff(ua) {
    let that = this;

    return (
      <div>
        {ua.attempts.slice().reverse().map((attempt) => {
          let score = "Un-submitted";
          let m = moment(attempt.created_at);
          let dateSent = m.format("ddd, MMM Do, h:mm a [GMT] ZZ") + " (" + m.fromNow() + ")";
          let attemptCount = attempt.attempt + 1;

          if (attempt.score) {
            score = Math.floor(attempt.score) + "%";

            return (
              <p
                title={dateSent}
                onClick={() => { that.reviewAttempt(attempt.id); }}
                style={{textDecoration:"underline", cursor: "pointer"}}
                >
                  {attemptCount}) Score: {score}
              </p>
            );
          } else {
            return (
              <p
                title={dateSent}
                style={{cursor: "help"}}
                >
                  {attemptCount}) {score}
              </p>
            );
          }
        })}
      </div>
    );
  }

  timeStuff(ua) {
    return (
      <div>
        {ua.attempts.map((attempt) => {
          let m = moment(attempt.created_at);
          let dateSent = m.format("ddd, MMM Do, h:mm a [GMT] ZZ");
          let relativeTime = m.fromNow();

          return (
            <p title={relativeTime}>{dateSent}</p>
          );
        })}
      </div>
    );
  }

  actions(ua) {
    if (ua.attempts_left == 1) {
      return (
        <button
          className="btn btn-info"
          onClick={() => { this.setAttempts(ua.id, 0); }}
          >
            Grant 1 attempt
        </button>
      );
    } else if (ua.attempts_left == 0) {
      return (
        <div>
          <p>
            <button
              className="btn btn-info"
              onClick={() => { this.setAttempts(ua.id, 1); }}
              >
                Grant 1 attempt
            </button>
          </p>
          <p>
            <button
              className="btn btn-info"
              onClick={() => { this.setAttempts(ua.id, 0); }}
              >
                Grant 2 attempts
            </button>
          </p>
        </div>
      );
    }
  }

  quiz_name() {
    return (
      this.state.userAssessments[0] ? this.state.userAssessments[0].assessment.name : "this quiz"
    );
  }

  no_quizzes() {
    if (this.state.userAssessments.length == 0) {
      return (
        <p>There have not been any attempts for this quiz yet.</p>
      );
    }
  }

  getStyles() {
    return {
      componentWrapper: {
        background: "#fff",
        padding: "0 25px"
      },
      attemptsWrapper: {
        textAlign:"center"
      },
      titleBar: {
        borderBottom: "2px solid #003136",
        padding: "22px 40px 22px 16px",
        fontFamily: "Arial",
        fontSize: "28px",
        fontWeight: "400",
        color: "#212b36",
        lineHeight: "1.4"
      }
    };
  }
}

Attempts.contextTypes = {
  theme: React.PropTypes.object,
  router: React.PropTypes.func,
};

module.export = Attempts;
