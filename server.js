
var express =  require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('chartlist',['chartlist']);
var bodyParser = require('body-parser');
 
app.use(express.static(__dirname));
app.use(bodyParser.json());
 
app.post('/addchartdata', function(req, res){
                db.chartlist.insert(req.body, function(err, doc){
                                res.json(doc);
                });          
});
 
app.get('/getchartdata/:id', function(req, res){
                db.chartlist.findOne({_id: mongojs.ObjectId(req.params.id)}, function(err, doc){
                                res.json(doc);
                })
});
 
app.listen(3000);
 
console.log('in 3000............');