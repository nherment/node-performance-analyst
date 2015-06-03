# node-performance-analyst

spit out performance metrics about functions you want to measure the performance of


```

var seneca = require('seneca')

var PerfAnalyst = require('performance-analyst')

var perfAnalyst = PerfAnalyst.wrap(seneca, 'add')

perfAnalyst.on('call', function(functionInfo, timeInMilliseconds) {

  functionInfo // { fileName: '....', line: '....', functionName: '....' }
  timeInMilliseconds // the time it took the function until the callback was invoked

})


seneca.add({...}, function myAnalyzedFunction(args, callback) {

  // do stuff
  callback()

});

```