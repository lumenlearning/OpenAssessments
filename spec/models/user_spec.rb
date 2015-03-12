require 'rails_helper'

describe User do

  before do
    @user = FactoryGirl.create(:user)
    @account = FactoryGirl.create(:account)
    @attr = {
      :name => "Example User",
      :email => "user@example.com",
      :password => "foobar888",
      :password_confirmation => "foobar888",
      :account_id => @account.id
    }
  end

  it { should belong_to(:account) }

  it { should have_many(:accounts) }
  it { should have_many(:external_identifiers) }
  it { should have_one(:profile) }

  it "should create a new instance given a valid attribute" do
    user = User.new(@attr)
    user.account = @account
    user.skip_confirmation!
    user.save!
  end

  describe "user profile" do
    it "adds a profile after the user is created" do
      @user.profile.should_not be_nil
    end
  end

  it "should require an email address" do
    no_email_user = User.new(@attr.merge(:email => ""))
    no_email_user.account = @account
    no_email_user.should_not be_valid
  end

  it "should accept valid email addresses" do
    addresses = %w[user@foo.com THE_USER@foo.bar.org first.last@foo.jp]
    addresses.each do |address|
      valid_email_user = User.new(@attr.merge(:email => address))
      valid_email_user.account = @account
      valid_email_user.should be_valid
    end
  end

  it "should reject invalid email addresses" do
    addresses = %w[user@foo,com user_at_foo.org example.user@foo.]
    addresses.each do |address|
      invalid_email_user = User.new(@attr.merge(:email => address))
      invalid_email_user.account = @account
      invalid_email_user.should_not be_valid
    end
  end

  it "should reject duplicate email addresses" do
    user = FactoryGirl.create(:user)
    user_with_duplicate_email = User.new(@attr.merge(:email => user.email))
    user_with_duplicate_email.account = @account
    user_with_duplicate_email.should_not be_valid
  end

  it "should reject email addresses identical up to case" do
    email = 'a_random_uppercase_email@example.com'
    user = FactoryGirl.create(:user, :email => email)
    user_with_duplicate_email = User.new(@attr.merge(:email => email.upcase))
    user_with_duplicate_email.account = @account
    user_with_duplicate_email.should_not be_valid
  end

  it "should raise an exception if an attempt is made to write a duplicate email to the database" do
    user = FactoryGirl.create(:user)
    user_with_duplicate_email = User.new(@attr.merge(:email => user.email))
    user_with_duplicate_email.account = @account
    lambda do
      user_with_duplicate_email.save(:validate => false)
    end.should raise_error(ActiveRecord::RecordNotUnique)
  end

  describe "passwords" do
    it "should have a password attribute" do
      @user.should respond_to(:password)
    end

    it "should have a password confirmation attribute" do
      @user.should respond_to(:password_confirmation)
    end
  end

  describe "password validations" do

    it "should require a password" do
      user = FactoryGirl.build(:user, @attr.merge(:password => "", :password_confirmation => ""))
      user.should_not be_valid
    end

    it "should require a matching password confirmation" do
      user = User.new(@attr.merge(:password_confirmation => "invalid"))
      user.account = @account
      user.should_not be_valid
    end

    it "should reject short passwords" do
      short = "a" * 5
      hash = @attr.merge(:password => short, :password_confirmation => short)
      user = User.new(hash)
      user.account = @account
      user.should_not be_valid
    end

  end

  describe "password encryption" do
    it "should have an encrypted password attribute" do
      @user.should respond_to(:encrypted_password)
    end

    it "should set the encrypted password attribute" do
      @user.encrypted_password.should_not be_blank
    end
  end

  describe "display_name" do
    it "should provide the name" do
      user = FactoryGirl.create(:user, :name => 'test guy')
      user.display_name.should == 'test guy'
    end
  end

  describe "omniauth" do
    before do
      @uid = 'test'
      @provider = 'facebook'
      @existing_email = 'test@example.com'
      @new_email = 'newtest@example.com'
    end
    describe "find_for_oauth" do
      before do
        @user = FactoryGirl.create(:user, :email => @existing_email)
        @user.authentications.create!(:uid => @uid, :provider => @provider)
      end
      describe "user already exists" do
        it "should find the existing user" do
          auth = get_omniauth('uuid' => @uid, 'provider' => @provider, 'facebook' => {'email' => @existing_email})
          user = User.find_for_oauth(auth)
          user.id.should == @user.id
          user.email.should == @existing_email
        end
      end
      describe "user doesn't exist" do
        it "should not find a user" do
          auth = get_omniauth('uuid' => 'non_existing_uid', 'provider' => @provider, 'facebook' => {'email' => 'other@example.com'})
          user = User.find_for_oauth(auth)
          user.should be_nil
        end
      end
    end
    describe "apply_oauth" do
      it "should add values from the omniauth result to the user" do
        auth = get_omniauth('uuid' => @uid, 'provider' => @provider, 'facebook' => {'email' => @new_email})
        user = User.new
        user.apply_oauth(auth)
        user.email.should == @new_email
        user.name.should == 'foo bar' # from default omniauth test data
      end
    end
    # describe "update_oauth" do
    #   it "should update the user using values from oauth" do
    #     pending "Cam write these specs"
    #   end
    # end
    # describe "params_for_create" do
    #   it "should get the create parameters for the user" do
    #   end
    # end
    # describe "setup_authentication" do
    #   it "should create an authentication for the user using the provider" do
    #   end
    # end
    # describe "associate_profile" do
    #   it "should create a profile if it doesn't exist" do
    #   end
    #   it "should not create the profile if it doesn't exist" do
    #   end
    #   it "should set profile about from auth" do
    #   end
    #   it "should set profile website from auth" do
    #   end
    # end
    # describe "associate_account" do
    #   before do
    #     @uid = 'test'
    #     @provider = 'facebook'
    #     @new_email = 'newtest@example.com'
    #   end
    #   it "should add an authentication for an existing user account" do
    #     user = FactoryGirl.create(:user, :email => 'test@example.com')
    #     auth = get_omniauth('uuid' => @uid, 'provider' => @provider, 'facebook' => {'email' => @new_email})
    #     user.associate_account(auth)
    #     user.authentications.length.should == 1
    #     user.authentications.first.uid.should == @uid
    #   end
    # end
    describe "setup_authentication" do
      before do
        @uid = 'anewuser'
        @email = 'anewuser@example.com'
      end
      it "should set the provider url" do
        provider_url = 'http://www.example.com'
        auth = get_omniauth('uuid' => @uid, 'provider' => @provider, 'facebook' => {'email' => @email, 'url' => provider_url})
        auth = @user.setup_authentication(auth)
        auth.provider_url.should == provider_url
      end
      it "should set the provider url without the path" do
        provider_url = 'http://www.example.com/some/path'
        auth = get_omniauth('uuid' => @uid, 'provider' => @provider, 'facebook' => {'email' => @email, 'url' => provider_url})
        auth = @user.setup_authentication(auth)
        auth.provider_url.should == 'http://www.example.com'
      end
      it "should handle sub domains" do
        provider_url = 'http://foo.example.com/some/path'
        auth = get_omniauth('uuid' => @uid, 'provider' => @provider, 'facebook' => {'email' => @email, 'url' => provider_url})
        auth = @user.setup_authentication(auth)
        auth.provider_url.should == 'http://foo.example.com'
      end
    end
  end

  describe 'after account creation' do
    it 'should set the current user to account_administrator' do
      @user = FactoryGirl.create(:user)
      @account_new = FactoryGirl.create(:account)
      @user.make_account_admin(:account_id => @account_new.id)
      @user.accounts.last.should == @account_new
    end
  end
end
