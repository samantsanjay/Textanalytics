

/*****/

function getDataFromService(){
	var request = new XMLHttpRequest();
	var datapointsUrl = "/predix-api1/";
    request.open('GET', datapointsUrl, true);
		request.onload = function(response) {
			if (request.status >= 200 && request.status < 400) {
				console.log("success");
			} else {
				console.log("failure on status code");
			}
			if(response){
				console.log(response);
			}
		};
		request.onerror = function() {
			console.log("failure after success code");
		};
		request.send();	
	
}