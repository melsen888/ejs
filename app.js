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

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(404).send('hem... 500 error: ' + err.stack)
})

app.listen(port)
