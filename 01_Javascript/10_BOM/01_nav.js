
// Redirect to another page location
document.getElementById('navopen').addEventListener('click', () => { window.location.href = "#END OF DOCUMENT"; });

document.getElementById('navopenyoutube').addEventListener('click', () => { window.open("https://www.youtube.com/", '_blank') });

// Reload the current page
document.getElementById('navreload').addEventListener('click', () => { window.location.reload() });


document.getElementById('navback').addEventListener('click', () => { window.history.back() });
document.getElementById('navfw').addEventListener('click', () => { window.history.forward() });

document.getElementById('navinfo').addEventListener('click', () => {
    let nav_info = ''
    nav_info += `AppName -> ${navigator.appName}\n`	// Returns the browser's name (deprecated)
    nav_info += `AppCodeName -> ${navigator.appCodeName}\n` //	Returns the browser's code name (deprecated)

    // Chrome, Edge, Firefox, etc.) still return "Netscape" or "Mozilla" even though it's no longer accurate.
    // Standardization: These properties have been frozen in time for consistency across browsers. 
    // They’re essentially “hard-coded” to avoid breaking pages that still rely on them.

    nav_info += `UserAgent -> ${navigator.userAgent}\n`	// Returns the user-agent string

    nav_info += `Platform -> ${navigator.platform}\n`	// Returns the operating system
    // navigator.platform returns "Win32" by default even on 64-bit versions of Windows.
    //  This is a legacy behavior preserved for compatibility reasons with older web content and scripts.


    nav_info += `Language -> ${navigator.language}\n`	// Returns the browser's language
    nav_info += `Languages -> ${navigator.languages}\n`	// Returns an array of preferred languages
    nav_info += `Online -> ${navigator.onLine}\n`	// Returns true if the browser is online ie internet is accessible / wifi is connected
    nav_info += `CookieEnabled -> ${navigator.cookieEnabled}\n`	// Returns true if cookies are enabled

    nav_info += `JavaEnabled -> ${navigator.javaEnabled()}\n`  // Returns true if Java is enabled (mostly obsolete)
    // Modern browsers have disabled Java support for years due to security concerns.

    document.getElementById('navinfodisplay').innerText = nav_info
})

// Ah, the classic [object CredentialsContainer] wall! That’s the browser politely telling you, “Sure, I have secrets—but I’m not spilling them that easily.”
//  Most of the navigator properties you’re trying to inspect are objects with internal methods and properties, and many are either asynchronous or secured, meaning /their data isn't directly exposed with toString() or JSON.stringify().
// check how to access when required

document.getElementById('navsce').addEventListener('click', () => {
    let nav_info = ''
    nav_info += `credentials -> ${navigator.credentials.toString()}\n`; // 	Credential Management API
    nav_info += `clipboard -> ${navigator.clipboard}\n`; // Read/write access to clipboard	
    nav_info += `locks -> ${navigator.locks}\n`; // 	LockManager API for async resource locking
    nav_info += `keyboard -> ${navigator.keyboard}\n`; // 	Access to keyboard layout and input
    nav_info += `ink -> ${navigator.ink}\n`; // 	Ink API for stylus input
    nav_info += `contacts -> ${navigator.contacts}\n`; // 	Access to user's contact list (secure context required)
    nav_info += `devicePosture -> ${navigator.devicePosture}\n`; // 	Detects foldable device posture	

    document.getElementById('navscedisplay').innerText = nav_info
})







