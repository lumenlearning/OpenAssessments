class Api::AssessmentSettingsController < Api::ApiController

  before_action :set_assessment_setting, only: [:show, :edit, :update, :destroy]
  respond_to :json
  def index
    @assessment_settings = AssessmentSetting.all
    respond_with(:api, @assessment_settings)
  end

  def show
  end

  def new
    @assessment_setting = AssessmentSetting.new
  end

  def edit
  end

  def create
    @assessment_setting = AssessmentSetting.new(assessment_setting_params)
    @assessment_setting.save!
    respond_with(:api, @assessment_setting)
  end

  def update
    @assessment_setting.update(assessment_setting_params)
    respond_with(:api, @assessment_setting)
  end

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
      params.require(:assessment_setting).permit(:per_sec, :allowed_attempts, :style, :assessment_id, :enable_start, :confidence_levels)
    end
end
