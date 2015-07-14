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
  ASSESSMENT_SUBMITTED: "assessment_submitted",
  ANSWER_SELECTED: "answer_selected",
  ASSESSMENT_GRADED: "assessment_graded",
  CLEAR_SELECTED_ANSWERS: "clear_selected_answers",
  EDX_LOAD_SECTION: "edx_load_section",
  EDX_LOAD_ITEM: "edx_load_item",
  EDX_LOAD_ASSESSMENT: "edx_load_assessment",
  QUESTION_SELECTED: "question_selected",

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
  CREATED_USER: "created_user"
};
