import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container container-wide">
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="footer__logo">
              <div className="footer__logo-icon">
                <Shield size={18} />
              </div>
              <span className="footer__logo-text">SchildWerk</span>
            </div>
            <p className="footer__tagline">
              Dein Name. Perfekt in Form.<br />
              3D-gedruckt in Deutschland.
            </p>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Produkte</h4>
            <Link to="/konfigurator/mailbox-sign" className="footer__link">
              Briefkasten-Namensschild
            </Link>
            <Link to="/konfigurator/keychain" className="footer__link">
              Schlüsselanhänger
            </Link>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Shop</h4>
            <Link to="/produkte" className="footer__link">Alle Produkte</Link>
            <Link to="/warenkorb" className="footer__link">Warenkorb</Link>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Rechtliches</h4>
            <Link to="/impressum" className="footer__link">Impressum</Link>
            <Link to="/datenschutz" className="footer__link">Datenschutz</Link>
            <Link to="#" className="footer__link">AGB</Link>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            © {new Date().getFullYear()} SchildWerk. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
}
