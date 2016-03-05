class CreateLtiCredentials < ActiveRecord::Migration
  def change
    create_table :lti_credentials do |t|
      t.string :name
      t.integer :account_id, required: true
      t.string :lti_key, required: true
      t.string :encrypted_lti_secret
      t.string :encrypted_lti_secret_salt
      t.string :encrypted_lti_secret_iv
      t.boolean :enabled

      t.timestamps null: false
    end
    add_index(:lti_credentials,:lti_key, unique: true)
    add_index(:lti_credentials,:account_id)
  end
end
