# 🧠 What Is a Memory Leak?
A memory leak occurs when memory that is no longer needed isn't released, causing the app to consume more memory over time. In JavaScript, this typically happens when objects remain referenced even though they’re no longer used.
<br />

# ⚠️ Common Causes & Examples
| Cause                     | Example                                                              |
|---------------------------|----------------------------------------------------------------------|
| Accidental global vars    | `hkjh = {}` without `let`/`const`/`var` creates a global reference   |
| Uncleared event listeners | Adding listeners but not removing them when elements are removed     |
| Detached DOM nodes        | Keeping references to removed DOM elements                           |
| Closures holding references| Functions that retain access to unused variables                    |
| Caching without limits    | Storing large data in memory without cleanup                         |

<br />

# ✅ Solutions & Best Practices
- Use let/const to avoid accidental globals
- Remove event listeners with removeEventListener when no longer needed
- Nullify references to unused objects: obj = null
- Use WeakMap/WeakSet for temporary object storage
- Limit cache size using strategies like LRU (Least Recently Used)

<br />

# 🛠️ Debugging & Performance Tips
- Chrome DevTools:
    - Use Memory tab → Take Heap Snapshots to find retained objects
    - Use Performance tab → Record memory usage over time
- Look for detached DOM nodes: Search for "Detached" in heap snapshot
- Force GC (Garbage Collection) manually to test cleanup
- Use profiling tools like DebugBear or Chrome DevTools