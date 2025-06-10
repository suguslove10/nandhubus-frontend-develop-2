import Image from "next/image";
import { SectionTitle } from "./SectionTitle";


export function SowthadkaSection() {
  return (
    <section className=" md:py-24 bg-gray-50">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary">
              Bonus Temple Visit
            </div>
            <SectionTitle 
              title="Sowthadka Shree Mahaganapati Temple" 
              subtitle="A unique open-air temple experience included in your journey"
              className="mb-6"
            />
            
            <p className="text-base md:text-lg text-gray-600">
              On your return journey from Dharmasthala, we include a special stop at the revered 
              Sowthadka Shree Mahaganapati Temple, a rare open-air temple located in a peaceful 
              green setting near Kokkada.
            </p>
            
            <p className="mt-4 text-base md:text-lg text-gray-600">
              This temple is famous for the idol of Lord Ganesha, which is uniquely placed in the 
              open without a Garbhagriha. Devotees believe that prayers offered here bring blessings 
              for success, obstacle removal, and inner strength.
            </p>
            
            <p className="mt-4 text-base md:text-lg text-gray-600">
              The temple is especially known for fulfilling the wishes of devotees related to education, 
              marriage, and business. Its peaceful atmosphere and unique design make this visit a must 
              for all spiritual travelers—the perfect way to end your Dharmasthala pilgrimage on a divine note.
            </p>
          </div>
          
          <div className="relative h-[400px] lg:h-[500px] rounded-xl overflow-hidden">
            <Image 
  src="/assests/d3.jpg"               alt="Sowthadka Shree Mahaganapati Temple"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}