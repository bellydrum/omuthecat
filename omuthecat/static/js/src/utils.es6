/**
 * random utilities to make life simpler
 *
 */

/** return a number from 0 - max **/
function getRandomIndex(max) {
    return Math.floor(Math.random() * Math.floor(max))
}

/** detect mobile browser **/
/** http://detectmobilebrowsers.com/ **/
function mobileBrowser() {
    return (/Android|webOS|iPhone|iPad|BlackBerry|Windows Phone|Mobile/i.test(navigator.userAgent))
}