import React from "react";

const LandingPage = () => {
  return (
    <div className="min-h-screen text-white flex flex-col">
      {/* Hero Section */}
      <header className=" py-16 px-6 text-center">
        <h1 className="text-2xl md:text-5xl font-bold mb-4">
          The Importance of Coding & React
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto">
          Coding is the language of the future. React makes building modern web
          applications faster, easier, and more powerful.
        </p>
      </header>

      {/* Alternating Sections */}
      <section className="py-16 px-6 max-w-6xl mx-auto space-y-16">
        {/* Section 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-semibold text-blue-300 mb-4">
              Why Learn Coding?
            </h2>
            <p className=" leading-relaxed">
              Coding empowers you to create solutions, automate tasks, and
              innovate in any field. It’s not just for developers — it’s a
              universal skill that opens doors to endless opportunities.
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2020&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Coding importance"
            className="rounded-lg shadow-lg"
          />
        </div>

        {/* Section 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center md:flex-row-reverse">
          <img
            src="https://images.unsplash.com/photo-1581276879432-15e50529f34b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="React importance"
            className="rounded-lg shadow-lg"
          />
          <div>
            <h2 className="text-2xl font-semibold text-blue-300 mb-4">
              Why React?
            </h2>
            <p className=" leading-relaxed">
              React simplifies building user interfaces with reusable
              components. It’s fast, efficient, and powers some of the world’s
              most popular applications. Learning React means learning how to
              build modern, scalable apps.
            </p>
          </div>
        </div>

        {/* Section 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-semibold text-blue-300 mb-4">
              The Future of Development
            </h2>
            <p className="leading-relaxed">
              With coding and React, you’re not just learning technology — you’re
              preparing for the future. These skills are essential for careers,
              startups, and innovation in every industry.
            </p>
          </div>
          <img
            src="https://plus.unsplash.com/premium_photo-1681400054984-c20bf5879c3b?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Future of coding"
            className="rounded-lg shadow-lg"
          />
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
