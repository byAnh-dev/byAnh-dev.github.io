# Anh Hoang - Portfolio

A sleek, minimal portfolio website showcasing Anh Hoang's projects and expertise in backend systems and AI, with a focus on natural language processing.

## 🚀 Features

- **Modern Design**: Clean, minimal aesthetic with black/white base and neon pink accents
- **3D Interactive Badge**: Custom 3D event badge using React Three Fiber with parallax effects
- **Responsive**: Fully responsive design that works on all devices
- **Dark Mode**: Automatic theme switching with system preference detection
- **Performance**: Optimized for Lighthouse scores ≥95 (mobile)
- **Accessibility**: WCAG 2.2 AA compliant with reduced motion support
- **SEO Optimized**: Complete metadata, Open Graph, and Twitter cards

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **3D Graphics**: React Three Fiber + Three.js
- **Icons**: Lucide React
- **Font**: Inter (Google Fonts)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page with hero section
│   ├── projects/          # Projects gallery and case studies
│   ├── about/             # About page with bio and skills
│   ├── contact/           # Contact page
│   ├── reserve/           # Placeholder for future content
│   └── layout.tsx         # Root layout with header/footer
├── components/            # Reusable components
│   ├── Header.tsx         # Navigation header with theme toggle
│   ├── Footer.tsx         # Footer with social links
│   └── EventBadge.tsx     # 3D interactive badge component
└── globals.css            # Global styles and Tailwind imports
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20.11.0 or higher
- npm 10.8.2 or higher

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Add any environment variables here
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

## 📝 Content Management

### Adding New Projects

1. Update the `projects` array in `src/app/projects/page.tsx`
2. Add project data to `projectsData` in `src/app/projects/[slug]/page.tsx`
3. Add project images to `public/images/` (optional)

### Updating Personal Information

- **Bio**: Edit `src/app/about/page.tsx`
- **Skills**: Update the `skills` object in the About page
- **Contact**: Modify email and social links in Header, Footer, and Contact components
- **Resume**: Replace `public/resume.pdf` with your actual resume

### Customizing Colors

The color scheme can be customized in:
- `tailwind.config.ts` - Pink color palette
- `src/app/globals.css` - CSS custom properties

## 🎨 Design System

### Colors
- **Primary**: Pink (#ec4899)
- **Background**: White/Black (light/dark mode)
- **Text**: Gray scale with proper contrast ratios

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Large, bold with tight tracking
- **Body**: 16-18px with generous line height

### Spacing
- Consistent 8px grid system
- Generous whitespace for readability
- Responsive padding and margins

## 📱 Performance & Accessibility

### Performance Targets
- **Lighthouse Score**: ≥95 (mobile)
- **LCP**: ≤2.7s
- **CLS**: ≤0.01
- **FID**: ≤100ms

### Accessibility Features
- WCAG 2.2 AA compliance
- Reduced motion support
- Proper ARIA labels
- Keyboard navigation
- Screen reader friendly

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on push

### Manual Deployment

```bash
npm run build
npm start
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Contact

- **Email**: hpa2309@gmail.com
- **GitHub**: [github.com/anhhoang](https://github.com/anhhoang)
- **LinkedIn**: [linkedin.com/in/anhhoang](https://linkedin.com/in/anhhoang)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber) for 3D graphics
- [Lucide](https://lucide.dev/) for beautiful icons

---

Built with ❤️ by Anh Hoang
