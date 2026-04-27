import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { submissions, customers, workshops, testimonials, portfolioItems, brands, siteContent } from '@/lib/db/schema'

export const dynamic = 'force-dynamic'

export async function POST() {
  const results: Record<string, string> = {}

  async function seed(name: string, fn: () => Promise<unknown>) {
    try {
      await fn()
      results[name] = 'ok'
    } catch (e) {
      results[name] = e instanceof Error ? e.message.slice(0, 120) : 'failed'
    }
  }

  await seed('workshops', () => db.insert(workshops).values([
    { title: 'Cinematic Photography Masterclass', slug: 'cinematic-photography-masterclass', category: 'Photography', description: 'Learn the art of cinematic storytelling through photography. From composition to color grading.', dateDisplay: 'Jun 14-15, 2026', startDate: '2026-06-14', endDate: '2026-06-15', location: 'Neelakar Studio, Pune', duration: '2 Days', level: 'Intermediate', price: 4999, priceDisplay: '₹4,999', totalSpots: 30, spotsFilled: 22, instructor: 'Arjun Kapoor', highlight: true, isActive: true, sortOrder: 1 },
    { title: 'Brand Identity Design Sprint', slug: 'brand-identity-design-sprint', category: 'Branding', description: 'Build a complete brand identity from scratch — logo, type system, color palette, and brand book.', dateDisplay: 'Jul 5-6, 2026', startDate: '2026-07-05', endDate: '2026-07-06', location: 'Online (Zoom)', duration: '2 Days', level: 'Beginner', price: 3499, priceDisplay: '₹3,499', totalSpots: 40, spotsFilled: 35, instructor: 'Priya Mehta', highlight: true, isActive: true, sortOrder: 2 },
    { title: 'Short Film Production Bootcamp', slug: 'short-film-production-bootcamp', category: 'Videography', description: 'From script to screen in 3 days. Cinematography, directing, and post-production fundamentals.', dateDisplay: 'Aug 8-10, 2026', startDate: '2026-08-08', endDate: '2026-08-10', location: 'Neelakar Studio, Pune', duration: '3 Days', level: 'Intermediate', price: 7999, priceDisplay: '₹7,999', totalSpots: 20, spotsFilled: 8, instructor: 'Rohan Deshmukh', highlight: false, isActive: true, sortOrder: 3 },
    { title: 'Social Media Content Creation', slug: 'social-media-content-creation', category: 'Digital', description: 'Create scroll-stopping reels, stories, and posts. Photo, video, and design for Instagram and YouTube.', dateDisplay: 'Sep 12, 2026', startDate: '2026-09-12', endDate: '2026-09-12', location: 'Online (Zoom)', duration: '1 Day', level: 'Beginner', price: 1999, priceDisplay: '₹1,999', totalSpots: 60, spotsFilled: 41, instructor: 'Sneha Joshi', highlight: false, isActive: true, sortOrder: 4 },
    { title: 'Advanced Color Grading for Film', slug: 'advanced-color-grading', category: 'Post-Production', description: 'Master DaVinci Resolve. Color science, LUTs, and the craft of visual tone.', dateDisplay: 'Completed — May 2026', startDate: '2026-05-03', endDate: '2026-05-04', location: 'Neelakar Studio, Pune', duration: '2 Days', level: 'Advanced', price: 5999, priceDisplay: '₹5,999', totalSpots: 25, spotsFilled: 25, instructor: 'Arjun Kapoor', highlight: false, isActive: false, sortOrder: 5 },
  ]).onConflictDoNothing())

  const now = Date.now()
  const day = 86400000

  await seed('submissions', () => db.insert(submissions).values([
    { type: 'general', status: 'new', name: 'Ananya Sharma', email: 'ananya.sharma@gmail.com', phone: '+91 98765 43210', message: 'Hi, I saw your work on Instagram and I am blown away. We are launching a new D2C skincare brand and need a complete visual identity.', serviceInterest: 'Photography', createdAt: new Date(now - day * 1) },
    { type: 'general', status: 'new', name: 'Vikram Patel', email: 'vikram.patel@outlook.com', phone: '+91 87654 32109', message: 'We need corporate headshots for our team of 25 people plus a behind-the-scenes brand video.', serviceInterest: 'Photography', createdAt: new Date(now - day * 1.5) },
    { type: 'general', status: 'contacted', name: 'Meera Krishnan', email: 'meera.k@yahoo.com', phone: '+91 76543 21098', message: 'Looking for a videographer for our annual day event. 500 attendees, full day coverage, highlight reel needed.', serviceInterest: 'Videography', createdAt: new Date(now - day * 3) },
    { type: 'general', status: 'in_progress', name: 'Raj Malhotra', email: 'raj.m@techcorp.in', phone: '+91 99887 76655', message: 'Need a complete website redesign for our architecture firm. Modern, minimal, portfolio-heavy.', serviceInterest: 'Web Design', createdAt: new Date(now - day * 5) },
    { type: 'general', status: 'completed', name: 'Priyanka Iyer', email: 'priyanka.iyer@gmail.com', phone: '+91 88776 65544', message: 'Thank you for the amazing wedding photography! Wanted to inquire about engagement shoot packages for my sister.', serviceInterest: 'Photography', createdAt: new Date(now - day * 8) },
    { type: 'launchpad', status: 'new', name: 'Kunal Desai', email: 'kunal@freshroots.co', phone: '+91 97654 32100', message: 'We are FreshRoots, a farm-to-table food delivery startup launching in Pune.', businessName: 'FreshRoots', businessType: 'Food & Beverage', budgetRange: '1L-3L', timeline: '1-2 months', projectDescription: 'Complete brand launch for organic food delivery startup. Need logo, packaging for 12 SKUs, website, and a 60-second launch video.', createdAt: new Date(now - day * 0.5) },
    { type: 'launchpad', status: 'contacted', name: 'Divya Nair', email: 'divya@bloomstudio.in', phone: '+91 86543 21099', message: 'Bloom Studio is a boutique interior design firm. We need branding that reflects our aesthetic.', businessName: 'Bloom Studio', businessType: 'Design & Architecture', budgetRange: '50K-1L', timeline: '3-6 months', projectDescription: 'Complete rebrand: new logo, business cards, portfolio website, and social media templates.', createdAt: new Date(now - day * 4) },
    { type: 'launchpad', status: 'in_progress', name: 'Arjun Reddy', email: 'arjun@peakfit.app', phone: '+91 77889 90011', message: 'PeakFit is a fitness app launching in 3 months. Need app store assets and product demo video.', businessName: 'PeakFit', businessType: 'Health & Fitness', budgetRange: '3L+', timeline: 'ASAP', projectDescription: 'App launch package: promo video, app store graphics, social media launch campaign, influencer collaboration kit.', createdAt: new Date(now - day * 7) },
    { type: 'workshop', status: 'new', name: 'Sneha Kulkarni', email: 'sneha.k@gmail.com', phone: '+91 98123 45678', message: 'Very excited about this! I have a mirrorless camera but never learned the manual settings properly.', preferredWorkshop: 'Cinematic Photography Masterclass', createdAt: new Date(now - day * 0.2) },
    { type: 'workshop', status: 'new', name: 'Rohit Jain', email: 'rohit.jain@proton.me', phone: '+91 87612 34567', message: 'Interested in the filmmaking bootcamp. I have some experience with Premiere Pro.', preferredWorkshop: 'Short Film Production Bootcamp', createdAt: new Date(now - day * 0.8) },
    { type: 'workshop', status: 'contacted', name: 'Aisha Bhat', email: 'aisha.bhat@gmail.com', phone: '+91 76501 23456', message: 'Can I attend with a friend? We run a small bakery and want to learn content creation.', preferredWorkshop: 'Social Media Content Creation', createdAt: new Date(now - day * 2) },
    { type: 'general', status: 'new', name: 'Siddharth Menon', email: 'sid.menon@gmail.com', phone: '+91 99001 12233', message: 'Our NGO works with rural artisans. We need a documentary-style video showcasing their craft.', serviceInterest: 'Videography', createdAt: new Date(now - day * 2.5) },
    { type: 'launchpad', status: 'new', name: 'Tara Kapoor', email: 'tara@kapoorstudios.com', phone: '+91 88990 01122', message: 'Kapoor Studios is a new yoga space opening in Koregaon Park. Need branding that feels serene yet modern.', businessName: 'Kapoor Studios', businessType: 'Health & Wellness', budgetRange: '50K-1L', timeline: '1-2 months', projectDescription: 'Brand identity + interior signage + opening event photography + social media launch.', createdAt: new Date(now - day * 1.2) },
    { type: 'general', status: 'contacted', name: 'Nikhil Agarwal', email: 'nikhil.ag@gmail.com', phone: '+91 77665 54433', message: 'Looking for product photography for our e-commerce store. Around 50 SKUs.', serviceInterest: 'Photography', createdAt: new Date(now - day * 6) },
    { type: 'general', status: 'completed', name: 'Fatima Sheikh', email: 'fatima.sheikh@outlook.com', message: 'We worked together on our restaurant launch last year. Now opening a second location!', serviceInterest: 'Branding', createdAt: new Date(now - day * 12) },
    { type: 'workshop', status: 'new', name: 'Yash Gaikwad', email: 'yash.gaikwad@gmail.com', phone: '+91 99887 11223', message: 'I am a graphic designer transitioning to brand strategy. The design sprint sounds perfect.', preferredWorkshop: 'Brand Identity Design Sprint', createdAt: new Date(now - day * 0.3) },
    { type: 'general', status: 'archived', name: 'Pooja Deshmukh', email: 'pooja.d@hotmail.com', phone: '+91 66554 43322', message: 'Was looking at wedding packages but decided to postpone. Will reach out again next year.', serviceInterest: 'Photography', createdAt: new Date(now - day * 20) },
  ]).onConflictDoNothing())

  await seed('customers', () => db.insert(customers).values([
    { email: 'ananya.sharma@gmail.com', name: 'Ananya Sharma', phone: '+91 98765 43210', serviceTypes: ['Photography'], status: 'active', totalSubmissions: 1 },
    { email: 'vikram.patel@outlook.com', name: 'Vikram Patel', phone: '+91 87654 32109', serviceTypes: ['Photography', 'Videography'], status: 'active', totalSubmissions: 1 },
    { email: 'meera.k@yahoo.com', name: 'Meera Krishnan', phone: '+91 76543 21098', serviceTypes: ['Videography'], status: 'active', totalSubmissions: 1 },
    { email: 'raj.m@techcorp.in', name: 'Raj Malhotra', phone: '+91 99887 76655', serviceTypes: ['Web Design'], status: 'active', totalSubmissions: 1 },
    { email: 'priyanka.iyer@gmail.com', name: 'Priyanka Iyer', phone: '+91 88776 65544', serviceTypes: ['Photography'], status: 'active', totalSubmissions: 1 },
    { email: 'kunal@freshroots.co', name: 'Kunal Desai', phone: '+91 97654 32100', serviceTypes: ['Branding', 'Photography', 'Videography'], status: 'lead', totalSubmissions: 1 },
    { email: 'divya@bloomstudio.in', name: 'Divya Nair', phone: '+91 86543 21099', serviceTypes: ['Branding'], status: 'lead', totalSubmissions: 1 },
    { email: 'arjun@peakfit.app', name: 'Arjun Reddy', phone: '+91 77889 90011', serviceTypes: ['Branding', 'Videography'], status: 'active', totalSubmissions: 1 },
    { email: 'sneha.k@gmail.com', name: 'Sneha Kulkarni', phone: '+91 98123 45678', serviceTypes: ['Workshop'], status: 'active', totalSubmissions: 1 },
    { email: 'tara@kapoorstudios.com', name: 'Tara Kapoor', phone: '+91 88990 01122', serviceTypes: ['Branding', 'Photography'], status: 'lead', totalSubmissions: 1 },
    { email: 'fatima.sheikh@outlook.com', name: 'Fatima Sheikh', serviceTypes: ['Branding'], status: 'active', totalSubmissions: 2 },
    { email: 'pooja.d@hotmail.com', name: 'Pooja Deshmukh', phone: '+91 66554 43322', serviceTypes: ['Photography'], status: 'inactive', totalSubmissions: 1 },
  ]).onConflictDoNothing())

  await seed('testimonials', () => db.insert(testimonials).values([
    { context: 'main', quote: 'Neelakar transformed our entire brand. The photography alone tripled our Instagram engagement, and the brand video is still our most-viewed content.', authorName: 'Ritika Anand', authorRole: 'Founder, Bare Essentials', sortOrder: 1, isActive: true },
    { context: 'main', quote: 'Working with the Neelakar team felt effortless. They understood our vision on the first call and delivered something even better than imagined.', authorName: 'Sameer Joshi', authorRole: 'CEO, UrbanCraft Architects', sortOrder: 2, isActive: true },
    { context: 'main', quote: 'We hired them for product photography and ended up redoing our entire brand identity through them. That is how good they are.', authorName: 'Deepa Krishnamurthy', authorRole: 'Head of Marketing, PureLeaf Tea', sortOrder: 3, isActive: true },
    { context: 'main', quote: 'The website they built for us consistently gets compliments from clients. Clean, fast, and the photography integration is seamless.', authorName: 'Aditya Rao', authorRole: 'Partner, Rao & Associates Law Firm', sortOrder: 4, isActive: true },
    { context: 'main', quote: 'From concept to delivery in 3 weeks. Our product launch video hit 100K views organically. They create results, not just content.', authorName: 'Nisha Malhotra', authorRole: 'Co-founder, GlowUp Skincare', sortOrder: 5, isActive: true },
    { context: 'workshop', quote: 'The photography masterclass changed how I see light. Arjun is an incredible teacher — patient, practical, and genuinely passionate.', authorName: 'Varun Sharma', authorRole: 'Freelance Photographer', sortOrder: 1, isActive: true },
    { context: 'workshop', quote: 'Best investment I made this year. From fumbling with camera settings to confidently shooting in manual mode. The hands-on approach makes all the difference.', authorName: 'Kavita Patel', authorRole: 'Content Creator', sortOrder: 2, isActive: true },
    { context: 'workshop', quote: 'The brand identity sprint gave me a complete brand kit in 2 days. I launched my freelance practice the following week with professional materials.', authorName: 'Manish Verma', authorRole: 'Brand Consultant', sortOrder: 3, isActive: true },
  ]).onConflictDoNothing())

  await seed('portfolio', () => db.insert(portfolioItems).values([
    { title: 'Bare Essentials — Product Launch', category: 'Brand Launch', imageUrl: '/placeholder.jpg', context: 'portfolio', subtitle: 'Complete brand identity, packaging, and launch campaign', sortOrder: 1, isActive: true },
    { title: 'UrbanCraft Architects', category: 'Corporate', imageUrl: '/placeholder.jpg', context: 'portfolio', subtitle: 'Architecture portfolio website and team photography', sortOrder: 2, isActive: true },
    { title: 'PureLeaf Tea Collection', category: 'Product', imageUrl: '/placeholder.jpg', context: 'portfolio', subtitle: '50+ SKU product photography with lifestyle setups', sortOrder: 3, isActive: true },
    { title: 'Monsoon Wedding — Pune', category: 'Wedding', imageUrl: '/placeholder.jpg', context: 'portfolio', subtitle: 'Three-day destination wedding coverage', sortOrder: 4, isActive: true },
    { title: 'GlowUp Skincare Launch', category: 'Brand Launch', imageUrl: '/placeholder.jpg', context: 'portfolio', subtitle: 'Product video, social campaign, and e-commerce photography', sortOrder: 5, isActive: true },
    { title: 'Behind the Lens — BTS Reel', category: 'Cinematic', imageUrl: '/placeholder.jpg', context: 'production_video', subtitle: 'Studio day-in-the-life cinematography', sortOrder: 1, isActive: true },
    { title: 'Kapoor Studios Opening', category: 'Event', imageUrl: '/placeholder.jpg', context: 'production_photo', subtitle: 'Yoga studio grand opening event coverage', sortOrder: 1, isActive: true },
    { title: 'FreshRoots — Farm Story', category: 'Documentary', imageUrl: '/placeholder.jpg', context: 'production_video', subtitle: 'Origin story documentary for organic food startup', sortOrder: 2, isActive: true },
  ]).onConflictDoNothing())

  await seed('brands', () => db.insert(brands).values([
    { name: 'Bare Essentials', industry: 'Beauty & Skincare', sortOrder: 1, isActive: true },
    { name: 'UrbanCraft', industry: 'Architecture', sortOrder: 2, isActive: true },
    { name: 'PureLeaf Tea', industry: 'Food & Beverage', sortOrder: 3, isActive: true },
    { name: 'GlowUp Skincare', industry: 'Beauty', sortOrder: 4, isActive: true },
    { name: 'PeakFit', industry: 'Health & Fitness', sortOrder: 5, isActive: true },
    { name: 'FreshRoots', industry: 'Food & Beverage', sortOrder: 6, isActive: true },
    { name: 'Bloom Studio', industry: 'Interior Design', sortOrder: 7, isActive: true },
    { name: 'Kapoor Studios', industry: 'Wellness', sortOrder: 8, isActive: true },
  ]).onConflictDoNothing())

  await seed('content', () => db.insert(siteContent).values([
    { key: 'stats.projects_delivered', value: '127', valueType: 'number', label: 'Projects Delivered', category: 'stats' },
    { key: 'stats.happy_clients', value: '84', valueType: 'number', label: 'Happy Clients', category: 'stats' },
    { key: 'stats.workshops_conducted', value: '18', valueType: 'number', label: 'Workshops Conducted', category: 'stats' },
    { key: 'stats.students_trained', value: '340', valueType: 'number', label: 'Students Trained', category: 'stats' },
    { key: 'stats.cities_reached', value: '12', valueType: 'number', label: 'Cities Reached', category: 'stats' },
    { key: 'hero.tagline', value: 'We craft unbreakable digital presence', valueType: 'text', label: 'Hero Tagline', category: 'hero' },
    { key: 'hero.subtitle', value: 'Photography · Videography · Branding · Web Design', valueType: 'text', label: 'Hero Subtitle', category: 'hero' },
  ]).onConflictDoNothing())

  const allOk = Object.values(results).every(v => v === 'ok')
  return NextResponse.json({ success: allOk, results }, { status: allOk ? 200 : 207 })
}
