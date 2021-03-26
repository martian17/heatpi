

var canvas = document.getElementById("canvas");
var width = 500;
var height = 300;
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext("2d");


var heatMap = [];
for(var i = 0; i < width; i++){
    if(i < (width-1)/2){
        heatMap.push(1);
    }else if(i === (width-1)/2){
        heatMap.push(0);
    }else{
        heatMap.push(-1);
    }
}

var stepHeatMap = function(dt){
    var heatMap1 = [];
    //left boundary
    var dhdx1 = (heatMap[0] - heatMap[1])*width/1;
    var dhdx2 = (heatMap[1] - heatMap[0])*width/1;
    //
    var dhdx02 = (dhdx2-dhdx1)*width/1;
    //console.log(dhdx02);
    heatMap1[0] = heatMap[0]+dhdx02*dt;
    
    for(var i = 1; i < width-1; i++){
        var dhdx1 = (heatMap[i] - heatMap[i-1])*width/1;//same as 1/dw dw is the step length
        var dhdx2 = (heatMap[i+1] - heatMap[i])*width/1;
        //
        var dhdx02 = (dhdx2-dhdx1)*width/1;
        if(heatMap[i] !== heatMap[i-1]){
            //console.log(heatMap[i],heatMap[i-1],dhdx1);
            //console.log(dhdx02);
        }
        //console.log(dhdx1,dhdx2);
        //console.log(dhdx02);
        heatMap1[i] = heatMap[i]+dhdx02*dt;
    }
    
    //right boundary
    var dhdx1 = (heatMap[width-1] - heatMap[width-2])*width/1;
    var dhdx2 = (heatMap[width-2] - heatMap[width-1])*width/1;
    //
    var dhdx02 = (dhdx2-dhdx1)*width/1;
    heatMap1[width-1] = heatMap[width-1]+dhdx02*dt;
    heatMap = heatMap1;
};

var stepHeatMap2 = function(){
    var heatMap1 = [];
    heatMap1[0] = (heatMap[0]+heatMap[1])/2;
    for(var i = 1; i < width-1; i++){
        heatMap1[i] = (heatMap[i+1]+heatMap[i]+heatMap[i-1])/3;
    }
    heatMap1[width-1] = (heatMap[width-2]+heatMap[width-1])/2;
    heatMap = heatMap1;
};

var colorFromVal = function(val){
    var r = Math.floor(255*(1-Math.abs(val/(height/3))));
    if(r > 255) r = 255;
    r = Math.floor(r/2);
    if(val < 0){
        return [r,r,255-r*2]
    }else{
        return [255-r,r,0]
    }
};

var drawHeatMap = function(){
    var imgdata = ctx.getImageData(0,0,width,height);
    var data = imgdata.data;
    var maxim = heatMap[0];
    //scale it according to the maxim
    //scale it accordingly
    for(var i = 0; i < width; i++){
        var x = i;
        var val = Math.floor(heatMap[i]*height/3/maxim);
        var aval = Math.abs(val);
        if(aval > height/3+20){
            aval = height/3+20
        }
        var sign = val < 0 ? 1 : -1;
        for(var j = 0; j < aval; j++){
            var y = Math.floor(j*sign+height/2);
            var idx = 4*(x+y*width);
            var col = colorFromVal(-j*sign);
            data[idx+0] = col[0];
            data[idx+1] = col[1];
            data[idx+2] = col[2];
            data[idx+3] = 255;
        }
    }
    ctx.putImageData(imgdata,0,0);
};

var start = 0;
var animate = function(t){
    if(start === 0)start = t;
    var dt = t - start;
    start = t;
    ctx.clearRect(0,0,width,height);
    ctx.fillStyle = "#002";
    ctx.fillRect(0,0,width,height);
    /*for(var i = 0; i < 1000; i++){
        stepHeatMap(16/100000000);
    }*/
    for(var i = 0; i < 1000; i++){
        //stepHeatMap2();
        stepHeatMap(16/100000000);
    }
    drawHeatMap();
    var centerSlope = (heatMap[width/2-1]-heatMap[width/2-1])/2;
    var edgeVal = (-centerSlope*(width+1)/2);
    var pi = edgeVal/heatMap[0]*2;
    document.getElementById("display").innerHTML = "π = "+pi;
    requestAnimationFrame(animate);
};

requestAnimationFrame(animate);
