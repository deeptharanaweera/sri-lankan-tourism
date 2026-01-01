import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-8">
                    <div>
                        <div className="mb-4">
                            <Image
                                src="/images/SriHeavenLankaLogo.png"
                                alt="Sri Heaven Lanka"
                                width={200}
                                height={60}
                                className="h-24 w-auto object-contain"
                            />
                        </div>
                        <p className="text-muted-foreground text-sm mb-6">
                            Your gateway to experiencing the beauty and culture of Sri Lanka
                        </p>
                        <div className="flex space-x-4">
                            <Link href="https://www.facebook.com/share/16jyMqTAQ1/" className="text-muted-foreground hover:text-primary transition-colors">
                                <Facebook className="h-8 w-8 text-blue-600" />
                                <span className="sr-only">Facebook</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="h-8 w-8 text-blue-400" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Instagram className="h-8 w-8 text-pink-600" />
                                <span className="sr-only">Instagram</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Linkedin className="h-8 w-8 text-blue-800" />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Youtube className="h-8 w-8 text-red-600" />
                                <span className="sr-only">Youtube</span>
                            </Link>

                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/tours" className="hover:text-foreground">Tours</Link></li>
                            <li><Link href="/vehicle-rental" className="hover:text-foreground">Vehicle Rental</Link></li>
                            <li><Link href="/gallery" className="hover:text-foreground">Gallery</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Resources</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/trip-planner" className="hover:text-foreground">Trip Planner</Link></li>
                            <li><Link href="/hotels" className="hover:text-foreground">Hotels</Link></li>
                            <li><Link href="/reviews" className="hover:text-foreground">Reviews</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Contact</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-foreground">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-foreground">Contact Us</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
                    <p>&copy; 2025 <span className="font-bold text-green-600">Sri</span> <span className="font-bold text-orange-500">Heaven</span> <span className="font-bold text-green-600">Lanka</span>. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
