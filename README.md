##cnsl  
**A mini console that'll output anywhere.**  
_____

        cnsl.log('output');
        cnsl.timer('timerName');
        cnsl.endTimer('timerName'); //Outputs your time

        cnsl.trace(); //Stack trace

        cnsl.profile('profileName'); //Current in the works
        cnsl.profileEnd('profileName'); //Outputs comparison between start and end states

        cnsl.count(); //continues to echo number of times fn called.

        cnsl.clear(); //clears logs (only applicable with DOM view)
___

###OPTIONS
        /**
           log: the external server file that handles cnsl JSON. If not included, DOM cnsl will show
           logType:	XHR, XMPP, no need to specify!
           jabber_id: If 'xmpp' log type is set, log messages will be sent to this Jabber account. (Jabber.org support only)
           styles: if default cnsl isn't pretty enough for you
        **/

        cnsl({
             log:     'logHandler.php',
             logType: 'xhr',
             styles:  {
                        log: {color:'#333', weight: 'normal', icon: 'b64'},
                        timer: {color:'#333', weight: 'normal', icon: 'b64'},
                        warn: {color:'#333', weight: 'normal', icon: 'b64'},
                        error: {color:'#F00', weight: 'normal', icon: 'b64'},
                       }
              });