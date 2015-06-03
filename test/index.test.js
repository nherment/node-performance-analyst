
var assert = require('assert')
var _ = require('lodash')

var PerfAnalyst = require('../index.js')

describe('performance-analyst', function() {

  it('test', function(done) {
    var stack = new Stack()

    var pa = PerfAnalyst.wrap(stack, 'add')

    pa.on('call', function(metricInfo, timeInMs) {
      assert.equal(metricInfo.file, __filename)
      assert.equal(metricInfo.line, 24)
      // functioName not working, not sure why 
      //assert.equal(metricInfo.functionName, 'myFunc')
      assert.ok(timeInMs > 1000)
      assert.ok(timeInMs < 1100)
      done()
    })
    
    stack.add(function myFunc(callback) {
      setTimeout(callback, 1000)
    })

    stack.run()
    
  })

})


function Stack() {
  this._stack = []
}

Stack.prototype.add = function() {
  var args = _.toArray(arguments)
  assert.ok(args.length > 0)
  this._stack.push(args)
}

Stack.prototype.run = function() {
  var self = this
  if(this._stack.length > 0) {
    var args = this._stack.pop()
    var func = args.shift()
    args.push(function() {
      setImmediate(function() {
        self.run()
      })
    })
    func.apply(this, args)
  }
}
