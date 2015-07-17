class AddRestrictPublic < ActiveRecord::Migration
  def change
    add_column :accounts, :restrict_public, :boolean, default: true
  end
end
