
var _ = require('lodash')
var EventEmitter = require('events').EventEmitter

require('./lib/FilenameTracing.hack.js')

function wrap(obj, funcName) {
  var eventEmitter = new EventEmitter()
  
  var originalFunc = obj.constructor.prototype[funcName]
  
  obj.constructor.prototype[funcName] = function() {
    
    var args = _.toArray(arguments)
    
    
    if(typeof _.last(args) === 'function') {
      
      var actionFunctionInfo = __caller_info
      
      var actionFunction = args.pop()
      
      args.push(function() {
        var args = _.toArray(arguments)
        
        if(typeof _.last(args) === 'function') {
          var startTime = Date.now()
          var callbackFunction = args.pop()
          args.push(function() {
            var endTime = Date.now()
            eventEmitter.emit('call', actionFunctionInfo, endTime - startTime)
            callbackFunction.apply(this, _.toArray(arguments))
          })
          actionFunction.apply(this, args)
        } else {  
          actionFunction.apply(this, args)
        }
      })
      
      originalFunc.apply(this, args)
      
    } else {
      originalFunc.apply(this, args)
    }
  }
  
  return eventEmitter
  
}

module.exports = {
  wrap: wrap
}
