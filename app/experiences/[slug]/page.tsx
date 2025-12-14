
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// Define the experience data structure
type ExperienceData = {
    title: string;
    subtitle: string;
    description: string;
    heroImage: string;
    highlights: string[];
    details: {
        title: string;
        content: string;
    }[];
    gallery: string[];
};

// Static data for each experience type
const experiences: Record<string, ExperienceData> = {
    "cultural-heritage": {
        title: "Cultural & Heritage Tours",
        subtitle: "Journey through time in the Pearl of the Indian Ocean",
        description:
            "Explore the rich tapestry of Sri Lanka's history, from ancient kingdoms to colonial legacies. Walk through the ruins of Anuradhapura, marvel at the Sigiriya Rock Fortress, and witness the sacred traditions that have thrived for millennia.",
        heroImage:
            "https://www.srilanka.org.tr/images/dataResim/9047ba-e_dyijlwyaajgd1.jpg?q=80&w=1600&auto=format&fit=crop",
        highlights: [
            "Climb the 5th-century Sigiriya Rock Fortress",
            "Visit the Temple of the Sacred Tooth Relic in Kandy",
            "Explore the ancient ruins of Polonnaruwa",
            "Walk through the colonial streets of Galle Fort",
            "Experience the Dambulla Cave Temple",
        ],
        details: [
            {
                title: "Ancient Cities",
                content:
                    "Discover the majestic ruins of Anuradhapura and Polonnaruwa, where great stupas and intricate irrigation systems showcase the engineering marvels of ancient Sri Lanka.",
            },
            {
                title: "Living Traditions",
                content:
                    "Witness captivating Kandyan dance performances, observe daily rituals at sacred temples, and immerse yourself in colorful festivals like the Esala Perahera.",
            },
        ],
        gallery: [
            "https://www.gokitetours.com/wp-content/uploads/2025/01/1.-Sigiriya-Rock-Fortress.webp?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1578509311666-4c4f923e4b47?q=80&w=800&auto=format&fit=crop",
        ],
    },
    "wildlife-nature": {
        title: "Wildlife & Nature Safaris",
        subtitle: "Encounter the wild heart of the island",
        description:
            "Sri Lanka is one of the best places in Asia for wildlife. From the leopards of Yala to the elephant gatherings in Minneriya and the blue whales of Mirissa, prepare for unforgettable encounters with nature.",
        heroImage:
            "https://i.ytimg.com/vi/FEAW5IbubXA/maxresdefault.jpg?q=80&w=1600&auto=format&fit=crop",
        highlights: [
            "Spot leopards in Yala National Park",
            "Watch elephant herds in Udawalawe",
            "Go whale watching in Mirissa",
            "Bird watching in Bundala and Sinharaja",
            "Trek through the Knuckles Mountain Range",
        ],
        details: [
            {
                title: "Safari Adventures",
                content:
                    "Embark on jeep safaris through our national parks. Our expert guides will help you spot elusive predators, colorful birds, and majestic elephants in their natural habitats.",
            },
            {
                title: "Marine Life",
                content:
                    "The ocean around Sri Lanka is teeming with life. Join a boat tour to see Blue Whales, Sperm Whales, and playful dolphins, or go snorkeling to explore vibrant coral reefs.",
            },
        ],
        gallery: [
            "https://images.unsplash.com/photo-1560969184-10fe8719e654?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1582046420557-2af9e2730a04?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1534947913387-a2267d30f576?q=80&w=800&auto=format&fit=crop",
        ],
    },
    "hill-country": {
        title: "Hill Country & Tea Trails",
        subtitle: "Misty mountains and emerald carpets",
        description:
            "Escape to the cool climes of the central highlands. Ride the famous blue train through breathtaking landscapes, hike to waterfalls, and sip fresh Ceylon tea right where it's grown.",
        heroImage:
            "https://images.unsplash.com/photo-1588661730097-f83cb48039e1?q=80&w=1600&auto=format&fit=crop",
        highlights: [
            "Ride the scenic Kandy to Ella train",
            "Visit a tea factory and plantation in Nuwara Eliya",
            "Hike to the top of Ella Rock or Little Adam's Peak",
            "Marvel at the Nine Arch Bridge",
            "Relax by the Gregory Lake",
        ],
        details: [
            {
                title: "Tea Culture",
                content:
                    "Learn about the art of tea making, from plucking the leaves to the final brew. Stay in converted tea planter bungalows for a touch of colonial nostalgia.",
            },
            {
                title: "Scenic Hikes",
                content:
                    "For the adventurous, the hill country offers some of the best hiking trails, leading to panoramic views, cascading waterfalls, and hidden temples.",
            },
        ],
        gallery: [
            "https://images.unsplash.com/photo-1590605912448-4cb296dfa12d?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1546252989-73e44081c7e9?q=80&w=800&auto=format&fit=crop",
        ],
    },
    "beach-coastal": {
        title: "Beach & Coastal Relaxation",
        subtitle: "Sun, sand, and surf on golden shores",
        description:
            "With over 1,300km of coastline, Sri Lanka is a beach lover's paradise. Whether you want to surf the waves, relax under a palm tree, or enjoy vibrant beach nightlife, there's a perfect spot for you.",
        heroImage:
            "https://images.unsplash.com/photo-1552554035-644eb9852093?q=80&w=1600&auto=format&fit=crop",
        highlights: [
            "Surf the waves at Arugam Bay",
            "Relax on the pristine sands of Mirissa and Unawatuna",
            "Explore the coral reefs of Hikkaduwa",
            "Enjoy water sports in Bentota",
            "Watch the sunset from Galle Fort ramparts",
        ],
        details: [
            {
                title: "Tropical Bliss",
                content:
                    "Our beaches offer the perfect setting for relaxation. Enjoy fresh coconut water, indulge in a seafood feast, or simply soak up the sun on the golden sands.",
            },
            {
                title: "Water Sports",
                content:
                    "From surfing and diving to jet skiing and windsurfing, the coastal waters offer plenty of excitement for thrill-seekers.",
            },
        ],
        gallery: [
            "https://images.unsplash.com/photo-1536761001546-b089c8c935bc?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1587352352843-ac80a9d24a6a?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1566373738586-cf18dc7df84d?q=80&w=800&auto=format&fit=crop",
        ],
    },
};

export default async function ExperiencePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const data = experiences[slug];

    if (!data) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navigation />

            {/* Hero Section */}
            <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
                <Image
                    src={data.heroImage}
                    alt={data.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <div className="container max-w-4xl space-y-6 animate-in fade-in zoom-in duration-700">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight drop-shadow-lg">
                            {data.title}
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 font-light tracking-wide max-w-2xl mx-auto drop-shadow-md">
                            {data.subtitle}
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                {/* Main Content & Sidebar Layout */}
                <div className="grid lg:grid-cols-3 gap-12 lg:gap-20">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* Description */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-2 text-primary font-medium">
                                <span className="h-px w-8 bg-primary"></span>
                                <span>Overview</span>
                            </div>
                            <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">
                                {data.description}
                            </p>
                        </section>

                        {/* Detailed Sections */}
                        <div className="grid sm:grid-cols-2 gap-8">
                            {data.details.map((detail, idx) => (
                                <div key={idx} className="bg-muted/30 p-8 rounded-2xl border border-border/50 hover:border-primary/20 transition-colors">
                                    <h3 className="text-xl font-bold mb-3 text-foreground">{detail.title}</h3>
                                    <p className="text-muted-foreground">{detail.content}</p>
                                </div>
                            ))}
                        </div>

                        {/* Gallery Grid */}
                        <section className="space-y-6 pt-8">
                            <h2 className="text-2xl font-bold">Captured Moments</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 h-96 sm:h-80">
                                {data.gallery.map((img, idx) => (
                                    <div
                                        key={idx}
                                        className={`relative rounded-xl overflow-hidden group ${idx === 0 ? 'sm:col-span-2 sm:row-span-2 h-full' : 'h-full'}`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${data.title} gallery ${idx + 1}`}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            sizes="(min-width: 640px) 50vw, 100vw"
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div>

                    {/* Sidebar / Highlights */}
                    <div className="space-y-8">
                        <div className="sticky top-24">
                            <div className="bg-card border rounded-2xl p-8 shadow-sm space-y-8">
                                <div>
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <CheckCircle2 className="text-primary h-5 w-5" />
                                        Highlights
                                    </h3>
                                    <ul className="space-y-4">
                                        {data.highlights.map((highlight, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                                                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                                                <span>{highlight}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="pt-6 border-t space-y-4">
                                    <h4 className="font-semibold text-foreground">Ready to explore?</h4>
                                    <Link href="/trip-planner" className="block">
                                        <Button className="w-full text-lg h-12" size="lg">
                                            <Sparkles className="mr-2 h-4 w-4" />
                                            Plan This Trip
                                        </Button>
                                    </Link>
                                    <Link href="/tours" className="block">
                                        <Button variant="outline" className="w-full text-lg h-12">
                                            View All Tours
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Footer CTA */}
            <section className="py-20 bg-muted/50 border-t">
                <div className="container mx-auto px-4 text-center space-y-6">
                    <h2 className="text-3xl font-bold">Discover More Experiences</h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Sri Lanka has so much more to offer. Explore our other curated experiences or customize your own journey.
                    </p>
                    <div className="flex justify-center gap-4 pt-4">
                        <Link href="/">
                            <Button variant="ghost" size="lg">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Home
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
