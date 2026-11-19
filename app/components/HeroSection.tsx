'use client';

import FeaturedProjectCard from './FeaturedProjectCard';
import { type FeaturedProject } from '../data/links';

interface HeroSectionProps {
  projects: FeaturedProject[];
  linkCounts: Record<string, number>;
  onProjectClick: (sectionId: string) => void;
}

export default function HeroSection({
  projects,
  linkCounts,
  onProjectClick,
}: HeroSectionProps) {
  return (
    <section className="mb-8 fade-in">
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">ZAO NEXUS</h1>
        <p className="text-lg opacity-75">Explore the Ecosystem</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {projects.map((project) => (
          <FeaturedProjectCard
            key={project.id}
            name={project.name}
            tagline={project.tagline}
            linkCount={linkCounts[project.sectionId] || 0}
            onClick={() => onProjectClick(project.sectionId)}
          />
        ))}
      </div>
    </section>
  );
}
