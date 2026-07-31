"use client";

import { motion } from "framer-motion";
import { Send, MapPin, Phone, Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-background pt-24 pb-20">
      <section className="container max-w-screen-xl px-4 md:px-6">
        <h1 className="text-5xl font-bold tracking-tight mb-4">Contact Us</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mb-12">
          Have questions about the hackathon ecosystem? Reach out to the faculty coordinators or student ambassadors.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="glass-card p-8 rounded-3xl flex items-start gap-6">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Location</h3>
                <p className="text-muted-foreground">Information Technology Department<br />Sona College of Technology<br />Salem, Tamil Nadu 636005</p>
              </div>
            </div>

            <div className="glass-card p-8 rounded-3xl flex items-start gap-6">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
                <Mail className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Email</h3>
                <p className="text-muted-foreground">streakathon@sonatech.ac.in</p>
                <p className="text-muted-foreground">itdept@sonatech.ac.in</p>
              </div>
            </div>
            
            <div className="glass-card p-8 rounded-3xl flex items-start gap-6">
              <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center shrink-0">
                <Phone className="h-6 w-6 text-success" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Phone</h3>
                <p className="text-muted-foreground">+91 123 456 7890 (Dr. Faculty Name)</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <form className="glass-card p-8 rounded-3xl flex flex-col gap-6 h-full">
              <div>
                <label className="block text-sm font-semibold mb-2">Name</label>
                <input type="text" className="w-full bg-black/5 border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Register Number</label>
                <input type="text" className="w-full bg-black/5 border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors" placeholder="e.g. 732924205001" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Message</label>
                <textarea rows={5} className="w-full bg-black/5 border border-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none" placeholder="How can we help?"></textarea>
              </div>
              <button type="submit" className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center hover:bg-primary/90 transition-colors mt-auto">
                Send Message <Send className="ml-2 h-4 w-4" />
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
