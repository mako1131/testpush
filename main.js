// function demo() {
//     Push.create('Hello world!', {
//         body: 'How\'s it hangin\'?',
//         icon: '/images/icon.png',
//         link: '/#',
//         timeout: 4000,
//         onClick: function () {
//             console.log("Fired!");
//             window.focus();
//             this.close();
//         },
//         vibrate: [200, 100, 200, 100, 200, 100, 200]
//     });
// }

// document.getElementById('demo_button').addEventListener('click', demo)


(function () {

    init();

    function init() {
        var button = document.getElementById('demo_button')
        if (window.Notification && window.Notification.permission && window.Notification.permission == 'default') { //if permission = default, show button
            button.style.display = "inline"
            button.addEventListener('click', function (e) { //on button click ask for permission and hide button
                e.preventDefault();
                Push.Permission.request(onGranted, onDenied);
                button.style.display = "none"

                return false;
            })
        } else {
            startNotificationPolling();
        }
    }

    function onGranted() { //when permission is granted start polling
        console.log('povolene')
        startNotificationPolling();
    }

    function onDenied() { } //if permission is denied, do nothing

    function startNotificationPolling() { //poll every x seconds

        var timeInterval = 10000; //60 seconds
        var lastTime = null;

        // var firstReq = $.get('/notification-events?c=' + (+(new Date())), {}, function (resp) {
        //     //console.log('first', resp)
        //     if (resp && resp.lastChecked) {
        //         lastTime = resp.lastChecked;
        //     }
        // })

        var interval = setInterval(function () {
            //every 10 sec check new articles
            Push.create('title', {
                    serviceWorker: '/serviceWorker.min.js',
                    body: 'i am body',
                    icon: '',
                    link: '/particular',
                    //timeout: 3000,
                    onClick: function () {
                        window.focus();
                        window.open('/particular');
                        this.close();
                    }
                });
        }, timeInterval)
    }


    // helper functions  *****************************
    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    // end helper functions *************************

    // helper functions for events
    function checkProcessedEvent(evtID) {
        var evts = getProcessedEvents();
        return evts[evtID];
    }

    function setProcessedEvent(evtID) {
        var evts = getProcessedEvents();
        evts[evtID] = true
        setCookie('brnot_processedEvents', JSON.stringify(evts), 1)
    }

    function getProcessedEvents() {
        try {
            processedEvents = JSON.parse(getCookie('brnot_processedEvents'));
            return processedEvents;
        } catch (e) {
            return {};
        }
    }
})()
