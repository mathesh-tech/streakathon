"use client";

import { motion } from "framer-motion";
import { Users, Target, Rocket, Shield, BookOpen, Star } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-background pt-24 pb-20">
      {/* Header */}
      <section className="container max-w-screen-xl px-4 md:px-6 mb-16 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
        >
          About <span className="text-primary">STREAKATHON</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
        >
          The premier hackathon ecosystem designed to foster continuous innovation within the Information Technology Department of Sona College of Technology.
        </motion.p>
      </section>

      {/* Mission & Vision */}
      <section className="container max-w-screen-xl px-4 md:px-6 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-10 rounded-3xl"
          >
            <Target className="h-12 w-12 text-accent mb-6" />
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              To transform the traditional academic environment into a dynamic tech hub where students continuously build, break, and innovate. We aim to replace theoretical rote learning with hands-on, competitive software development.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-10 rounded-3xl"
          >
            <Shield className="h-12 w-12 text-primary mb-6" />
            <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              To create a department where every student graduates not just with a degree, but with a robust portfolio of real-world projects, verified skills, and the confidence to tackle global technological challenges.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Objectives */}
      <section className="bg-primary/5 py-24 mb-24 border-y border-black/5">
        <div className="container max-w-screen-xl px-4 md:px-6 text-center">
          <h2 className="text-4xl font-bold mb-12">Core Objectives</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Rocket, title: "Rapid Prototyping", desc: "Learn to build MVPs in under 12 hours." },
              { icon: Users, title: "Team Collaboration", desc: "Master the art of working in agile development teams." },
              { icon: BookOpen, title: "Skill Acquisition", desc: "Forced exploration of new frameworks and APIs." },
              { icon: Star, title: "Portfolio Building", desc: "Every hackathon submission is a resume booster." },
            ].map((obj, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-black/5 border border-black/10 flex items-center justify-center mb-4">
                  <obj.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{obj.title}</h3>
                <p className="text-sm text-muted-foreground">{obj.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
