class CreateAssessmentSettings < ActiveRecord::Migration
  def change
    create_table :assessment_settings do |t|
      t.integer :assessment_id
      t.integer :allowed_attempts
      
      t.timestamps null: false
    end
  end
end
