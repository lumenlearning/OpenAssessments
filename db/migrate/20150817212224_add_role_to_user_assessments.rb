class AddRoleToUserAssessments < ActiveRecord::Migration
  def change
    add_column :user_assessments, :lti_role, :string
  end
end
