import Link from 'next/link'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import PixelField from '@/archive/components/PixelField'
import ProjectList from '@/archive/components/ProjectList'
import ContactInvite from '@/archive/components/ContactInvite'

export default function Home() {
  return <>
    <section className="home-hero" aria-labelledby="hero-heading">
      <div className="hero-title"><span className="eyebrow">A portfolio by</span><h1 id="hero-heading">ANH<br />HOANG<span className="title-period">.</span></h1></div>
      <div className="hero-aside">
        <p className="hero-descriptor"><span>Curiosity</span><span>&amp; code.</span><span>Ideas</span><span>into systems.</span></p>
        <div className="hero-summary"><span className="pixel-mark" aria-hidden="true">✳</span><p>I build software around messy problems.<br />Backend systems, applied AI,<br />and everything I learn along the way.</p></div>
        <a href="#selected-work" className="hero-jump eyebrow">Explore my work <ArrowDown size={18} aria-hidden="true" /></a>
      </div>
    </section>
    <PixelField />
    <section className="work-section section-pad" id="selected-work" aria-labelledby="work-heading">
      <div className="section-topline"><h2 id="work-heading" className="eyebrow">01 / Selected work</h2><Link href="/archive/projects" className="text-link small-link">All projects <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
      <p className="section-statement">Less noise. More signal.<br />Software that makes<br className="desktop-break" /> complicated things useful.</p>
      <ProjectList />
    </section>
    <section className="about-strip section-pad" aria-labelledby="about-heading">
      <div><span className="eyebrow">02 / A bit about me</span><h2 id="about-heading">Curiosity is<br />the starting point.</h2></div>
      <div className="about-strip-copy"><p>I'm a Computer Science student drawn to backend systems and AI. I like figuring out how things work, then finding a cleaner way to build them.</p><p>Right now, that means exploring natural language processing, working with LLMs, and making sense of messy data. Away from the keyboard, it's hiking, the gym, or another game of League.</p><Link className="text-link" href="/archive/about">More about me <ArrowUpRight size={18} aria-hidden="true" /></Link></div>
    </section>
    <section className="practice-section section-pad" aria-labelledby="practice-heading">
      <div className="section-topline"><span className="eyebrow">03 / How I approach the work</span><span className="eyebrow">Keep asking why</span></div>
      <h2 id="practice-heading">Understand.<br />Build. Refine.</h2>
      <div className="practice-grid">
        <article><span className="eyebrow">01 / Understand</span><h3>Start with the problem.</h3><p>Read the data. Find the constraints. Work out what the software actually needs to do before choosing the tools.</p><div className="pixel-diagram diagram-one" aria-hidden="true" /></article>
        <article><span className="eyebrow">02 / Build</span><h3>Make the idea testable.</h3><p>Prototype the uncertain parts first. Get something working, then see where the assumptions break.</p><div className="pixel-diagram diagram-two" aria-hidden="true" /></article>
        <article><span className="eyebrow">03 / Refine</span><h3>Follow the evidence.</h3><p>Measure the slow parts, simplify the design, and keep improving the details that people will notice.</p><div className="pixel-diagram diagram-three" aria-hidden="true" /></article>
      </div>
    </section>
    <ContactInvite />
  </>
}

