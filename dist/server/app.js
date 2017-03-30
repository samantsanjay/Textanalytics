/******************************************************************
start of post gress logic
******************************************************************/  
var pg = require('pg');

var conString = "postgres://u97fb3ebb7ecd4f17bed84bd536ef0cc3:683a5ec08a434219a85fcc35f214391c@10.72.6.125/d97fb3ebb7ecd4f17bed84bd536ef0cc3";



var clientTokenResponse=" ";

var request = require('request');

var monthMap = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];

var tempMonthMap = ["January","February","March","April","May","June","July","August","September","October","November","December"];

var finalData = {};

var uaaURL='https://ec24782e-ac8f-4c0b-8700-852319f7aa12.predix-uaa.run.aws-usw02-pr.ice.predix.io';



/*************************************************************
End of post gress logic
**************************************************************/




/*******************************************************
The predix-seed Express web application includes these features:
  * routes to mock data files to demonstrate the UI
  * passport-predix-oauth for authentication, and a sample secure route
  * a proxy module for calling Predix services such as asset and time series
*******************************************************/

var express = require('express');
var jsonServer = require('json-server'); // used for mock api responses
var path = require('path');
var cookieParser = require('cookie-parser'); // used for session cookie
var bodyParser = require('body-parser');
var passport;  // only used if you have configured properties for UAA
// simple in-memory session is used here. use connect-redis for production!!
var session = require('express-session');
var proxy = require('./proxy'); // used when requesting data from real services.
// get config settings from local file or VCAPS env var in the cloud
var config = require('./predix-config');
// configure passport for authentication with UAA
var passportConfig = require('./passport-config');

// if running locally, we need to set up the proxy from local config file:
var node_env = process.env.node_env || 'development';
if (node_env === 'development') {
  var devConfig = require('./localConfig.json')[node_env];
	proxy.setServiceConfig(config.buildVcapObjectFromLocalConfig(devConfig));
	proxy.setUaaConfig(devConfig);
}

var windServiceURL = devConfig ? devConfig.windServiceURL : process.env.windServiceURL;

console.log('************'+node_env+'******************');

var uaaIsConfigured = config.clientId &&
    config.uaaURL &&
    config.uaaURL.indexOf('https') === 0 &&
    config.base64ClientCredential;
if (uaaIsConfigured) {
	passport = passportConfig.configurePassportStrategy(config);
}

/**********************************************************************
       SETTING UP EXRESS SERVER
***********************************************************************/
var app = express();

app.set('trust proxy', 1);
app.use(cookieParser('predixsample'));
// Initializing default session store
// *** Use this in-memory session store for development only. Use redis for prod. **
app.use(session({
	secret: 'predixsample',
	name: 'cookie_name',
	proxy: true,
	resave: true,
	saveUninitialized: true}));

if (uaaIsConfigured) {
  app.use(passport.initialize());
  // Also use passport.session() middleware, to support persistent login sessions (recommended).
  app.use(passport.session());
}

//Initializing application modules
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var server = app.listen(process.env.VCAP_APP_PORT || 5000, function () {
	//console.log ('Server started on port: ' + server.address().port);
});

/*******************************************************
SET UP MOCK API ROUTES
*******************************************************/
// Import route modules
var viewServiceRoutes = require('./view-service-routes.js')();
var assetRoutes = require('./predix-asset-routes.js')();
var timeSeriesRoutes = require('./time-series-routes.js')();

// add mock API routes.  (Remove these before deploying to production.)
app.use('/api/view-service', jsonServer.router(viewServiceRoutes));
app.use('/api/predix-asset', jsonServer.router(assetRoutes));
app.use('/api/time-series', jsonServer.router(timeSeriesRoutes));

/****************************************************************************
	SET UP EXPRESS ROUTES
*****************************************************************************/

if (!uaaIsConfigured) { // no restrictions
   //console.log('uaa flag not set');
  app.use(express.static(path.join(__dirname, process.env['base-dir'] ? process.env['base-dir'] : '../public')));
} else {
  //login route redirect to predix uaa login page
  //console.log('uaa flag set');
  app.get('/login',passport.authenticate('predix', {'scope': ''}), function(req, res) {
    // The request will be redirected to Predix for authentication, so this
    // function will not be called.
  });

  // access real Predix services using this route.
  // the proxy will add UAA token and Predix Zone ID.
  app.use('/predix-api',
  	passport.authenticate('main', {
  		noredirect: true
  	}),
  	proxy.router);

  //callback route redirects to secure route after login
  app.get('/callback', passport.authenticate('predix', {
  	failureRedirect: '/'
  }), function(req, res) {
  	//console.log('Redirecting to secure route...');
  	res.redirect('/');
    });

  // example of calling a custom microservice.
  if (windServiceURL && windServiceURL.indexOf('https') === 0) {
    app.get('/windy/*', passport.authenticate('main', { noredirect: true}),
      // if calling a secure microservice, you can use this middleware to add a client token.
      // proxy.addClientTokenMiddleware,
      proxy.customProxyMiddleware('/windy', windServiceURL)
    );
  }

  //Use this route to make the entire app secure.  This forces login for any path in the entire app.
  app.use('/', passport.authenticate('main', {
    noredirect: false //Don't redirect a user to the authentication page, just show an error
    }),
    express.static(path.join(__dirname, process.env['base-dir'] ? process.env['base-dir'] : '../public'))
  );

  //Or you can follow this pattern to create secure routes,
  // if only some portions of the app are secure.
  app.get('/secure', passport.authenticate('main', {
    noredirect: true //Don't redirect a user to the authentication page, just show an error
    }), function(req, res) {
    //console.log('Accessing the secure route');
    // modify this to send a secure.html file if desired.
    res.send('<h2>This is a sample secure route.</h2>');
  });

}

//logout route
app.get('/logout', function(req, res) {
	req.session.destroy();
	req.logout();
  passportConfig.reset(); //reset auth tokens
  res.redirect(config.uaaURL + '/logout?redirect=' + config.appURL);
});

app.get('/favicon.ico', function (req, res) {
	res.send('favicon.ico');
});

/**********************************************************
code for colling the service for photovolatile app
***********************************************************/
app.post('/getChartData', function (req, res) {
	console.log('chart data');
	var rowData = [];
	var tempMonthData = [];
		var commentPlant = req.body.data.commentPlant;
		
			
						var options = {
					method: 'POST',
					url: uaaURL + '/oauth/token',
					form: {
						'grant_type': 'client_credentials',
						'client_id': 'client'
					},
					headers: {
						'Authorization': 'Basic ' + 'Y2xpZW50OnBhc3N3b3Jk'
					}
				};

				request(options, function(err, response, body) {
					var executeResponse;
					if (!err && response.statusCode == 200) {
						 clientTokenResponse = JSON.parse(body);
									  var u='https://predix-analytics-catalog-release.run.aws-usw02-pr.ice.predix.io/api/v1/catalog/analytics/3cbab4ac-3887-4704-bfd8-ca66cf7cb5af/execution'	 
									  var au='Bearer '
									  var data_main;
									  var data = [{'data':[commentPlant]}];
							request.post({
							  headers: {'Authorization': au.concat(String(clientTokenResponse["access_token"])),
										'content-type': 'application/json',
										'Predix-Zone-Id':'b8fa90ab-644f-4eed-b769-0a1c4b1390b5'
										},
							  url:     u,
							  json:    data
							}, function(error, response, body){
								 finalData = body;
								 var resultString = "Please provide meaningful JSON input specific to Machine";
                                  console.log("Error"+JSON.stringify(body));
								  var entityData = finalData;
								  if(resultString != entityData.result){							  
										 var entityData = JSON.parse(finalData.result).result.entity;
										 //console.log("entity"+JSON.stringify(entityData));
										 var entityFinalData = [];
										 for(var i= 0 ; i < entityData.length ;i++){
											 entityFinalData.push(entityData[i].name);
											 console.log("name"+entityData[i].name);
										 }
										 if(entityFinalData.length != 0){
												 request.post({
											  headers: {'Authorization': au.concat(String(clientTokenResponse["access_token"])),
														'content-type': 'application/json',
														'Predix-Zone-Id':'7caeddea-d39f-44c9-8503-990d43fa5bd2'
														},
											  url:     'https://predix-analytics-catalog-release.run.aws-usw02-pr.ice.predix.io/api/v1/catalog/analytics/23e9556a-4ef1-4654-bfa7-47b9f0688712/execution',
											  json:   [{
														"data": [commentPlant],
														"input": entityFinalData
														}]
											}, function(error, response, body){
												 finalData = body;
												 
												 res.send({
														data: finalData
													});
												 
											});
										 }
										
								  }
								   else{
											 res.send();
										 }
										 
								 
							});
						
					} else {
						return executeResponse;
					}
					
				});
});
/**************************************
data for country
************************************/

var rowData = [];
app.get('/getStateDetails', function (req, res) {
	    var client = new pg.Client(conString);
		client.connect(function(err, client, done) {
		  if(err) {
			return console.error('error fetching client from pool', err);
		  }
		  var query = client.query('SELECT * FROM "PV"."temp_data"', function(err, result) {
			 
			 var response;

			if(err) {
			  return console.error('error running query', err);
			}
			res.send({
				data: JSON.stringify(result.rows)
			});
		  });
		  query.on('end', function() {
					 client.end();
					 res.end();
					 });
		});
});

 var getClientToken = function(successCallback, errorCallback) {
	//request = require('request');
	var options = {
		method: 'POST',
		url: uaaURL + '/oauth/token',
		form: {
			'grant_type': 'client_credentials',
			'client_id': 'client'
		},
		headers: {
			'Authorization': 'Basic ' + 'Y2xpZW50OnBhc3N3b3Jk'
		}
	};

	request(options, function(err, response, body) {
		var executeResponse;
		if (!err && response.statusCode == 200) {
			 clientTokenResponse = JSON.parse(body);
			executeResponse = executePV(); 
			
		} else {
			return executeResponse;
		}
		
	});
//calling the service 	
};

var executePV = function(){
         config = {}
         resource_data ={'latitude':51.3,'daily_solar_radiation':rowData,
		 'air_temperature':[-0.2,0.8,3.9,7.9,12.6,15.6,17.2,16.9,13.5,9.3,4.1,1.1]}
		 pv_module_data ={'pv_module_efficiency':0.11,'noct':45.0,'temperature_coefficient':0.004,'array_losses':0.05}
         inverter_data = {'inverter_efficiency':0.9,'inverter_losses':0.05}
         system_data = {'pv_module_data':pv_module_data,'inverter_data':inverter_data}
         plant_data = {'tilt':5,'array_azimuth':0,'system_capacity':1000}
         data1 = {'resource_data':resource_data,'system_data':system_data,'plant_data':plant_data}
         d={'data':data1,'config':config}
         JSON.stringify(d)	
          var u='https://predix-analytics-catalog-release.run.aws-usw02-pr.ice.predix.io/api/v1/catalog/analytics/37b9a933-b5c9-435b-ba2a-0acc2dec717d/execution'	 
          var au='Bearer '
		  var data_main;
request.post({
  headers: {'Authorization': au.concat(String(clientTokenResponse["access_token"])),
            'content-type': 'application/json',
			'Predix-Zone-Id':'b8fa90ab-644f-4eed-b769-0a1c4b1390b5'
			},
  url:     u,
  json:    d
}, function(error, response, body){
	 finalData = body;
	 return finalData;
     
});
}


// catch 404 and forward to error handler
app.use(function(err, req, res, next) {
  //console.error(err.stack);
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// development error handler - prints stacktrace
if (node_env === 'development') {
	app.use(function(err, req, res, next) {
		if (!res.headersSent) {
			res.status(err.status || 500);
			res.send({
				message: err.message,
				error: err
			});
		}
	});
}




// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	if (!res.headersSent) {
		res.status(err.status || 500);
		res.send({
			message: err.message,
			error: {}
		});
	}
});

module.exports = app;
