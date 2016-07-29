const oFs = require("fs");
const oPath = require("path");
var dependenceMap = [];
var config = {
	"alias": {},
	"comp_dir": process.cwd(),//absolute path where component locates
	"seajs_dir": process.cwd() + '/lib', //absolute path where module loader locates
	"entrance": 'index.js'
};

function parseDependence (entrance, path) {
	var module_reg = /^([^\/\*]*?)require\(['"](.*?)['"]\)/gm;
	var module_file = oPath.normalize(oPath.join(path, entrance));
	var file_content;
	var match;

	if(dependenceMap.indexOf(module_file) > -1){
		return;
	}

	file_content = oFs.readFileSync(oPath.join(path, entrance)).toString();
	while((match = module_reg.exec(file_content))){
		var line = match[0];
		var module = match[2];

		//ingore commented codes
		if(line.indexOf('\/\/') > -1 || line.indexOf('*') > -1){
			continue;
		}

		module = config.alias[module] || module;
		module += '.js';

		if(module.indexOf('/') !== -1){
			parseDependence(module, config.comp_dir);
		} else {
			parseDependence(module, config.seajs_dir);
		}
	}

	dependenceMap.push(module_file);
}

module.exports = function(options){
	Object.assign(config, options);
	parseDependence(config.entrance, config.comp_dir);
	return dependenceMap;
}