module.exports = function(db) {

    var pdfText = require('pdf-text');
    var mongodb = require('mongodb');

    var fileName = "/AP Physics C Electricity and Magnetism/2004.pdf";

    var pathToPdf = __dirname + fileName;



    pdfText(pathToPdf, function(err, chunks) {

        var problem = {};
        var probNumSet = new RegExp(/(\((a|b|c|d|e|f|g|h|i|j|k|l|m)+\))/, 'g');
        var currentProb = "formula";
        problem.formula = { name: "formula" };
        var currentProbPart = "a";

        for (var i = 0; i < chunks.length; i++) {
            var line = chunks[i];

            if (line.indexOf("E&M") > -1) {
                currentProb = line.trim();
                problem[currentProb] = {};
                problem[currentProb][currentProbPart] = "a";
            }

            if (line.trim()[0] === "(") {
                if (line.match(probNumSet)) {
                    currentProbPart = line.trim()[1];
                    problem[currentProb][currentProbPart] = "";
                }
            }

            problem[currentProb][currentProbPart] += line;

        }

        // db.collection('frq_scrape_test').insertOne({
        //     "exam": "AP Physics C Electricity and Magnetism",
        //     "year": 2004,
        //     "chunks": chunks
        // }, function(err, result) {
        //     console.log("ADDED", fileName);
        //     callback();
        // });
    });

};
