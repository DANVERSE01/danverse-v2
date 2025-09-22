import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { 
  Palette, 
  Rocket, 
  Target, 
  Code, 
  Database, 
  GraduationCap,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import VideoBackground from './VideoBackground'
import desertWhaleVideo from '../assets/videos/desert_whale.mp4'

const ServicesSection = () => {
  const [hoveredService, setHoveredService] = useState(null)

  const services = [
    {
      icon: Palette,
      title: "Global Creative Designs",
      description: "Premium visual identity and design concepts that captivate and convert",
      features: [
        "Brand Identity Design",
        "Visual Concepts", 
        "Marketing Materials",
        "UI/UX Design"
      ],
      gradient: "from-pink-500 to-rose-500"
    },
    {
      icon: Rocket,
      title: "Brand Transformation", 
      description: "Complete brand evolution from strategy to execution",
      features: [
        "Brand Strategy",
        "Visual Rebrand",
        "Market Positioning", 
        "Brand Guidelines"
      ],
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      icon: Target,
      title: "End-to-End Campaigns",
      description: "From concept to execution - comprehensive campaign management",
      features: [
        "Campaign Strategy",
        "Creative Concepts",
        "Multi-Channel Execution",
        "Performance Analytics"
      ],
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Code,
      title: "Premium Web Development",
      description: "High-end landing pages and web experiences that convert",
      features: [
        "Custom Development",
        "Modern Animations", 
        "SEO Optimization",
        "Performance Focus"
      ],
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Database,
      title: "Full-Stack Solutions",
      description: "Complete web applications with integrated CRM and automation",
      features: [
        "Backend Development",
        "Database Design",
        "API Integration", 
        "Automation Systems"
      ],
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: GraduationCap,
      title: "DANVERSE Academy",
      description: "Master AI, e-commerce, and online business strategies",
      features: [
        "AI Mastery Courses",
        "E-commerce Training",
        "Business Strategy",
        "1-on-1 Mentoring"
      ],
      gradient: "from-violet-500 to-purple-500"
    }
  ]

  return (
    <section id="services" className="relative py-20">
      <VideoBackground 
        videoSrc={desertWhaleVideo}
        overlayOpacity={0.7}
      >
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-white/90 text-sm">Our Expertise</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-white">Transform Your </span>
              <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                Vision
              </span>
            </h2>
            
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              End-to-end solutions that accelerate your business into the future. 
              From design to development, strategy to execution.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon
              return (
                <div
                  key={index}
                  className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-white/20"
                  onMouseEnter={() => setHoveredService(index)}
                  onMouseLeave={() => setHoveredService(null)}
                >
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${service.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-white/70 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-8">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-white/60">
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button 
                    variant="outline" 
                    className="w-full border-white/20 text-white hover:bg-white/10 group-hover:border-cyan-400/50 transition-all"
                  >
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  {/* Hover Effect */}
                  {hoveredService === index && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-600/10 rounded-2xl pointer-events-none"></div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <h3 className="text-3xl font-bold text-white mb-6">
              Ready to Enter DANVERSE?
            </h3>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Let's discuss your project and create something extraordinary together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white border-0"
              >
                Start Your Project
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
              >
                View Portfolio
              </Button>
            </div>
          </div>
        </div>
      </VideoBackground>
    </section>
  )
}

export default ServicesSection
