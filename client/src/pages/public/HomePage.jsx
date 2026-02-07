import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { CheckCircle, Globe, Headphones, Zap } from 'lucide-react';

export default function HomePage() {
  const services = [
    {
      icon: <Globe className="w-8 h-8 text-primary-600" />,
      title: 'Web Design',
      description: 'Beautiful, mobile-responsive websites tailored to your business needs.',
    },
    {
      icon: <Zap className="w-8 h-8 text-primary-600" />,
      title: 'Fast & Reliable',
      description: 'Lightning-fast loading speeds and 99.9% uptime guarantee.',
    },
    {
      icon: <Headphones className="w-8 h-8 text-primary-600" />,
      title: '24/7 Support',
      description: 'Expert support whenever you need it. We\'re here to help you succeed.',
    },
  ];

  const features = [
    'Mobile-First Design',
    'SEO Optimization',
    'Secure Hosting',
    'Regular Backups',
    'Unlimited Updates',
    'Free SSL Certificate',
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
                Our websites come packed with features designed to help your business grow. No
                hidden fees, no surprises - just everything you need to establish your online
                presence.
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
