/**
 * ajaxHelper.js
 * -------------------------------------------------
 * functions pertaining to usage of ajax and corresponding csrftokens
 */


/**
 * boilerplate csrftoken setup
 * https://docs.djangoproject.com/en/2.1/ref/csrf/#ajax
 */

// using jQuery
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
let csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

/**
 *
 * @param url (string) - url from which to request data
 * @param requestType (string) - type of request
 * @param data (optional: object) - data required to make request
 * @returns
 *  - success: {Promise<*>}
 *  - failure: error
 *    - there was an error making the ajax call to the given url
 *
 * @about - standardized wrapper for ajax calls
 */
async function ajaxCall(url, requestType, data=null) {
    try {
        let result = await $.ajax({
            url: url,
            type: requestType,
            data: data,
            success: result => { return result },
            error: error => { return error }
        })
        return result
    } catch(error) {
        throw error
    }
}