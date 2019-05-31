// Dependencies
import React from "react";
import ReactDOM from "react-dom";
import { Route } from "react-router";
// Views
import About from "./components/main/about";
import Assessment from "./components/main/assessment";
import AssessmentResult from "./components/assessment_results/assessment_result";
import Attempts from "./components/main/attempts";
import Edit from "./components/edit/edit";
import Index from "./components/index";
import Login from "./components/sessions/login";
import Logout from "./components/sessions/logout";
import NotFound from "./components/not_found";
import Register from "./components/users/register";
import Start from "./components/main/start";
import TeacherPreview from "./components/assessment_results/teacher_preview";
import TeacherReview from "./components/assessment_results/teacher_review";
// For IE Promise support
require("es6-promise").polyfill();

/**
 * React Router v4
 *
 * All of Open Assessments' frontend routes can be found here.
 */
export default class Router {
  static routes() {
    return (
      <Route handler={Index}>
        <Route name="start" handler={Start}/>
        <Route name="assessment" handler={Assessment}/>
        <Route name="assessment-result" handler={AssessmentResult}/>
        <Route name="teacher-review" handler={TeacherReview} path="review/:assessmentId/:attemptId"/>
        <Route name="teacher-preview" handler={TeacherPreview} path="preview/:assessmentId"/>
        <Route name="login" handler={Login}/>
        <Route name="register" handler={Register}/>
        <Route name="logout" handler={Logout}/>
        <Route name="about" handler={About}/>
        <Route name="attempts" handler={Attempts} path="attempts/:assessmentId/:contextId"/>
        <Route name="edit" handler={Edit} path="edit/:assessmentId"/>
        <Route path='*' exact={true} component={NotFound} />
      </Route>
    );
  }

  static run() {
    ReactDOM.render(this.routes, document.getElementById("App"));
  }
}
