# **Browser Object Model**
The BOM (Browser Object Model) is a set of APIs provided by the browser to interact with the browser window itself—not just the content of the page. While the DOM deals with the document structure, the BOM enables access to things like the browser history, window size, alerts, and more.

- Controls the browser window and its behavior
- Allows interaction with location, history, navigator, and screen objects
- Supports popup management: alerts, confirms, prompts
- Enables timers, intervals, and browser-based events

## **🔹 Core Concepts of BOM**
What the BOM is and how it extends browser capabilities


-> The BOM provides the ability to interact with the browser itself. It includes objects like **window, navigator, location, screen, and history**, allowing developers to manipulate the browser window, monitor device info, and control navigation and timing behavior.


## **🧭 Window Object Overview → [ 01 Window Object ]**
The window object is the global object for all browser-side JavaScript.
- Properties:
    - window.innerWidth, window.innerHeight — viewport size
    - window.screenX, screenY — window position
    - window.scrollX, scrollY — scroll offsets

- Methods:
    - alert(), confirm(), prompt()
    - open(), close()
    - setTimeout(), setInterval(), clearTimeout(), clearInterval()

## **🌍 Location Object → [ 02 Location ]**
- Used to get or change the URL of the current page.
- location.href — full URL
- location.hostname, pathname, search, hash
- location.reload(), assign(), replace()

## **📜 History Object → [ 03 History ]**
Lets you interact with the browser’s session history.

- history.back() — go to previous page
- history.forward() — go to next page
- history.go(n) — move n steps forward/back
- history.length — number of entries

## **🧭 Navigator Object → [ 04 Navigator ]**
- Gives information about the browser and device.
- navigator.userAgent, navigator.language
- navigator.onLine — check connection status
- navigator.geolocation — location access

## **📺 Screen Object → [ 05 Screen ]**
Provides screen-related details.

| Property           | Description                           |
|--------------------|----------------------------------------|
| screen.width       | Width of the physical screen           |
| screen.height      | Height of the physical screen          |
| screen.availWidth  | Usable width excluding system UI       |
| screen.availHeight | Usable height excluding system UI      |


## **🧩 Miscellaneous Essentials**
- Detecting browser: navigator.userAgent
- Blocking popup: window.open() restrictions
- Measuring performance: window.performance
- Accessing clipboard: navigator.clipboard