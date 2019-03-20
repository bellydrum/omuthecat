/**
 * requestHelper.js
 * -------------------------------------------------
 * functions pertaining to usage of request and corresponding csrftokens
 */


/**
  * boilerplate csrftoken setup without jQuery
  * https://stackoverflow.com/questions/49808272/django-and-ajax-without-jquery
  */

// get csrftoken and assign to window.csrftoken
function getCookie( name, cookieValue=null ) {

    if ( document.cookie ) {
        let cookies = document.cookie.split(';')
        for ( let i = 0; i < cookies.length; i++ ) {
            cookie = cookies[i].trim()
            if ( cookie.substring( 0, name.length + 1 ) == ( name + '=' ) ) {
                cookieValue = decodeURIComponent( cookie.substring( name.length + 1) )
                break
            }
        }
    }
    return cookieValue
}
window.csrftoken = getCookie('csrftoken')


/**
 *
 * @param url (string) - url from which to request data
 * @param requestType (string) - type of request
 * @param data (optional: object) - data required to make request
 * @param async (optional: boolean; default: true) - whether or not to run the fetch asynchronously
 * @returns
 *  - success: {Promise<*>}
 *  - failure: error
 *    - there was an error making the request to the given url
 *
 * @about - standardized wrapper for asynchronous fetch requests
 */
async function fetchWrapper( url, requestType, data={}, async=true) {

    /* ASYNCHRONOUS */
    if (async) {

        const request = new XMLHttpRequest()
        request.open(requestType, url, true)
        request.setRequestHeader('Content-Type', 'text/plain; charset="utf-8"')
        request.setRequestHeader( 'X-CSRFToken', window.csrftoken )
        request.setRequestHeader( 'cache-control', 'max-age=31536000' )
        request.onload = (e) => {
            if ( request.readyState === 4 ) {
                if ( request.status !== 200 ) {
                    console.error(request.statusText)
                }
            }
        }
        request.onerror = (e) => {
            console.error(request.statusText)
        }
        request.send( JSON.stringify( data ))


    /* SYNCHRONOUS */
    } else {

        const request = new XMLHttpRequest()
        request.open(requestType, url, false)
        request.setRequestHeader('Content-Type', 'text/plain; charset="utf-8"')
        request.setRequestHeader( 'X-CSRFToken', window.csrftoken )
        request.setRequestHeader( 'cache-control', 'max-age=31536000' )
        request.withCredentials = true
        request.send( JSON.stringify( data ) )

    }

}
