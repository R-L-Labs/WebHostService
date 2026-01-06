import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create admin user
  console.log('Creating admin user...');
  const hashedPassword = await bcrypt.hash('Admin123!', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'rllabsadmin@rl-labs.org' },
    update: {},
    create: {
      email: 'rllabsadmin@rl-labs.org',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'SUPER_ADMIN',
    },
  });

  console.log('Admin user created:', adminUser.email);

  // Create packages
  console.log('Creating packages...');

  const basicPackage = await prisma.package.upsert({
    where: { name: 'Basic Static Website' },
    update: {},
    create: {
      name: 'Basic Static Website',
      description: 'Perfect for small businesses just getting started online. Get a professional, mobile-responsive website with essential features.',
      price: 497.00,
      features: JSON.stringify([
        '5 Pages (Home, About, Services, Contact, etc.)',
        'Mobile Responsive Design',
        'Contact Form Integration',
        'Basic SEO Optimization',
        'Social Media Links',
        '30-Day Support',
        'Google Maps Integration',
        'Fast Loading Speed'
      ]),
      isActive: true,
      displayOrder: 1,
    },
  });

  const customPackage = await prisma.package.upsert({
    where: { name: 'Custom Website' },
    update: {},
    create: {
      name: 'Custom Website',
      description: 'Fully customized website tailored to your brand and business needs. Perfect for established businesses looking for advanced features.',
      price: 1497.00,
      features: JSON.stringify([
        'Unlimited Pages',
        'Custom Design & Branding',
        'Advanced Features (Galleries, Booking, etc.)',
        'Content Management System',
        'E-commerce Integration (if needed)',
        '90-Day Support',
        'Training Session Included',
        'Premium SEO Optimization',
        'Newsletter Integration',
        'Blog Setup'
      ]),
      isActive: true,
      displayOrder: 2,
    },
  });

  const hostingPackage = await prisma.package.upsert({
    where: { name: 'Hosting & Maintenance' },
    update: {},
    create: {
      name: 'Hosting & Maintenance',
      description: 'Keep your website running smoothly with our comprehensive hosting and maintenance plan. Never worry about technical issues again.',
      price: 49.00,
      features: JSON.stringify([
        'Unlimited Content Updates',
        'SSL Certificate Included',
        'Daily Automated Backups',
        'Uptime Monitoring (99.9%)',
        'Priority Email Support',
        'Security Updates',
        'Performance Optimization',
        'Menu & Pricing Updates (for restaurants)',
        'Photo Updates',
        'Emergency Support Available'
      ]),
      isActive: true,
      displayOrder: 3,
    },
  });

  console.log('Packages created:');
  console.log('- ', basicPackage.name);
  console.log('- ', customPackage.name);
  console.log('- ', hostingPackage.name);

  // Create sample clients
  console.log('Creating sample clients...');

  const client1 = await prisma.client.upsert({
    where: { email: 'maria@tastybites.com' },
    update: {},
    create: {
      businessName: 'Tasty Bites Restaurant',
      contactName: 'Maria Garcia',
      email: 'maria@tastybites.com',
      phone: '(555) 123-4567',
      website: 'https://tastybites-demo.com',
      status: 'ACTIVE',
      packageId: customPackage.id,
      notes: 'Local Italian restaurant, focuses on authentic family recipes. Very responsive client.',
    },
  });

  const client2 = await prisma.client.upsert({
    where: { email: 'john@plumbpro.com' },
    update: {},
    create: {
      businessName: 'PlumbPro Services',
      contactName: 'John Smith',
      email: 'john@plumbpro.com',
      phone: '(555) 234-5678',
      status: 'PROSPECT',
      packageId: basicPackage.id,
      notes: 'Interested in basic website to start. May upgrade later.',
    },
  });

  console.log('Sample clients created:');
  console.log('- ', client1.businessName);
  console.log('- ', client2.businessName);

  // Create sample inquiries
  console.log('Creating sample inquiries...');

  const inquiry1 = await prisma.inquiry.create({
    data: {
      name: 'Sarah Johnson',
      email: 'sarah@coffeehaven.com',
      phone: '(555) 345-6789',
      businessName: 'Coffee Haven',
      message: 'Hi! I own a small coffee shop and currently only have a Facebook page. I would like to get a professional website to showcase our menu and allow customers to find us easier. What are your pricing options?',
      status: 'NEW',
    },
  });

  const inquiry2 = await prisma.inquiry.create({
    data: {
      name: 'Michael Chen',
      email: 'mike@cleantech.com',
      phone: '(555) 456-7890',
      businessName: 'CleanTech Solutions',
      message: 'Looking for a website for my cleaning business. Need online booking capabilities and service area map. Can you help with this?',
      status: 'NEW',
    },
  });

  console.log('Sample inquiries created:');
  console.log('- ', inquiry1.name, '-', inquiry1.businessName);
  console.log('- ', inquiry2.name, '-', inquiry2.businessName);

  console.log('\nDatabase seed completed successfully!');
  console.log('\n=== LOGIN CREDENTIALS ===');
  console.log('Email:', adminUser.email);
  console.log('Password: Admin123!');
  console.log('=========================\n');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
