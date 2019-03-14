/**
 * app.es6
 * ------------------------------------------------------------------------------
 * main script that utilizes above compiled code
 */

$(document).on('ready', () => {

    const app = {

        /** initialize constants **/
        image_filenames: image_filenames,       // defined in home.html
        image_filepath: '/static/images/omu/',
        cookie: new CookieHelper(),

        /** define application functionality **/
        logClicks: () => {
            const clicks = parseInt(app.cookie.getValueByKey('clicks'))
            // TODO - make ajax call to store this sessions clicks in the db
            console.log(`There were ${clicks} clicks last session.`)
        },

        changePicture: async (image) => {
            const newPicture = await ajaxCall('change_picture', 'GET')
            const newFilepath = `static/images/omu/${newPicture}`
            $(image).attr('src', newFilepath)
        },

        addListeners: () => {

            // clicking the image adds click to counter and refreshes image
            $('.omu-image').click((e) => {

                // add click to click counter
                app.cookie.addObject({ 'clicks': parseInt(app.cookie.getValueByKey('clicks')) + 1 })

                /** STAY AT CLIENT - access stored filenames **/
                const randomIndex = getRandomIndex( app.image_filenames.length )
                $(e.target).attr( 'src', `${app.image_filepath}` + `${app.image_filenames[ randomIndex ]}` )

                /** Or, CALL SERVER - make an ajax request **/
                // app.changePicture(e.target)
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