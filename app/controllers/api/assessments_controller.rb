class Api::AssessmentsController < ApplicationController
  
  before_action :validate_token
  before_action :skip_trackable
  
  respond_to :xml, :json

  def index
    page = (params[:page] || 1).to_i
    per_page = 100
    @assessments = Assessment.all
    if params[:q].present?
      q = "%#{params[:q]}%"
      @assessments = @assessments.where("title ILIKE ? OR description ILIKE ?", q, q).paginate(:page => page, :per_page => per_page)
    end
    respond_to do |format|
      format.json { render :json => @assessments }
      format.xml { render }
    end
  end

  def show
    assessment = Assessment.find(params[:id])
    respond_to do |format|
      format.json { render :json => assessment }
      format.xml { render :text => assessment.assessment_xmls.by_newest.first.xml }
    end
  end

  def create
    assessment = Assessment.from_xml(request.body.read, current_user)
    respond_with(:api, assessment)
  end

end
