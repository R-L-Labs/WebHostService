import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { CheckCircle, Sparkles } from 'lucide-react';
import { getPackages } from '../../lib/queries';
import { formatPrice } from '../../utils/helpers';
import { toast } from 'sonner';

export default function ServicesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const { packages, error } = await getPackages();
      if (error) throw error;
      setPackages(packages || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast.error('Failed to load service packages');
    } finally {
      setLoading(false);
    }
  };

  const FOUNDERS_DISCOUNT = 0.30;

  const getDiscountedPrice = (price) => {
    return Math.round(price * (1 - FOUNDERS_DISCOUNT) * 100) / 100;
  };

  const getPriceDisplay = (pkg) => {
    // Custom Website package shows "Contact for Quote"
    if (pkg.price === 0 || pkg.name.toLowerCase().includes('custom')) {
      return (
        <div className="text-2xl font-bold text-primary-600">
          Contact for Quote
        </div>
      );
    }

    const discountedPrice = getDiscountedPrice(pkg.price);
    const suffix = pkg.name.toLowerCase().includes('hosting') || pkg.name.toLowerCase().includes('maintenance')
      ? '/month'
      : ' one-time';

    const isMonthly = suffix === '/month';

    return (
      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-sm text-gray-500 font-medium">Starting at</span>
          <span className="text-lg text-gray-400 line-through">{formatPrice(pkg.price)}</span>
          <span className="text-4xl font-bold text-green-600">{formatPrice(discountedPrice)}</span>
          <span className="text-gray-600">{isMonthly ? '/first month' : suffix}</span>
        </div>
        <span className="inline-block mt-1 text-xs font-semibold text-white bg-orange-500 rounded-full px-2 py-0.5">
          SAVE {Math.round(FOUNDERS_DISCOUNT * 100)}%{isMonthly ? ' FIRST MONTH' : ''}
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container-custom section-padding">
        <div className="text-center">Loading services...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Our Services</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the perfect package for your business. All packages include mobile-responsive
            design and professional support.
          </p>
        </div>
      </section>

      {/* Discount Banner */}
      <section className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 py-6">
        <div className="container-custom text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Sparkles className="w-6 h-6 text-white" />
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-white">
              Spring Discount
            </h2>
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <p className="text-white/90 text-lg md:text-xl font-semibold">
            30% off your first month — limited spots available!
          </p>
          <p className="text-white/75 text-sm mt-1">
            Mention "SPRING" when you contact us to claim your discount.
          </p>
        </div>
      </section>

      {/* Packages */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <Card key={pkg.id} className="flex flex-col hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                  <CardDescription className="text-base">{pkg.description}</CardDescription>
                  <div className="mt-4">
                    {getPriceDisplay(pkg)}
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {pkg.features.map((feature, idx) => {
                      const isAddon = feature.includes('*');
                      return (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className={`text-sm ${isAddon ? 'text-gray-500 italic' : 'text-gray-700'}`}>
                            {feature}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link to="/contact">
                      {pkg.name.toLowerCase().includes('custom') ? 'Request Quote' : 'Get Started'}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Add-on note */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 italic">
              * Available as add-on service at additional cost
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 section-padding">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">Not sure which package is right for you?</h2>
          <p className="text-gray-600 mb-6">Contact us for a free consultation. We'll help you choose the perfect solution.</p>
          <Button asChild size="lg">
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
