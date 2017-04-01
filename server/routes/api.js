var config = require('../../config');

module.exports = function(app, express, db) {
    var apiRouter = express.Router();

    apiRouter.route('/test')
        .get(function(req, res) {
            res.send({yo: "Jawn"});
        });


    return apiRouter;
};
