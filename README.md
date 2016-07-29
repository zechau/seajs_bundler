# SeaJS Bundler
A solution to resolve seajs module bundling. It parses the dependence recursively from the entrance module, then bundles all modules together in rgith loading order.


## installation
npm install seajs-bundler

##usage
\> seajs-bundler  

run above command will output the finally bundled file.

or  
```javascript
require("seajs-bundler");
```

##config  
config file name: build_config.json  

config items  
```json
{  
	"project_dir": "/path/to/your/project",  
	//component dir  
	"comp_dir": "component",  
	//dir seajs locates  
	"seajs_dir": "lib",  
	//seajs alias config  
    	"alias": {  
    		"$": "jquery"  
    	},  
	//app entrance  
	"entrance": "index.html",  
	//entrance module  
	"seajs_entrance": "main.js",  
	//dir where bundled file ouputs   
	"output": "./output",  
	//whether minify  
	"minify": true  
}
```
