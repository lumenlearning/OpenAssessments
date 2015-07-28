class FixSummativeSpelling < ActiveRecord::Migration
  def change
    change_column :assessments, :kind, :string, default: "Summative"
  end
end
