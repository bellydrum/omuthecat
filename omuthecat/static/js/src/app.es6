/**
 * app.es6
 * ------------------------------------------------------------------------------
 * main script that utilizes above compiled code
 */

document.addEventListener("DOMContentLoaded", () => {

    const app = {

        /** initialize constants **/

        csrftoken: window.csrftoken,
        imageFilenames: image_filenames,       // defined in home.html
        imageFilepath: 'static/images/omu/',  // find another way that isn't hardcoding
        nextIndex: getRandomIndex( image_filenames.length ),
        cookie: new CookieHelper(),

        /** define application functionality **/

        /** FOR DESKTOP -- log clicker_id with total number of clicks to DesktopClickLog **/
        logDesktopClicks: async () => {

            /* get clicker_id AND clicks from cookie */
            const data = {
                'csrf': app.csrftoken,
                'clicker_id': app.cookie.getValueByKey('clickerid'),
                'clicks': parseInt(app.cookie.getValueByKey('clicks'))
            }
            await ajaxCall( 'log_clicks', 'POST', data, async=false )

        },

        /** FOR MOBILE -- log clicker_id with single click to MobileClickLog **/
        logMobileClicks: debounce(async () => {

            /* get only clicker_id from cookie */
            const data = {
                'csrf': app.csrftoken,
                'clicker_id': app.cookie.getValueByKey('clickerid')
            }

            await ajaxCall( 'log_clicks', 'POST', data )

        }, 50),

        addListeners: () => {

            (() => {

                /* determine if user is viewing page from desktop or browser */
                const onDesktop = !( mobileBrowser() )

                /** ON IMAGE CLICK -- change image and increment counter **/
                document.getElementById('omu-image').addEventListener('click', (e) => {

                    /** IF DESKTOP -- increment cookie; do not log **/
                    if ( onDesktop ) {
                        app.cookie.addObject({ 'clicks': parseInt(app.cookie.getValueByKey('clicks')) + 1 })

                    /** IF MOBILE -- log individual click to MobileClickLog **/
                    } else {

                        app.logMobileClicks()

                    }

                    /* change picture and set next picture */
                    e.target.setAttribute('src', `${app.imageFilepath}` + `${app.imageFilenames[ app.nextIndex ]}` )
                    app.nextIndex = getRandomIndex( app.imageFilenames.length )

                })

                if ( onDesktop ) {

                    /** ON PAGE UNLOAD -- log clicker_id and clicks to DesktopClickLog **/
                    window.addEventListener('beforeunload', () => {

                        const clicks = parseInt(app.cookie.getValueByKey('clicks'))

                        if (clicks) {

                            app.logDesktopClicks(
                                app.cookie.getValueByKey('clickerid'),
                                clicks
                            )
                        }

                    })

                }

            })()

        },

        /** start the app */
        init: () => {


            /** initialize user info in cookie */
            app.cookie.addObject( {
                    'clickerid': CryptoJS.AES.encrypt( Date.now().toString(), 'iloveomu' ).toString(),
                    'clicks': 0,
            } )

            app.addListeners();

        }

    }

    app.init()

})
