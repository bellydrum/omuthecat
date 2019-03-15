
/**
 * app.es6
 * ------------------------------------------------------------------------------
 * main script that utilizes above compiled code
 */

document.addEventListener("DOMContentLoaded", () => {

    const app = {

        /** initialize constants **/

        csrftoken: csrftoken,
        image_filenames: image_filenames,       // defined in home.html
        image_filepath: 'static/images/omu/',  // find another way that isn't hardcoding
        cookie: new CookieHelper(),

        /** define application functionality **/

        logClicks: async (clicks) => {

            if (clicks) {
                const data = {
                    'csrf': app.csrftoken,
                    'clicks': clicks
                }
                console.log('Sending data to database.')
                console.log(data)
                await ajaxCall( 'log_clicks', 'POST', data, async=false )
            }

        },

        addListeners: () => {

            /** change image on click **/
            document.getElementById('omu-image').addEventListener('click', (e) => {
                app.cookie.addObject({ 'clicks': parseInt(app.cookie.getValueByKey('clicks')) + 1 })
                const randomIndex = getRandomIndex( app.image_filenames.length )
                e.target.setAttribute('src', `${app.image_filepath}` + `${app.image_filenames[ randomIndex ]}` )

            })

            /** log number of clicks when user leaves page **/

            if (window.mobile) {
                /* for mobile */
                window.addEventListener('pagehide', () => {
                    document.getElementById('high-score').innerText="mobile, bitch!"
                })
            } else {
                /* for desktop */
                window.addEventListener('beforeunload', () => {
                    app.logClicks( parseInt(app.cookie.getValueByKey( 'clicks' )) )
                    document.getElementById('high-score').innerText="desktop, bitch!"
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
