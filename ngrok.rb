require 'socket'

def wait
  # Block execution until the ngrok is ready
  started = false
  until started do
    sleep 0.5  
    begin
      TCPSocket.new('localhost', 4040)
      started = true
      puts "ngrok started"
    rescue Errno::ECONNREFUSED => e
      puts "Waiting for ngrok to start"
    end  
  end
end

def tunnel(config)
  exec %Q{curl -X POST -H "Accept: application/json" -H "Content-type: application/json" -d '#{config}' http://localhost:4040/api/tunnels}
end

def config(subdomain, port)
  %Q{{ "addr": "#{port}", "proto": "http", "subdomain": "#{subdomain}", "name": "#{subdomain}" }}
end

wait
puts "Starting tunnels"
tunnel(config(ENV['APP_SUBDOMAIN'], ENV['APP_PORT']))
tunnel(config(ENV['ASSETS_SUBDOMAIN'], ENV['ASSETS_PORT']))
