'use client'

import { ArrowUpRight } from 'lucide-react'
import posthog from 'posthog-js'

export default function ContactInvite() {
  const captureContactStarted = () => posthog.capture('contact_started', { source: 'archive_contact_invite' })

  return <section className="contact-invite section-pad" aria-labelledby="contact-heading">
    <div className="section-topline"><span className="eyebrow">Have something in mind?</span><span className="eyebrow">Let's talk</span></div>
    <h2 id="contact-heading"><a href="mailto:hpa2309@gmail.com" onClick={captureContactStarted}>Get in touch.<ArrowUpRight aria-hidden="true" /></a></h2>
    <div className="contact-bottom"><p>Interesting problems, new ideas, or a good conversation.<br />My inbox is open.</p><a className="text-link" href="mailto:hpa2309@gmail.com" onClick={captureContactStarted}>hpa2309@gmail.com <ArrowUpRight size={18} aria-hidden="true" /></a></div>
  </section>
}

