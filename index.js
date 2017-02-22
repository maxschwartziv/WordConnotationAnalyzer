var fs = require('fs');
var filename = ('readMe.txt');
var CSV = require('csv-string');
var express = require('express')
var math = require('mathjs');
var app = express();
var counter = 0
var final;
var connotation;
var arr;
var row;
var position;
var emotion = [];
var words = [];
var index
var emotionSm = [];
var wordcount = 0;

var path = require('path');
var formidable = require('formidable');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){

	res.sendFile(path.join(__dirname, 'views/index.html'));
	 fs.stat('/uploads/' +filename, function (err, stats) {
   //console.log(stats);//here we got all information of file in stats variable

   if (err) {
       return console.error(err);
   }

   fs.unlink('./uploads/' +filename,function(err){
        if(err) return console.log(err);
        console.log('file deleted successfully');
   });
	 });
});

app.post('/upload', function(req, res){
  // create an incoming form object
  var form = new formidable.IncomingForm();
	console.log('var form');

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = false;
	console.log('var false');

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/uploads');
	console.log('var uploadsave');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, filename));
	  console.log('var rename');
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
	  console.log('var error');
  });

  // once all the files have been uploaded, send a response to the client
	form.on('end', function() {
	  res.end('success');

	  var string = fs.readFile('uploads/'+filename, 'utf8', function(err, data) {
		  if (err) throw err;
		  var invalid = /['`~!@#$%^&*()_|+-=?;:'",1234567890.<>\{\}\[\]\\\/]/gi;
		  clean1 = data.replace(invalid, "")
		  clean2 = clean1.replace(/\n/g, ' ')
			  .toLowerCase()
			  .replace(/\r/g, '');
		  array = clean2.split(' ');
		  final = array.filter(Boolean);

	  	final.forEach(function(element,index){			
		if (emotionSm.length>final.length/40){
			emotion.push(math.mean(emotionSm));
			emotionSm = []
			wordcount++
			words.push(wordcount)
		};
			
		position = arr.indexOf(element+',');
		if (position === -1){
			return};
		length = element.length
		line = arr.substring(position+length+1,10+position+length);
		//console.log(line);
		if (line.includes('neg')){
			emotionSm.push(-1)
			return};
		if (line.includes('pos')){
			emotionSm.push(1)
			return};
		if (line.includes('neu')){
			emotionSm.push(0)
			return};

		
	});
	console.log(emotion.length);
	console.log(words.length);
		  

	//console.log(emotion);
});
  
  });
	  
	  
	  

  // parse the incoming request containing the form data
  form.parse(req);
	console.log('var parse');
});

//start server
var server = app.listen(3000, function(){
  console.log('Server listening on port 3000');

	//convert connotation database to string
	var readConnotation = fs.readFile('connotation_lexicon_a.0.1.csv', 'utf8', function(err, data) {
  if (err) throw err;
   arr = CSV.stringify(data);
    });



});
app.get('/graph', function (req, res) {
  res.render('page', {emotion, words});
		emotion = [];
    words = [];
    emotionSm = [];
    wordcount = 0;

});
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');









