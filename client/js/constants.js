"use strict";

export default {
  
  // User 
  LOGIN: "login",
  LOGIN_PENDING: "login_pending",
  REGISTER: "register",
  REGISTER_PENDING: "register_pending",
  LOGOUT_PENDING: "logout_pending",
  LOGOUT: "logout",

  // Assessments
  ASSESSMENT_LOAD: "assessment_load",
  ASSESSMENT_LOAD_PENDING: "assessment_load_pending",
  ASSESSMENT_LOADED: "assessment_loaded",
  ASSESSMENT_NEXT_QUESTION: "assessment_next_question",
  ASSESSMENT_PREVIOUS_QUESTION: "assessment_previous_question",
  ASSESSMENT_START: "assessment_start",
  ASSESSMENT_CHECK_ANSWER: "assessment_check_answer",
  ASSESSMENT_VIEWED: "assessment_viewed",
  ASSESSMENT_POST_ANALYTICS: "assessment_post_analytics",
  ASSESSMENT_POST_LTI_OUTCOME: "assessment_post_lti_outcome",
  ASSESSMENT_SUBMITTED: "assessment_submitted",
  ANSWER_SELECTED: "answer_selected",
  ASSESSMENT_GRADED: "assessment_graded",
  CLEAR_SELECTED_ANSWERS: "clear_selected_answers",
  EDX_LOAD_SECTION: "edx_load_section",
  EDX_LOAD_ITEM: "edx_load_item",
  EDX_LOAD_ASSESSMENT: "edx_load_assessment",
  QUESTION_SELECTED: "question_selected",
  RETAKE_ASSESSMENT: "retake_assessment",

  // Review Assessments
  REVIEW_ASSESSMENT_LOAD: "review_assessment_load",
  REVIEW_ASSESSMENT_LOAD_PENDING: "review_assessment_load_pending",
  REVIEW_ASSESSMENT_LOADED: "review_assessment_loaded",
  REVIEW_RESULT_LOAD: "review_result_load",
  REVIEW_RESULT_LOAD_PENDING: "review_result_load_pending",
  REVIEW_RESULT_LOADED: "review_result_loaded",

  ADD_MESSAGE: "add_message",
  REMOVE_MESSAGE: "remove_message",
  CLEAR_MESSAGES: "clear_messages",

  // settings
  SETTINGS_LOAD: "settings_load",

  // Errors
  TIMEOUT: "timeout",
  ERROR: "error",
  NOT_AUTHORIZED: "not_authorized",

  // Admin
  CHANGE_MAIN_TAB_PENDING: "change_main_tab_pending",
  
  // Accounts
  ACCOUNTS_LOADING: "accounts_loading",
  ACCOUNTS_LOADED: "accounts_loaded",
  
  USERS_LOADING: "users_loading",
  USERS_LOADED: "users_loaded",
  LOADING_SELECTED_USER_DATA: "loading_selected_user_data",

  USER_UPDATING: "user_updating",
  USER_UPDATED: "user_updated",

  RESET_USERS: "reset_users",

  ADD_USER: "add_user",
  REMOVE_USER: "remove_user",

  DELETE_USERS: "delete_users",
  DELETING_USERS: "deleting_users",
  NAV_CHANGED: "nav_changed",

  CLEAR_STORE: "clear_store",
  LEVEL_SELECTED: "level_selected", 
  CREATED_USER: "created_user",

  // UserAssessments
  USER_ASSESSMENTS_LOADING: "user_assessments_loading",
  USER_ASSESSMENTS_LOADED: "user_assessments_loaded",
  USER_ASSESSMENTS_UPDATING: "user_assessments_updating",
  USER_ASSESSMENTS_UPDATED: "user_assessments_updated"
};
