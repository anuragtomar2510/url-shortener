require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const ShortUrl = require('./shortUrl');
const mongoose = require('mongoose');
const DB_URL = process.env.DB_URL


const app = express();
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');


mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => console.log('Connected to database successfully')
        ).catch((err) => console.log('Failed to connect to database' + err))

let fullUrl = '';
app.get('/', async (req, res) => {

        const shortUrls = await ShortUrl.find();
        res.render('index', {shortUrls: shortUrls, fullUrl: fullUrl});

});

app.post('/shortUrl', async (req, res) => {

        fullUrl = req.body.fullUrl;
        const exists = await ShortUrl.findOne({full : fullUrl});
        await ShortUrl.create({full : fullUrl });
        res.redirect('/');
})


app.get('/:shortUrl', async (req, res) => {

        const shortUrl = await ShortUrl.findOne({short : req.params.shortUrl});

        if(shortUrl === null) return res.sendState(404);

        shortUrl.clicks++;
        shortUrl.save();

        res.redirect(shortUrl.full);

});







app.listen(8000, () => {

        console.log('Server started and tuned at port 8000');

})