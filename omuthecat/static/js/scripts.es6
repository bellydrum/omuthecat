/**
 * scripts.js
 * ------------------------------------------------------------------------------
 * main script that utilizes above compiled code
 */

$(document).on('ready', () => {



    const app = {

        // helpers
        cookie: new CookieHelper(),

        storeClicks: () => {
            const clicks = parseInt(app.cookie.getValueByKey('clicks'))
            // make ajax call to store this sessions clicks in the db
            console.log(`There were ${clicks} clicks last session.`)
        },

        addListeners: () => {

            // clicking the image adds click to counter and refreshes image
            $('.omu-image').click((e) => {
                app.cookie.addObject({ 'clicks': parseInt(app.cookie.getValueByKey('clicks')) + 1 })
                app.changePicture(e.target, 'omu-image')
            })
        },

        changePicture: async (image, imageClassname) => {
            const newPicture = await ajaxCall('change_picture', 'GET')
            const newFilepath = `static/images/omu/${newPicture}`
            $(image).attr('src', newFilepath)
        },

        init: () => {
            app.storeClicks()
            app.cookie.addObject({ 'clicks': 0 })
            app.addListeners()
        }
    }

    app.init()

})