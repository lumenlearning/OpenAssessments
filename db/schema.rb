# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20180313034310) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "accounts", force: :cascade do |t|
    t.string   "name"
    t.string   "domain"
    t.string   "lti_key"
    t.string   "lti_secret"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "canvas_uri",                 limit: 2048
    t.string   "code"
    t.boolean  "restrict_signup",                         default: true
    t.boolean  "restrict_assessment_create",              default: true
    t.boolean  "restrict_public",                         default: true
    t.string   "default_style"
  end

  add_index "accounts", ["code"], name: "index_accounts_on_code", using: :btree
  add_index "accounts", ["domain"], name: "index_accounts_on_domain", unique: true, using: :btree

  create_table "assessment_outcomes", force: :cascade do |t|
    t.integer  "assessment_id"
    t.integer  "outcome_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "assessment_outcomes", ["assessment_id", "outcome_id"], name: "index_assessment_outcomes_on_assessment_id_and_outcome_id", using: :btree
  add_index "assessment_outcomes", ["assessment_id"], name: "index_assessment_outcomes_on_assessment_id", using: :btree
  add_index "assessment_outcomes", ["outcome_id"], name: "index_assessment_outcomes_on_outcome_id", using: :btree

  create_table "assessment_results", force: :cascade do |t|
    t.integer  "assessment_id"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.datetime "rendered_datestamp"
    t.string   "session_status"
    t.string   "referer",            limit: 2048
    t.string   "ip_address"
    t.string   "eid",                limit: 512
    t.string   "src_url",            limit: 2048
    t.string   "identifier",         limit: 512
    t.string   "keywords",           limit: 512
    t.string   "external_user_id"
    t.string   "objectives",         limit: 1024
    t.float    "score"
    t.integer  "attempt"
    t.jsonb    "lti_outcome_data",                default: {}, null: false
    t.integer  "user_assessment_id"
    t.integer  "lti_launch_id"
    t.integer  "assessment_xml_id"
    t.jsonb    "data",                            default: {}, null: false
  end

  add_index "assessment_results", ["assessment_id"], name: "index_assessment_results_on_assessment_id", using: :btree
  add_index "assessment_results", ["lti_launch_id"], name: "index_assessment_results_on_lti_launch_id", using: :btree
  add_index "assessment_results", ["referer"], name: "index_assessment_results_on_referer", using: :btree
  add_index "assessment_results", ["session_status"], name: "index_assessment_results_on_session_status", using: :btree
  add_index "assessment_results", ["user_assessment_id"], name: "index_assessment_results_on_user_assessment_id", using: :btree
  add_index "assessment_results", ["user_id"], name: "index_assessment_results_on_user_id", using: :btree

  create_table "assessment_settings", force: :cascade do |t|
    t.integer  "assessment_id"
    t.integer  "allowed_attempts"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.string   "style"
    t.string   "per_sec"
    t.boolean  "confidence_levels"
    t.boolean  "enable_start"
    t.boolean  "is_default"
    t.integer  "account_id"
    t.string   "mode"
    t.boolean  "show_recent_results"
    t.boolean  "show_answers",        default: false
  end

  create_table "assessment_xmls", force: :cascade do |t|
    t.text     "xml"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "assessment_id"
    t.string   "kind"
    t.text     "no_answer_xml"
    t.jsonb    "data",          default: {}, null: false
  end

  add_index "assessment_xmls", ["assessment_id"], name: "index_assessment_xmls_on_assessment_id", using: :btree

  create_table "assessments", force: :cascade do |t|
    t.string   "identifier"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "title"
    t.text     "description"
    t.integer  "user_id"
    t.string   "src_url"
    t.datetime "published_at"
    t.integer  "recommended_height"
    t.string   "license"
    t.string   "keywords"
    t.integer  "account_id"
    t.string   "kind",                      default: "formative"
    t.integer  "current_assessment_xml_id"
    t.jsonb    "data",                      default: {},          null: false
  end

  add_index "assessments", ["account_id"], name: "index_assessments_on_account_id", using: :btree
  add_index "assessments", ["identifier", "user_id"], name: "index_assessments_on_identifier_and_user_id", using: :btree
  add_index "assessments", ["src_url", "user_id"], name: "index_assessments_on_src_url_and_user_id", using: :btree

  create_table "authentications", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "provider"
    t.datetime "created_at",                                null: false
    t.datetime "updated_at",                                null: false
    t.text     "json_response"
    t.string   "uid"
    t.string   "provider_avatar"
    t.string   "username"
    t.string   "provider_url",                 limit: 2048
    t.string   "encrypted_token"
    t.string   "encrypted_token_salt"
    t.string   "encrypted_token_iv"
    t.string   "encrypted_secret"
    t.string   "encrypted_secret_salt"
    t.string   "encrypted_secret_iv"
    t.string   "encrypted_refresh_token"
    t.string   "encrypted_refresh_token_salt"
    t.string   "encrypted_refresh_token_iv"
  end

  add_index "authentications", ["provider", "uid"], name: "index_authentications_on_provider_and_uid", using: :btree
  add_index "authentications", ["user_id"], name: "index_authentications_on_user_id", using: :btree

  create_table "external_identifiers", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "identifier"
    t.string   "provider"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "custom_canvas_user_id"
  end

  add_index "external_identifiers", ["identifier", "provider"], name: "index_external_identifiers_on_identifier_and_provider", using: :btree
  add_index "external_identifiers", ["user_id"], name: "index_external_identifiers_on_user_id", using: :btree

  create_table "item_results", force: :cascade do |t|
    t.string   "identifier",           limit: 512
    t.string   "sequence_index"
    t.datetime "datestamp"
    t.string   "session_status"
    t.text     "item_variable"
    t.string   "candidate_comment",    limit: 512
    t.datetime "rendered_datestamp"
    t.string   "referer",              limit: 2048
    t.string   "ip_address"
    t.integer  "item_id"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "assessment_result_id"
    t.integer  "time_elapsed"
    t.integer  "confidence_level"
    t.string   "eid",                  limit: 512
    t.string   "src_url",              limit: 2048
    t.string   "external_user_id"
    t.string   "keywords",             limit: 512
    t.string   "objectives",           limit: 1024
    t.boolean  "correct"
    t.float    "score"
    t.string   "outcome_guid"
    t.string   "answers_chosen"
  end

  add_index "item_results", ["assessment_result_id"], name: "index_item_results_on_assessment_result_id", using: :btree
  add_index "item_results", ["item_id"], name: "index_item_results_on_item_id", using: :btree
  add_index "item_results", ["user_id"], name: "index_item_results_on_user_id", using: :btree

  create_table "items", force: :cascade do |t|
    t.string   "identifier"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "title",             limit: 512
    t.text     "description"
    t.integer  "section_id"
    t.text     "question_text"
    t.text     "answers"
    t.text     "feedback"
    t.text     "item_feedback"
    t.text     "correct_responses"
    t.string   "base_type"
    t.string   "keywords",          limit: 512
  end

  add_index "items", ["identifier", "section_id"], name: "index_items_on_identifier_and_section_id", using: :btree

  create_table "lti_credentials", force: :cascade do |t|
    t.string   "name"
    t.integer  "account_id"
    t.string   "lti_key"
    t.string   "encrypted_lti_secret"
    t.string   "encrypted_lti_secret_salt"
    t.string   "encrypted_lti_secret_iv"
    t.boolean  "enabled"
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  add_index "lti_credentials", ["account_id"], name: "index_lti_credentials_on_account_id", using: :btree
  add_index "lti_credentials", ["lti_key"], name: "index_lti_credentials_on_lti_key", unique: true, using: :btree

  create_table "lti_launches", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "account_id"
    t.integer  "lti_credential_id"
    t.string   "tc_instance_guid"
    t.string   "lti_user_id"
    t.string   "lti_context_id"
    t.string   "oauth_nonce"
    t.boolean  "was_valid"
    t.jsonb    "data",              default: {}, null: false
    t.datetime "created_at",                     null: false
    t.datetime "updated_at",                     null: false
  end

  add_index "lti_launches", ["oauth_nonce"], name: "index_lti_launches_on_oauth_nonce", using: :btree
  add_index "lti_launches", ["user_id"], name: "index_lti_launches_on_user_id", using: :btree

  create_table "outcomes", force: :cascade do |t|
    t.string   "name"
    t.string   "mc3_bank_id"
    t.string   "mc3_objective_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "permissions", force: :cascade do |t|
    t.integer  "role_id"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "permissions", ["role_id", "user_id"], name: "index_permissions_on_role_id_and_user_id", using: :btree

  create_table "profiles", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "location"
    t.decimal  "lat",           precision: 15, scale: 10
    t.decimal  "lng",           precision: 15, scale: 10
    t.text     "about"
    t.string   "city"
    t.integer  "state_id"
    t.integer  "country_id"
    t.integer  "language_id"
    t.integer  "profile_views"
    t.text     "policy"
    t.datetime "created_at",                              null: false
    t.datetime "updated_at",                              null: false
    t.string   "website"
    t.string   "blog"
    t.string   "twitter"
    t.string   "facebook"
    t.string   "linkedin"
  end

  create_table "progresses", force: :cascade do |t|
    t.integer  "assessment_result_id"
    t.jsonb    "data",                 default: {}, null: false
    t.datetime "created_at",                        null: false
    t.datetime "updated_at",                        null: false
  end

  add_index "progresses", ["assessment_result_id"], name: "index_progresses_on_assessment_result_id", unique: true, using: :btree

  create_table "roles", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "sections", force: :cascade do |t|
    t.string   "identifier"
    t.integer  "assessment_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "sections", ["identifier"], name: "index_sections_on_identifier", using: :btree

  create_table "taggings", force: :cascade do |t|
    t.integer  "tag_id"
    t.integer  "taggable_id"
    t.string   "taggable_type"
    t.integer  "tagger_id"
    t.string   "tagger_type"
    t.string   "context",       limit: 128
    t.datetime "created_at"
  end

  add_index "taggings", ["tag_id", "taggable_id", "taggable_type", "context", "tagger_id", "tagger_type"], name: "taggings_idx", unique: true, using: :btree
  add_index "taggings", ["taggable_id", "taggable_type", "context"], name: "index_taggings_on_taggable_id_and_taggable_type_and_context", using: :btree

  create_table "tags", force: :cascade do |t|
    t.string  "name"
    t.integer "taggings_count", default: 0
  end

  add_index "tags", ["name"], name: "index_tags_on_name", unique: true, using: :btree

  create_table "test_results", force: :cascade do |t|
    t.integer  "assessment_result_id"
    t.integer  "identifier"
    t.datetime "datestamp"
    t.text     "item_variable"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "test_results", ["assessment_result_id"], name: "index_test_results_on_assessment_result_id", using: :btree
  add_index "test_results", ["identifier"], name: "index_test_results_on_identifier", using: :btree

  create_table "user_accounts", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "account_id"
    t.string   "role"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "user_accounts", ["user_id", "account_id"], name: "index_user_accounts_on_user_id_and_account_id", using: :btree

  create_table "user_assessments", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "assessment_id"
    t.integer  "attempts"
    t.datetime "first_attempt_at"
    t.datetime "most_recent_attempt_at"
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.string   "eid"
    t.string   "lti_context_id"
    t.string   "lti_role"
  end

  add_index "user_assessments", ["assessment_id"], name: "index_user_assessments_on_assessment_id", using: :btree
  add_index "user_assessments", ["eid"], name: "index_user_assessments_on_eid", using: :btree
  add_index "user_assessments", ["lti_context_id"], name: "index_user_assessments_on_lti_context_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "email",                  default: "",        null: false
    t.string   "encrypted_password",     default: "",        null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email"
    t.string   "authentication_token"
    t.string   "name"
    t.integer  "role"
    t.integer  "account_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "external_id"
    t.string   "username"
    t.string   "avatar"
    t.string   "time_zone",              default: "UTC"
    t.string   "password_salt"
    t.string   "lti_key"
    t.string   "lti_secret"
    t.string   "provider_avatar"
    t.string   "profile_privacy",        default: "private"
    t.string   "profile_privacy_token"
    t.string   "active_avatar",          default: "none"
  end

  add_index "users", ["account_id"], name: "index_users_on_account_id", using: :btree
  add_index "users", ["authentication_token"], name: "index_users_on_authentication_token", unique: true, using: :btree
  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

end
