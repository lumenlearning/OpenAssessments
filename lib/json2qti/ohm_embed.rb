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
    IFRAME = %{<iframe id="mom%d" src="%s" style="width:100%%;height:150px"></iframe>}

    def initialize(item)
      super(item)

      @embed_info = item["mom_embed"]
      @material = IFRAME % [@embed_info["questionId"], @embed_info["embedUrl"]]
    end

    def type
      "mom_embed"
    end

    def material_ext
      <<XML
            <mat_extension>
              <mom_domain>#{@embed_info["domain"].encode(:xml => :text)}</mom_domain>
              <mom_question_id>#{@embed_info["questionId"].encode(:xml => :text)}</mom_question_id>
              <mom_embed_url>#{@embed_info["embedUrl"].encode(:xml => :text)}</mom_embed_url>
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

  end
end