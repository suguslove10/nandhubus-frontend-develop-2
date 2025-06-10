"use client";
import { ArrowRight, Calendar, Camera, Clock, Heart, MapPin, Mountain, Star, Users, Utensils } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
}

interface GuideCardProps {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  icon: ReactNode;
  features: Feature[];
  link: string;
}

interface DestinationCardProps {
  name: string;
  imageUrl: string;
  distance: string;
}

interface TipCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const BlogPage = () => {
    const router=useRouter();
  return (
    <div className="min-h-screen mt-20 bg-gray-50">
      {/* Hero Section */}
      <section
  className="w-full h-screen bg-cover bg-center text-white flex items-center justify-center px-4"
  style={{
    backgroundImage: `url(/assests/bus-5.jpeg)`,
  }}
>
 <div className="max-w-6xl mx-auto text-center bg-black/30 backdrop-blur-xs  rounded-xl p-8">
  <h1 className="text-3xl md:text-5xl font-bold mb-4">
    Travel Guides from Bengaluru
  </h1>
  <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
    Discover detailed guides for your next pilgrimage or heritage journey
  </p>
</div>

</section>


      {/* Featured Guides Section */}
   <section className="w-full p-5 ">
  <div className="text-center mb-12">
    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
      Featured Travel Guides
    </h2>
    <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {/* Tirupati Guide Card */}
    <GuideCard 
      title="Tirupati Pilgrimage"
      subtitle="Sacred Journey Guide"
      description="Complete pilgrimage planning guide from Bengaluru to the sacred hills of Tirupati"
      imageUrl="/assests/pp.jpg"
      icon={<MapPin className="h-4 w-4 text-blue-600" />}
      features={[
        {
          icon: <MapPin className="h-4 w-4 text-blue-600" />,
          title: "Sacred Temples",
          description: "Complete temple information and darshan procedures"
        },
        {
          icon: <Calendar className="h-4 w-4 text-green-600" />,
          title: "Perfect Timing",
          description: "Best seasons and festival calendars for your visit"
        },
        {
          icon: <Clock className="h-4 w-4 text-blue-600" />,
          title: "Darshan Tips",
          description: "Insider tips for queue management and rituals"
        }
      ]}
      link="/blog/thirupathi"
    />

    {/* Mysuru Guide Card */}
    <GuideCard 
      title="Mysuru Heritage"
      subtitle="Royal City Experience"
      description="Discover the royal heritage and cultural treasures of Karnataka's cultural capital"
      imageUrl="/assests/m2.jpg"
      icon={<Mountain className="h-4 w-4 text-blue-600" />}
      features={[
        {
          icon: <Mountain className="h-4 w-4 text-blue-600" />,
          title: "Royal Palaces",
          description: "Mysore Palace and other architectural marvels"
        },
        {
          icon: <Camera className="h-4 w-4 text-orange-600" />,
          title: "Cultural Sites",
          description: "Museums, gardens, and historic landmarks"
        },
        {
          icon: <Utensils className="h-4 w-4 text-red-600" />,
          title: "Local Cuisine",
          description: "Traditional Mysore delicious and dining spots"
        }
      ]}
      link="/blog/mysuru"
    />

    {/* Mantralayam Guide Card */}
    <GuideCard 
      title="Mantralayam Spiritual"
      subtitle="Divine Blessings Journey"
      description="Experience the presence at Sri Raghavendra Swamy's in Mantralayam"
      imageUrl="/assests/m1.jpeg"
      icon={<Star className="h-4 w-4 text-blue-600" />}
      features={[
        {
          icon: <Star className="h-4 w-4 text-blue-600" />,
          title: "Sacred Brindavana",
          description: "Visit the holy samadhi of Sri Raghavendra Swamy"
        },
        {
          icon: <Heart className="h-4 w-4 text-blue-600" />,
          title: "Devotional Practices",
          description: "Prayers, rituals and spiritual experiences guide"
        },
        {
          icon: <Calendar className="h-4 w-4 text-green-600" />,
          title: "Festival Calendar",
          description: "Special occasions and celebration timings"
        }
      ]}
      link="/blog/mantralayam"
    />

    {/* Dharmasthala Guide Card - Will wrap to next row */}
    <GuideCard 
      title="Dharmasthala Sacred"
      subtitle="Temple Town Experience"
      description="Discover unique spiritual cultural heritage of Karnataka's sacred temple town"
      imageUrl="/assests/d4.jpg"
      icon={<Users className="h-4 w-4 text-green-600" />}
      features={[
        {
          icon: <Users className="h-4 w-4 text-green-600" />,
          title: "Sacred Temples",
          description: "Manjunatha Temple and spiritual significance"
        },
        {
          icon: <Heart className="h-4 w-4 text-blue-600" />,
          title: "Free Meals",
          description: "Annadana tradition and community service"
        },
        {
          icon: <Mountain className="h-4 w-4 text-teal-600" />,
          title: "Cultural Sites",
          description: "Museums, statue parks and heritage attractions"
        }
      ]}
      link="/blog/dharmasthala"
    />
  </div>
</section>

      {/* Popular Destinations Section */}
      {/* <section className="w-full bg-white py-12 px-4 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              Popular Destinations
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <DestinationCard 
              name="Coorg"
              imageUrl="/assests/coorg.jpg"
              distance="250km from Bengaluru"
            />
            <DestinationCard 
              name="Hampi"
              imageUrl="/assests/hampi.jpg"
              distance="340km from Bengaluru"
            />
            <DestinationCard 
              name="Ooty"
              imageUrl="/assests/ooty.jpg"
              distance="270km from Bengaluru"
            />
            <DestinationCard 
              name="Kanyakumari"
              imageUrl="/assests/kanyakumari.jpg"
              distance="700km from Bengaluru"
            />
          </div>
        </div>
      </section> */}

      {/* Travel Tips Section */}
      <section className="w-full max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            Travel Tips & Resources
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TipCard 
            icon={<Calendar className="h-6 w-6 text-blue-600" />}
            title="Best Time to Visit"
            description="Learn about ideal seasons and weather conditions for temple visits"
          />
          <TipCard 
            icon={<Clock className="h-6 w-6 text-green-600" />}
            title="Queue Management"
            description="Strategies to minimize wait times at popular temples"
          />
          <TipCard 
            icon={<Utensils className="h-6 w-6 text-orange-600" />}
            title="Local Cuisine Guide"
            description="Must-try traditional foods at each destination"
          />
        </div>
      </section>
    </div>
  );
};

// Reusable Guide Card Component
const GuideCard = ({ 
  title, 
  subtitle, 
  description, 
  imageUrl, 
  icon, 
  features, 
  link 
}: GuideCardProps) => {
    const router = useRouter();
  return (
    <div className="group rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-300 hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10"></div>
        <div
          className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url('${imageUrl}')` }}
        ></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
          <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg mb-1">
            {title}
          </h3>
          <div className="flex items-center text-white/90">
            {icon}
            <span className="text-xs font-medium ml-1">
              {subtitle}
            </span>
          </div>
        </div>
      </div>

      <div className="p-5">
        <p className="text-gray-700 font-medium text-base mb-4 leading-relaxed">
          {description}
        </p>

        <div className="space-y-3 mb-6">
          {features.map((feature:any, index:any) => (
            <div key={index} className="flex items-start group/item">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-2 rounded-lg mr-3 group-hover/item:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                  {feature.title}
                </h4>
                <p className="text-gray-600 text-xs leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            className="w-full group/btn bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 shadow hover:shadow-md"
            onClick={() => router.push(link)}
          >
            <span className="flex items-center justify-center text-sm">
              Explore {title.split(' ')[0]} Guide
              <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Reusable Destination Card Component
const DestinationCard = ({ 
  name, 
  imageUrl, 
  distance 
}: DestinationCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 h-48">
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url('${imageUrl}')` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
      <div className="relative h-full flex flex-col justify-end p-4">
        <h3 className="text-xl font-bold text-white">{name}</h3>
        <p className="text-sm text-gray-200">{distance}</p>
      </div>
    </div>
  );
};

// Reusable Tip Card Component
const TipCard = ({ 
  icon, 
  title, 
  description 
}: TipCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
      <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

export default BlogPage;