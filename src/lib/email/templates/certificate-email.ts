import { emailLayout } from './base'

export function certificateEmail(name: string, workshopTitle: string) {
  return emailLayout(`
    <h1>Congratulations, ${name}! 🎉</h1>
    <p>You&rsquo;ve successfully completed <span class="highlight">${workshopTitle}</span> with Neelakar Creative House.</p>
    <p>Your certificate of completion is attached to this email. We hope you enjoyed the experience and took away skills that&rsquo;ll stick with you.</p>
    <p>Keep creating. Keep pushing. We&rsquo;ll see you at the next one.</p>
    <hr class="divider" />
    <p style="font-size: 13px;">Share your certificate on social media and tag us <span class="highlight">@neelakar</span></p>
  `)
}
