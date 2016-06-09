class CreateProgresses < ActiveRecord::Migration
  def change
    create_table :progresses do |t|
      t.integer :assessment_result_id
      t.jsonb :data, null: false, default: '{}'

      t.timestamps null: false
    end

    add_index :progresses, :assessment_result_id, unique: true
  end
end
