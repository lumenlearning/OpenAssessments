class CreateAccounts < ActiveRecord::Migration
  def change

    create_table "accounts", force: true do |t|
      t.string   "name"
      t.string   "domain"
      t.string   "lti_key"
      t.string   "lti_secret"
      t.datetime "created_at"
      t.datetime "updated_at"
      t.string   "canvas_api_key"
      t.string   "canvas_uri",     limit: 2048
      t.string   "code"
    end

    add_index "accounts", ["code"], name: "index_accounts_on_code", using: :btree
    add_index "accounts", ["domain"], name: "index_accounts_on_domain", unique: true, using: :btree

    create_table "external_identifiers", force: true do |t|
      t.integer  "user_id"
      t.string   "identifier"
      t.string   "provider"
      t.datetime "created_at"
      t.datetime "updated_at"
      t.string   "custom_canvas_user_id"
    end

    add_index "external_identifiers", ["identifier", "provider"], name: "index_external_identifiers_on_identifier_and_provider", using: :btree
    add_index "external_identifiers", ["user_id"], name: "index_external_identifiers_on_user_id", using: :btree

  end
end