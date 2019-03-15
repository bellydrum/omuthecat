/**
 * random utilities to make life simpler
 *
 */

/** return a number from 0 - max **/
const getRandomIndex = (max) => {
    return Math.floor(Math.random() * Math.floor(max))
}

/** detect mobile browser **/
/** http://detectmobilebrowsers.com/ **/
const mobileBrowser = () => {
    return (/Android|webOS|iPhone|iPad|BlackBerry|Windows Phone|Mobile/i.test(navigator.userAgent))
}

/** limit load of requests to server **/
// https://stackoverflow.com/questions/55186427/what-is-a-modern-reliable-way-to-store-total-user-clicks-during-their-time-on-a
// https://davidwalsh.name/javascript-debounce-function
const debounce = (func, wait, immediate) => {
    let timeout
    return function() {
        let context = this, args = arguments
        let later = function() {
            timeout = null
            if (!immediate) func.apply(context, args)
        };
        let callNow = immediate && !timeout
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
        if (callNow) func.apply(context, args)
    }
}