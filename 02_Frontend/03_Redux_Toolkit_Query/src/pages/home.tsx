
const home = () => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100">
            {/* Navigation */}
            <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
                <div className="text-2xl font-black tracking-tighter text-indigo-600">RQ.DOCS</div>
                <div className="space-x-8 text-sm font-medium text-slate-500">
                    <span className="hover:text-indigo-600 cursor-pointer">Concepts</span>
                    <span className="hover:text-indigo-600 cursor-pointer">Best Practices</span>
                    <button className="bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition">Get Started</button>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="max-w-4xl mx-auto text-center py-20 px-6">
                <h1 className="text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Mastering Server State
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                    React Query (TanStack Query) is often described as the missing data-fetching library for React.
                    It makes fetching, caching, and updating asynchronous data a breeze.
                </p>
            </header>

            {/* Core Concepts Grid */}
            <main className="max-w-7xl mx-auto px-6 pb-24">
                <div className="grid md:grid-cols-3 gap-8">

                    {/* Concept 1 */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow duration-300">
                        <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
                            <span className="text-2xl">⚡</span>
                        </div>
                        <h3 className="text-xl font-bold mb-3">Declarative Queries</h3>
                        <p className="text-slate-500 leading-relaxed">
                            Forget <code className="bg-slate-100 px-1 rounded text-pink-500">useEffect</code> and manual loading states. Define your fetcher and let the library manage the lifecycle.
                        </p>
                    </div>

                    {/* Concept 2 */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow duration-300">
                        <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                            <span className="text-2xl">📦</span>
                        </div>
                        <h3 className="text-xl font-bold mb-3">Zero-Config Caching</h3>
                        <p className="text-slate-500 leading-relaxed">
                            Data is cached out of the box. Users see instant results on subsequent visits while background refetching keeps things fresh.
                        </p>
                    </div>

                    {/* Concept 3 */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow duration-300">
                        <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center mb-6">
                            <span className="text-2xl">🔄</span>
                        </div>
                        <h3 className="text-xl font-bold mb-3">Automatic Sync</h3>
                        <p className="text-slate-500 leading-relaxed">
                            Data stays updated automatically when the user refocuses the window, reconnects to the web, or through intervals.
                        </p>
                    </div>

                </div>

                {/* Informational Section */}
                <section className="mt-20 bg-indigo-900 rounded-[3rem] p-12 text-white overflow-hidden relative">
                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-3xl font-bold mb-6">Why use it?</h2>
                        <ul className="space-y-4 text-indigo-100">
                            <li className="flex items-start">
                                <span className="text-indigo-400 mr-3">✔</span>
                                Reduces lines of code by removing boilerplate state management.
                            </li>
                            <li className="flex items-start">
                                <span className="text-indigo-400 mr-3">✔</span>
                                Optimizes network usage by avoiding duplicate requests.
                            </li>
                            <li className="flex items-start">
                                <span className="text-indigo-400 mr-3">✔</span>
                                Handles pagination and infinite scroll with built-in helpers.
                            </li>
                        </ul>
                    </div>
                    {/* Decorative Circle */}
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-800 rounded-full opacity-50"></div>
                </section>
            </main>

            <footer className="py-12 border-t border-slate-200 text-center text-slate-400 text-sm">
                Built for React Developers • Documentation Concept
            </footer>
        </div>
    );
};

export default home


