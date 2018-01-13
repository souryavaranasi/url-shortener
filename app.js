var express=require('express');
var mongoose=require('mongoose');
// mongoose.connect("mongodb://localhost/url_shortener_db",{useMongoClient: true});
mongoose.connect(process.env.DATABASEURL);
var bodyParser=require('body-parser');
var cors=require('cors');
var Url=require('./models/url');

var app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
app.set('view engine','ejs');

app.use(express.static(__dirname+"/public"));


app.get('/',(req,res)=>{
    res.redirect('/new');
});
// Url.create({long_url:"http://www.google.com"},function(err,newURL){
//     if(err){
//         console.log(err);
//     }else{
//         console.log(newURL);
//     }
// })
app.get('/new',(req,res)=>{
    res.render('index');
})
app.post('/',function(req,res){
    var longURL=req.body.url.longurl;
    console.log(longURL);
    var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var regex = expression;
    if(regex.test(longURL)===true){
        var shortURL = Math.floor(Math.random()*100000).toString();
       var data={
           long_url:longURL,
           short_url:shortURL
       }
        Url.create(data,function(err,newurl){
            if(err){
                console.log(err);
            }else{
                console.log(newurl);
                res.redirect('/new/'+newurl.short_url);
            }
        })
    }
});

app.get('/new/:shorturl', (req, res)=>{
    var  short = req.params.shorturl;
    Url.findOne({'short_url': short}, (err, data)=>{
        if (err) return res.send('error reading db');
        var re = new RegExp("^(http|https)://", "i");
        var strToCheck = data.long_url;
        if(re.test(strToCheck)){
            // res.redirect(301, data.long_url )
            res.render('show',{short:data.short_url,long:data.long_url})
        }
        else{
            res.render('show',{short:data.short_url,long:'http://'+data.long_url} )
        }
    });
});



app.listen(process.env.PORT,process.env.IP,function(){
    console.log("server started");
})
