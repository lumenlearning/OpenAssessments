require 'pp'

desc 'compile bundles using webpack'
task "assets:webpack" do
  cmd    = 'cd client && webpack --config webpack.release.js --progress --profile --colors --json'
  output = `#{cmd}`
  stats  = JSON.parse output

  File.open('./public/assets/webpack-asset-manifest.json', 'w') do |f|
    f.write stats['assetsByChunkName'].to_json
  end

  pp stats['assetsByChunkName']
end
