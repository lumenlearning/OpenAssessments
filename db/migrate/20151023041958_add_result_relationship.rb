class AddResultRelationship < ActiveRecord::Migration
  def change
    add_column :assessment_results, :user_assessment_id, :integer

    add_index :assessment_results, :user_assessment_id

      set_result_foreign_ids
  end

  def set_result_foreign_ids
    UserAssessment.all.find_each do |ua|
      AssessmentResult.where(user_id: ua.user_id, assessment_id: ua.assessment_id, user_assessment_id: nil).update_all(user_assessment_id: ua.id)
    end
  end
end
