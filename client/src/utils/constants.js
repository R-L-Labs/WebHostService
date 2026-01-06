// Client status options
export const CLIENT_STATUS_OPTIONS = [
  { value: 'PROSPECT', label: 'Prospect', color: 'bg-blue-100 text-blue-800' },
  { value: 'ACTIVE', label: 'Active', color: 'bg-green-100 text-green-800' },
  { value: 'INACTIVE', label: 'Inactive', color: 'bg-gray-100 text-gray-800' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
];

// Inquiry status options
export const INQUIRY_STATUS_OPTIONS = [
  { value: 'NEW', label: 'New', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'CONTACTED', label: 'Contacted', color: 'bg-blue-100 text-blue-800' },
  { value: 'QUALIFIED', label: 'Qualified', color: 'bg-purple-100 text-purple-800' },
  { value: 'CONVERTED', label: 'Converted', color: 'bg-green-100 text-green-800' },
  { value: 'DISMISSED', label: 'Dismissed', color: 'bg-gray-100 text-gray-800' },
];

// Navigation links for public site
export const PUBLIC_NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Services', path: '/services' },
  { label: 'Contact', path: '/contact' },
];

// Navigation links for admin dashboard
export const ADMIN_NAV_LINKS = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: 'LayoutDashboard' },
  { label: 'Clients', path: '/admin/clients', icon: 'Users' },
  { label: 'Inquiries', path: '/admin/inquiries', icon: 'Mail' },
];

// FAQ items for home page
export const FAQ_ITEMS = [
  {
    question: 'How long does it take to build a website?',
    answer: 'For basic static websites, we typically complete the project within 1-2 weeks. Custom websites with advanced features may take 3-4 weeks depending on complexity.',
  },
  {
    question: 'Do I need technical knowledge to update my website?',
    answer: 'No! With our Hosting & Maintenance plan, we handle all updates for you. Just send us your changes via email, and we\'ll implement them within 24 hours.',
  },
  {
    question: 'What if I already have a website?',
    answer: 'We can redesign your existing website or help you migrate to a new platform. Contact us for a free consultation to discuss your needs.',
  },
  {
    question: 'Can I update my website myself?',
    answer: 'Yes! Custom website packages include a content management system (CMS) and training. You\'ll be able to make basic updates yourself, with our support available whenever you need it.',
  },
  {
    question: 'What\'s included in the Hosting & Maintenance plan?',
    answer: 'Unlimited content updates, SSL certificate, daily backups, uptime monitoring, security updates, and priority support. Perfect for restaurants that need to frequently update menus and specials.',
  },
  {
    question: 'Do you offer payment plans?',
    answer: 'Yes, we offer flexible payment options for custom websites. Contact us to discuss a payment plan that works for your budget.',
  },
];
