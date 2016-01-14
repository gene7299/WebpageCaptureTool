// include plugins
var system = require('system');
if (system.args.length === 1) {
    console.log('Try to pass some args when invoking this script!');
} else {
    system.args.forEach(function (arg, i) {
          //  console.log(i + ': ' + arg);
    });
}
//var fileSystem = require('fs');
var page = require('webpage').create();
// global errorhandler
phantom.onError = function(msg, trace) {
  console.log("ERROR!!!!! \n" + msg);
  phantom.exit(1);
};

var snapurl = system.args[1];
var snapdest = system.args[2];
var snapwidth = system.args[3];
var snapheight = system.args[4];
snapdest = snapdest.replace('file:///','');
var snapcount = 0;

console.log("systemargs[2]: snapurl -> " + snapurl);
console.log("systemargs[3]: snapdest -> " + snapdest);

function snapPage()
{
  var page = require('webpage').create();
  page.viewportSize = { width: snapwidth, height: snapheight };
  page.settings.javascriptEnabled = true;
  page.settings.loadImages = true;
  page.onConsoleMessage = function (msg) {
    //  console.log("from page: " + msg);
  };
  setTimeout(doRender, 6000);
  page.open(snapurl, function (status) {
      var content = page.content;
      //console.log('Content: ' + content);
      console.log("OPEN:Status:" + status);
      if (status !== 'success') {
          console.log('Unable to access the network!');
          phantom.exit();
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
              phantom.exit();
            }
            console.log("render fail!!")
            snapcount++;
            console.log("snapcount:" + snapcount);
            page.close();
            snapPage();
          }else {
            setTimeout(doRender, 300);
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
  function doRender() {
      //rendered = page.render('snapshot_'+ Date.now() +'.png', {format: 'jpeg', quality: '100'});
      rendered = page.render(snapdest, {format: 'png', quality: '33'});
      console.log("rendered:" + rendered)
      phantom.exit();
  }
}

(function() {
     snapPage();
})();
