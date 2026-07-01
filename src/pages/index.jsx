import Seo from "../components/Essential/Seo";
import Navbar from "../components/Essential/Navbar";
import Footer from "../components/Essential/Footer";
import Hero from "../components/Home/Hero";
import ProblemSolution from "../components/Home/ProblemSolution";
import Demo from "../components/Home/Demo";
import Demo2 from "../components/Home/Demo2";
import FinalCTA from "../components/Home/FinalCTA";
import Link from "next/link";
import Solution from "@/components/Home/Solution";
import Impact from "@/components/Home/Impact";
import Positioning from "@/components/Home/Positioning";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-white font-sans overflow-x-hidden scroll-smooth selection:bg-cyan-500 selection:text-slate-950">
      <Seo />

      <Navbar />

      <main className="pt-20">
        {" "}
        {/* Padding to account for fixed navbar */}
        <Hero />
        <ProblemSolution />
        <Solution />
        <Demo />
        <Impact />
        <Positioning />
        <Demo2 />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}
