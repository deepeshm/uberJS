# uberJS
Uber JS is a Uber button that lets developers add a uber button that deep links into the uber application with the starting coordinates.
To use this, just load the uberhelper library and place the uberhelper.js and the rideWithUber.png in the same directory. 
https://github.com/deepeshm/uberJS/new/master?readme=1#fullscreen
To see a working sample, clone the repo and run Index.html

<html> 
	<head> 
		<title>Ride with uber</title>
	</head>
	<script src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
	<script src="uberhelper.js"></script>
	<script type="text/javascript">
	$(document).ready(function() {
		uber.uberButton('uberDiv',null,'2201 6th Ave Seattle WA');
	});
	</script>
	<body>
		<p>The div element below will be replaced with the Uber Button</p>
		<div id='uberDiv'>
		</div>
	</body>
</html>
