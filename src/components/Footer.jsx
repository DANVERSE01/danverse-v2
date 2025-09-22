import { 
  MessageCircle, 
  Mail, 
  Instagram, 
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import VideoBackground from './VideoBackground'
import epicCityscapeVideo from '../assets/videos/epic_cityscape.mp4'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    services: [
      "Creative Studio",
      "API Platform", 
      "About Us"
    ],
    contact: [
      { icon: MessageCircle, text: "+20 1207346648", href: "#" },
      { icon: Mail, text: "danverseai@outlook.com", href: "mailto:danverseai@outlook.com" },
      { icon: Instagram, text: "@muhammedd_adel", href: "#" }
    ]
  }

  return (
    <footer className="relative">
      <VideoBackground 
        videoSrc={epicCityscapeVideo}
        overlayOpacity={0.8}
      >
        <div className="container mx-auto px-6 py-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-white/30"></div>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-400 rounded-full animate-pulse"></div>
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                  DANVERSE
                </span>
              </div>
              
              <p className="text-white/80 mb-6 leading-relaxed max-w-md">
                Transform your business through cutting-edge design, development, and strategic innovation. 
                Enter a parallel universe where your success accelerates.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white border-0"
                >
                  Start Your Project
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
                >
                  <Sparkles className="mr-2 w-4 h-4" />
                  Learn More
                </Button>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-white font-semibold text-lg mb-6">Services</h4>
              <ul className="space-y-3">
                {footerLinks.services.map((service, index) => (
                  <li key={index}>
                    <a 
                      href="#" 
                      className="text-white/70 hover:text-white transition-colors duration-200 flex items-center group"
                    >
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold text-lg mb-6">Contact</h4>
              <ul className="space-y-4">
                {footerLinks.contact.map((contact, index) => {
                  const IconComponent = contact.icon
                  return (
                    <li key={index}>
                      <a 
                        href={contact.href}
                        className="text-white/70 hover:text-white transition-colors duration-200 flex items-center group"
                      >
                        <IconComponent className="w-4 h-4 mr-3 text-cyan-400 group-hover:scale-110 transition-transform" />
                        {contact.text}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-white/60 text-sm mb-4 md:mb-0">
                © {currentYear} DANVERSE. All rights reserved.
              </p>
              
              <div className="flex items-center space-x-6">
                <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </VideoBackground>
    </footer>
  )
}

export default Footer
