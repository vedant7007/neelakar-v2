import { emailLayout } from './base'

export function generalConfirmation(name: string) {
  return emailLayout(`
    <h1>We got your message, ${name}.</h1>
    <p>Thanks for reaching out. Our team will review your inquiry and get back to you within <span class="highlight">24 hours</span>.</p>
    <p>In the meantime, feel free to explore our work at <a href="https://neelakar.com/portfolio" style="color: #C9561E; text-decoration: none;">neelakar.com/portfolio</a>.</p>
    <hr class="divider" />
    <p style="font-size: 13px;">If you didn&rsquo;t submit this form, you can safely ignore this email.</p>
  `)
}

export function launchpadConfirmation(name: string, businessName: string) {
  return emailLayout(`
    <h1>Your brand launch starts here, ${name}.</h1>
    <p>We&rsquo;ve received your application for <span class="highlight">${businessName}</span>. Our team will review your project details and reach out within <span class="highlight">48 hours</span> to discuss next steps.</p>
    <p>We take every brand launch seriously &mdash; expect a thoughtful, tailored response.</p>
    <hr class="divider" />
    <p style="font-size: 13px;">If you didn&rsquo;t submit this form, you can safely ignore this email.</p>
  `)
}

export function workshopConfirmation(name: string, workshop: string | null) {
  return emailLayout(`
    <h1>You&rsquo;re in, ${name}!</h1>
    <p>We&rsquo;ve received your enrollment${workshop ? ` for <span class="highlight">${workshop}</span>` : ''}. We&rsquo;ll send you all the details &mdash; schedule, gear list, and location &mdash; closer to the date.</p>
    <p>Get ready to create something amazing.</p>
    <hr class="divider" />
    <p style="font-size: 13px;">If you didn&rsquo;t submit this form, you can safely ignore this email.</p>
  `)
}
