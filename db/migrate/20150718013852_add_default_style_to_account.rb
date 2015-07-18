class AddDefaultStyleToAccount < ActiveRecord::Migration
  def change
    add_column :accounts, :default_style, :string
  end
end
