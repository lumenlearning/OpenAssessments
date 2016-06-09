class Progress < ActiveRecord::Base
  belongs_to :assessment_result

  store_accessor :data, :answers

  def add_answers!(array)
    return unless array.kind_of?(Array) && array.length < 100

    self.answers ||= []
    unless self.answers.last == array
      self.answers << array
      self.save!
    end
  end
end
