(function() {
	var Cnsl = function(opts) {
		var opts = {
			log:		opts.log || 'document',
			logtype:	opts.logtype || undefined,
			alias:		opts.alias || 'cnsl',
			styles:		opts.styles || {
				log:	{color:'#333',weight:'normal',icon:undefined},
				timer:	{color:'#333',weight:'normal',icon:undefined},
				warn:	{color:'#333',weight:'normal',icon:undefined},
				error:	{color:'#F00',weight:'normal',icon:undefined}
			},
			jabber_id: opts.jabber_id || undefined
		},
		timers = {};
		
		if(opts.log === 'document') {
			var display = document.createElement('div');
			display.style.cssText = 'background:#FFF;border-top:2px solid #888;bottom:0;font-family:courier;font-size:.8em;height:20%;left:0;overflow:auto;padding:1em 0;text-indent:2em;position:absolute;width:100%;z-index:9999;';
			document.body.appendChild(display);
		}

		//Work in that lame ActiveX object
		//SocketIO, too?
		//TODO: Add XHR flush fn, so if a butt-ton of logs are written in a short amount of time
		//		we don't want to try and open up 2304927340918234 connections to the server.
		//
		function write(data) {
			switch(opts.logtype){
				case 'xhr':
					var xhr = new XMLHttpRequest(),
					dataString = 'msg={"type":"' + data.type + '", "text":"' + data.text + '"}';
	
					xhr.open('POST', opts.log, true);
					xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
					
					xhr.onreadystatechange = function() {
						if(this.readyState === 4) {
							if(!/404/g.test(this.status)) {
								//xhr.responseText
							}
						}
					}
	
					xhr.send(dataString);
				break;
				case 'xmpp':
					if(typeof opts.jabber_id !== undefined){
						var xhr = new XMLHttpRequest(),
						dataString = 'msg={"type":"' + data.type + '", "text":"' + data.text + '"}&jid='+opts.jabber_id;
		
						xhr.open('POST', opts.log, true);
						xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
						
						xhr.onreadystatechange = function() {
							if(this.readyState === 4) {
								if(!/404/g.test(this.status)) {
									//xhr.responseText
								}
							}
						}
		
						xhr.send(dataString);
					} else {
						console.log('ulskdf');
					}
				break;
				default:
					var newLog = document.createElement('div'),
						styles = opts.styles[data.type];
	
					newLog.style.cssText = 'color:' + styles.color + ';font-weight:' + styles.weight + ';';
					newLog.innerHTML = '<img src="data:image/png;base64,' + styles.icon + '" style="position:absolute;left:0;" height="16px" width="16px" /><span style="text-indent:1em;">' + data.text + '</span>';
					display.appendChild(newLog);
				break;
			}
		
		
			if(opts.logtype === 'xhr') {
				
			} else {
				
			}

			return true;
		}
		
		function log(msg) {
			write({type: "log", text: msg});
			//return true;
		}
	
		function warn(msg) {
			write({type: "warn", text: msg});
		}

		function error(msg) {
			write({type: "error", text: msg});
		}

		function getObjectPropsRecursively(obj) {
			if(obj === display) return 0;

			var ct = 0;
			//console.log(obj);
			for(var p in obj) {
				ct++;
				ct += getObjectPropsRecursively(ct);
			}
			return ct;
		}

		function getDOMRecursively(parent) {
			if(parent === display) return 0;
			var els = parent.childNodes,
				ct = 0;
			for(var c in els) {
				ct++;
				ct += getDOMRecursively(els[c]);
				if(els[c].nodeType === 1) ct += getObjectPropsRecursively(els[c]);
			}
			return ct;
		}

		//For now, looking at profiling as a way to track objects
		//When a profile ends, it spits out a comparison between the start state,
		//and end state.
		//
		//Sad comparison to WK Devtools, but still may be helpful?
		function profile(name) {
			//Any possible way we can manage this??
			//Maybe accessing all available objects within the window?
			//log(getObjectPropsRecursively(window));
			//log(getDOMRecursively(document.body));
		}

		function profileEnd(name) {
			//Ditto as profile start
		}

		function timer(name) {
			timers[name] = {start: new Date().getTime()};
		}

		function timerEnd(name) {
			write({type: 'timer', text: name + ': ' + ((new Date().getTime() - timers[name].start)/1000) + 's'});
			delete timers[name];
		}

		function trace() {
			var stack = {},
				stackString = '',
				caller = arguments.callee.caller,
				i = 0;
			while(caller) {
				stack[i++] = caller;
				caller = caller.arguments.callee.caller;
			}

			for(var fn in stack) {
				write({type: 'log', 'text': 'TRACE: ' + stack[fn].toString().substr(0,stack[fn].toString().indexOf('{'))});
			}
		}

		function count() {
			var count = arguments.callee.caller._timesCalled++;
			if(!count) count = arguments.callee.caller._timesCalled = 1;
			write({type: 'log', text: count});
		}

		function clear() {
			display.innerHTML = '';
		}

		opts.styles.log.icon = "R0lGODlhEAAQAOMMAKCgoNPT09jY2Nra2tzc3N3d3d/f3+Hh4eLi4ubm5uzs7PHx8f///////////////yH5BAEKAA8ALAAAAAAQABAAAAQt8MlJq704YwA0BUvnPWA4AkoqZgBhIMl6AcJQHLIFFHyuCwKfLiDUFUfIpCYCADs=";
		opts.styles.error.icon = "R0lGODlhEAAQAOMKAL4AAMUAAMwAANMAANsAAOIAAOkAAPEAAPgAAP8AAP///////////////////////yH5BAEKAA8ALAAAAAAQABAAAAQ88MlJq70448R7wkgoitZhHopyHpbhGulrWEVdpHZhETyR9gTLYEgsWgRIQSopuASeUCgGQK0CNNis1hIBADs=";
		opts.styles.warn.icon = "R0lGODlhEAAQAKUhADhGcD9Ia0FNa0RNadODNdKFOdOGOdSHN9OHOtSJOtWJOtWKO96aP+CcReGlTeq0UvTGU//WSP/ZUf/aSP/bSP/bSf/cUP/dR//eVP/hXP/hXv/jaP/lW//odf/raP/2dv//kf///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAEKAD8ALAAAAAAQABAAAAZQwJ9wSCwaj8ik8uA4KIcNUOP5I3QEHcLz8Rl8HkrFxhPwbBRIA0ST4WQ0EMORgZFYABYJhmFMRCoTFBcUExURCUULCAWMBowFCAtUk5SVVEEAOw==";
		opts.styles.timer.icon = "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAARJJREFUeNpi/P//PwMlgAXG2LljHYrE1m0HMEz29nJgROa7ewQhDEDXaGNjwxAWFgYXX7VqFVwOxSCQF0B4x/a1DLm5uf+XL1/+/+evX3As69WLwgfJg9SB1IP0MaG7wNPbl+H7j19wDALIfJA8MmBCdrqxiSlQ0Q8UDDEAVQykDuYdlDCwdXBi+Pb9B0ZIo4uB1J09c5oBwwCgH7FGFS5xDAM+f/qCIhlSu5thTbMrhjjWMACBM6eOYWjGBpDVMSElksYb167CJXBpBgGQOpB6dBc0oJtOwPYGjDAAmQqMnnqQDRpa2gwmZlYoGmEuhNmOYQDIVKAkLF3UI3sJTWMDLgPgkjCDsMkhA0ZKszNAgAEAJO7B86pEjxAAAAAASUVORK5CYII=";

		return {
			log: log,
			warn: warn,
			error: error,
			profile: profile,
			profileEnd: profileEnd,
			timer: timer,
			timerEnd: timerEnd,
			trace: trace,
			count: count,
			clear: clear
		}
	}

	window.Cnsl = Cnsl;
})();