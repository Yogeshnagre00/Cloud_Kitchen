import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand Info */}
        <div>
          <h2>Claud_Kitchen</h2>
          <p>Fresh, fast, and flavorful meals delivered to your door.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/menu">Menu</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h3>Get in Touch</h3>
          <p>Email: support@claudkitchen.com</p>
          <div className="social-icons">
            <a href="#">📘</a>
            <a href="#">📸</a>
            <a href="#">🐦</a>
            <a href="mailto:support@claudkitchen.com">✉️</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Claud_Kitchen. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
