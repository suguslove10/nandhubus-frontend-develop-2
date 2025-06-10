// "use client";

// import { motion } from "framer-motion";
// import { Bus } from "lucide-react";

// export function CtaSection() {
//   return (
//     <section className="py-20 bg-[#0f7bab]">
//       <div className="container mx-auto px-4 text-center">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.5 }}
//           className="max-w-3xl mx-auto"
//         >
//           <Bus className="h-16 w-16 text-white/90 mx-auto mb-6" />
//           <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Simplify Group Travel?</h2>
//           <p className="text-xl text-white/90 mb-10 leading-relaxed">
//             Let us handle the logistics while you focus on creating memorable experiences with your group.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <a
//               href="#contact"
//               className="inline-block bg-white text-[#0f7bab] font-medium rounded-full px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
//             >
//               Contact Us
//             </a>
//             <a
//               href="#services"
//               className="inline-block bg-transparent text-white border border-white font-medium rounded-full px-8 py-3 hover:bg-white/10 transition-all duration-300"
//             >
//               Learn More
//             </a>
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   );
// }