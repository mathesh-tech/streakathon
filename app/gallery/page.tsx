"use client";

import { motion } from "framer-motion";

export default function GalleryPage() {
  // Generate mock heights for a masonry-like grid effect
  const items = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    height: i % 3 === 0 ? "h-64" : i % 2 === 0 ? "h-96" : "h-72",
  }));

  return (
    <div className="flex flex-col min-h-screen w-full bg-background pt-24 pb-20">
      <section className="container max-w-screen-xl px-4 md:px-6">
        <h1 className="text-5xl font-bold tracking-tight mb-4">Gallery</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mb-12">
          Moments captured from previous hackathons. Witness the innovation and collaboration of our students.
        </p>

        {/* CSS Masonry Grid implementation */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {items.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.1 }}
              className={`w-full bg-black/5 border border-black/10 rounded-2xl overflow-hidden break-inside-avoid relative group ${item.height}`}
            >
              {/* Image Placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 group-hover:scale-105 transition-transform duration-700"></div>
              
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="font-bold text-foreground">Streakathon #{(i % 10) + 1}</p>
                <p className="text-xs text-black/70">Semester {Math.floor(i / 2) % 5 + 1}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
