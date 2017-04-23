module Json2Qti
  # Example QTI

  # <presentation>
  #   <material>
  #     <mattext texttype="text/html">&lt;iframe id=&quot;mom987&quot; src=&quot;https://www.myopenmath.com/OEAembedq.php?id=987&amp;jssubmit=1&amp;showscoredonsubmit=0&quot; style=&quot;width:100%;height:150px&quot;&gt;&lt;/iframe&gt;</mattext>
  #     <mat_extension>
  #       <mom_domain>www.myopenmath.com</mom_domain>
  #       <mom_question_id>987</mom_question_id>
  #       <mom_embed_url>https://www.myopenmath.com/OEAembedq.php?id=987&amp;theme=oea&amp;jssubmit=1&amp;showscoredonsubmit=0&amp;showhints=0</mom_embed_url>
  #     </mat_extension>
  #   </material>
  # </presentation>

  # <resprocessing>
  #   <outcomes>
  #     <decvar maxvalue="100" minvalue="0" varname="SCORE" vartype="Decimal"/>
  #   </outcomes>
  #   <itemproc_extension>
  #     <!-- My Open Math questions are graded remotely and passed via the client -->
  #   </itemproc_extension>
  # </resprocessing>
  class OhmEmbed < Question
    BASE_URL = "https://www.myopenmath.com/OEAembedq.php"
    IFRAME = %{<iframe id="mom%d" src="%s" style="width:100%%;height:150px"></iframe>}

    def initialize(item)
      super(item)

      @embed_info = item["mom_embed"]
      @domain = @embed_info["domain"]
      @question_id = @embed_info["questionId"].to_i

      @url = ohm_url(@question_id)
      @material = IFRAME % [@question_id, @url]
    end

    def type
      "mom_embed"
    end

    def material_ext
      <<XML
            <mat_extension>
              <mom_domain>#{@domain.encode(:xml => :text)}</mom_domain>
              <mom_question_id>#{@question_id.to_s.encode(:xml => :text)}</mom_question_id>
              <mom_embed_url>#{@url.encode(:xml => :text)}</mom_embed_url>
            </mat_extension>
XML
    end

    def answer_processing
      <<XML
            <itemproc_extension>
              <!-- My Open Math questions are graded remotely and passed via the client -->
            </itemproc_extension>
XML
    end


    # "https://www.myopenmath.com/OEAembedq.php?id=1018&theme=oea&jssubmit=1&showscoredonsubmit=0&showhints=0&auth=bracken"
    def ohm_url(question_id=nil)
      question_id ||= @question_id

      uri = URI.parse BASE_URL
      query_vals = URI.decode_www_form(uri.query || '')
      query_vals << ['id', question_id]
      query_vals << ['theme', 'oea']
      query_vals << ['jssubmit', "1"]
      query_vals << ['showscoredonsubmit', '0']
      query_vals << ['showhints', '0']
      query_vals << ['auth', Rails.application.secrets.mom_key]
      uri.query = URI.encode_www_form(query_vals)

      uri.to_s
    end

  end
end