Delayed::Worker.destroy_failed_jobs = false      # default true
# Delayed::Worker.sleep_delay = 5                # polling frequency; default 5 seconds
Delayed::Worker.max_attempts = 5                 # default 25
Delayed::Worker.max_run_time = 5.minutes         # default 4.hours
# Delayed::Worker.read_ahead = 5                 # default 5
# Delayed::Worker.default_queue_name = 'default' # default: process without named queue
# Delayed::Worker.delay_jobs = !Rails.env.test?  # default true - queue (delay) even in Test environment
