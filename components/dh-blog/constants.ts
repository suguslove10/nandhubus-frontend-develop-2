export const siteConfig = {
    name: "Nandhu Bus",
    description: "Premium bus booking service from Bengaluru to Dharmasthala",
    mainNav: [
      { title: "Home", href: "/" },
      { title: "About Dharmasthala", href: "/about" },
      { title: "Packages", href: "/packages" },
      { title: "Booking", href: "/booking" },
      { title: "Contact", href: "/contact" },
    ],
    links: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      twitter: "https://twitter.com",
    },
  };
  
  export const testimonials = [
    {
      id: 1,
      name: "Ramesh Kumar",
      role: "Regular Traveler",
      content: "The Nandhu Bus experience to Dharmasthala was exceptional. The drivers were professional and the stop at Sowthadka temple made the journey even more special.",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      id: 2,
      name: "Priya Sharma",
      role: "Family Traveler",
      content: "Traveling with my family was comfortable and stress-free. The timely departure and arrival helped us plan our temple visit perfectly.",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      id: 3,
      name: "Venkatesh Rao",
      role: "Monthly Pilgrim",
      content: "As someone who visits Dharmasthala monthly, I always choose Nandhu Bus for their reliability and the peaceful journey they provide.",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
  ];
  
  export const packageOptions = [
    {
      id: "weekend-trip",
      title: "Weekend Dharmasthala Special",
      description: "Perfect 2-day trip for weekend pilgrimage",
      price: "₹2,499",
      features: [
        "Round-trip AC bus travel",
        "1 night accommodation",
        "Temple visit with guide",
        "Stop at Sowthadka Temple",
        "Breakfast included",
      ],
      popular: true,
    },
    {
      id: "day-trip",
      title: "Dharmasthala Day Trip",
      description: "Same day return for quick pilgrimage",
      price: "₹1,499",
      features: [
        "Round-trip non-AC bus travel",
        "Temple visit time: 4 hours",
        "Stop at Sowthadka Temple",
        "Early morning departure",
        "Late night return",
      ],
      popular: false,
    },
    {
      id: "extended",
      title: "Extended Dharmasthala Tour",
      description: "Comprehensive 3-day spiritual journey",
      price: "₹3,999",
      features: [
        "Round-trip AC bus travel",
        "2 nights accommodation",
        "Temple visits with guide",
        "Stop at Sowthadka & other temples",
        "All meals included",
        "Evening cultural program",
      ],
      popular: false,
    },
  ];
  
  export const templeTimings = {
    darshana: [
      "6:30 AM to 11:00 AM",
      "12:15 PM to 2:30 PM",
      "5:00 PM to 8:30 PM"
    ],
    abhisheka: [
      "8:30 AM to 10:30 AM"
    ],
    thulabhara: [
      "8:00 AM and 1:00 PM"
    ],
    note: "Timings may change on festival days. Always check in advance for updates."
  };
  
  export const busTypes = [
    {
      id: "seater-ac",
      name: "Seater AC",
      capacity: "40 seater",
      features: ["Air conditioned", "Push-back seats", "Mobile charging", "Clean interiors"],
      image: "/assests/bus-2.jpeg"
    },
    {
      id: "seater-nonac",
      name: "Seater Non-AC",
      capacity: "52 seater",
      features: ["Economical option", "Push-back seats", "Clean interiors"],
      image: "/assests/seaterNonac.jpg"
    },
    {
      id: "sleeper-ac",
      name: "Sleeper AC",
      capacity: "30 sleeper berths",
      features: ["Air conditioned", "Comfortable berths", "Mobile charging", "Reading lights"],
      image: "/assests/bus-4.jpeg"
    },
  ];
  
  export const faqs = [
    {
      question: "How long does the journey from Bangalore to Dharmasthala take?",
      answer: "The journey typically takes 7-8 hours depending on traffic conditions and rest stops."
    },
    {
      question: "Do you provide pickup from multiple locations in Bangalore?",
      answer: "Yes, we provide pickup from key locations across Bangalore including Majestic, Whitefield, Electronic City, and Marathahalli."
    },
    {
      question: "Is food provided during the journey?",
      answer: "We make stops at clean restaurants where you can purchase food. Some of our premium packages include meals."
    },
    {
      question: "Can I book for a large group?",
      answer: "Absolutely! We offer special group rates and can arrange dedicated buses for groups of 20+ people."
    },
    {
      question: "What is the cancellation policy?",
      answer: "Full refund if cancelled 72 hours before departure, 50% refund if cancelled 24-72 hours before, and no refund for cancellations within 24 hours."
    }
  ];