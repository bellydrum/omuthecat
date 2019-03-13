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