var fs = require('fs');
var i18n = [];
var list = [];
var localization = 'ru';

fs.readFile('i18n_' + localization + '.json', 'utf8', function (err, content) {
	i18n = JSON.parse(content);
});

fs.readFile('data_' + localization + '.json', 'utf8', function (err, content) {
    var data = JSON.parse(content);
    
    data.forEach(item => templateCity("city.html", item, i18n[2], "{{text}}.html"));


    data.forEach(element => {
    	if(!list.includes(element.continent))
    		list.push(element.continent);
    });
    for(var i = 0; i < list.length; i++)
	    data.forEach(item => {
	    	if(item.continent == list[i])
	        	item['cities_list'] = getItemsList(data, list[i]);
	    });
    data.forEach(item => template("category.html", item, i18n[1], "{{continent}}.html"));


	var buff = '';
	for(var i = 0; i < list.length; i++)
        buff += '<a href="'+list[i]+'.html">' +  list[i] + '</a><br />';
	
    fs.readFile("index.html", 'utf8', function (err, content) {
		content = content.replace('{{tit}}', i18n[0].title);
		content = content.replace('{{list}}', buff);
        var fileName = 'public_'+ localization +'/index.html';
		fs.writeFile(fileName, content, function(err) {
        	if(err) {
         	   return console.log(err);
        	}
    	});
	});

});

function getItemsList(data, content) {
    var result = '';
    for(var i = 0; i < data.length; i++){
    	if(data[i].continent == content)
        	result += '<a href="cities/'+data[i].text+'.html">' +  data[i].text + '</a><br />';
    }

    return result;
}


function template(template, data, i18n, fileName){
    fs.readFile(template, 'utf8', function (err, content) {
        for (var prop in data) {
            var find = '{{' + prop + '}}';
            var re = new RegExp(find, 'g');
            content = content.replace(re, data[prop]);
            content = content.replace('{{title}}', i18n.title);

            fileName = fileName.replace(re, data[prop]);
        }
        var fullName = "public_"+ localization + "/" + fileName;
        
        fs.writeFile(fullName, content, function(err) {
            if(err) {
                return console.log(err);
            }
        });
    });
}

function templateCity(template, data, i18n, fileName){
	fs.readFile(template, 'utf8', function (err, content) {
		for (var prop in data) {
            var find = '{{' + prop + '}}';
            var re = new RegExp(find, 'g');
            content = content.replace(re, data[prop]);
            content = content.replace('{{title}}', i18n.title);

            fileName = fileName.replace(re, data[prop]);
        }
        var fullName = "public_"+ localization+"/cities/" + fileName;
        
        fs.writeFile(fullName, content, function(err) {
            if(err) {
                return console.log(err);
            }
        });
	});
}