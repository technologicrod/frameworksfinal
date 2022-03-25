//import express from 'express';
const { Router } = require('express');
var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var jsonParser = bodyParser.json()
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 8080;

global.tally = [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [5, 0],
    [6, 0],
    [7, 0],
    [8, 0],
    [9, 0],
]
var admin = require("firebase-admin");
let serviceAccount
if (process.env.GOOGLE_CREDENTIALS != null){
    serviceAccount = JSON.parse(process.env.GOOGLE_CREDENTIALS)
}
else {
    serviceAccount = require("./itelectiveframeworks.json");
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
const itemcollection = db.collection('items');

const candi = []
for (let i = 0; i < 10; i++ ) {
    candi.push("candidate/" + i.toString())
}
candi.forEach(candidate => {
    app.get("/" + candidate, async (req, res) => {
        const items = await itemcollection.get();
        
        let data = {
            url: req.url,
            itemdata: items.docs,
            tally: tally,
        }
        res.render('pages/candidate', data);
    })
})

app.get('/', function (req, res) {
    let data = {
        url: req.url
    }
    res.render('pages/index', data);
    console.log(tally)
})

app.get('/results', async function (req, res) {
    const items = await itemcollection.get();
    let data = {
        url: req.url,
        tally: tally,
        itemdata: items.docs,
    }
    res.render('pages/results', data);
})
app.post('/results', jsonParser, async function (req, res) {
    const received = req.body;
    const items = await itemcollection.get();
    for (let i = 0; i < 10; i++ ) {
        if (tally[i][0] == received.passid) {
            tally[i][1] = tally[i][1] + 1
        }
    }
    console.log(tally)
    let data = {
        url: req.url,
        tally: tally,
        itemdata: items.docs,
    }
    res.redirect('/results')
})
app.get('/lists', async function (req, res) {
    const items = await itemcollection.get();
    // items.forEach(doc => {
    //     console.log(doc.id, '=>', doc.data());
    // }
    //     )
    console.log(items.docs.length);
    let data = {
        url: req.url,
        itemdata: items.docs,
    }
    res.render('pages/lists', data);
})
app.listen(port,);