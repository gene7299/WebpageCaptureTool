var port = 9999;
var server, service,
    system = require('system');
var snapcount = 0;
if (system.args.length === 1) {
    console.log('Try to pass some args when invoking this script!');
} else {
    system.args.forEach(function (arg, i) {
            console.log(i + ': ' + arg);
    });
}
//var fileSystem = require('fs');
// global errorhandler
phantom.onError = function(msg, trace) {
  console.log("ERROR!!!!! \n" + msg);
  phantom.exit(1);
};
/** get parameter from url
*/
function getURLParameter(url, name) {
	return (RegExp(name + '=' + '(.+?)(&|$)').exec(url)||[,null])[1];
}
server = require('webserver').create();
service = server.listen(port, function (request, response) {
  var data = request.postRaw;
  var url = getURLParameter(data,'url');
  var dest = getURLParameter(data,'dest');
  url = decodeURIComponent(url);
  dest = decodeURIComponent(dest);
  dest = dest.replace('file:///','');
  console.log("url:" + url);
  console.log("dest:" + dest);
  snapcount = 0
  var ret = snapPage(url,dest);
  console.log("ret:" + ret);
  var jsonObject = new Object();
  jsonObject['status'] = ret;
  response.statusCode = 200;
  response.write(JSON.stringify(jsonObject));
  response.close();
  });
if (service) {
    console.log('Web server running on port ' + port);
} else {
    console.log('Error: Could not create web server listening on port ' + port);
    phantom.exit();
}

function snapPage(url,dest)
{
  var page = require('webpage').create();
  page.viewportSize = { width: 640, height: 360 };
  page.settings.javascriptEnabled = true;
  page.settings.loadImages = true;
  page.onConsoleMessage = function (msg) {
      //console.log("from page: " + msg);
  };
  page.open(url, function (status) {
      console.log('snapurl = '+url);
      var content = page.content;
      //console.log('Content: ' + content);
      console.log("OPEN:Status:" + status);
      if (status !== 'success') {
          console.log('Unable to access the network!');
          //phantom.exit();
          return "Unable to access the page!";
      } else {
        var x = page.evaluate(function () {
              var body = document.body;
              console.log("evaluate!")
              return initSizeLab;
          });
          console.log("initSizeLab:"+x )
          if(x == null)
          {
            if(snapcount>3){
              setTimeout(doRender, 300);
              return "Unable to access the page!";
              //phantom.exit();
            }
            console.log("render fail!!")
            snapcount++;
            console.log("snapcount:" + snapcount);
            page.close();
            return snapPage(url,dest);
          }else {
            setTimeout(doRender(dest), 300);
            return "OK"
          }
          content.isFinished = true;
          //page.render('technews.png');
      }

  });
  /*
  page.onLoadFinished = function(status) {
    var url = page.url;
    console.log("Status:" + status);
    console.log("Loaded:" + url);
  };
  */
  function doRender(dest) {
      //rendered = page.render('snapshot_'+ Date.now() +'.png', {format: 'jpeg', quality: '100'});
      rendered = page.render(dest, {format: 'jpeg', quality: '100'});
      console.log("rendered:" + rendered);
      console.log("dest:" + dest);
      page.close();
      return rendered;
      //phantom.exit();
  }
}
