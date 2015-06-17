# uberJS
Uber JS is a Uber button that lets developers add a uber button that deep links into the uber application with the starting coordinates.
To use this, just load the uberhelper library and place the uberhelper.js and the rideWithUber.png in the same directory. 
https://github.com/deepeshm/uberJS/new/master?readme=1#fullscreen
To see a working sample, clone the repo and run Index.html from the src directory.

```html
<html> 
	<head> 
	
	</head>
	<script src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
	<script src="uberhelper.js"></script>
	<script type="text/javascript">
	$(document).ready(function() {
		uber.uberButton('uberDiv',null,'800 Occidental Ave S, Seattle, WA');
	});
	</script>
	<body>
	
		<div id='uberDiv'>
		</div>
	</body>
</html>
'''
