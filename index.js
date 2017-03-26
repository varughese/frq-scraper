var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");
var colors = require('colors');

var url = "http://apcentral.collegeboard.com/apc/members/exam/exam_information/2084.html";

function getLinkNames(html, $, links, titleFn, additionalTitle) {
    html.each(function(a, el) {
        var href = $(el).attr("href");
        var title = titleFn($, el);

        if(additionalTitle) {
            title+=additionalTitle;
        }


        if(href.substring(0, 4) !== "http") {
            href = "http://apcentral.collegeboard.com" + href;
        }
        links.push({
            href: href,
            title: title
        });
    });
}

function getYear($, el) {
    var caption = $(el).closest("table").find("caption").text().trim();
    var year = caption.substring(0, 4);
    if(caption.indexOf("Form B") > -1) {
        year += "B";
    }
    return year;
}

request(url, function(error, response, html) {
    if (!error) {
        var $ = cheerio.load(html);

        var examTitle = $(".arialTwenty003366Bold").text().trim();
        var linkHTML = $("tr>td>p>a:contains('Free-Response Questions')");
        var answersHTML = $($("tr>td>p>a:contains('Scoring Guidelines')"));

        var links = [];
        var examName = examTitle.substring(4, examTitle.length-5).replace(':', "");

        console.log("Downloading FRQs for " + examName.red);

        getLinkNames(linkHTML, $, links, getYear);
        getLinkNames(answersHTML, $, links, getYear, "_ANSWERS");

        fs.mkdir(examName, function(err) {
            if(err && err.code !== 'EEXIST') console.error(err);

            for(var i=0; i<links.length; i++) {
                downloadPdf(links[i].href, examName + "/" + links[i].title);
            }
        });

    }
});


function downloadPdf(link, name) {
    // request.get(link).pipe(fs.createWriteStream(name + ".pdf"));
    request(link).pipe(fs.createWriteStream(name + ".pdf"));
    //
    // request(url, function(err, response, pdf) {
    //     if(err) {
    //         console.error(err);
    //     } else {
    //         console.log("LINK NAME", link);
    //         console.log(pdf.substring(0, 20));
    //     }
    // });
}
