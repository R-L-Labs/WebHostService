import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { CheckCircle } from 'lucide-react';
import { packagesAPI } from '../../utils/api';
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
      const { data } = await packagesAPI.getAll();
      setPackages(data.data.packages || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast.error('Failed to load service packages');
    } finally {
      setLoading(false);
    }
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

      {/* Packages */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <Card key={pkg.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                  <CardDescription>{pkg.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{formatPrice(pkg.price)}</span>
                    {pkg.name.includes('Hosting') ? (
                      <span className="text-gray-600">/month</span>
                    ) : (
                      <span className="text-gray-600"> one-time</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link to="/contact">Get Started</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
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
