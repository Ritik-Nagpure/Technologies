
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Section */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">About</h3>
          <p className="text-sm leading-relaxed">
            This website is dedicated to helping developers learn React step by
            step. Explore tutorials, guides, and best practices to build modern
            web applications.
          </p>
        </div>

        {/* Mission Section */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Our Mission</h3>
          <p className="text-sm leading-relaxed">
            We aim to simplify React for beginners and provide advanced insights
            for experienced developers. Our goal is to make learning React both
            practical and enjoyable.
          </p>
        </div>

        {/* Contact Info (no links) */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Contact</h3>
          <p className="text-sm leading-relaxed">
            Email: react.tutorial@example.com <br />
            Phone: +1 (555) 123-4567 <br />
            Location: Remote / Worldwide
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} React Tutorial. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
