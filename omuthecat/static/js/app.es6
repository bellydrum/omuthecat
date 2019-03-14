
/**
 * app.es6
 * ------------------------------------------------------------------------------
 * main script that utilizes above compiled code
 */

document.addEventListener("DOMContentLoaded", () => {

    const app = {

        /** initialize constants **/
        image_filenames: image_filenames,       // defined in home.html
        image_filepath: '/static/images/omu/',
        cookie: new CookieHelper(),

        /** define application functionality **/
        logClicks: async (clicks) => {
            if (clicks) {
                const data = { 'clicks': clicks }
                await ajaxCall( 'log_clicks', 'POST', data )
            }
        },

        addListeners: () => {

            /** change image on click **/
            document.getElementById('omu-image').addEventListener('click', (e) => {

                // add click to click counter
                app.cookie.addObject({ 'clicks': parseInt(app.cookie.getValueByKey('clicks')) + 1 })

                /** STAY AT CLIENT - access stored filenames **/
                const randomIndex = getRandomIndex( app.image_filenames.length )
                e.target.setAttribute('src', `${app.image_filepath}` + `${app.image_filenames[ randomIndex ]}` )

            })

        },

        init: () => {
            app.logClicks( parseInt(app.cookie.getValueByKey( 'clicks' )) )
            app.cookie.addObject({ 'clicks': 0 })  // initialize click count
            app.addListeners()
        }
    }

    // start the application
    app.init()

})