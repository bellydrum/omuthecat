
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
        logClicks: async () => {
            const data = {
                'clicks': parseInt(app.cookie.getValueByKey('clicks'))
            }
            // TODO - make ajax call to store this sessions clicks in the db
            await ajaxCall( 'log_clicks', 'POST', data )

            console.log(`There were ${clicks} clicks last session.`)
        },

        // changePicture: async () => {
        //     const newPicture = await ajaxCall('change_picture', 'GET')
        //     const newFilepath = `static/images/omu/${newPicture}`
        //     document.getElementById('omu-image').setAttribute('src', newFilepath)
        // },

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
            app.logClicks()
            app.cookie.addObject({ 'clicks': 0 })  // initialize click count
            app.addListeners()
        }
    }

    // start the application
    app.init()

})