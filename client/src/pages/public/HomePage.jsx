import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { CheckCircle, ExternalLink, Globe, Headphones, Quote, Star, Zap } from 'lucide-react';

export default function HomePage() {
  const services = [
    {
      icon: <Globe className="w-8 h-8 text-primary-600" />,
      title: 'Professional Websites',
      description: 'Beautiful, mobile-responsive websites designed for small businesses. From basic to fully custom solutions.',
    },
    {
      icon: <Zap className="w-8 h-8 text-primary-600" />,
      title: 'High Performance',
      description: 'Lightning-fast sites with 90+ Google PageSpeed scores. Your customers won\'t be kept waiting.',
    },
    {
      icon: <Headphones className="w-8 h-8 text-primary-600" />,
      title: 'Ongoing Support',
      description: 'Priority email support and unlimited content updates with our hosting packages.',
    },
  ];

  const testimonials = [
    // {
    //   name: 'Sarah M.',
    //   business: 'Local Bakery Owner',
    //   quote: 'SiteKeeper made getting online so easy. I went from no website to a beautiful, professional page in less than a week. My customers love it!',
    //   rating: 5,
    // },
    // {
    //   name: 'James R.',
    //   business: 'Landscaping Company',
    //   quote: 'The ongoing support is what sets them apart. Whenever I need something updated, it gets done fast. Worth every penny.',
    //   rating: 5,
    // },
    // {
    //   name: 'Maria L.',
    //   business: 'Boutique Retail Shop',
    //   quote: 'I was paying way too much for a website that barely worked on mobile. SiteKeeper rebuilt it and now my site loads instantly on any device.',
    //   rating: 5,
    // },
  ];

  const portfolio = [
    {
      title: 'GreenScapes Landscaping & Construction',
      category: 'Landscaping & Construction',
      description: 'Professional site with project gallery and quote request system. This site has links for the client\'s social media and contact forms for customers to easily get in touch.',
      image: '/our_work/greenscapes_screenshot2.png',
    },
    {
      title: 'LabelSnap Label Printer Formatter',
      category: 'Software & SaaS',
      description: 'Clean, modern site with product features, pricing, and contact form. This site has a custom design that highlights the client\'s software product and makes it easy for potential customers to learn about the features and get in touch.',
      image: '/our_work/labelsnap_screenshot.png',
    },{
      title: 'R&L Labs LLC Website',
      category: 'Software & Web Development',
      description: 'Custom website for our LLC. This site features a clean, modern design with sections for services, portfolio, and contact information. It\'s designed to showcase our expertise and make it easy for potential clients to get in touch.',
      image: '/our_work/rllabs_screenshot.png',
    },
  ];

  const features = [
    'Mobile-Responsive Design',
    'High Performance Sites (90+ PageSpeed)',
    'Professional Email Support',
    'Content Updates & Maintenance',
    'Domain & DNS Setup',
    'Social Media Integration',
    'Google Maps Integration',
    'Contact Form Setup',
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-gray-900 mb-6">
              Professional Websites for{' '}
              <span className="text-primary-600">Small Businesses</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Get a beautiful, professional website without the tech headaches. Perfect for
              restaurants, shops, and service businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/services">View Our Services</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Get a Free Quote</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Why Choose SiteKeeper?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We specialize in helping small businesses get online quickly and affordably.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border-none shadow-lg animate-slide-up">
                <CardHeader>
                  <div className="mb-4">{service.icon}</div>
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                Everything You Need to Succeed Online
              </h2>
              <p className="text-gray-600 mb-8">
                SiteKeeper provides all the essential features your small business needs to succeed
                online. From lightning-fast performance to seamless integrations, we've got you covered.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
                <Globe className="w-32 h-32 text-primary-600/20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Our Work
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Take a look at some of the sites we've built for small businesses just like yours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {portfolio.map((project, index) => (
              <Card key={index} className="group overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                <div className="overflow-hidden">
                  {project.image ? (
                    <img src={project.image} alt={project.title} className="aspect-video w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center group-hover:from-primary-200 group-hover:to-secondary-200 transition-colors duration-300">
                      <Globe className="w-16 h-16 text-primary-600/20 group-hover:text-primary-600/40 transition-colors duration-300" />
                    </div>
                  )}
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg group-hover:text-primary-600 transition-colors duration-300">{project.title}</CardTitle>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors duration-300" />
                  </div>
                  <span className="text-xs font-medium text-primary-600 bg-primary-50 rounded-full px-2 py-0.5 w-fit">
                    {project.category}
                  </span>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              What Our Clients Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it — hear from the businesses we've helped.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-none shadow-lg">
                <CardContent className="pt-6">
                  <Quote className="w-8 h-8 text-primary-600/30 mb-4" />
                  <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.business}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>}

      {/* CTA Section */}
      <section className="section-padding bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            Join dozens of small businesses who trust us with their online presence. Get your
            professional website today.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link to="/contact">Contact Us Today</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
