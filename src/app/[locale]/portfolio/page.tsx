import { useTranslations } from 'next-intl';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio | DANVERSE Digital Solutions',
  description: 'Explore our portfolio of successful digital projects, case studies, and innovative solutions.',
};

export default function PortfolioPage() {
  const t = useTranslations('portfolio');
  const tCommon = useTranslations('common');

  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform Transformation",
      category: "webDev",
      image: "/api/placeholder/600/400",
      description: "Complete digital transformation of a retail business with modern e-commerce platform, resulting in 300% increase in online sales.",
      technologies: ["Next.js", "Supabase", "Stripe", "Tailwind CSS"],
      results: ["300% increase in sales", "50% faster load times", "95% customer satisfaction"],
      featured: true
    },
    {
      id: 2,
      title: "Global Brand Identity Redesign",
      category: "branding",
      image: "/api/placeholder/600/400",
      description: "Comprehensive brand transformation for international tech company, creating cohesive identity across 15 markets.",
      technologies: ["Adobe Creative Suite", "Figma", "Brand Guidelines"],
      results: ["40% brand recognition increase", "Unified global presence", "Award-winning design"],
      featured: true
    },
    {
      id: 3,
      title: "Digital Marketing Campaign Success",
      category: "campaigns",
      image: "/api/placeholder/600/400",
      description: "Multi-channel marketing campaign that generated exceptional ROI and brand awareness for startup launch.",
      technologies: ["Google Ads", "Facebook Ads", "Analytics", "CRM Integration"],
      results: ["500% ROI", "1M+ impressions", "25% conversion rate"],
      featured: false
    },
    {
      id: 4,
      title: "Corporate Training Platform",
      category: "academy",
      image: "/api/placeholder/600/400",
      description: "Custom learning management system for enterprise client with advanced analytics and certification tracking.",
      technologies: ["React", "Node.js", "MongoDB", "Video Streaming"],
      results: ["10,000+ users trained", "90% completion rate", "Industry certification"],
      featured: false
    },
    {
      id: 5,
      title: "SaaS Application Development",
      category: "webDev",
      image: "/api/placeholder/600/400",
      description: "Full-stack SaaS platform with advanced features, real-time collaboration, and enterprise-grade security.",
      technologies: ["React", "Node.js", "PostgreSQL", "AWS"],
      results: ["1000+ active users", "99.9% uptime", "Enterprise clients"],
      featured: false
    },
    {
      id: 6,
      title: "Startup Brand Launch",
      category: "branding",
      image: "/api/placeholder/600/400",
      description: "Complete brand creation and market launch strategy for innovative fintech startup.",
      technologies: ["Brand Strategy", "Logo Design", "Marketing Materials"],
      results: ["Successful funding round", "Market recognition", "Media coverage"],
      featured: false
    }
  ];

  const categories = [
    { key: 'all', icon: '🎯' },
    { key: 'webDev', icon: '💻' },
    { key: 'branding', icon: '🎨' },
    { key: 'campaigns', icon: '📈' },
    { key: 'academy', icon: '🎓' }
  ];

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cosmic-purple/20 via-cosmic-blue/10 to-cosmic-cyan/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,119,198,0.2),transparent_50%)]"></div>
        
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cosmic-purple via-cosmic-blue to-cosmic-cyan bg-clip-text text-transparent">
            {t('title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
          <p className="text-lg text-gray-400 max-w-4xl mx-auto leading-relaxed">
            {t('description')}
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.key}
                className="group px-6 py-3 bg-dark-900/50 backdrop-blur-sm border border-cosmic-purple/20 rounded-xl hover:border-cosmic-purple/40 transition-all duration-300 hover:transform hover:scale-105"
              >
                <span className="text-2xl mr-2">{category.icon}</span>
                <span className="text-white font-medium">{t(`categories.${category.key}`)}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center bg-gradient-to-r from-cosmic-purple via-cosmic-blue to-cosmic-cyan bg-clip-text text-transparent">
            {t('projects.featured')}
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {projects.filter(project => project.featured).map((project) => (
              <div key={project.id} className="group">
                <div className="bg-dark-900/50 backdrop-blur-sm border border-cosmic-purple/20 rounded-2xl overflow-hidden hover:border-cosmic-purple/40 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="aspect-video bg-gradient-to-br from-cosmic-purple/20 to-cosmic-blue/20 flex items-center justify-center">
                    <div className="text-6xl opacity-50">🚀</div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 bg-cosmic-purple/20 text-cosmic-purple rounded-full text-sm font-medium">
                        {t(`categories.${project.category}`)}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-cosmic-purple transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      {project.description}
                    </p>
                    
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-cosmic-cyan mb-2">{t('projects.technologies')}</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, index) => (
                          <span key={index} className="px-2 py-1 bg-dark-800 text-gray-300 rounded text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-neon-green mb-2">{t('projects.results')}</h4>
                      <ul className="space-y-1">
                        {project.results.map((result, index) => (
                          <li key={index} className="text-sm text-gray-300 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-neon-green rounded-full"></span>
                            {result}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-4">
                      <button className="flex-1 px-4 py-2 bg-gradient-to-r from-cosmic-purple to-cosmic-blue rounded-lg text-white font-medium hover:from-cosmic-purple/80 hover:to-cosmic-blue/80 transition-all duration-300">
                        {t('projects.viewProject')}
                      </button>
                      <button className="px-4 py-2 border border-cosmic-cyan text-cosmic-cyan rounded-lg hover:bg-cosmic-cyan hover:text-dark-950 transition-all duration-300">
                        {t('projects.liveDemo')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Projects Grid */}
      <section className="py-12 px-4 bg-dark-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center bg-gradient-to-r from-cosmic-purple via-cosmic-blue to-cosmic-cyan bg-clip-text text-transparent">
            {t('projects.recent')}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.filter(project => !project.featured).map((project) => (
              <div key={project.id} className="group">
                <div className="bg-dark-900/50 backdrop-blur-sm border border-cosmic-purple/20 rounded-2xl overflow-hidden hover:border-cosmic-purple/40 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="aspect-video bg-gradient-to-br from-cosmic-purple/20 to-cosmic-blue/20 flex items-center justify-center">
                    <div className="text-4xl opacity-50">💼</div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-cosmic-purple/20 text-cosmic-purple rounded-full text-xs font-medium">
                        {t(`categories.${project.category}`)}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-cosmic-purple transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                      {project.description}
                    </p>
                    
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 3).map((tech, index) => (
                          <span key={index} className="px-2 py-1 bg-dark-800 text-gray-400 rounded text-xs">
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="px-2 py-1 bg-dark-800 text-gray-400 rounded text-xs">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    <button className="w-full px-4 py-2 bg-gradient-to-r from-cosmic-purple to-cosmic-blue rounded-lg text-white text-sm font-medium hover:from-cosmic-purple/80 hover:to-cosmic-blue/80 transition-all duration-300">
                      {t('projects.viewProject')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-cosmic-purple via-cosmic-blue to-cosmic-cyan bg-clip-text text-transparent">
            {t('caseStudies.title')}
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            {t('caseStudies.subtitle')}
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-cosmic-purple to-cosmic-blue rounded-xl text-white font-semibold hover:from-cosmic-purple/80 hover:to-cosmic-blue/80 transition-all duration-300 hover:transform hover:scale-105">
            {t('caseStudies.viewCase')}
          </button>
        </div>
      </section>
    </div>
  );
}

