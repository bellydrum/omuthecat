/**
 * app.es6
 * ------------------------------------------------------------------------------
 * main script that utilizes above compiled code
 */

$(document).on('ready', () => {

    const app = {

        cookie: new CookieHelper(),

        logClicks: () => {
            const clicks = parseInt(app.cookie.getValueByKey('clicks'))
            // make ajax call to store this sessions clicks in the db
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
                app.cookie.addObject({ 'clicks': parseInt(app.cookie.getValueByKey('clicks')) + 1 })
                app.changePicture(e.target)
            })

        },

        init: () => {
            app.logClicks()
            app.cookie.addObject({ 'clicks': 0 })  // initialize click count
            app.addListeners()
        }
    }

    app.init()

})