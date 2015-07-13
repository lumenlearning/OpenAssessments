class Api::ApiController < ApplicationController
  respond_to :json

  before_action :validate_token
  before_action :skip_trackable

  skip_before_action :verify_authenticity_token
end