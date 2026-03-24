import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { contactFormSchema } from '../../utils/validators';
import { getPackages, submitInquiry } from '../../lib/queries';
import { toast } from 'sonner';
import { Mail } from 'lucide-react';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const [packages, setPackages] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [addonOtherText, setAddonOtherText] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(contactFormSchema),
  });

  const ADDITIONAL_SERVICES = [
    { name: 'Instagram Gallery', price: '+$15/month', description: 'Display your Instagram feed on your site' },
    { name: 'Jobber Form', price: 'Free', description: 'Embed your existing Jobber booking form' },
    { name: 'Facebook Reviews', price: 'Contact for pricing', description: 'Show your Facebook reviews on your site' },
    { name: 'Other', price: '', description: 'Have something else in mind? Let us know' },
  ];

  const togglePackage = (packageName) => {
    setSelectedPackages(prev => {
      const newSelection = prev.includes(packageName)
        ? prev.filter(p => p !== packageName)
        : [...prev, packageName];

      // Update the form value
      setValue('interestedPackage', newSelection.join(', '));
      return newSelection;
    });
  };

  const toggleAddon = (addonName) => {
    setSelectedAddons(prev => {
      const newSelection = prev.includes(addonName)
        ? prev.filter(a => a !== addonName)
        : [...prev, addonName];

      // Build the additional services string
      const services = newSelection.map(s => {
        if (s === 'Other' && addonOtherText) return `Other: ${addonOtherText}`;
        return s;
      });
      setValue('additionalServices', services.join(', '));
      return newSelection;
    });
  };

  const handleAddonOtherText = (text) => {
    setAddonOtherText(text);
    setValue('additionalServicesOther', text);
    // Update the additional services string with new other text
    if (selectedAddons.includes('Other')) {
      const services = selectedAddons.map(s => {
        if (s === 'Other' && text) return `Other: ${text}`;
        return s;
      });
      setValue('additionalServices', services.join(', '));
    }
  };

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
    }
  };

  const onSubmit = async (data) => {
    const now = Date.now();
    if (now - lastSubmitTime < 30000) {
      toast.error('Please wait 30 seconds before submitting again.');
      return;
    }
    setIsSubmitting(true);
    setLastSubmitTime(now);
    try {
      // Map camelCase form fields to snake_case database columns
      const inquiryData = {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        business_name: data.businessName || null,
        interested_package: data.interestedPackage || null,
        additional_services: data.additionalServices || null,
        message: data.message,
        status: 'NEW',
      };
      const { error } = await submitInquiry(inquiryData);
      if (error) throw error;
      toast.success("Thank you for your inquiry! We'll get back to you soon.");
      reset();
      setSelectedPackages([]);
      setSelectedAddons([]);
      setAddonOtherText('');
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast.error(error.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ready to get started? Fill out the form below and we'll get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-heading font-bold mb-6">Get in Touch</h2>
                <p className="text-gray-600 mb-6">
                  Have questions? We're here to help! Reach out through the form or contact us
                  directly.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-sm text-gray-600">support@rl-labs.org</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <Label htmlFor="name">
                        Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        {...register('name')}
                        placeholder="Your full name"
                        className="mt-1"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                      />
                      {errors.name && (
                        <p id="name-error" className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        placeholder="your.email@example.com"
                        className="mt-1"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                      />
                      {errors.email && (
                        <p id="email-error" className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        {...register('phone')}
                        placeholder="(555) 123-4567"
                        className="mt-1"
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input
                        id="businessName"
                        {...register('businessName')}
                        placeholder="Your Business Name"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Packages You're Interested In</Label>
                      <input type="hidden" {...register('interestedPackage')} />
                      <div className="mt-2 space-y-2">
                        {packages.map((pkg) => (
                          <label
                            key={pkg.id}
                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                              selectedPackages.includes(pkg.name)
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedPackages.includes(pkg.name)}
                              onChange={() => togglePackage(pkg.name)}
                              className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                            />
                            <div className="flex-1">
                              <span className="font-medium">{pkg.name}</span>
                              <span className="text-gray-500 ml-2">
                                — starting at ${parseFloat(pkg.price).toLocaleString()}
                              </span>
                            </div>
                          </label>
                        ))}
                        <label
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedPackages.includes('Not sure yet')
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedPackages.includes('Not sure yet')}
                            onChange={() => togglePackage('Not sure yet')}
                            className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                          />
                          <span className="font-medium">Not sure yet</span>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Select all that apply (optional)</p>
                    </div>

                    <div>
                      <Label>Additional Services</Label>
                      <input type="hidden" {...register('additionalServices')} />
                      <input type="hidden" {...register('additionalServicesOther')} />
                      <div className="mt-2 space-y-2">
                        {ADDITIONAL_SERVICES.map((addon) => (
                          <div key={addon.name}>
                            <label
                              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                selectedAddons.includes(addon.name)
                                  ? 'border-primary-500 bg-primary-50'
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={selectedAddons.includes(addon.name)}
                                onChange={() => toggleAddon(addon.name)}
                                className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{addon.name}</span>
                                  {addon.price && (
                                    <span className="text-sm text-gray-500">— {addon.price}</span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500">{addon.description}</p>
                              </div>
                            </label>
                            {addon.name === 'Other' && selectedAddons.includes('Other') && (
                              <div className="ml-7 mt-2">
                                <Input
                                  value={addonOtherText}
                                  onChange={(e) => handleAddonOtherText(e.target.value)}
                                  placeholder="Please describe what you're looking for..."
                                  className="text-sm"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Select any additional services you'd like (optional)</p>
                    </div>

                    <div>
                      <Label htmlFor="message">
                        Message <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        {...register('message')}
                        placeholder="Tell us about your project and what you're looking for..."
                        rows={5}
                        className="mt-1"
                        aria-invalid={!!errors.message}
                        aria-describedby={errors.message ? 'message-error' : undefined}
                      />
                      {errors.message && (
                        <p id="message-error" className="text-sm text-red-600 mt-1">{errors.message.message}</p>
                      )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
