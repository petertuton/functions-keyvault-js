module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // const name = (req.query.name || (req.body && req.body.name));
    // const responseMessage = name
    //     ? "Hello, " + name + ". This HTTP triggered function executed successfully."
    //     : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    // context.res = {
    //     // status: 200, /* Defaults to 200 */
    //     body: responseMessage
    // };

    const responseMessage = extractSettings(process.env.SettingsPrefix, process.env.SettingsSeparator);

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}

function extractSettings(settingsPrefix, separator) {
    // Valid examples: 
    //      "Settings--Key": "Value"
    //      "Settings--Category--Key" : "Value"

    // Filter the environmant variables to those beginning with 'Settings--'
    var keys = Object.keys(process.env).filter(key => key.startsWith(settingsPrefix+separator));
    
    // Init the result object
    var settings = new Object();
    
    // Process each setting
    for (index in keys) {
        var key = keys[index];
        console.log("Key: " + key + " Value: " + process.env[key]);
        // Split key on '--'
        var keyParts = key.split(separator);
        switch (keyParts.length)
        {
            case 2:
                // "Settings--Key": "Value"
                settings[keyParts[1]] = process.env[key];
                break;
            case 3:
                // "Settings--Category--Key" : "Value"
                if (settings[keyParts[1]] == undefined)
                    settings[keyParts[1]] = new Object();
                settings[keyParts[1]][keyParts[2]] = process.env[key];
                break;
            default:
                // Invalid
                break;
        }
    }

    // Return the settings object
    console.log(settings);
    return settings;
}