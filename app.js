if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express');
const upload = require('express-fileupload');
const articlesRouter = require('./router/articles.ejs')
var parseUrl = require('body-parser')
const fs = require('fs');
const app = express();
const port = 9999;
const requestIp = require('request-ip'); // ip
app.use(requestIp.mw())

let encodeUrl = parseUrl.urlencoded({ extended: true })

// login 
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const users  = [];
const bcrypt = require('bcrypt');
const initializePassword = require('./passport-config');
const { mkdir } = require('fs');
initializePassword(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(express.urlencoded({ extended: false }))
app.get('/login', (req, res) => {
    res.render(__dirname + '/views/login.ejs')
})

app.get('/register', (req, res) => {
    res.render(__dirname + '/views/register.ejs')
})

app.post('/login',  passport.authenticate('local', {
    successRedirect : '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.post('/register',  async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: res.body.name,
            email: res.body.email,
            password: hashedPassword
        })
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
    console.log(req.body)
})
// 
// upload
app.use(upload())
app.get('/upload', (req, res) => {
    res.render(__dirname +'/views/project/upload.ejs')
})
app.post('/upload', (req, res) => {
    if (req.files){
        console.log(req.files)
        var uuid = require("uuid");
        var id = uuid.v4();
        var file = req.files.file
        var filename = file.name;
        var name = file.name;
        var type = file.mimetype;
        if (filename = filename ){
            var filename = id ;
        }
        var size = file.size
        var date = new Date(Date.now())
        console.log(filename)
        console.log(name)

        file.mv('./data/uploads/'+ filename,function(err){
            if (err) {
                res.send(err)
            } else {
                res.send(`
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link rel="shortcut icon" href="/public/img/apple-touch-icon.png" type="image/x-icon">
                    <link rel="stylesheet" href="/public/css/style.css">
                    <!-- <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"> -->
                    <script src="/public/js/full.js"></script>
                            
                    <title>melsen</title>
                </head>
                
                <h2 style="text-align: center;">File uploaded successfully</h2>
                <p>file name : ${name}</p>
                <p>file size : ${size}</p>
                <p>${date}</p> <br>
                <small>${id}</small>
                <hr>
                <a href="/data/uploads/${filename}">/data/uploads/${filename}</a>
                `)
            }
        })
    }
})

app.use('/public', express.static('public'))
app.use('/data', express.static('data'))
app.use('/articles', articlesRouter)

// set view engine
app.set('view engine', 'ejs', 'html');

// disable checkAuthenticated
app.get ('/', (req, res) => {
    const articles = [{
        title: 'Teori Asal Usul Nenek Moyang Indonesia',
        createdAt: new Date(Date.now()),
        description: 'teori asal usul nenek moyang Indonesia',
    }]
    res.render('index', {articles: articles});
})

// to set app get
app.get ('/ips',(req, res) => {
    res.render(__dirname + "/views/ips/index.ejs");
})

app.get ('/ipa',(req, res) => {
    res.render(__dirname + "/views/ipa/index.ejs");
})

app.get ('/alfa',(req, res) => {
    res.render(__dirname + "/views/alfa/alfa.ejs");
})

app.get ('/melsen',(req, res, next) => {
    res.render(__dirname + "/views/melsen/index.ejs");
})

// TODO: add helper, project , menu , comments , sql

app.get ('/melsen/form',(req, res, next) => {
    const ip = req.clientIp;
    console.log(`Get /melsen \n ip : ${ip}
        `)
    res.render(__dirname + "/views/melsen/melsen.ejs");
})

//! get form data from /melsen 
//*post data from /melsen/data 
app.post('/melsen', encodeUrl, (req, res) => {
    const ip = req.clientIp;
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    console.log(`Get /melsen \n ip : ${ip} \n date : ${date}`)
    console.log('melsen:', req.body)
    res.render(__dirname + '/views/melsen/melsen.ejs')
    res.end(ip);
})

app.get ('/getstarted',(req, res) => {
    res.render(__dirname + "/router/getstarted.ejs");
})

app.post('/kenalan', encodeUrl, (req, res) => {
    const ip = req.clientIp;
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    console.log(`Get /melsen \n ip : ${ip} \n date : ${date}`)
    console.log('melsen:', req.body)
    res.render(__dirname + '/views/alfa/alfa.ejs')
    res.end(ip);
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(404).send('<h1 style="background-color: black; color: white; text-align: center;">ERROR 404 | Melsen</h1>' + err.stack )
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
    res.redirect('/login')
}

app.listen(port)
