const express = require('express');
var parseUrl = require('body-parser')
const fs = require('fs');
const app = express();
const port = 3000;
const requestIp = require('request-ip'); // ip
app.use(requestIp.mw())

let encodeUrl = parseUrl.urlencoded({ extended: true })

app.use('/public', express.static('public'))

// set view engine
app.set('view engine', 'ejs', 'html');

app.get ('/',(req, res) => {
    res.render('index');
})

// to set app get
app.get ('/ips',(req, res) => {
    res.render(__dirname + "/views/ips/index.ejs");
})

app.get ('/ipa',(req, res) => {
    res.render(__dirname + "/views/ipa/index.ejs");
})

app.get ('/melsen',(req, res, next) => {
    const ip = req.clientIp;
    console.log(`Melsen Page \n ip : ${ip}`)
    res.render(__dirname + "/views/melsen/melsen.ejs");
    res.end(ip);
})


//! get form data from /melsen 
//*post data from /melsen/data 
app.post('/melsen', encodeUrl, (req, res) => {
    console.log('melsen:', req.body)
    res.render(__dirname + '/views/melsen/melsen.ejs')
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('hem... 500 error: ' + err.stack)
})

app.listen(port)