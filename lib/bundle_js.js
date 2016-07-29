const __basedir = process.cwd();
const oPath = require("path");
const oParseDep = require(oPath.join(__basedir, 'lib/parse_sea_dependence.js'));
const oFs = require("fs");
const oUglifyJS = require("uglify-js2");

var config = JSON.parse(oFs.readFileSync(oPath.join(__basedir, 'build_config.json')));
var parse_dep_config = {
	"alias": config.alias,
	"comp_dir": oPath.join(config.project_dir, config.comp_dir),
	"seajs_dir": oPath.join(config.project_dir, config.seajs_dir),
	"entrance": config.seajs_entrance
};
var deps = oParseDep(parse_dep_config);//get all denpendences of seajs by loading order
var output = oPath.join(__basedir, config.output || '', 'bundle.js');

oFs.writeFileSync(output, '');

deps.unshift(oPath.join(parse_dep_config.seajs_dir, 'sea.js'));
deps.forEach(function(file){
	var data = oFs.readFileSync(file).toString();
	var file_name = file.substr(file.lastIndexOf('\\') + 1).replace('.js', '');
	var module_name = oPath.basename(file, '.js');
	var reg = new RegExp('^(?:[^\\/\*]*?)(define\\s*\\(\\s*([\"\']' + file_name + '[\"\'],)?)', 'gm');

	//add module id
	data = data.replace(reg, function(match, p1){
		return match.replace(p1, 'define("' + module_name + '",');
	});

	//require module by id
	data = data.replace(/^([^\/\*]*?)require\(['"](.*?)['"]\)/gm, function(match, p1, p2){
		var module_name = oPath.basename(p2);

		return match.replace(p2, module_name);
	});
	
	if(config.minify){
		data = oUglifyJS.minify(data, {"fromString": true}).code;
	}

	oFs.appendFile(output, ';' + data,  function(err) {
	   if (err) {
	       return console.error(err);
	   }
	});
});

