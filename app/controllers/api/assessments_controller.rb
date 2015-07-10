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

  # *******************************************************************
  # URL PARAMS
  # 
  # enable_start
  # => set to true or false to show the start screen 
  # style
  # => set to "lumen_learning" to use the lumen learning theme. Leave out for default style
  # asid
  # => give it an id to load an assessment setting which determines how many attempts a studen has to take the quiz. Right now there is no
  #    way to create one of these so if you need one you can find the assessment you want in the database and create one by doing .assessment_settings.create({attempts: n})
  # per_sec
  # => give it the number of random questions from each section you want.
  # confidence_levels
  # => set to true or false to display confidence controls
  # Example
  # https://assessments.lumenlearning.com/assessments/15?style=lumen_learning&asid=1&per_sec=2&confidence_levels=true&enable_start=true
  # ********************************************************************
  def create

 

    assessment = Assessment.from_xml(request.body.read, current_user)
    respond_with(:api, assessment)
  end

end
