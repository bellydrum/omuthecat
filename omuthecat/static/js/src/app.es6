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
        currentSessionScore: 0,
        cookie: new CookieHelper(),

        /** APPLICATION FUNCTIONS **/

        /** FOR DESKTOP -- post clicker_id with total number of clicks to DesktopClickLog **/
        postDesktopClicks: async (clickerId, clicks) => {

            /* get clicker_id AND clicks from cookie */
            const data = {
                'csrf': app.csrftoken,
                'clicker_id': clickerId,
                'clicks': clicks,
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

                /**
                    NOTE on saving clicks to the database -
                    Saving clicks to the database works differently on desktop vs mobile.
                    On desktop, clicks are accrued in a counter and the sum is posted on page unload.
                    On mobile, each individual click is posted to the database one at a time.
                    Desktop and mobile clicks are stored in separate tables due to this measure.
                    Due to the high load of server calls on mobile, a "debouncer" is put in place.
                    The sum of total desktop and mobile clicks are reformatted and counted in api.get_all_entries().
                 **/

                /** ON IMAGE SECTION CLICK -- change image and increment counter **/
                document.querySelector('.image-section').addEventListener('click', (e) => {
                    /**
                     * Run these events when user clicks the picture section:
                     *  Step 1. increment the click counters.
                     *  Step 2. if on mobile, POST the click to the database.
                     *  Step 3. determine the next image randomly.
                     *  Step 4. hide the current image from the page.
                     *  Step 5. display the randomly chosen image.
                     *  Step 6. update the current score on the page.
                     */

                    /** Step 1. increment the click counters. **/
                    app.cookie.addObject({ 'currentTotalClicks': parseInt(app.cookie.getValueByKey('currentTotalClicks')) + 1 })
                    app.currentSessionScore += 1

                    /** Step 2. if on mobile, POST the click to the database. **/
                    if ( !(app.onDesktop) ) { app.postMobileClicks() }

                    /** Step 3. determine the next image randomly. **/
                    app.nextIndex = getRandomIndex( app.imageFilenames.length )

                    /** Step 4. hide the current image from the page. **/
                    const currentImage = document.querySelector(`img[style='display:inline-block;']`)
                    currentImage.setAttribute('style', 'display:none;')

                    /** Step 5. display the randomly chosen image. **/
                    document.querySelector(
                        `img[src='${app.imageFilepath}` + `${app.imageFilenames[app.nextIndex]}']`
                    ).setAttribute('style', `display:inline-block;`)

                    /** Step 6. update the current score on the page. **/
                    document.querySelector(
                        '#current-score'
                    ).textContent='Your current score: ' + `${ app.cookie.getValueByKey('currentTotalClicks') }.`

                }, false)

                /** ON DESKTOP PAGE UNLOAD -- post clicker_id and clicks to DesktopClickLog **/
                if ( app.onDesktop ) {

                    window.addEventListener('beforeunload', () => {
                        /**
                         * Run these events when a desktop user exits the page:
                         *  Step 1. retrieve the total sum of clicks from the counter in the cookie.
                         *  Step 2. POST the current session sum of clicks to the database if more than zero.
                         */

                        /** Step 1. retrieve the total sum of clicks from the counter in the cookie. **/
                        const clicks = parseInt( app.currentSessionScore )

                        /** Step 2. POST the current session sum of clicks to the database if more than zero. **/
                        if (clicks) {
                            app.postDesktopClicks( app.cookie.getValueByKey('clickerid'), app.currentSessionScore )
                        }

                    })

                }

            })()

        },

        /** start the app */
        init: () => {

            /** add new clickerid cookie if clickerid cookie doesn't exist **/
            if ( !(app.cookie.getValueByKey('clickerid')) ) {
                app.cookie.addObject({
                    'clickerid': CryptoJS.AES.encrypt( Date.now().toString(), 'iloveomu' ).toString()
                })
            }

            /** initialize click counter cookie to 0 if click counter cookie doesn't exist */
            if ( !(app.cookie.getValueByKey('currentTotalClicks')) ) {
                app.cookie.addObject({
                    'currentTotalClicks': 0,
                })
            } else {
                /* update score on page with current score */
                document.querySelector(
                    '#current-score'
                ).textContent='Your current score: ' + `${ app.cookie.getValueByKey('currentTotalClicks') }.`
            }

            app.addListeners()

        }

    }

    app.init()

})
