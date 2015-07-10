require 'pp'

# The webpack task must run before assets:environment task.
# Otherwise Sprockets cannot find the files that webpack produces.
Rake::Task['assets:precompile']
  .clear_prerequisites
  .enhance(['assets:compile_environment'])

namespace :assets do
  # In this task, set prerequisites for the assets:precompile task
  task :compile_environment => :webpack do
    Rake::Task['assets:environment'].invoke
  end

  # desc 'Compile assets with webpack'
  # task :webpack do
  #   sh '$(npm bin)/webpack --config webpack.config.js'
  # end

  desc 'compile bundles using webpack'
  task :webpack do
    cmd    = 'cd client && webpack --config webpack.release.js --progress --profile --colors --json'
    output = `#{cmd}`
    stats  = JSON.parse output

    File.open('./public/assets/webpack-asset-manifest.json', 'w') do |f|
      f.write stats['assetsByChunkName'].to_json
    end

    pp stats['assetsByChunkName']
  end

  task :clobber do
    rm_rf "#{app.config.root}/app/assets/javascripts/{bundle.js,components.js}"
  end
end