require 'rails_helper'
require 'json2qti'

describe Json2Qti do
  context "#sanitize_html" do

    it "should not change strings that aren't bad" do
      expect(Json2Qti.sanitize_html("hi")).to eq "hi"
    end

    it "should filter out javascript" do
      expect(Json2Qti.sanitize_html("hi<script>alert('gotcha')</script>")).to eq "hi"
    end

    it "should filter out links" do
      expect(Json2Qti.sanitize_html("hi<a href=http://google.com> google</a>")).to eq "hi google"
    end

    it "should filter out images" do
      expect(Json2Qti.sanitize_html("hi<img src=https://www.google.com/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&ved=0ahUKEwia2ofdr4DPAhUD0GMKHUJEBYgQjRwIBw&url=http%3A%2F%2Farstechnica.com%2Fscience%2F2016%2F02%2Ftiny-blurry-pictures-find-the-limits-of-computer-image-recognition%2F&psig=AFQjCNF3V336JHjdGoorBg4IWVpETGS7MA&ust=1473444786714695>")).to eq "hi"
    end

    it "should filter out style tag" do
      expect(Json2Qti.sanitize_html("hi<style>background-color: #fff</style>")).to eq "hibackground-color: #fff"
    end

    it "should filter out embedded tags" do
      expect(Json2Qti.sanitize_html("hi<table><a href=http://lumenlearning.com> lumen</a></table>")).to eq "hi lumen"
    end

  end
end
