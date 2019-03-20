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
        timeSinceLastCheck: Date.now(),
        timeGapsBetweenChecks: [],

        /** APPLICATION LISTENERS **/

        /** changes image and increments counter; called when .image-section is clicked **/
        imageClickListener: (e) => {
            /**
             * Run these events when user clicks the picture section:
             *  Step 1. increment the click counters.
             *  Step 2. if on mobile, POST the click to the database.
             *  Step 3. determine the next image randomly.
             *  Step 4. hide the current image from the page.
             *  Step 5. display the randomly chosen image.
             *  Step 6. update the current score on the page.
             */

            /** Step 0. check for bot usage. **/
            if ( app.userIsBot(e) ) {
                app.blockBot()
                return
            }

            /** Step 1. increment the click counters. **/
            app.cookie.addObject({ 'currentTotalClicks': parseInt( app.cookie.getValueByKey('currentTotalClicks') ) + 1 })
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
                `img[src='${ app.imageFilepath }` + `${ app.imageFilenames[app.nextIndex] }']`
            ).setAttribute('style', `display:inline-block;`)

            /** Step 6. update the current score on the page. **/
            document.querySelector(
                '#current-score'
            ).textContent='Your current score: ' + `${ app.cookie.getValueByKey('currentTotalClicks') }.`

        },

        /** APPLICATION FUNCTIONS **/

        /** enter batch of desktop clicks to DesktopClickLog **/
        postDesktopClicks: async (clickerId, clickCount) => {

            const data = {
                csrf: app.csrftoken,
                clicker_id: clickerId,
                clicks: clickCount
            }

            await fetchWrapper( 'post_clicks', 'POST', data, async=false )

        },

        /** enter single mobile click to MobileClickLog **/
        postMobileClicks: debounce(async () => {

            /* get only clicker_id from cookie */
            const data = {
                'csrf': app.csrftoken,
                'clicker_id': app.cookie.getValueByKey('clickerid')
            }
            await fetchWrapper( 'post_clicks', 'POST', data )

        }, 15),

        userIsBot: (e) => {

            /** check if click event isTrusted **/
            if ( !(e.isTrusted) ) {
                return true
            }

            /** do a click frequency check every 10 clicks. **/
            if ( ( app.currentSessionScore > 10 ) && ( app.currentSessionScore % 5 === 0 ) ) {

                /* check state of click frequency */
                const now = Date.now()
                const timeGap = now - app.timeSinceLastCheck
                app.timeSinceLastCheck = now
                app.timeGapsBetweenChecks.push( timeGap )

                /* determine if state of clicks implies bot usage */
                if (app.timeGapsBetweenChecks.length > 3) {
                    const gapsToCheck = app.timeGapsBetweenChecks.slice( -3 )
                    const averageOfLastThreeChecks = ( parseInt(gapsToCheck.reduce( ( p, c ) => p + c, 0 ) / gapsToCheck.length) )
                    const userIsBot = ( Math.abs( gapsToCheck[0] - averageOfLastThreeChecks ) < 5 ) &&
                        ( Math.abs( gapsToCheck[1] - averageOfLastThreeChecks ) < 5 ) &&
                        ( Math.abs( gapsToCheck[2] - averageOfLastThreeChecks ) < 5 )

                    return userIsBot
                }

            }
        },

        /** remove functionality from page if bot is being used **/
        blockBot: () => {

            /* remove event listener from .image-section */
            document.querySelector('.image-section').removeEventListener(
                'click', app.imageClickListener, false
            )

            /* remove .image-section from page as a safety measure */
            document.querySelector('.image-section').parentNode.removeChild(
                document.querySelector('.image-section')
            )

            /* alert user of bot usage */
            document.querySelector('#alert').setAttribute(
                'style', 'font-size: 3em; text-align: center; padding: 30px;'
            )
            document.querySelector('#alert').textContent="Omu is scare of bots :("
            document.querySelector('.text-display').setAttribute(
                'style', 'top: auto;'
            )

            /* destroy current click data */
            app.currentSessionScore = 0
            app.cookie.flush()
        },

        /** add listeners to document elements **/
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

                /** ON IMAGE SECTION CLICK -- change image and increment counter; prevent double-tap zoom on iOS **/
                document.querySelector('.image-section').addEventListener('touchstart', preventZoom)
                document.querySelector('.image-section').addEventListener('click', app.imageClickListener, false)

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
