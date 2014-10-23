require 'rails_helper'
Capybara.default_driver = :selenium
Capybara.default_wait_time = 30
WebMock.allow_net_connect!
Capybara.register_driver :selenium do |app|
  Capybara::Selenium::Driver.new(app, :browser => :chrome)
end

feature 'user interacts with lti' do

  scenario 'user does LTI stuff', js: true do
    visit "https://canvas.instructure.com"
    fill_in "Email", with: "colebusby+atomicjolt@gmail.com"
    fill_in "Password", with: "asdfasdf"
    click_button 'Log In'
    visit "https://canvas.instructure.com/courses/866168/"
    within_frame("tool_content") do

    end
  end
end