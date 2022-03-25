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

// var http = require("http");
// setInterval(function() {
//     http.get("https://desolate-peak-93013.herokuapp.com");
// }, 300000); // every 5 minutes (300000)

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
var candidvotes = db.collection('tally');

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
})

app.get('/results', async function (req, res) {
    const items = await itemcollection.get();
    var votes = await candidvotes.get();
    let data = {
        url: req.url,
        tally: tally,
        itemdata: items.docs,
        votesdata: votes.docs
    }
    res.render('pages/results', data);
})
app.post('/results', jsonParser, async function (req, res) {
    const received = req.body;
    const items = await itemcollection.get();
    var votes = await candidvotes.get();
    let votesdata = votes.docs;
    let itemsdata = items.docs;
    let x;
    for (let i = 0; i < 10; i++ ) {
        let receiveddata = received.passid;
        if (votesdata[i].data()['id'] == receiveddata) {
            x = votesdata[i].data()['votes']  + 1
            j = JSON.stringify(i)
            candidvotes.doc(j).update({
                "votes": x
            })
        }
        console.log(itemsdata[i].data()['name'])
        console.log(votesdata[i].data()['votes'])
    }
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
    let data = {
        url: req.url,
        itemdata: items.docs,
    }
    res.render('pages/lists', data);
})
app.listen(port,);