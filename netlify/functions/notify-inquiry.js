export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.NOTIFY_EMAIL;

  if (!resendApiKey || !notifyEmail) {
    console.error('Missing RESEND_API_KEY or NOTIFY_EMAIL environment variable');
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { name, email, phone, businessName, interestedPackage, additionalServices, message } = await req.json();

    const htmlBody = `
      <h2>New Inquiry Received</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr><td style="padding: 8px; font-weight: bold;">Name</td><td style="padding: 8px;">${name}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Email</td><td style="padding: 8px;">${email}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Phone</td><td style="padding: 8px;">${phone || 'Not provided'}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Business</td><td style="padding: 8px;">${businessName || 'Not provided'}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Packages</td><td style="padding: 8px;">${interestedPackage || 'None selected'}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Add-ons</td><td style="padding: 8px;">${additionalServices || 'None selected'}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Message</td><td style="padding: 8px;">${message}</td></tr>
      </table>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SiteKeeper <onboarding@resend.dev>',
        to: [notifyEmail],
        subject: `New Inquiry from ${name}`,
        html: htmlBody,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Resend API error:', errorData);
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Notify inquiry error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
