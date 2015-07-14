class AddAccountSecurity < ActiveRecord::Migration
  def change
    add_column :accounts, :restrict_signup, :boolean, default: true
    add_column :accounts, :restrict_assessment_create, :boolean, default: true
  end
end
