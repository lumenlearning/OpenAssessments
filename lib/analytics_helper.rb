class AnalyticsHelper
  def self.enabled?
    !!(server_url && auth_token)
  end

  def self.server_url
    Rails.application.secrets.analytics_server
  end

  def self.auth_token
    Rails.application.secrets.analytics_auth_token
  end

  def self.headers
    {
            "Authorization" => "Bearer #{Rails.application.secrets.analytics_auth_token}",
            "Content-Type" => "application/json",
    }
  end

  def self.send_result(payload)
    response = HTTParty.post(server_url, headers: headers, body: payload.to_json, timeout: 4)
    if response.code == 200
      return "OK"
    else
      Rails.logger.error "Response error posting to analytics. Status code: #{response.code} - #{response.body}"
      return "Sending event failed"
    end
  rescue HTTParty::Error, Net::ReadTimeout, Errno::ECONNREFUSED => e
    Rails.logger.error "Error posting to analytics server: #{e.message}"
    return "Sending event errored"
  end
end