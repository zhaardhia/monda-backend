const {
    db
} = require("../components/database");
const response = require("../components/response");

const { RateLimiterMySQL } = require("rate-limiter-flexible")

const opts = {
    storeClient: db,
    dbName: '',
    tableName: '',
    keyPrefix : "",
    points: 5, // Number of points
    duration: 1 * 60, // Per second(s),
  };

const ready = (err) => {
    if (err) {
        console.error(err);
        throw "Internal server error!"
    } else {
        console.log("Limiter table checked!");   
    }
}

const parseUserAgent = (ua) => {
    let browser;

    if( /firefox/i.test(ua) )
        browser = 'firefox';
    else if( /chrome/i.test(ua) )
        browser = 'chrome';
    else if( /safari/i.test(ua) )
        browser = 'safari';
    else if( /msie/i.test(ua) )
        browser = 'msie';
    else if( /PostmanRuntime/i.test(ua) )
        browser = 'postman';
    else
        browser = 'unknown';

    return browser;

}

const rateLimiter = new RateLimiterMySQL(opts, ready);

module.exports = async (req, res, next) => {
    const userAgent = parseUserAgent(req.headers['user-agent'])
    const ipAddr = req.ip;
    const idKey = `${req.query?.userId}_${ipAddr}_${userAgent}`

    const resLoginByIP = await rateLimiter.get(idKey)
    let retrySecs = 0;

    console.log(resLoginByIP);

    // Check if IP or Username + IP is already blocked
    if (resLoginByIP !== null && resLoginByIP.consumedPoints > 5) {
        retrySecs = Math.round(resLoginByIP.msBeforeNext / 1000) || 1;
    }

    if (retrySecs > 0) {

        return response.res429(res, "Max login attempt reached!", retrySecs)
    
    } else {

        // Invalid userId
        if (!req.isAuthenticated) {

            try {
                const promises = [rateLimiter.consume(idKey)];
                
                await Promise.all(promises)

                return response.res401(res, "Unauthorized access!");
            } catch (rlRejected) {
                if (rlRejected instanceof Error) {
                    throw rlRejected;
                } else {
                    return response.res429(res, "Max login attempt reached!", String(Math.round(rlRejected.msBeforeNext / 1000)) || 1)
                }
            }

        }

        // Valid userId
        if (resLoginByIP !== null && resLoginByIP.consumedPoints > 0) {
            // Reset on successful authorisation
            await rateLimiter.delete(idKey);

            next();
        }
    }
    
}