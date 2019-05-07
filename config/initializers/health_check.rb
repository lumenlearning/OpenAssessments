HealthCheck.setup do |config|

  # Timeout in seconds used when checking smtp server
  # config.smtp_timeout = 30.0

  # Or to exclude one check:
  config.standard_checks -= [ 'emailconf', 'email' ]

end
