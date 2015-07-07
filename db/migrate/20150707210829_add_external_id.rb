class AddExternalId < ActiveRecord::Migration
  def change
    add_column :user_assessments, :eid, :string
  end
end
