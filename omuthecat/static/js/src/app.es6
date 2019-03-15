
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

        logClicks: async (clicks) => {

            if (clicks) {
                const data = {
                    'csrf': app.csrftoken,
                    'clicks': clicks
                }
                await ajaxCall( 'log_clicks', 'POST', data, async=false )
            }

        },

        addListeners: () => {

            /** change image on click **/
            document.getElementById('omu-image').addEventListener('click', (e) => {
                e.target.setAttribute('src', `${app.imageFilepath}` + `${app.imageFilenames[ app.nextIndex ]}` )
                app.cookie.addObject({ 'clicks': parseInt(app.cookie.getValueByKey('clicks')) + 1 })
                app.nextIndex = getRandomIndex( app.imageFilenames.length )
            })

            /** log number of clicks when user leaves page **/

           if (mobileBrowser()) {

               console.log( mobileBrowser() )

                /* for mobile */
                window.addEventListener('pagehide', () => {
                    app.logClicks( parseInt(app.cookie.getValueByKey( 'clicks' )) )
                })

            } else {

                /* for desktop */
                window.addEventListener('beforeunload', () => {
                    app.logClicks( parseInt(app.cookie.getValueByKey( 'clicks' )) )
                })

            }

        },

        /** start the app */
        init: () => {

            app.cookie.addObject( { 'clicks': 0 } )
            app.addListeners()

        }

    }

    app.init()

})
