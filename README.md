# WebpageCaptureTool
A tool for web page capture 

Please download the phantomjs from http://phantomjs.org/

How to use?

1.webcapture.js for Command line: 

[phantomjs.exe] [SourceURL] [FILE To Save] [Webpage Width] [Webpage Height]

Example1: "D://x/bin/phantomjs.exe" "D://x/bin/webcapture.js" "file:///D://x/preview/admin/layout/layout_202/index.html" "file:///D://x/preview/admin/layout/layout_202/output.png" 640 360
 
Example2: D:\pt>phantomjs.exe "D://pt/webcapture.js" "http://cnn.com" "file:///D://pt/output.png" 640 360

2.webpageCaptureServer.js for Server:

POST:  http://localhost:9999/

Data: 
url: file:///D://x/preview/admin/layout/layout_202/index.html
dest: file:///D://x/preview/admin/layout/layout_202/output.png
