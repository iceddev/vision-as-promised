'use strict';

var isPromiseLike = require('is-promise');

function onPreResponse(request, reply){
  var response = request.response;
  var variety = response.variety;
  var source = response.source;

  function onSuccess(result){
    source.context = result;
    reply.continue();
  }

  function onError(err){
    reply(err);
  }

  if(variety !== 'view'){
    return reply.continue();
  }

  if(!isPromiseLike(source.context)){
    return reply.continue();
  }

  source.context.then(onSuccess, onError);
}

function visionAsPromised(server, opts, done){

  server.ext('onPreResponse', onPreResponse);

  done();
}

visionAsPromised.attributes = {
  pkg: require('./package.json')
};

module.exports = {
  register: visionAsPromised
};
