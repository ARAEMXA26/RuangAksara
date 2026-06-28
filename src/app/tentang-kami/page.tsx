"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen, BrainCircuit, Target, Lightbulb, Sparkles, Shield, Cpu, Compass } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

export default function TentangKamiPage() {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-primary selection:text-white">


      {/* Hero Section */}
      <section className="relative pt-44 pb-20 overflow-hidden bg-white border-b border-slate-100">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl -z-10" />
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-indigo-300/10 rounded-full blur-3xl -z-10 -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <AnimatedSection>
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 font-bold text-xs uppercase tracking-wider mb-8 border border-blue-100">
                Mengenal Lebih Dekat
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
                Ruang <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Aksara</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto font-normal">
                Evolusi perpustakaan cerdas berbasis AI yang dirancang untuk mendukung penelitian akademik 
                dan mempermudah pencarian pengetahuan secara presisi, terstruktur, dan adaptif.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Apa itu Ruang Aksara Section */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Column: Image with decoration */}
            <div className="lg:col-span-5">
              <AnimatedSection animation="fade-up" delay={0.1}>
                <div className="relative p-3 bg-slate-100 rounded-[32px] border border-slate-200/60 shadow-xl group">
                  <div className="relative rounded-[24px] overflow-hidden aspect-[4/3] sm:aspect-square md:aspect-[4/3] lg:aspect-square">
                    <Image 
                      src="/library-hero.png" 
                      alt="Perpustakaan Cerdas" 
                      fill
                      className="object-cover transform transition-transform duration-700 group-hover:scale-105"
                      priority
                    />
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* Right Column: Text & Features */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <AnimatedSection animation="fade-left" delay={0.2}>
                <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-5 border border-indigo-100">
                  Platform Cerdas
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                  Perpustakaan Cerdas Berbasis AI
                </h2>
                <div className="space-y-6 text-slate-600 leading-relaxed text-base md:text-lg">
                  <p>
                    <strong>Ruang Aksara</strong> merupakan pionir <em>Knowledge Management System</em> (KMS) 
                    akademik yang mengintegrasikan kecerdasan buatan untuk merombak cara sivitas akademika menemukan, 
                    mengelola, dan memanfaatkan literatur ilmiah.
                  </p>
                  <p>
                    Dengan algoritma pemrosesan bahasa alami (NLP), platform ini tidak sekadar mencari kecocokan kata kunci, 
                    melainkan menganalisis konteks semantik dari pertanyaan peneliti, menyajikan hasil pencarian yang relevan, 
                    serta mendukung alur kerja penelitian yang lebih efisien.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 mt-10">
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/10 transition-all duration-300">
                    <BrainCircuit className="w-8 h-8 text-primary mb-4" />
                    <h3 className="font-bold text-slate-900 text-lg mb-2">Pencarian Semantik</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">Pencarian cerdas yang memahami maksud dan konteks riset Anda secara kontekstual.</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/10 transition-all duration-300">
                    <BookOpen className="w-8 h-8 text-primary mb-4" />
                    <h3 className="font-bold text-slate-900 text-lg mb-2">Knowledge System</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">Repositori data ilmiah tersentralisasi yang mempermudah pelacakan dokumen akademik.</p>
                  </div>
                </div>
              </AnimatedSection>
            </div>
            
          </div>
        </div>
      </section>

      {/* Filosofi Logo Section */}
      <section className="py-28 bg-slate-950 text-white relative overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[120px] -z-0" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] -z-0" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <AnimatedSection>
            <div className="text-center mb-20">
              <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white/5 text-slate-300 font-bold text-xs uppercase tracking-wider mb-5 border border-white/10">
                Identitas Visual
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Filosofi Logo</h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
                Setiap detail visual dirancang untuk merepresentasikan visi kami dalam mengalirkan dan menjaga kemurnian ilmu pengetahuan.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid lg:grid-cols-12 gap-16 items-center">
            {/* Logo Image in Dark Glass Box */}
            <div className="lg:col-span-5 flex justify-center">
              <AnimatedSection animation="fade-up" delay={0.2} className="w-full max-w-md">
                <div className="relative w-full aspect-square bg-white/5 border border-white/10 rounded-[40px] p-12 backdrop-blur-xl flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                  <div className="relative w-full h-full">
                    <Image 
                      src="/logo-ra.png" 
                      alt="Logo Ruang Aksara" 
                      fill
                      className="object-contain filter drop-shadow-[0_10px_20px_rgba(255,255,255,0.05)]"
                      priority
                    />
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* Logo Details */}
            <div className="lg:col-span-7">
              <AnimatedSection animation="fade-left" delay={0.4}>
                <div className="space-y-8">
                  
                  <div className="flex gap-5 items-start">
                    <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl font-black text-blue-400 shadow-md">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 tracking-wide">Ruang (Wadah Pengetahuan)</h3>
                      <p className="text-slate-400 leading-relaxed text-sm md:text-base">
                        Melambangkan ekosistem akademik yang kokoh, terstruktur, aman, dan inklusif bagi seluruh pencari ilmu untuk berkolaborasi dan melakukan eksplorasi referensi ilmiah.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-5 items-start">
                    <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl font-black text-blue-400 shadow-md">
                      2
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 tracking-wide">Aksara (Penyimpanan Literatur)</h3>
                      <p className="text-slate-400 leading-relaxed text-sm md:text-base">
                        Representasi dari simbol penulisan, bahasa, dan data ilmiah yang tersimpan rapi secara digital. Menjaga orisinalitas dan kredibilitas karya tulis ilmiah.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-5 items-start">
                    <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl font-black text-blue-400 shadow-md">
                      3
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 tracking-wide">Kecerdasan Buatan (AI Integration)</h3>
                      <p className="text-slate-400 leading-relaxed text-sm md:text-base">
                        Simbol dari integrasi teknologi AI yang dinamis, memproses aliran data besar untuk memberikan wawasan informasi yang cepat, akurat, dan relevan sesuai kebutuhan pengguna.
                      </p>
                    </div>
                  </div>

                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Visi & Misi Section */}
      <section id="visi-misi" className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Visi Card */}
          <AnimatedSection>
            <div className="bg-white rounded-[40px] p-8 md:p-16 shadow-xl border border-slate-100 text-center relative overflow-hidden mb-20 max-w-5xl mx-auto">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-blue-400 to-primary" />
              <Target className="w-14 h-14 text-primary mx-auto mb-6 opacity-90" />
              <h2 className="text-xs font-bold text-primary tracking-widest uppercase mb-4">Visi Kami</h2>
              <p className="text-2xl md:text-3xl font-extrabold text-slate-800 leading-snug max-w-4xl mx-auto tracking-tight">
                "Menjadi platform repositori akademik dan perpustakaan digital terdepan di Indonesia yang mengintegrasikan Artificial Intelligence untuk memajukan kualitas riset dan pendidikan."
              </p>
            </div>
          </AnimatedSection>

          {/* Misi Section */}
          <AnimatedSection delay={0.2}>
            <div className="text-center mb-16">
              <h2 className="text-xs font-bold text-primary tracking-widest uppercase mb-3">Misi Kami</h2>
              <h3 className="text-3xl font-extrabold text-slate-900">Langkah Nyata Mencapai Visi</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <BrainCircuit size={28} />,
                  title: "Inovasi AI & Semantik",
                  desc: "Terus mengembangkan algoritma semantic search dan machine learning untuk memberikan pengalaman pencarian referensi ilmiah yang paling intuitif."
                },
                {
                  icon: <BookOpen size={28} />,
                  title: "Aksesibilitas Data",
                  desc: "Menyediakan akses mudah, cepat, dan terorganisir ke ribuan jurnal, tesis, dan repositori akademik bagi komunitas ilmiah."
                },
                {
                  icon: <Lightbulb size={28} />,
                  title: "Ekosistem Kolaboratif",
                  desc: "Membangun sistem manajemen pengetahuan (KMS) yang mendukung kolaborasi riset dan menghasilkan wawasan inovatif."
                }
              ].map((misi, idx) => (
                <div 
                  key={idx} 
                  className="bg-white rounded-[32px] p-8 shadow-lg hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-slate-100 group flex flex-col"
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-center justify-center text-primary mb-6 transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                    {misi.icon}
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-4">{misi.title}</h4>
                  <p className="text-slate-600 leading-relaxed text-sm md:text-base flex-grow">{misi.desc}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 text-center px-6 bg-slate-50">
        <AnimatedSection className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight text-slate-900">Siap Menjelajahi Ruang Aksara?</h2>
          <p className="text-base md:text-lg text-slate-600 mb-10 max-w-xl mx-auto font-normal leading-relaxed">
            Mulailah riset Anda hari ini dengan pencarian referensi yang didukung penuh oleh kecerdasan buatan.
          </p>
          <Link 
            href="/search" 
            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold bg-primary text-white rounded-full hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Mulai Pencarian Sekarang
          </Link>
        </AnimatedSection>
      </section>
    </div>
  );
}
