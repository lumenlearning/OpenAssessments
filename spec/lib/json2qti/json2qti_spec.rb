require 'rails_helper'
require 'json2qti'

describe Json2Qti do
  context "#white_list_sanitize_html" do

    it "should not change strings that aren't bad" do
      expect(Json2Qti.white_list_sanitize_html("hi")).to eq "hi"
    end

    it "should filter out javascript" do
      expect(Json2Qti.white_list_sanitize_html("hi<script> alert('gotcha')</script>")).to eq "hi alert('gotcha')"
    end

    it "should not filter out links" do # yes? currently not allowing links
      expect(Json2Qti.white_list_sanitize_html("hi<a href=https://www.google.com> google</a>")).to eq "hi<a href=\"https://www.google.com\"> google</a>"
    end

    it "should filter out style tag" do
      expect(Json2Qti.white_list_sanitize_html("hi<style> background-color: #fff</style>")).to eq "hi background-color: #fff"
    end

    it "should filter out embedded evil tags" do
      expect(Json2Qti.white_list_sanitize_html("hi<a href=http://lumenlearning.com> <script>alert('gotcha')</script> <strong>lumen</strong></a>")).to eq "hi<a href=\"http://lumenlearning.com\"> alert('gotcha') <strong>lumen</strong></a>"
    end

    it "should not filter out &" do
      expect(Json2Qti.white_list_sanitize_html("hi & bye")).to eq "hi &amp; bye"
      expect(Json2Qti.white_list_sanitize_html("hi &amp; bye")).to eq "hi &amp; bye"
    end

    it "should not filter out images" do
      expect(Json2Qti.white_list_sanitize_html("hi<img src=https://www.google.com>")).to eq "hi<img src=\"https://www.google.com\">"
    end

    it "should not filter out tinyMCE style attributes -bold, italics, underline, strikethrough" do
      expect(Json2Qti.white_list_sanitize_html("<strong>make me bold</strong> and <p style='text-decoration: line-through underline'> underline and cross me out</p> & <em>bye</em><span> and not remove the span tags</span>")).to eq "<strong>make me bold</strong> and <p style=\"text-decoration: line-through underline;\"> underline and cross me out</p> &amp; <em>bye</em><span> and not remove the span tags</span>"
    end

    it "should filter out script within an allowed table" do
      expect(Json2Qti.white_list_sanitize_html("<table>
        <tr>
          <th>Month</th>
          <th>Savings</th>
            <script>alert('what <b>the</b> heck?!?')</script>
        </tr>
        <tr>
          <td>January</td>
          <td>$100</td>
        </tr>
        <tr>
          <td>February</td>
          <td>$80</td>
        </tr>
      </table>")).to eq "<table>
        <tr>
          <th>Month</th>
          <th>Savings</th>
            alert('what <b>the</b> heck?!?')
        </tr>
        <tr>
          <td>January</td>
          <td>$100</td>
        </tr>
        <tr>
          <td>February</td>
          <td>$80</td>
        </tr>
      </table>"
    end
    it "should not allow onclick type events or embeds" do
      expect(Json2Qti.white_list_sanitize_html("<p id='demo' onclick='myFunction()'><embed src='helloworld.swf'>Click me to change <em>my</em> text color.</p>")).to eq "<p id=\"demo\">Click me to change <em>my</em> text color.</p>"
    end
    it "should not strip any h or pre tags" do
      expect(Json2Qti.white_list_sanitize_html("<pre><h2>I am an h2 tag</h2></pre>")).to eq "<pre><h2>I am an h2 tag</h2></pre>"
    end
    it "should not strip title attributes" do
      expect(Json2Qti.white_list_sanitize_html("<span title='my title'>I am a span with a title</span>")).to eq "<span title=\"my title\">I am a span with a title</span>"
    end
    it "should not strip source or control attributes from audio files" do
      expect(Json2Qti.white_list_sanitize_html("<audio controls><source src='horse.ogg' type='audio/ogg'><source src='http://hubblesource.stsci.edu/sources/video/clips/details/images/centaur_1.mpg' type='audio/mpg'>Your browser does not support the audio tag.</audio>")).to eq "<audio controls><source src=\"horse.ogg\" type=\"audio/ogg\"><source src=\"http://hubblesource.stsci.edu/sources/video/clips/details/images/centaur_1.mpg\" type=\"audio/mpg\">Your browser does not support the audio tag.</source></source></audio>"
    end
    it "should align right for right to left directional text" do
      expect(Json2Qti.white_list_sanitize_html("<p style='text-align:right'><bdo dir='rtl'>write this backwards</bdo></p>")).to eq "<p style=\"text-align: right;\"><bdo dir=\"rtl\">write this backwards</bdo></p>"
    end
  end
end
