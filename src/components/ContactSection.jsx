import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { 
  MessageCircle, 
  Mail, 
  Instagram, 
  Clock, 
  Globe, 
  Languages,
  Calendar,
  Send,
  Sparkles
} from 'lucide-react'
import VideoBackground from './VideoBackground'
import flowerGirlVideo from '../assets/videos/flower_girl.mp4'

const ContactSection = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    budget: '',
    details: ''
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  const contactInfo = [
    {
      icon: MessageCircle,
      title: "WhatsApp & Telegram",
      value: "+20 1207346648 (Text only)",
      action: "Message",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Mail,
      title: "Email",
      value: "danverseai@outlook.com",
      action: "Email",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Instagram,
      title: "Instagram",
      value: "@muhammedd_adel",
      action: "Follow",
      gradient: "from-pink-500 to-purple-500"
    }
  ]

  const businessInfo = [
    {
      icon: Globe,
      title: "Time Zone",
      value: "UTC+2 (Cairo)"
    },
    {
      icon: Clock,
      title: "Response Time",
      value: "Within 24 hours"
    },
    {
      icon: Languages,
      title: "Languages",
      value: "English, Arabic"
    },
    {
      icon: Calendar,
      title: "Project Start",
      value: "Same week"
    }
  ]

  return (
    <section id="contact" className="relative py-20">
      <VideoBackground 
        videoSrc={flowerGirlVideo}
        overlayOpacity={0.7}
      >
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-white/90 text-sm">Get In Touch</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-white">Start Your </span>
              <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                Journey
              </span>
            </h2>
            
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Ready to transform your business? Let's discuss your project and create 
              something extraordinary together.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">Let's Connect</h3>
              <p className="text-white/80 mb-8 leading-relaxed">
                Whether you're looking for a complete brand transformation, cutting-edge web development, 
                or strategic business growth, I'm here to help you enter the DANVERSE.
              </p>

              {/* Contact Methods */}
              <div className="space-y-6 mb-8">
                {contactInfo.map((contact, index) => {
                  const IconComponent = contact.icon
                  return (
                    <div
                      key={index}
                      className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${contact.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{contact.title}</h4>
                            <p className="text-white/70">{contact.value}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white border-0"
                        >
                          {contact.action}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Business Info */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <h4 className="text-white font-semibold mb-4">Global Availability</h4>
                <div className="grid grid-cols-2 gap-4">
                  {businessInfo.map((info, index) => {
                    const IconComponent = info.icon
                    return (
                      <div key={index} className="flex items-center space-x-3">
                        <IconComponent className="w-5 h-5 text-cyan-400" />
                        <div>
                          <p className="text-white/60 text-sm">{info.title}</p>
                          <p className="text-white text-sm font-medium">{info.value}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="company"
                      placeholder="Company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-colors"
                      required
                    >
                      <option value="" className="bg-slate-800">Service Needed</option>
                      <option value="design" className="bg-slate-800">Creative Design</option>
                      <option value="branding" className="bg-slate-800">Brand Transformation</option>
                      <option value="campaigns" className="bg-slate-800">Marketing Campaigns</option>
                      <option value="web" className="bg-slate-800">Web Development</option>
                      <option value="fullstack" className="bg-slate-800">Full-Stack Solutions</option>
                      <option value="academy" className="bg-slate-800">DANVERSE Academy</option>
                    </select>
                  </div>
                  <div>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-colors"
                    >
                      <option value="" className="bg-slate-800">Budget Range</option>
                      <option value="5k-10k" className="bg-slate-800">$5k - $10k</option>
                      <option value="10k-25k" className="bg-slate-800">$10k - $25k</option>
                      <option value="25k-50k" className="bg-slate-800">$25k - $50k</option>
                      <option value="50k+" className="bg-slate-800">$50k+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <textarea
                    name="details"
                    placeholder="Project Details"
                    value={formData.details}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                    required
                  ></textarea>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white border-0"
                >
                  Send Message
                  <Send className="ml-2 w-5 h-5" />
                </Button>
              </form>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Business?
            </h3>
            <p className="text-white/80 mb-6">
              Join hundreds of successful businesses that have accelerated their growth with DANVERSE.
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white border-0"
            >
              Schedule a Free Consultation
              <Calendar className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </VideoBackground>
    </section>
  )
}

export default ContactSection
