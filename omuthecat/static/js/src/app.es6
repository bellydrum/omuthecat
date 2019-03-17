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

        /** APPLICATION FUNCTIONS **/

        /** FOR DESKTOP -- post clicker_id with total number of clicks to DesktopClickLog **/
        postDesktopClicks: async () => {

            /* get clicker_id AND clicks from cookie */
            const data = {
                'csrf': app.csrftoken,
                'clicker_id': app.cookie.getValueByKey('clickerid'),
                'clicks': parseInt(app.cookie.getValueByKey('clicks'))
            }
            await ajaxCall( 'post_clicks', 'POST', data, async=false )

        },

        /** FOR MOBILE -- post clicker_id with single click to MobileClickLog **/
        postMobileClicks: debounce(async () => {

            /* get only clicker_id from cookie */
            const data = {
                'csrf': app.csrftoken,
                'clicker_id': app.cookie.getValueByKey('clickerid')
            }

            await ajaxCall( 'post_clicks', 'POST', data )

        }, 15),

        /** APPLICATION LISTENERS **/

        addListeners: () => {

            (() => {

                /** ON IMAGE SECTION CLICK -- change image and increment counter **/
                document.querySelector('.image-section').addEventListener('click', (e) => {

                    app.currentScore += 1

                    /** increment click counter in cookie **/
                    app.cookie.addObject({ 'clicks': parseInt(app.cookie.getValueByKey('clicks')) + 1 })

                    /** IF MOBILE -- post individual click to MobileClickLog **/
                    if ( !(app.onDesktop) ) {
                        app.postMobileClicks()
                    }

                    /** determine next image randomly **/
                    app.nextIndex = getRandomIndex( app.imageFilenames.length )

                    /** hide current image **/
                    const currentImage = document.querySelector(`img[style='display:inline-block;']`)
                    currentImage.setAttribute('style', 'display:none;')

                    /** display next image **/
                    document.querySelector(
                        `img[src='${app.imageFilepath}` + `${app.imageFilenames[app.nextIndex]}']`
                    ).setAttribute('style', `display:inline-block;`)

                    /** update score on page **/
                    document.querySelector(
                        '#current-score'
                    ).textContent='Your current score: ' + `${ app.currentScore }.`

                }, false)

                /** ON DESKTOP PAGE UNLOAD -- post clicker_id and clicks to DesktopClickLog **/
                if ( app.onDesktop ) {

                    window.addEventListener('beforeunload', () => {

                        /* get current total number of clicks */
                        const clicks = parseInt(app.cookie.getValueByKey('clicks'))

                        /* only post if user has clicked */
                        if (clicks) {
                            app.postDesktopClicks( app.cookie.getValueByKey('clickerid'), clicks )
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
