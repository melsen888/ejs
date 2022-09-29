const express = require('express');
const upload = require('express-fileupload');
// const mongoose = require('mongoose');
const articlesRouter = require('./router/articles.ejs')
var parseUrl = require('body-parser')
const fs = require('fs');
const app = express();
const port = 9999;
const requestIp = require('request-ip'); // ip
app.use(requestIp.mw())

let encodeUrl = parseUrl.urlencoded({ extended: true })

// upload
app.use(upload())
app.get('/upload', (req, res) => {
    res.render(__dirname +'/views/project/upload.ejs')
})
app.post('/upload', (req, res) => {
    if (req.files){
        console.log(req.files)
        var file = req.files.file
        var filename = file.name
        console.log(filename)

        file.mv('./data/uploads/'+ filename,function(err){
            if (err) {
                res.send(err)
            } else {
                res.send(`
                <h3 style="text-center">File uploaded successfully</h3>
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

app.get ('/',(req, res) => {
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

app.listen(port)