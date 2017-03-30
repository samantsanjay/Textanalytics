var jsonData;
var mainJsonData;
var ary2 = [];
var bvalue = [];
var bheader = [];
var dropDownValueState = [];
var dropDownValueCounty = [];
var dropDownValueZipCode = [];
var displayNameState = "NONE";
var displayNameCounty = "NONE";
var displayNameZipCode = "NONE";
var init = true;
var columnColors = ['#9a4d6f', '#c76c47', '#f85115', '#d9b099', '#d4ba2f'];

var resultJson = {};
function getData(){
	console.log("ready function");
	var request = new XMLHttpRequest();
	var datapointsUrl = "/getChartData/";
    request.open('POST', datapointsUrl, true);
	request.setRequestHeader('Content-Type','application/json');
		request.onload = function(response) {
			if (request.status >= 200 && request.status < 400) {
				console.log("success");
				plotChart(request.response);
				
			} else {
				console.log("failure on status code");
			}
			
		};
		request.onerror = function() {
			console.log("failure after success code");
		};
		
		var commentString = document.getElementById('submitText').value;
		
		var requestData ={"data":{"commentPlant":commentString}}; 
		request.send(JSON.stringify(requestData));	
}

function clickHandler() {  
	   getData(); 
		     
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function plotChart(jsonData){
	
	//var data =[];
	   var isJSON = IsJsonString(jsonData);
	   jsonData = (isJSON ? JSON.parse(jsonData).data.result : 'false');
	   if(jsonData != 'false'){
		   var resultData = JSON.parse(jsonData).result.entity;
		   var resultMap = {};
		   var commentData = document.getElementById('submitText').value;
		   var finalData = [];
		   for(var i = 0 ; i < resultData.length ; i++){
			   finalData.push(resultData[i].name);
			   resultMap[resultData[i].name] = resultData[i].status;
		   }
		   drawWordCloud(finalData ,resultMap);
	   }
	   else{
		   document.getElementsByClassName("chart-div")[0].style.display = "block";
		   d3.selectAll("svg").remove();
		   
	   }
	
}



function parseURLParams(url) {
    var queryStart = url.indexOf("?") + 1,
        queryEnd   = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {}, i, n, v, nv;

    if (query === url || query === "") return;

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=", 2);
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) parms[n] = [];
        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
}


function drawWordCloud(text_string,resultData){
        var common = "poop,i,me,my,myself,we,us,our,ours,ourselves,you,your,yours,yourself,yourselves,he,him,his,himself,she,her,hers,herself,it,its,itself,they,them,their,theirs,themselves,what,which,who,whom,whose,this,that,these,those,am,is,are,was,were,be,been,being,have,has,had,having,do,does,did,doing,will,would,should,can,could,ought,i'm,you're,he's,she's,it's,we're,they're,i've,you've,we've,they've,i'd,you'd,he'd,she'd,we'd,they'd,i'll,you'll,he'll,she'll,we'll,they'll,isn't,aren't,wasn't,weren't,hasn't,haven't,hadn't,doesn't,don't,didn't,won't,wouldn't,shan't,shouldn't,can't,cannot,couldn't,mustn't,let's,that's,who's,what's,here's,there's,when's,where's,why's,how's,a,an,the,and,but,if,or,because,as,until,while,of,at,by,for,with,about,against,between,into,through,during,before,after,above,below,to,from,up,upon,down,in,out,on,off,over,under,again,further,then,once,here,there,when,where,why,how,all,any,both,each,few,more,most,other,some,such,no,nor,not,only,own,same,so,than,too,very,say,says,said,shall";

        var word_count = {};
		d3.selectAll("svg").remove();
		

        var words = text_string;
          if (words.length == 1){
            word_count[words[0]] = 1;
          } else {
            words.forEach(function(word){
              var word = word.toLowerCase();
              if (word != "" && common.indexOf(word)==-1 && word.length>1){
                if (word_count[word]){
                  word_count[word]++;
                } else {
                  word_count[word] = 1;
                }
              }
            })
          }

        var svg_location = "#chart";
        var width = $(document).width();
        var height = $(document).height();

        var fill = d3.scale.category20();

        var word_entries = d3.entries(word_count);

        var xScale = d3.scale.linear()
           .domain([0, d3.max(word_entries, function(d) {
              return d.value;
            })
           ])
           .range([10,100]);

        d3.layout.cloud().size([width, height])
          .timeInterval(20)
          .words(word_entries)
          .fontSize(function(d) { return xScale(+d.value); })
          .text(function(d) { return d.key; })
          .rotate(function() { return ~~(Math.random() * 2) * 90; })
          .font("Impact")
          .on("end", draw)
          .start();

        function draw(words) {
          d3.select(svg_location).append("svg")
              .attr("width", width)
              .attr("height", height)
            .append("g")
              .attr("transform", "translate(" + [width >> 1, height >> 1] + ")")
            .selectAll("text")
              .data(words)
            .enter().append("text")
              .style("font-size", function(d) { return xScale(d.value) + "px"; })
              .style("font-family", "Impact")
              .style("fill", function(d, i) { 
			                                 if(resultData[d.key] == "negated" ){
												 return "red";
											 }
											 else{
											 return fill(i); }})
              .attr("text-anchor", "middle")
              .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
              })
              .text(function(d) { return d.key; });
        }

        d3.layout.cloud().stop();
      }