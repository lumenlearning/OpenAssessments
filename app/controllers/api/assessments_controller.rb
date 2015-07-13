
class Api::AssessmentsController < Api::ApiController
  
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
  #    way to create one of these so if you need one you can find the assessment you want in the database and create one by doing .assessment_settings.create({allowed_attempts: n})
  # per_sec
  # => give it the number of random questions from each section you want.
  # confidence_levels
  # => set to true or false to display confidence controls
  # Example
  # https://assessments.lumenlearning.com/assessments/15?style=lumen_learning&asid=1&per_sec=2&confidence_levels=true&enable_start=true
  # ********************************************************************

  def create
    xml = assessment_params[:xml_file].read
    assessment = Assessment.from_xml(xml, current_user)
    assessment.title = assessment_params[:title] if assessment_params[:title].present?
    assessment.description = assessment_params[:description] if assessment_params[:description].present?
    assessment.license = assessment_params[:license] if assessment_params[:license].present?
    assessment.keyword_list.add(assessment_params[:keywords], parse: true) if assessment_params[:keywords].present?
    assessment.recommended_height = assessment_params[:recommended_height] if assessment_params[:recommended_height].present?
    assessment.src_url = assessment_params[:src_url] if assessment_params[:src_url].present?
    if assessment_params[:account_id].present?
      account = Account.find(assessment_params[:account_id])
      if current_user.account_admin?(account)
        assessment.account_id = account.id
      else
        render :json => { :error => "Unauthorized: Can't create assessment in this account." }, status: :unauthorized
        return
      end
    end
    assessment.save!
    respond_with(:api, assessment)
  end
  
  def update
    assessment = Assessment.find(params[:id])
    input_xml = update_params[:xml_file].present? ? update_params[:xml_file].read : ""
    assessment.title = update_params[:title] if update_params[:title].present?
    assessment.description = update_params[:description] if update_params[:description].present?
    assessment.license = update_params[:license] if update_params[:license].present?
    assessment.keyword_list.add(update_params[:keywords], parse: true) if update_params[:keywords].present?
    assessment.recommended_height = update_params[:recommended_height] if update_params[:recommended_height].present?
    assessment.src_url = update_params[:src_url] if update_params[:src_url].present?
    if input_xml.length > 0
      assessment.assessment_xmls.destroy_all()
      assessment.assessment_xmls.create!(
        xml: input_xml,
        kind: "formative"
      )
      # Create a summative xml entry (no answers in xml)
      sumative_xml = input_xml
      sumative_xml.gsub! /<conditionvar>(.*?)<\/conditionvar>/m, ''
      assessment.assessment_xmls.create!(
        xml: sumative_xml,
        kind: "summative"
      )
    end
    assessment.save!
    respond_with(:api, assessment)
  end 

  private



  def assessment_params
    params.require(:assessment).permit(:title, :description, :xml_file, :license,
                                       :src_url, :recommended_height, :keywords,
                                       :account_id)
  end

  def update_params
    params.require(:assessment).permit(:title, :description, :xml_file, :license,
                                       :src_url, :recommended_height, :keywords,
                                       :account_id)
  end

end
