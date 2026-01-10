'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, Component, ReactNode } from 'react';
import Link from 'next/link';

interface ErrorBoundaryProps { children: ReactNode; fallback: ReactNode; onError?: () => void; }
interface ErrorBoundaryState { hasError: boolean; }

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(): ErrorBoundaryState { return { hasError: true }; }
  componentDidCatch() { this.props.onError?.(); }
  render() { if (this.state.hasError) return this.props.fallback; return this.props.children; }
}

function MapFallback({ stories }: { stories: Array<{ slug: string; title: string; region?: string; category?: string }> }) {
  const byRegion = stories.reduce((acc, story) => { const region = story.region || 'Namibia'; if (!acc[region]) acc[region] = []; acc[region].push(story); return acc; }, {} as Record<string, typeof stories>);
  const sortedRegions = Object.keys(byRegion).sort();
  return (
    <div className="w-full bg-[#111] px-6 py-8 border border-white/10">
      <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-6">Stories by Region</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
        {sortedRegions.slice(0, 9).map(region => (
          <div key={region}><h3 className="text-sm text-white/70 mb-2">{region}</h3><ul className="space-y-1">{byRegion[region].slice(0, 3).map(story => (<li key={story.slug}><Link href={`/story/${story.slug}`} className="text-sm text-white/40 hover:text-white transition-colors">{story.title}</Link></li>))}{byRegion[region].length > 3 && (<li className="text-xs text-white/30">+ {byRegion[region].length - 3} more</li>)}</ul></div>
        ))}
      </div>
    </div>
  );
}

const NamibiaMap = dynamic(() => import('./NamibiaMap'), { ssr: false, loading: () => (<div className="w-full h-[400px] md:h-[500px] bg-[#1a1a1a] flex items-center justify-center"><div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>) });

const NAMIBIA_COORDINATES: Record<string, [number, number]> = {
  'Windhoek': [17.0858, -22.5609], 'Swakopmund': [14.5053, -22.6792], 'Sossusvlei': [15.2833, -24.7333], 'Etosha': [16.0000, -18.8556],
  'Fish River Canyon': [17.5833, -27.5500], 'Skeleton Coast': [13.0000, -20.0000], 'Damaraland': [14.5000, -20.5000],
  'North': [17.0000, -18.5000], 'South': [17.0000, -26.0000], 'Central': [17.0000, -22.5000], 'Coast': [14.5000, -22.5000],
  'Namibia': [17.0858, -22.5609], 'Multiple': [17.0858, -22.5609],
};

const prepareStoriesForNamibiaMap = (stories: Array<{ slug: string; title: string; subtitle?: string; category?: string; region?: string; }>) => {
  const getCoordinates = (region: string): [number, number] => {
    if (!region) return NAMIBIA_COORDINATES['Namibia'];
    if (NAMIBIA_COORDINATES[region]) return NAMIBIA_COORDINATES[region];
    const lowerRegion = region.toLowerCase();
    for (const [key, coords] of Object.entries(NAMIBIA_COORDINATES)) {
      if (key.toLowerCase() === lowerRegion) return coords;
      if (lowerRegion.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerRegion)) return coords;
    }
    return NAMIBIA_COORDINATES['Namibia'];
  };
  return stories.map(story => ({ slug: story.slug, title: story.title, subtitle: story.subtitle, category: story.category, region: story.region, coordinates: getCoordinates(story.region || '') }));
};

interface NamibiaMapWrapperProps { stories: Array<{ slug: string; title: string; subtitle?: string; category?: string; region?: string; }>; className?: string; }

export default function NamibiaMapWrapper({ stories, className }: NamibiaMapWrapperProps) {
  const [mapError, setMapError] = useState(false);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);
  if (stories.length === 0) return (<div className="w-full h-[300px] bg-[#1a1a1a] flex items-center justify-center"><p className="text-white/40 text-sm">No stories to display on map</p></div>);
  if (!isClient || mapError) return <MapFallback stories={stories} />;
  const mappedStories = prepareStoriesForNamibiaMap(stories);
  return (<ErrorBoundary fallback={<MapFallback stories={stories} />} onError={() => setMapError(true)}><NamibiaMap stories={mappedStories} className={className} /></ErrorBoundary>);
}
