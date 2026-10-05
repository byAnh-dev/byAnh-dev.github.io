import { ArrowUpRight } from 'lucide-react'

export default function ContactInvite() {
  return <section className="contact-invite section-pad" aria-labelledby="contact-heading">
    <div className="section-topline"><span className="eyebrow">Have something in mind?</span><span className="eyebrow">Let's talk</span></div>
    <h2 id="contact-heading"><a href="mailto:hpa2309@gmail.com">Get in touch.<ArrowUpRight aria-hidden="true" /></a></h2>
    <div className="contact-bottom"><p>Interesting problems, new ideas, or a good conversation.<br />My inbox is open.</p><a className="text-link" href="mailto:hpa2309@gmail.com">hpa2309@gmail.com <ArrowUpRight size={18} aria-hidden="true" /></a></div>
  </section>
}

