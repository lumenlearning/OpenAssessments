class CreateLtiLaunches < ActiveRecord::Migration
  def change
    create_table :lti_launches do |t|
      t.integer :user_id
      t.integer :account_id
      t.integer :lti_credential_id
      t.string :tc_instance_guid # AKA tool_consumer_instance_guid
      t.string :lti_user_id
      t.string :lti_context_id
      t.string :oauth_nonce
      t.boolean :was_valid
      t.jsonb :data, null: false, default: '{}'

      t.timestamps null: false
    end

    add_index(:lti_launches, :user_id)
    add_index(:lti_launches,:oauth_nonce, unique: false)

    add_column(:assessment_results, :lti_launch_id, :integer)
  end
end
