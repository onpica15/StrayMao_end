const express = require('express');
const moment = require('moment-timezone');
const db = require(__dirname + '/../../db_connect2');
const upload = require(__dirname + '/../../upload-img-module');

const router = express.Router();

router.get('/', (req, res)=>{
    res.send('routes_social_media')
});

//exapmle for get data from database
router.get('/try-db', (req, res)=>{
    db.query('SELECT * FROM address_book LIMIT 2')
    .then(([results])=>{
        res.json(results);
    })
});

router.get('/list',(req, res)=>{
    res.render('social_media/list');
});




module.exports = router;










