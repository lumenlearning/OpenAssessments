require 'spec_helper'
require 'url_helper'

describe UrlHelper do

  describe "#ensure_scheme" do
    it "should add http onto url if it doesn't exist" do
      UrlHelper.ensure_scheme('www.example.com').should == 'http://www.example.com'
    end
    it "should not add http onto url if it does exist" do
      UrlHelper.ensure_scheme('https://www.example.com').should == 'https://www.example.com'
    end
  end

  describe "#host" do
    it "should get the host name from the url" do
      UrlHelper.host('http://www.example.com').should == 'www.example.com'
      UrlHelper.host('http://www.example.com/some/path').should == 'www.example.com'
      UrlHelper.host('http://www.example.com?some=thing').should == 'www.example.com'
      UrlHelper.host('www.example.com').should == 'www.example.com'
      UrlHelper.host('www.example.com/some/path').should == 'www.example.com'
      UrlHelper.host('www.example.com?some=thing').should == 'www.example.com'
    end
    it "should get the host with subdomain from the url" do
      UrlHelper.host('http://foo.example.com').should == 'foo.example.com'
      UrlHelper.host('http://foo.example.com/some/path').should == 'foo.example.com'
      UrlHelper.host('http://foo.example.com?some=thing').should == 'foo.example.com'
      UrlHelper.host('foo.example.com').should == 'foo.example.com'
      UrlHelper.host('foo.example.com/some/path').should == 'foo.example.com'
      UrlHelper.host('foo.example.com?some=thing').should == 'foo.example.com'
    end
  end

  describe "#scheme_host" do
    it "should return the scheme and host" do
      UrlHelper.scheme_host('https://www.example.com').should == 'https://www.example.com'
      UrlHelper.scheme_host('https://www.example.com/some/path').should == 'https://www.example.com'
      UrlHelper.scheme_host('https://www.example.com?some=thing').should == 'https://www.example.com'
      UrlHelper.scheme_host('http://www.example.com').should == 'http://www.example.com'
      UrlHelper.scheme_host('http://www.example.com/some/path').should == 'http://www.example.com'
      UrlHelper.scheme_host('http://www.example.com?some=thing').should == 'http://www.example.com'
      UrlHelper.scheme_host('www.example.com').should == 'http://www.example.com'
      UrlHelper.scheme_host('www.example.com/some/path').should == 'http://www.example.com'
      UrlHelper.scheme_host('www.example.com?some=thing').should == 'http://www.example.com'
    end
    it "should return the scheme and host with subdomain" do
      UrlHelper.scheme_host('https://foo.example.com').should == 'https://foo.example.com'
      UrlHelper.scheme_host('https://foo.example.com/some/path').should == 'https://foo.example.com'
      UrlHelper.scheme_host('https://foo.example.com?some=thing').should == 'https://foo.example.com'
      UrlHelper.scheme_host('http://foo.example.com').should == 'http://foo.example.com'
      UrlHelper.scheme_host('http://foo.example.com/some/path').should == 'http://foo.example.com'
      UrlHelper.scheme_host('http://foo.example.com?some=thing').should == 'http://foo.example.com'
      UrlHelper.scheme_host('foo.example.com').should == 'http://foo.example.com'
      UrlHelper.scheme_host('foo.example.com/some/path').should == 'http://foo.example.com'
      UrlHelper.scheme_host('foo.example.com?some=thing').should == 'http://foo.example.com'
    end
  end

  describe "#host_from_instance_guid" do
    it "should get the base domain" do
      UrlHelper.host_from_instance_guid('http://www.example.com').should == 'example.com'
      UrlHelper.host_from_instance_guid('http://foo.example.com').should == 'example.com'
    end
  end
end