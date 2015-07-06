class CreateUserAssessments < ActiveRecord::Migration
  def change
    create_table :user_assessments do |t|
      t.integer :user_id
      t.integer :assessment_id
      t.integer :attempts
      t.datetime :first_attempt_at
      t.datetime :most_recent_attempt_at
      t.timestamps null: false
    end
  end
end
