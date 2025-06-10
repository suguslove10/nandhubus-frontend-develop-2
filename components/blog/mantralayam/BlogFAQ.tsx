"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function BlogFAQ() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-left">
          How long does the trip from Bangalore to Mantralayam take?
        </AccordionTrigger>
        <AccordionContent>
          The journey from Bangalore to Mantralayam typically takes around 6-7 hours by road, covering approximately 330 kilometers. The exact duration may vary based on traffic conditions, weather, and the number of stops made during the journey. Our drivers are familiar with the route and plan the journey to ensure comfortable travel times.
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="item-2">
        <AccordionTrigger className="text-left">
          What types of buses are available for the journey?
        </AccordionTrigger>
        <AccordionContent>
          We offer various types of buses to suit different group sizes and comfort preferences:
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>21-seater Mini Buses (AC and Non-AC)</li>
            <li>32-seater Standard Buses (AC and Non-AC)</li>
            <li>40-seater Deluxe Buses with push-back seats</li>
            <li>Sleeper coaches for overnight journeys</li>
            <li>52-seater Multi-Axle Volvo buses for premium comfort</li>
          </ul>
          All our buses are regularly maintained and sanitized for your safety and comfort.
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="item-3">
        <AccordionTrigger className="text-left">
          Is pickup and drop service included in the package?
        </AccordionTrigger>
        <AccordionContent>
          Yes, our packages include pickup and drop-off services from your location in Bangalore. For group bookings, we can arrange pickup from a common point or multiple locations as needed. Please specify your pickup requirements during the booking process so we can plan accordingly.
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="item-4">
        <AccordionTrigger className="text-left">
          Can I request a local guide or priest during the temple visit?
        </AccordionTrigger>
        <AccordionContent>
          Yes, we can arrange for a local guide who is knowledgeable about the temple history and rituals. For special poojas or archanas, we can help coordinate with temple authorities or priests. These services are offered as add-ons to your basic package and should be requested at the time of booking to ensure availability.
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="item-5">
        <AccordionTrigger className="text-left">
          How do I make a booking and what payment methods are accepted?
        </AccordionTrigger>
        <AccordionContent>
          You can book your Mantralayam trip through our website, by calling our customer service number, or via WhatsApp. The booking process involves:
          <ol className="list-decimal pl-5 mt-2 space-y-1">
            <li>Selecting your travel date and group size</li>
            <li>Choosing your preferred bus type</li>
            <li>Providing pickup location details</li>
            <li>Making a payment to confirm your booking</li>
          </ol>
          We accept various payment methods including credit/debit cards, net banking, UPI, and wallet payments. For group bookings, we also offer the option of paying a 50% advance with the balance due before the journey.
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="item-6">
        <AccordionTrigger className="text-left">
          What is the best time to visit Mantralayam?
        </AccordionTrigger>
        <AccordionContent>
          Mantralayam can be visited throughout the year, but the most comfortable months are from October to February when the weather is pleasant. Summers (March to June) can be quite hot in this region. Special festivals at the temple, particularly Raghavendra Swamy Aradhana (typically in August/September as per the lunar calendar), attract large crowds. If you prefer a less crowded experience, weekdays are better than weekends.
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="item-7">
        <AccordionTrigger className="text-left">
          Are meals included in the package?
        </AccordionTrigger>
        <AccordionContent>
          Our basic packages do not include meals, but we make convenient stops at clean, hygienic restaurants along the way. The temple also offers prasadam (consecrated food) to devotees after darshan. For group bookings, we can arrange meal packages at additional cost if requested in advance. Many groups prefer to have meals at the temple's dining hall (if available) or at restaurants near the temple.
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="item-8">
        <AccordionTrigger className="text-left">
          Can you arrange accommodation in Mantralayam?
        </AccordionTrigger>
        <AccordionContent>
          Yes, we can arrange accommodation in Mantralayam based on your preferences and budget. Options range from simple lodges near the temple to comfortable hotels with modern amenities. For large groups, early booking is recommended, especially during festival seasons and weekends. Some devotees also prefer to stay at the accommodations provided by the temple trust, which we can help arrange subject to availability.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}