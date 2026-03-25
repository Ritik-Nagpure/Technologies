
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-10">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* About Section */}
        <div>
          <h2 className="text-lg font-semibold mb-2">About Us</h2>
          <p className="text-sm">
            At Sweet Crumbs Bakery, we’ve been crafting breads, cakes, ice creams,
            and snacks with love since 1995. Our mission is to bring fresh,
            delicious, and wholesome baked goods to your table every day.
          </p>
        </div>

        {/* Contact Section */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Contact</h2>
          <p className="text-sm">📍 123 Main Street, Mulshi, MH, India</p>
          <p className="text-sm">📧 sweetcrumbs@bakery.com</p>
          <p className="text-sm">📞 +91 98765 43210</p>
        </div>

        {/* Social Media Section */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Follow Us</h2>
          <ul className="text-sm space-y-1">
            <li>🌐 Facebook: /sweetcrumbsbakery</li>
            <li>📸 Instagram: @sweetcrumbs_bakery</li>
            <li>🐦 Twitter: @sweetcrumbs</li>
          </ul>
        </div>
      </div>

      <div className="text-center mt-6 text-xs text-gray-400">
        © {new Date().getFullYear()} Sweet Crumbs Bakery. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
