/**
 * app.es6
 * ------------------------------------------------------------------------------
 * main script that utilizes above compiled code
 */

document.addEventListener("DOMContentLoaded", () => {

    const app = {

        /** APPLICATION GLOBALS **/

        csrftoken: window.csrftoken,                            // set in requestHelper.es6
        cookie: new CookieHelper(),                             // defined in cookieHelper.es6
        onDesktop: !( mobileBrowser() ),                        // defined in utils.es6
        imageFilenames: null,                                   // defined in app.init()
        nextIndex: null,                                        // defined in app.init()
        imageFilepath: 'static/images/omu/',                    // hardcoded -- find better way
        timeSinceLastCheck: Date.now(),
        timeGapsBetweenChecks: [],
        currentSessionClicks: 0,                                // every page load

        /** APPLICATION LISTENERS **/

        /** changes image and increments counter; called when .image-section is clicked **/
        imageSectionClickListener: () => {
            /**
             * Run these events when user clicks the picture section:
             *  Step 1. increment the click counters.
             *  Step 2. if on mobile, POST the click to the database.
             *  Step 3. determine the next image randomly.
             *  Step 4. hide the current image from the page.
             *  Step 5. display the randomly chosen image.
             *  Step 6. update the current scores on the page.
             *  Step 7. update current high score if user is setting it.
             */

            /** Step 0. check for bot usage. **/
            // if ( app.userIsBot() ) {
            //     app.blockBot()
            //     return
            // }

            console.log(app.imageFilenames)

            /** Step 1. increment the click counters. **/
            app.cookie.addObject({ 'currentUserTotalClicks': parseInt( app.cookie.getValueByKey('currentUserTotalClicks') ) + 1 })
            app.currentSessionClicks += 1

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

            /** Step 6. update the current scores on the page. **/
            document.querySelector(
                '#current-score'
            ).textContent='Your current score: ' + `${ app.cookie.getValueByKey('currentUserTotalClicks') }.`

            /** Step 7. update current high score if user is setting it. **/
            if ( parseInt( app.cookie.getValueByKey('currentUserTotalClicks') ) >=
                parseInt( document.querySelector('#high-score').textContent ) ) {
                document.querySelector('#high-score').textContent = app.cookie.getValueByKey( 'currentUserTotalClicks' )
            }

        },

        /** APPLICATION FUNCTIONS **/

        /** enter batch of desktop clicks to DesktopClickLog **/
        postDesktopClicks: async (clickerId, clickCount) => {

            const data = {
                csrf: app.csrftoken,
                clicker_id: clickerId,
                clicks: clickCount
            }
            await requestHelper( 'post_clicks', 'POST', data, async=false )

        },

        /** enter single mobile click to MobileClickLog **/
        postMobileClicks: debounce(async () => {

            /* get only clicker_id from cookie */
            const data = {
                'csrf': app.csrftoken,
                'clicker_id': app.cookie.getValueByKey('clickerid')
            }
            await requestHelper( 'post_clicks', 'POST', data )

        }, 15),

        userIsBot: () => {
            /** Check if the click frequency is unchanging */

            /** do a click frequency check every 10 clicks. **/
            if ( ( app.currentSessionClicks > 10 ) && ( app.currentSessionClicks % 5 === 0 ) ) {

                /* check state of click frequency */
                const now = Date.now()
                const timeGap = now - app.timeSinceLastCheck
                app.timeSinceLastCheck = now
                app.timeGapsBetweenChecks.push( timeGap )

                /* determine if state of clicks implies bot usage */
                if ( app.timeGapsBetweenChecks.length > 3 ) {
                    const gapsToCheck = app.timeGapsBetweenChecks.slice( -3 )
                    const averageOfLastThreeChecks = (
                        parseInt(gapsToCheck.reduce( ( p, c ) => p + c, 0 ) / gapsToCheck.length)
                    )
                    return (
                        ( Math.abs( gapsToCheck[0] - averageOfLastThreeChecks ) < 5 ) &&
                        ( Math.abs( gapsToCheck[1] - averageOfLastThreeChecks ) < 5 ) &&
                        ( Math.abs( gapsToCheck[2] - averageOfLastThreeChecks ) < 5 )
                    )

                }

            }
        },

        /** remove functionality from page if bot is being used **/
        blockBot: () => {

            /* dump current user data */
            app.currentSessionClicks = 0
            app.cookie.flush()

            /* remove event listener from .image-section */
            document.querySelector('.image-section').removeEventListener(
                'click', app.imageSectionClickListener, false
            )

            /* remove .image-section from page as a double measure */
            document.querySelector('.image-section').parentNode.removeChild(
                document.querySelector('.image-section')
            )

            /* alert user of bot usage */
            document.querySelector('#alert').setAttribute(
                'style', 'font-size: 3em; text-align: center; padding: 30px;'
            )
            document.querySelector('#alert').textContent="Omu is scare of bots :("
            document.querySelector('.text-display').setAttribute('style', 'top: auto;')
        },

        /** add listeners to document elements **/
        addListeners: () => {

            (() => {

                /**
                    NOTE on saving clicks to the database -
                    Saving clicks to the database works differently on desktop vs mobile.
                    - On desktop, clicks are counted in a cookie and the sum is saved when user exits the page.
                    - On mobile, each individual click is saved to the database.
                    Desktop and mobile clicks are stored in separate tables due to this measure.
                    Due to the high load of server calls on mobile, a "debouncer" is put in place on mobile clicks.
                    The sum of total desktop and mobile clicks are reformatted and counted in api.get_all_entries().
                 **/

                /** ON IMAGE SECTION CLICK -- change image and increment counter; prevent double-tap zoom on iOS **/
                document.querySelector('.image-section').addEventListener('touchstart', preventZoom)
                document.querySelector('.image-section').addEventListener('click', app.imageSectionClickListener, false)

                /** ON DESKTOP PAGE UNLOAD -- post clicker_id and clicks to DesktopClickLog **/
                if ( app.onDesktop ) {

                    window.addEventListener('beforeunload', () => {
                        /**
                         * Run these events when a desktop user exits the page:
                         *  Step 1. retrieve the total sum of clicks from the counter in the cookie.
                         *  Step 2. POST the current session sum of clicks to the database if more than zero.
                         */

                        /** Step 1. retrieve the total sum of clicks from the counter in the cookie. **/
                        const clicks = parseInt( app.currentSessionClicks )

                        /** Step 2. POST the current session sum of clicks to the database if more than zero. **/
                        if (clicks > 0) {
                            app.postDesktopClicks( app.cookie.getValueByKey('clickerid'), app.currentSessionClicks )
                        }

                    })

                }

            })()

        },

        /** start the app */
        init: () => {

            /** store filenames and next filename index in global variables **/
            app.imageFilenames = [
                ...document.querySelectorAll('.omu-image')
            ].map( e => e.attributes.src.textContent.slice( app.imageFilepath.length ) )
            app.nextIndex = getRandomIndex( app.imageFilenames.length )

            /** add cookies if not already there **/
            if ( !(app.cookie.getValueByKey('clickerid')) ) {
                app.cookie.addObject({
                    'clickerid': CryptoJS.AES.encrypt( Date.now().toString(), 'iloveomu' ).toString()
                })
            }
            if ( !(app.cookie.getValueByKey('totalClicks')) ) {
                app.cookie.addObject( {
                    'totalClicks': parseInt(document.querySelector('#number-of-clicks').textContent),
                })
            }

            /** initialize scores on page */
            if ( !(app.cookie.getValueByKey('currentUserTotalClicks')) ) {
                app.cookie.addObject({
                    'currentUserTotalClicks': 0,
                })
            } else {
                /* update score on page with current score */
                document.querySelector(
                    '#current-score'
                ).textContent='Your current score: ' + `${ app.cookie.getValueByKey('currentUserTotalClicks') }.`
            }

            app.addListeners()

        }

    }

    app.init()

})
