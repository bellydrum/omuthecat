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
        currentScore: 0,
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

                /** ON IMAGE CLICK -- change image and increment counter **/
                const imageElements = document.getElementsByClassName('omu-image')

                document.querySelector('.image-section').addEventListener('click', (e) => {

                    app.currentScore += 1

                    /** increment click counter in cookie **/
                    app.cookie.addObject({ 'clicks': parseInt(app.cookie.getValueByKey('clicks')) + 1 })

                    /** IF MOBILE -- log individual click to MobileClickLog **/
                    if ( !(app.onDesktop) ) {
                        app.logMobileClicks()
                    }

                    /** update picture on page **/
                    app.nextIndex = getRandomIndex( app.imageFilenames.length )
                    const currentImage = document.querySelector(`img[style='display:inline-block;']`)
                    console.log('current image')
                    console.log(currentImage)
                    console.log('current image style:')
                    console.log(currentImage.getAttribute('style'))
                    currentImage.setAttribute('style', 'display:none;')
                    console.log('Just tried to set its attribute to none.')
                    document.querySelector(`img[src='${app.imageFilepath}` + `${app.imageFilenames[app.nextIndex]}']`
                    ).setAttribute('style', `display:inline-block;`)

                    /** update score on page **/
                    document.querySelector(
                        '#current-score'
                    ).textContent='Your current score: ' + `${ app.currentScore }.`

                }, false)


                /* add event listener to each image */
                // Array.from(imageElements).forEach(function(e) {
                //     e.addEventListener('click', (e) => {
                //
                //         app.currentScore += 1
                //
                //         /** increment click counter in cookie **/
                //         app.cookie.addObject({ 'clicks': parseInt(app.cookie.getValueByKey('clicks')) + 1 })
                //
                //         /** IF MOBILE -- log individual click to MobileClickLog **/
                //         if ( !(app.onDesktop) ) {
                //             app.logMobileClicks()
                //         }
                //
                //         /** update picture on page **/
                //         app.nextIndex = getRandomIndex( app.imageFilenames.length )
                //         e.target.setAttribute('style', 'display: none')
                //         document.querySelector(`img[src='${app.imageFilepath}` + `${app.imageFilenames[app.nextIndex]}']`
                //         ).setAttribute('style', `display: inline-block`)
                //
                //         /** update score on page **/
                //         document.querySelector(
                //             '#current-score'
                //         ).textContent='Your current score: ' + `${ app.currentScore }.`
                //
                //     }, false)
                // })

                /** IF DESKTOP -- ON PAGE UNLOAD -- log clicker_id and clicks to DesktopClickLog **/
                if ( app.onDesktop ) {

                    window.addEventListener('beforeunload', () => {

                        /* get current total number of clicks */
                        const clicks = parseInt(app.cookie.getValueByKey('clicks'))

                        /* only log if user has clicked */
                        if (clicks) {
                            app.logDesktopClicks( app.cookie.getValueByKey('clickerid'), clicks )
                            app.currentScore += clicks
                        }

                    })

                }

            })()

        },

        /** start the app */
        init: () => {

            /** add new clicker id if one doesn't exist **/
            if ( !(app.cookie.getValueByKey('clickerid')) ) {
                app.cookie.addObject({
                    'clickerid': CryptoJS.AES.encrypt( Date.now().toString(), 'iloveomu' ).toString()
                })
            }

            /** initialize clicks in cookie */
            app.cookie.addObject( {
                'clicks': 0,
            } )

            app.addListeners()

        }

    }

    app.init()

})
