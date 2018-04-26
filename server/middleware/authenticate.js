/*jshint esversion: 6 */
const {User} = require('./../models/user.js');


var authenticate = async (req, res, next) => {
    var token = req.header('x-auth');

    try {
        const user = await User.findByToken(token)

        if (!user) {
            new Error();
        }

        req.user = user;
        req.token = token;
        next();
    } catch(e) {
        res.status(401).send();
    };

};

module.exports = {authenticate};