class AddResultLtiLaunchIndex < ActiveRecord::Migration
  def change
    add_index :assessment_results, :lti_launch_id
  end
end
