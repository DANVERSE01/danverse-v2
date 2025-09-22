import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { ExternalLink, TrendingUp, Users, Eye, Sparkles } from 'lucide-react'
import VideoBackground from './VideoBackground'
import starfighterVideo from '../assets/videos/starfighter_rain.mp4'

const PortfolioSection = () => {
  const [activeFilter, setActiveFilter] = useState('All')
  const [hoveredProject, setHoveredProject] = useState(null)

  const filters = ['All', 'E-commerce', 'Branding', 'Marketing', 'Development', 'Advertising']

  const projects = [
    {
      id: 1,
      title: "Luxury Apparel Launch",
      client: "UAE Fashion Brand",
      category: "E-commerce",
      year: "2024",
      description: "Complete e-commerce platform for premium fashion brand with seamless UX and high conversion rates.",
      tags: ["E-commerce", "UI/UX", "Full-Stack"],
      metrics: {
        growth: "150%",
        visitors: "10k",
        cvr: "3.2%"
      },
      image: "/api/placeholder/600/400",
      gradient: "from-pink-500 to-rose-500"
    },
    {
      id: 2,
      title: "Cozy Café Rebrand",
      client: "Egyptian Café Chain",
      category: "Branding",
      year: "2024",
      description: "Visual identity transformation for café chain, boosting brand recognition and customer engagement.",
      tags: ["Branding", "Design", "Strategy"],
      metrics: {
        growth: "30%",
        visitors: "5k",
        cvr: "2.8%"
      },
      image: "/api/placeholder/600/400",
      gradient: "from-amber-500 to-orange-500"
    },
    {
      id: 3,
      title: "Agency Campaign Overhaul",
      client: "Saudi Marketing Agency",
      category: "Marketing",
      year: "2023",
      description: "End-to-end digital strategy and campaign management resulting in improved client retention.",
      tags: ["Marketing", "Strategy", "Campaigns"],
      metrics: {
        growth: "75%",
        visitors: "25k",
        cvr: "4.1%"
      },
      image: "/api/placeholder/600/400",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      id: 4,
      title: "Global Dropship Platform",
      client: "International E-commerce",
      category: "Development",
      year: "2023",
      description: "Scalable dropshipping platform with automated integrations and advanced analytics.",
      tags: ["Development", "Automation", "Scale"],
      metrics: {
        growth: "200%",
        visitors: "100k",
        cvr: "2.1%"
      },
      image: "/api/placeholder/600/400",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      id: 5,
      title: "UAE Coffee Ad Campaign",
      client: "Coffee Brand UAE",
      category: "Advertising",
      year: "2023",
      description: "Multi-channel advertising campaign achieving viral reach and exceptional engagement rates.",
      tags: ["Advertising", "Video", "Social"],
      metrics: {
        growth: "300%",
        visitors: "500k",
        cvr: "1.8%"
      },
      image: "/api/placeholder/600/400",
      gradient: "from-purple-500 to-violet-500"
    },
    {
      id: 6,
      title: "Tech Startup Branding",
      client: "FinTech Startup",
      category: "Branding",
      year: "2024",
      description: "Complete brand identity and digital presence for emerging financial technology company.",
      tags: ["Branding", "FinTech", "Startup"],
      metrics: {
        growth: "180%",
        visitors: "15k",
        cvr: "5.2%"
      },
      image: "/api/placeholder/600/400",
      gradient: "from-indigo-500 to-purple-500"
    }
  ]

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(project => project.category === activeFilter)

  return (
    <section id="portfolio" className="relative py-20">
      <VideoBackground 
        videoSrc={starfighterVideo}
        overlayOpacity={0.8}
      >
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-white/90 text-sm">Our Work</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-white">Success </span>
              <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                Stories
              </span>
            </h2>
            
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Real projects, real results. See how we've transformed businesses across industries 
              with innovative solutions.
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                className={`${
                  activeFilter === filter
                    ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white border-0"
                    : "border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
                } transition-all duration-300`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </Button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-white/20"
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                {/* Project Image */}
                <div className="relative h-48 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-20`}></div>
                  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-white">
                    {project.year}
                  </div>
                  <div className="absolute top-4 right-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6">
                  {/* Category & Client */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-cyan-400 text-sm font-medium">{project.category}</span>
                    <span className="text-white/60 text-sm">{project.client}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-white/70 text-sm mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-white/10 text-white/80 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                        <span className="text-green-400 font-bold text-lg">{project.metrics.growth}</span>
                      </div>
                      <span className="text-white/60 text-xs">Growth</span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Eye className="w-4 h-4 text-blue-400 mr-1" />
                        <span className="text-blue-400 font-bold text-lg">{project.metrics.visitors}</span>
                      </div>
                      <span className="text-white/60 text-xs">Visitors</span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Users className="w-4 h-4 text-purple-400 mr-1" />
                        <span className="text-purple-400 font-bold text-lg">{project.metrics.cvr}</span>
                      </div>
                      <span className="text-white/60 text-xs">CVR</span>
                    </div>
                  </div>
                </div>

                {/* Hover Effect */}
                {hoveredProject === project.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-600/10 pointer-events-none"></div>
                )}
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
            >
              View All Case Studies
              <ExternalLink className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </VideoBackground>
    </section>
  )
}

export default PortfolioSection
