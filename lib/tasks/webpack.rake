require 'pp'

desc 'compile bundles using webpack'
task "assets:webpack" do
  cmd    = 'cd client && node_modules/webpack/bin/webpack.js --config webpack.release.js --progress --profile --colors --json'
  output = `#{cmd}`
  stats  = JSON.parse output

  File.open('./public/assets/webpack-asset-manifest.json', 'w') do |f|
    f.write stats['assetsByChunkName'].to_json
  end

  pp stats['assetsByChunkName']
end
