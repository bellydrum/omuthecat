/**
 * app.es6
 * ------------------------------------------------------------------------------
 * main script that utilizes above compiled code
 */

document.addEventListener("DOMContentLoaded", () => {

    const app = {

        /** initialize constants **/

        csrftoken: window.csrftoken,
        onDesktop: !( mobileBrowser() ),
        imageFilenames: image_filenames,       // defined in home.html
        imageFilepath: 'static/images/omu/',  // find another way that isn't hardcoding
        nextIndex: getRandomIndex( image_filenames.length ),
        cookie: new CookieHelper(),
        mobileClicks: 0,

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

                /** ON IMAGE CLICK -- change image and increment counter **/
                document.getElementById('omu-image').addEventListener('click', (e) => {

                    /** IF DESKTOP -- increment cookie; do not log **/
                    if ( app.onDesktop ) {
                        app.cookie.addObject({ 'clicks': parseInt(app.cookie.getValueByKey('clicks')) + 1 })

                    /** IF MOBILE -- log individual click to MobileClickLog **/
                    } else {
                        app.logMobileClicks()
                    }

                    /* change picture and set next picture */
                    e.target.setAttribute('src', `${app.imageFilepath}` + `${app.imageFilenames[ app.nextIndex ]}` )
                    app.nextIndex = getRandomIndex( app.imageFilenames.length )

                    /* update current score on page */
                    app.mobileClicks += 1
                    document.querySelector(
                        '#current-score'
                    ).textContent='Your current score: ' + `${ app.mobileClicks }.`

                })

                /** IF DESKTOP -- ON PAGE UNLOAD -- log clicker_id and clicks to DesktopClickLog **/
                if ( app.onDesktop ) {

                    window.addEventListener('beforeunload', () => {

                        /* get current total number of clicks */
                        const clicks = parseInt(app.cookie.getValueByKey('clicks'))

                        /* only log if user has clicked */
                        if (clicks) {
                            app.logDesktopClicks( app.cookie.getValueByKey('clickerid'), clicks )
                        }

                    })

                }

                /** IF MOBILE -- ON SCREEN RESIZE TO LANDSCAPE -- make body background-color black **/
                if ( !(app.onDesktop) ) {
                    let resizeTimeout
                    const darkenBodyBackground = () => {
                        document.querySelector('body').setAttribute(
                            'background-color', '#000'
                        )
                    }
                    const resizeThrottler = () => {
                        if ( !resizeTimeout ) {
                            resizeTimeout = setTimeout(() => {
                                resizeTimeout = null
                                darkenBodyBackground()
                            })
                        }
                    }
                    window.addEventListener('resize', resizeThrottler, false)
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

            app.addListeners()

        }

    }

    app.init()

})
