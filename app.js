angular.module("myapp", ["ngRoute","chart.js"])
.config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl : 'upload.html',
                controller  : 'LineCtrl'
            })
            .when('/link/:id', {
                templateUrl : 'chart.html',
                controller  : 'ChartCtrl'
            });
    })
.controller("ChartCtrl", function ($scope, $routeParams, $http) {   
    $scope.parseSuccess = true;
   
    function validateAndDraw(csvdata){
        var graphdata = csvdata.chartdata;   
        var formatteddata = graphdata.replace(/\n/g,',');
       
        var arr = formatteddata.split(',');   
        if(!arr[arr.length-1])
        {
            arr.pop();
        }
        var series=[];
        var chartObj = {};
        var startIndex, endIndex; 
        var series=[], labels, data; 
        for(var i in arr)
        {
            if(arr[i].indexOf('SERIES')>-1)
            {
                if( startIndex !== i )
                {
                    if(startIndex && !endIndex)
                    {
                        endIndex = i;
                    }
                    if(!startIndex)
                    {
                        startIndex = i;
                    }   
                    if(startIndex && endIndex)
                    {
                        break;
                    }               
                }                               
            }
        }   
    
        for(var j=parseInt(startIndex); j < arr.length; j=j+parseInt(endIndex) )
        {
            chartObj[arr[j]]=arr.slice(j+1,j+parseInt(endIndex));
        }      
        for(var k in chartObj)
        {
            var objConvert = {};
            for(var l in chartObj[k])
            {
                var obn = chartObj[k][l].split('|');               
                objConvert[obn[0]] = obn[1];                               
            }
            chartObj[k] = objConvert;
        }
       
        for(var m in chartObj)
        {
            series.push(m);  
            if(!labels)    
            {
                labels = Object.keys(chartObj[m]);           
            }
        }
       
        $scope.labels = labels;
        $scope.series = series;   
       
        $scope.data = [];
        for(var n in chartObj)
        {
            var arrg = [];
            for(var o in chartObj[n])
            {
                arrg.push(parseInt(chartObj[n][o]));
            }
            $scope.data.push(arrg);
        }
 
    }
 
    try {        
        $http.get('/getchartdata/'+$routeParams.id)
        .then(function(res){
            validateAndDraw(res.data);
        });
    }
    catch(err){
        $scope.parseSuccess =  false;
    }
   
 
})
.controller("LineCtrl", function ($scope, $http) {
     
    $scope.upload = function() {       
        var f = document.getElementById('file').files[0],
            r = new FileReader();       
        r.onload = function(e) {           
          
            $http.post('/addchartdata', {chartdata:""+e.target.result.replace(/\n/g,',')})
            .then(function(res){               
                $scope.generatedLink = location.href+"link/"+res.data._id;
            });
        }
 
        r.readAsBinaryString(f);
    }
 
});
 
 