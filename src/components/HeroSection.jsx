import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { ArrowRight, Sparkles } from 'lucide-react'
import VideoBackground from './VideoBackground'
import cyberpunkVideo from '../assets/videos/cyberpunk_woman.mp4'

const HeroSection = () => {
  const [currentText, setCurrentText] = useState(0)
  
  const heroTexts = [
    "Enter DANVERSE",
    "Transform Your Vision", 
    "Accelerate Your Success"
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % heroTexts.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center">
      <VideoBackground 
        videoSrc={cyberpunkVideo}
        className="min-h-screen"
        overlayOpacity={0.5}
      >
        <div className="container mx-auto px-6 text-center">
          {/* Welcome Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-white/90 text-sm">Welcome to the Future</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="text-white">Enter </span>
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
              DANVERSE
            </span>
          </h1>

          {/* Animated Subheading */}
          <div className="h-16 mb-8">
            <h2 className="text-xl md:text-2xl lg:text-3xl text-white/90 font-light animate-fade-in">
              Where Innovation Accelerates Your Success
            </h2>
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-12 leading-relaxed">
            Step into a faster, smarter parallel universe that transforms people and businesses 
            through cutting-edge design, development, and strategic innovation.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white border-0 px-8 py-4 text-lg group"
            >
              Start Your Transformation
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 text-lg"
            >
              <Sparkles className="mr-2 w-5 h-5" />
              Explore Services
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: "100+", label: "Projects Delivered" },
              { number: "50+", label: "Happy Clients" },
              { number: "200%", label: "Avg ROI Increase" },
              { number: "24/7", label: "Innovation Lab" }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                  {stat.number}
                </div>
                <div className="text-white/70 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </VideoBackground>
    </section>
  )
}

export default HeroSection
