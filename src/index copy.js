require('dotenv').config();
// -----------------------以下開始引入套件、模組設定------------------------
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const {v4: uuidv4} = require('uuid');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const MysqlStore = require('express-mysql-session')(session);
const moment = require('moment-timezone');
const cors = require('cors');
const db = require(__dirname + '/db_connect2');  // 引用模組，模組裡安裝mysql2
const sessionStore = new MysqlStore({}, db);
const upload = multer({dest: __dirname + '/../tmp_uploads'});
// ---------以下開始物件、top use middleware設定------------------------

// 建立app物件
const app = express();
// 使用樣版引擎
app.set('view engine', 'ejs');
// 解析urlencoded格式middleware
app.use( express.urlencoded({extended: false}) );
// 解析json格式middleware
app.use( express.json() );
const corsOptions = {
    credentials: true,
    origin: function(origin, cb){
        console.log(`origin: ${origin}`);
        cb(null, true);
    }
};
app.use(cors(corsOptions));
app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: 'jghdkasskjfks37848kj',
    store: sessionStore,
    cookie: {
        maxAge: 1200000
    }
}));

// -------------------------------以下開始路由設定------------------------
app.use((req, res, next)=>{
    res.locals.title = 'StaryMao寵愛有家';
    res.locals.sess = req.session;

    let auth = req.get('Authorization');

    if(auth && auth.indexOf('Bearer ')===0){
        auth = auth.slice(7);
        jwt.verify(auth, process.env.TOKEN_SECRET, function(error, payload){
            if(!error){
                req.bearer = payload;
            }
            next();
        });
    } else {
        next();
    }
})
// 引入首頁路由
app.get('/', (req, res)=>{
    // res.send('<h2>Hola </h2>');
    res.render('home', {name: 'StaryMao寵愛有家'});
});
app.use('/starymao',require(__dirname + '/routes/routesmaster'));
// app.use('/store',require(__dirname + '/routes/store/main.js'));
// public 資料夾middleware
app.use( express.static(__dirname + '/../public'));
// 404 middleware
app.use((req, res )=>{
    res
        .type('text/plain')
        .status(404)
        .send('找不到網頁');
});

// -------------------------------以下開始伺服器監聽------------------------
app.listen(3001, ()=>{
    console.log('伺服器已啟動...');
})

/*
app.get('/json-sales', (req, res)=>{
    const sales = require(__dirname + '/../data/sales');
    res.locals.title += ' - JSON';
    // res.json(sales);
    res.render('json-sales', {sales})
});
app.get('/json-sales2', (req, res)=>{
    const sales = require(__dirname + '/../data/sales');
    // res.json(sales);
    res.render('abc/def/json-sales2', {sales})
});

app.get('/try-qs', (req, res)=>{
    res.json(req.query);
});


app.post('/try-post',(req, res)=>{
    res.json(req.body);
});

app.get('/try-post-form',(req, res)=>{
    res.render('try-post-form');
});

app.post('/try-post-form',(req, res)=>{
    res.render('try-post-form', req.body);
});

app.post('/try-upload', upload.single('avatar'), (req, res)=>{
    console.log(req.file);

    if(req.file && req.file.originalname){
        let ext = '';

        switch(req.file.mimetype){
            case 'image/png':
            case 'image/jpeg':
            case 'image/gif':

                fs.rename(
                    req.file.path,
                    __dirname + '/../public/img/' + req.file.originalname,
                    error=>{

                        return res.json({
                            success: true,
                            path: '/img/'+ req.file.originalname
                        });
                    });

                break;
            default:
                fs.unlink(req.file.path, error=>{
                    return res.json({
                        success: false,
                        msg: '不是圖檔'
                    });
                });

        }
    } else {
        return res.json({
            success: false,
            msg: '沒有上傳檔案'
        });
    }
});

app.get('/try-uuid',(req, res)=>{
    res.json({
        uuid1: uuidv4(),
        uuid2: uuidv4(),
    });
});

const upload2 = require(__dirname + '/upload-img-module');
app.post('/try-upload2', upload2.single('avatar'), (req, res)=> {
    res.json(req.file);
});

app.get('/my-params1/:action?/:id?', (req, res)=> {
    res.json(req.params);
});
app.get('/my-params2/*?/*?', (req, res)=> {
    res.json(req.params);
});

app.get(/^\/m\/09\d{2}-?\d{3}-?\d{3}$/i, (req, res)=> {
    let u = req.url.slice(3).split('?')[0];
    u = u.replace(/-/g, '');
    res.send(u);
});

app.use(require(__dirname + '/routes/admin2'));


app.use('/members', require(__dirname + '/routes/admin3'));

app.get('/yahoo', async (req, res)=>{
    const response = await axios.get('https://tw.yahoo.com/');
    res.send(response.data);
});

app.get('/try-session', (req, res)=>{
    req.session.myVar = req.session.myVar || 0;
    req.session.myVar++;
    console.log(req.session);
    res.json({
        myVar: req.session.myVar,
        session: req.session
    });
});

app.get('/try-moment', (req, res)=>{
    const fm = 'YYYY-MM-DD HH:mm:ss';
    const now = moment(new Date());

    res.json({
        t1: new Date(),
        t2: now.format(fm),
        t2a: now.tz('Europe/London').format(fm),
        t3: moment(req.session.cookie.expires).format(fm),
        t3b: moment(req.session.cookie.expires).tz('Asia/Tokyo').format(fm),
        'process.env.DB_NAME': process.env.DB_NAME,
    });
});

app.get('/try-db', (req, res)=>{
    db.query('SELECT * FROM address_book LIMIT 2')
        .then(([results])=>{
            res.json(results);
        })
});

app.use('/address-book', require(__dirname + '/routes/address-book'));
 */