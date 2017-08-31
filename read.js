var fs = require('fs')
    , util = require('util')
    , stream = require('stream')
    , es = require('event-stream');

var lineNr = 0;

let jsonPath = './Kickstarter_2017-05-15T22_21_11_300Z.json';

let categoriesSet = new Set();
let lineErr = '';
var s = fs.createReadStream(jsonPath)
    .pipe(es.split())
    .pipe(es.mapSync(function(line){
        lineErr = line;

        // pause the readstream
        s.pause();

        lineNr += 1;

        // process line here and call s.resume() when rdy
        // function below was for logging memory usage

        if (lineNr < 10) {
          console.log(lineNr);
          console.log(line, '\n', '\n');

          try {
            let jsonObj = JSON.parse(line).data;
            // console.log(`${jsonObj.state} ${jsonObj.country} ${jsonObj.category.slug} ${jsonObj.usd_pledged}`);
            categoriesSet.add(jsonObj.category.slug);
          }
          catch (e) {
            console.error(e);
            console.error('on lineNr');
            console.error(line);
          }

        }

        // resume the readstream, possibly from a callback
        s.resume();
    })
    .on('error', function(err){
        console.error('Error while reading file.', err);
        console.log(lineErr);
    })
    .on('end', function(){
        console.log('Read entire file.')
        console.log(categoriesSet);
    })
);
