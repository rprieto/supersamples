exports.lint = function(samples, options){
  var errors = []
  samples.forEach(function(sample){
    if(sample.name.match(/\n/)){
      errors = errors.concat(sample.name)
    }
  })
  return {errors: errors}
}