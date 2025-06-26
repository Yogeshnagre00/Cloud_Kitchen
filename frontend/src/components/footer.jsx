import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand Info */}
        <div>
          <h2>Cloud_Kitchen</h2>
          <p>Fresh, fast, and flavorful meals delivered to your door.</p>
        </div>

        {/* Contact Info */}
        <div>
          <h3>Get in Touch</h3>
          <p>Email: support@cloudkitchen.com</p>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Cloud_Kitchen. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
