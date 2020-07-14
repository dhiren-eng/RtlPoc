const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require('../modules/dbConnect');
const config = require('../modules/secret');

router.post('/api/admin/login', (req, res, next) => {
    if(!req.body.admName || !req.body.yrPass) {
        res.status(400).jsonp('Incomplete information');
    } else {
        db.getDB().collection('admin').findOne({logName: req.body.admName}).then((doc) => {
            if (doc) {
            
                if(bcrypt.compareSync(req.body.yrPass, doc.passCode)) {
                    let token = jwt.sign({aId: doc._id, aName: doc.admName}, config.secretAdm);
                    res.status(202).jsonp({aId: doc._id, aName: doc.admName, token: token});
                } else
                    res.status(401).jsonp('Authentication failed!');
            } else
                res.status(401).jsonp('Authentication failed!');
        })
        .catch(err => {
            res.status(410).jsonp(err);
            next(err);
        });
    }
});


module.exports = router;
