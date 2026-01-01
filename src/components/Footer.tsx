import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-muted border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 gradient-warm rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-heading font-bold">ShopBD</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Your trusted online shopping destination for quality products in Bangladesh.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-smooth">About Us</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition-smooth">Contact</Link></li>
              <li><Link to="/shipping" className="text-muted-foreground hover:text-foreground transition-smooth">Shipping Info</Link></li>
              <li><Link to="/returns" className="text-muted-foreground hover:text-foreground transition-smooth">Returns</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/categories/baby" className="text-muted-foreground hover:text-foreground transition-smooth">Baby Items</Link></li>
              <li><Link to="/categories/women" className="text-muted-foreground hover:text-foreground transition-smooth">Women Fashion</Link></li>
              <li><Link to="/categories/men" className="text-muted-foreground hover:text-foreground transition-smooth">Men Fashion</Link></li>
              <li><Link to="/categories/electronics" className="text-muted-foreground hover:text-foreground transition-smooth">Electronics</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+880 1XXX-XXXXXX</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>support@shopbd.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 ShopBD. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
