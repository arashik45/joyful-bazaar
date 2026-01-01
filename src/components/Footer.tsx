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
                <span className="text-white font-bold text-lg">শ</span>
              </div>
              <span className="text-xl font-heading font-bold">আমার শপ</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              সারা বাংলাদেশের নির্ভরযোগ্য অনলাইন শপিং প্ল্যাটফর্ম। আসল পণ্য, সেরা দাম ও দ্রুত ডেলিভারি।
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
            <h3 className="font-heading font-semibold mb-4">দ্রুত লিঙ্ক</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-smooth">আমাদের সম্পর্কে</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition-smooth">যোগাযোগ</Link></li>
              <li><Link to="/shipping" className="text-muted-foreground hover:text-foreground transition-smooth">ডেলিভারি তথ্য</Link></li>
              <li><Link to="/returns" className="text-muted-foreground hover:text-foreground transition-smooth">রিটার্ন পলিসি</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-heading font-semibold mb-4">ক্যাটাগরি</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/categories/baby" className="text-muted-foreground hover:text-foreground transition-smooth">বেবি আইটেম</Link></li>
              <li><Link to="/categories/women" className="text-muted-foreground hover:text-foreground transition-smooth">নারী ফ্যাশন</Link></li>
              <li><Link to="/categories/men" className="text-muted-foreground hover:text-foreground transition-smooth">পুরুষ ফ্যাশন</Link></li>
              <li><Link to="/categories/electronics" className="text-muted-foreground hover:text-foreground transition-smooth">ইলেকট্রনিক্স</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold mb-4">যোগাযোগ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>ঢাকা, বাংলাদেশ</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>০১XXXXXXXXX</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>support@amarshop.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; ২০২৪ আমার শপ। সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </div>
    </footer>
  );
};
