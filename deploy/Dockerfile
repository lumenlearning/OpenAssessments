FROM ruby:2.2.10
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs && rm -rf /var/lib/apt/lists/*

# App specific installations are run separatelly so previous is a rehused container
RUN apt-get install -y imagemagick && rm -rf /var/lib/apt/lists/*

ENV INSTALL_PATH /app
ENV NVM_DIR /.nvm

# Since we are using such an old version of node
# NVM seems to be the only reliable way to go
# Once we upgrade, we should switch to using a global node install
RUN mkdir -p $INSTALL_PATH && \
    mkdir -p $NVM_DIR && \
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash && \
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && \
    nvm install 0.10.37

WORKDIR $INSTALL_PATH/client
COPY client/package.json client/npm-shrinkwrap.json ./
RUN [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && \
    nvm use 0.10.37 && \
    npm cache clean && rm -rf node_modules && npm install --production

WORKDIR $INSTALL_PATH

COPY Gemfile Gemfile.lock ./
RUN  bundle install --jobs 20 --retry 5 --without development test

# Set Rails to run in production
ENV RAILS_ENV production 
ENV RACK_ENV production

COPY . ./

RUN [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && \
    nvm use 0.10.37 && \
    cp config/database.yml.example config/database.yml && \
    cp config/secrets.yml.example config/secrets.yml && \
    cp .env.example .env && \
    bundle exec rake assets:precompile && \
    bundle exec rake assets:webpack

CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]