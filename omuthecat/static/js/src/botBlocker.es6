const botBlocker = {

    timeSinceLastCheck: Date.now(),
    timeGapsBetweenChecks: [],


    check: () => {

        /** do a click frequency check every 10 clicks. **/
        if ((botBlocker.currentSessionScore > 20) && (botBlocker.currentSessionScore % 10 === 0)) {

            console.log('hey')

            const now = Date.now()

            console.log(now - botBlocker.timeSinceLastCheck)

            app.timeSinceLastCheck = now
            app.timeGapsBetweenChecks.append()

            console.log(botBlocker.timeGapsBetweenChecks)

        }
    }

}