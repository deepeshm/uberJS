var uber = (function ($) {
	var my = {};
	//Current position
    var currentLongitude = 0;
	var currentLatitude = 0;
	//Current Token
	var serverToken = "yhS9j03X8dOV0b_JDeGF4ntNPx5irX6MEOr3v04s";
    var client_id = 'atTSLD7-D_JIyIvW-bgMdnuiBLhD-1Qn';
    var client_secret = 'vBRZx8OV9utOMycpR9hPs_zgWahU5beM5uMcLWwa';
	
	//  Uber URLs
	var uberUrl = 'https://api.uber.com/';
    var authorizeUrl= 'https://login.uber.com/oauth/authorize';
    var loginUrl = 'https://login.uber.com/oauth/token';
	var uberDeepLink = 'uber://?action=setPickup';
	var uberMobileWeb = 'http://m.uber.com/?action=setPickup'
    
	// On document load check if there is a authorization code or access token
	$(document).ready(function() {
     
	 navigator.geolocation.getCurrentPosition(successCallback,
	                                             errorCallback,
	                                             {maximumAge:600000});
	    function successCallback(position) {
				// $("p").text(position.coords.longitude+ " " + position.coords.latitude);
				currentLatitude = position.coords.latitude;
				currentLongitude = position.coords.longitude;
	    }
	
	    function errorCallback(error) {
	  		
	    }
		initialize();
	 });
	
	makeRequest = function(url, params){
		var result;
		$.get(url,params,function( data ) {
			result = data;
			
  		});
		return result;
	};
	
	// Uber Button
	my.uberButton = function(buttonDiv,dropOffCoordinates,dropOffAddress)
	{
			
			var myDiv = $('#'+buttonDiv);
			var buttonHtml = '<input type="image" id="requestUber" src="rideWithUber.png" onclick="uber.requestUber" border=1 alt="Uber button">';
			myDiv.html(buttonHtml);
				
			$('#requestUber').click(function(){ 
			var userAgent = navigator.userAgent;
			var redirectUrl;
			if(userAgent.indexOf("ios") >= 0 ||  userAgent.indexOf("android") >= 0)
			{
				redirectUrl = uberDeepLink;
			}
			else{
				redirectUrl = uberMobileWeb;
			}
			
			redirectUrl = redirectUrl + '&client_id='+client_id
									  + '&pickup[latitude]='+currentLatitude
									  + '&pickup[longitude]='+currentLongitude;
			if(dropOffCoordinates !== undefined && dropOffCoordinates !== null)				
			{
			redirectUrl = redirectUrl + '&dropoff[latitude]='+dropOffCoordinates.latitude
									  + '&dropoff[longitude]='+dropOffCoordinates.longitude;
			}	
			if(dropOffAddress !== undefined && dropOffAddress !== null)
			{					  
			redirectUrl = redirectUrl + '&dropoff[formatted_address]='+encodeURIComponent(dropOffAddress);
			
			}
			window.location.href= redirectUrl;
		});
		
	};
	
	
	// Uber Products
	my.getProductInfo = function(coordinates){
	var url = uberUrl +"v1/products";
	
	var parameters = {
		    'server_token': serverToken,
		    'latitude': currentLatitude,
		    'longitude': currentLongitude
		};
		return makeRequest(url,parameters);
	};
	
	//Uber price estimates
	my.getPriceEstimates = function (endCoordinates){
	 var url = "/v1/estimates/price";

	 var parameters = {
		    'start_latitude': currentLatitude,
		    'start_longitude': currentLongitude,
			'end_latitude': endCoordinates.latitude,
		    'end_longitude': endCoordinates.longitude
		};
	 	return makeRequest(url,parameters);
		
		
	};
		
	//Uber time estimates
	my.getTimeEstimates = function (){
	 var url = "/v1/estimates/time";

	 var parameters = {
		
		    'start_latitude': currentLatitude,
		    'start_longitude': currentLongitude,
		};
		return makeRequest(url,parameters);
	};

	//Uber promotions
	my.getPromotions = function (endCoordinates){
	 var url = "/v1/promotions";

	 var parameters = {
		
		    'start_latitude': currentLatitude,
		    'start_longitude': currentLongitude,
			'end_latitude': endCoordinates.latitude,
		    'end_longitude': endCoordinates.longitude
		};
		
		return makeRequest(url,parameters);
	};

	//Uber user activity
	my.getUserActivity = function (){
	 var url = "/v1.2/history";
	 
	 return makeRequest(url);
	};
	
	//uber user profile
	my.getUserProfile = function (){
	 var url = "/v1/me";
	 
	 return makeRequest(url);
	};
	//Uber login
	my.init = function(redirectUri){
        var session;
		if ($.cookie('access_token') === undefined)
        {
            if ($.cookie('refresh_token') !== undefined)
            {
               session = exchangeRefreshTokenForAccess();
            }

        }
        return session;
	};
	my.login = function(redirectUri){
		if (my.init(redirectUri) === undefined)
        {
            $.cookie('redirectUrl', redirectUri);
                    var url = authorizeUrl + "?response_type=code&client_id=" + client_id;
                    var windowName = "_blank";
                         var windowSizeArray = [ "width=200,height=200",
                                    "width=300,height=400,scrollbars=no" ];
                    var windowSize = windowSizeArray[$(this).attr("rel")];
                    window.open(url, windowName, windowSize);
                    
        }
	};
	

	
    exchangeCodeForToken = function (code) {
        var redirect = $.cookie('redirectUrl');
        $.cookie('redirectUrl');
		
       var parameters = {
		    'client_secret': client_secret,
		    'client_id': client_id,
		    'grant_type': 'authorization_code',
            'redirect_uri': redirect,
            'code':code,
		};
		var header = {
				'Access-Control-Allow-Origin' : '*',
				'Access-Control-Allow-Methods' : '*',
				'Access-Control-Allow-Headers' : 'Accept'
		};
   $.ajax({
		    type: "GET",
		    contentType: "application/json",
		    url: loginUrl,
		    dataType: "json",
			data: parameters,
			 headers: header,
	        complete: function () { alert('Done'); },
            success: function (a, b, c) {
                    alert('Success');
                    alert(a); alert(b); alert(c);
                },
           error:function (xhr, ajaxOptions, thrownError){
                    alert(xhr.status);
                    alert(thrownError);
                    }
		});
	}
	
	initialize = function(){
		 var access_token =	$.url('?query');
     var code = $.url('?code')
     if (code != null)
     {
          window.close();
         exchangeCodeForToken(code);
     }
     if($.url('file') === 'redirect.html')
     {
         window.close();
     }
     
	}
	return my;
}(jQuery));


/*
 * Purl (A JavaScript URL parser) v2.3.1
 * Developed and maintanined by Mark Perkins, mark@allmarkedup.com
 * Source repository: https://github.com/allmarkedup/jQuery-URL-Parser
 * Licensed under an MIT-style license. See https://github.com/allmarkedup/jQuery-URL-Parser/blob/master/LICENSE for details.
 */
window.url = (function() {
    function isNumeric(arg) {
      return !isNaN(parseFloat(arg)) && isFinite(arg);
    }
    
    return function(arg, url) {
        var _ls = url || window.location.toString();

        if (!arg) { return _ls; }
        else { arg = arg.toString(); }

        if (_ls.substring(0,2) === '//') { _ls = 'http:' + _ls; }
        else if (_ls.split('://').length === 1) { _ls = 'http://' + _ls; }

        url = _ls.split('/');
        var _l = {auth:''}, host = url[2].split('@');

        if (host.length === 1) { host = host[0].split(':'); }
        else { _l.auth = host[0]; host = host[1].split(':'); }

        _l.protocol=url[0];
        _l.hostname=host[0];
        _l.port=(host[1] || ((_l.protocol.split(':')[0].toLowerCase() === 'https') ? '443' : '80'));
        _l.pathname=( (url.length > 3 ? '/' : '') + url.slice(3, url.length).join('/').split('?')[0].split('#')[0]);
        var _p = _l.pathname;

        if (_p.charAt(_p.length-1) === '/') { _p=_p.substring(0, _p.length-1); }
        var _h = _l.hostname, _hs = _h.split('.'), _ps = _p.split('/');

        if (arg === 'hostname') { return _h; }
        else if (arg === 'domain') {
            if (/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/.test(_h)) { return _h; }
            return _hs.slice(-2).join('.'); 
        }
        //else if (arg === 'tld') { return _hs.slice(-1).join('.'); }
        else if (arg === 'sub') { return _hs.slice(0, _hs.length - 2).join('.'); }
        else if (arg === 'port') { return _l.port; }
        else if (arg === 'protocol') { return _l.protocol.split(':')[0]; }
        else if (arg === 'auth') { return _l.auth; }
        else if (arg === 'user') { return _l.auth.split(':')[0]; }
        else if (arg === 'pass') { return _l.auth.split(':')[1] || ''; }
        else if (arg === 'path') { return _l.pathname; }
        else if (arg.charAt(0) === '.')
        {
            arg = arg.substring(1);
            if(isNumeric(arg)) {arg = parseInt(arg, 10); return _hs[arg < 0 ? _hs.length + arg : arg-1] || ''; }
        }
        else if (isNumeric(arg)) { arg = parseInt(arg, 10); return _ps[arg < 0 ? _ps.length + arg : arg] || ''; }
        else if (arg === 'file') { return _ps.slice(-1)[0]; }
        else if (arg === 'filename') { return _ps.slice(-1)[0].split('.')[0]; }
        else if (arg === 'fileext') { return _ps.slice(-1)[0].split('.')[1] || ''; }
        else if (arg.charAt(0) === '?' || arg.charAt(0) === '#')
        {
            var params = _ls, param = null;

            if(arg.charAt(0) === '?') { params = (params.split('?')[1] || '').split('#')[0]; }
            else if(arg.charAt(0) === '#') { params = (params.split('#')[1] || ''); }

            if(!arg.charAt(1)) { return params; }

            arg = arg.substring(1);
            params = params.split('&');

            for(var i=0,ii=params.length; i<ii; i++)
            {
                param = params[i].split('=');
                if(param[0] === arg) { return param[1] || ''; }
            }

            return null;
        }

        return '';
    };
})();

if(typeof jQuery !== 'undefined') {
    jQuery.extend({
        url: function(arg, url) { return window.url(arg, url); }
    });
}

/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2006, 2014 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD (Register as an anonymous module)
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// Node/CommonJS
		module.exports = factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			// If we can't parse the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		// Write

		if (arguments.length > 1 && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setMilliseconds(t.getMilliseconds() + days * 864e+5);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {},
			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling $.cookie().
			cookies = document.cookie ? document.cookie.split('; ') : [],
			i = 0,
			l = cookies.length;

		for (; i < l; i++) {
			var parts = cookies[i].split('='),
				name = decode(parts.shift()),
				cookie = parts.join('=');

			if (key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		// Must not alter options, thus extending a fresh object...
		$.cookie(key, '', $.extend({}, options, { expires: -1 }));
		return !$.cookie(key);
	};

}));