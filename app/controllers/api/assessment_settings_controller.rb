class Api::AssessmentSettingsController < ApplicationController
  before_action :set_assessment_setting, only: [:show, :edit, :update, :destroy]

  # GET /assessment_settings
  def index
    @assessment_settings = AssessmentSetting.all
  end

  # GET /assessment_settings/1
  def show
  end

  # GET /assessment_settings/new
  def new
    @assessment_setting = AssessmentSetting.new
  end

  # GET /assessment_settings/1/edit
  def edit
  end

  # POST /assessment_settings
  def create
    @assessment_setting = AssessmentSetting.new(assessment_setting_params)

    if @assessment_setting.save
      redirect_to @assessment_setting, notice: 'Assessment setting was successfully created.'
    else
      render :new
    end
  end

  # PATCH/PUT /assessment_settings/1
  def update
    if @assessment_setting.update(assessment_setting_params)
      redirect_to @assessment_setting, notice: 'Assessment setting was successfully updated.'
    else
      render :edit
    end
  end

  # DELETE /assessment_settings/1
  def destroy
    @assessment_setting.destroy
    redirect_to assessment_settings_url, notice: 'Assessment setting was successfully destroyed.'
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_assessment_setting
      @assessment_setting = AssessmentSetting.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def assessment_setting_params
      params[:assessment_setting]
    end
end
