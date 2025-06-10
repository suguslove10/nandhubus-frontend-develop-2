import React from "react";
import { Calendar, MapPin, Clock, Users, Heart, Music } from "lucide-react";

export const WeddingEvents: React.FC = () => {
  const events = [
    {
      icon: <Heart className="w-12 h-12 text-[#0f7bab]" />,
      title: "Wedding Ceremony",
      description:
        "Transport your guests to and from the wedding venue in comfort. Perfect for ensuring everyone arrives on time for your special moment.",
      features: [
        "Flexible pickup points",
        "On-time arrival guarantee",
        "Coordinated guest transport",
      ],
    },
    {
      icon: <Music className="w-12 h-12 text-[#0f7bab]" />,
      title: "Reception Party",
      description:
        "Keep the celebration going with reliable transportation to your reception venue. Ideal for maintaining the festive atmosphere.",
      features: [
        "Evening transport service",
        "Multiple trip options",
        "Late-night availability",
      ],
    },
    {
      icon: <Calendar className="w-12 h-12 text-[#0f7bab]" />,
      title: "Pre-Wedding Events",
      description:
        "From sangeet to mehendi, ensure your guests can attend all pre-wedding celebrations with ease and comfort.",
      features: [
        "Custom scheduling",
        "Multiple day bookings",
        "Event coordination",
      ],
    },
    {
      icon: <MapPin className="w-12 h-12 text-[#0f7bab]" />,
      title: "Temple Visits",
      description:
        "Organize group visits to temples before or after the wedding. Perfect for traditional ceremonies and blessings.",
      features: ["Route planning", "Experienced drivers", "Flexible timing"],
    },
    {
      icon: <Clock className="w-12 h-12 text-[#0f7bab]" />,
      title: "Day Tours",
      description:
        "Plan sightseeing trips for out-of-town guests. Show them the beauty of Bangalore and surrounding areas.",
      features: [
        "Customized itineraries",
        "Local guides available",
        "Comfort stops planned",
      ],
    },
    {
      icon: <Users className="w-12 h-12 text-[#0f7bab]" />,
      title: "Family Get-togethers",
      description:
        "Keep extended family together with group transportation for post-wedding gatherings and celebrations.",
      features: [
        "Group coordination",
        "Flexible seating arrangements",
        "Door-to-door service",
      ],
    },
  ];

  return (
    <section id="events" className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-800">
            Perfect for Every Wedding Event
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            From pre-wedding celebrations to post-wedding gatherings, we provide
            reliable transportation solutions for all your wedding-related
            events.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="mb-6 flex justify-center">{event.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-neutral-800 text-center">
                {event.title}
              </h3>
              <p className="text-neutral-600 mb-6 text-center">
                {event.description}
              </p>
              <ul className="space-y-2">
                {event.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-center text-neutral-700"
                  >
                    <span className="w-2 h-2 bg-[#0f7bab] rounded-full mr-3"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a
            href="#booking"
            className="inline-block bg-[#0f7bab] hover:bg-[#0c6991] text-white px-8 py-4 rounded-md transition-colors text-lg font-medium"
          >
            Plan Your Wedding Transport
          </a>
        </div>
      </div>
    </section>
  );
};
