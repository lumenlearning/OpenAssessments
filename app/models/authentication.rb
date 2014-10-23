class Authentication < ActiveRecord::Base

  belongs_to :user, :inverse_of => :authentications

  validates :provider, :presence => true, :uniqueness => {:scope => [:uid, :user_id, :provider_url]}

end
