'use client';

import { useEffect, useRef, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mapboxgl: any = null;

interface StoryLocation {
  slug: string;
  title: string;
  subtitle?: string;
  category?: string;
  region?: string;
  coordinates: [number, number];
}

interface NamibiaMapProps {
  stories: StoryLocation[];
  className?: string;
}

const NAMIBIA_COORDINATES: Record<string, [number, number]> = {
  // Cities
  'Windhoek': [17.0858, -22.5609],
  'Swakopmund': [14.5053, -22.6792],
  'Walvis Bay': [14.5053, -22.9575],
  'Lüderitz': [15.1591, -26.6481],
  'Sossusvlei': [15.2833, -24.7333],
  'Etosha': [16.0000, -18.8556],
  'Skeleton Coast': [13.0000, -20.0000],
  'Fish River Canyon': [17.5833, -27.5500],
  'Kolmanskop': [15.2333, -26.7000],
  'Spitzkoppe': [15.2000, -21.8333],
  'Twyfelfontein': [14.3667, -20.5833],
  'Damaraland': [14.5000, -20.5000],
  'Kaokoland': [13.0000, -18.0000],
  'Caprivi Strip': [23.5000, -18.0000],
  'Zambezi Region': [23.5000, -18.0000],

  // Regions
  'North': [17.0000, -18.5000],
  'South': [17.0000, -26.0000],
  'Central': [17.0000, -22.5000],
  'Coast': [14.5000, -22.5000],
  'Namib Desert': [15.0000, -24.0000],
  'Kalahari': [19.5000, -24.0000],

  // Parks & Reserves
  'Etosha National Park': [16.0000, -18.8556],
  'Namib-Naukluft': [15.5000, -24.0000],
  'Waterberg': [17.2500, -20.4167],
  'Brandberg': [14.5667, -21.1333],

  // Default
  'Namibia': [17.0858, -22.5609],
  'Multiple': [17.0858, -22.5609],
};

function getCoordinatesForStory(region: string): [number, number] | null {
  if (!region) return NAMIBIA_COORDINATES['Namibia'];
  if (NAMIBIA_COORDINATES[region]) return NAMIBIA_COORDINATES[region];

  const lowerRegion = region.toLowerCase();
  for (const [key, coords] of Object.entries(NAMIBIA_COORDINATES)) {
    if (key.toLowerCase() === lowerRegion) return coords;
    if (lowerRegion.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerRegion)) return coords;
  }
  return NAMIBIA_COORDINATES['Namibia'];
}

export default function NamibiaMap({ stories, className = '' }: NamibiaMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const map = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([]);
  const [mapError, setMapError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    const initMap = async () => {
      try {
        if (!mapboxgl) {
          const mb = await import('mapbox-gl');
          mapboxgl = mb.default;
          mapboxgl.accessToken = 'pk.eyJ1IjoiaW5kaWdvYW5kbGF2ZW5kZXIiLCJhIjoiY21kN3B0OTZvMGllNjJpcXY0MnZlZHVlciJ9.1-jV-Pze3d7HZseOAhmkCg';

          if (!document.getElementById('mapbox-gl-css')) {
            const link = document.createElement('link');
            link.id = 'mapbox-gl-css';
            link.rel = 'stylesheet';
            link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css';
            document.head.appendChild(link);
          }
        }

        if (!mapContainer.current) return;

        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [17.0858, -22.0],
          zoom: 5,
          minZoom: 4,
          maxZoom: 10,
          attributionControl: false,
          scrollZoom: false,
          maxBounds: [
            [10, -29],
            [26, -16]
          ],
        });

        map.current.on('error', () => setMapError(true));
        map.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
        map.current.on('click', () => map.current?.scrollZoom.enable());
        mapContainer.current?.addEventListener('mouseleave', () => map.current?.scrollZoom.disable());

        map.current.on('load', () => {
          setIsLoading(false);
          markersRef.current.forEach(m => m.remove());
          markersRef.current = [];

          const storyGroups: Record<string, StoryLocation[]> = {};
          stories.forEach((story) => {
            const coords = story.coordinates;
            if (!coords) return;
            const key = `${coords[0].toFixed(2)},${coords[1].toFixed(2)}`;
            if (!storyGroups[key]) storyGroups[key] = [];
            storyGroups[key].push(story);
          });

          Object.entries(storyGroups).forEach(([key, groupStories]) => {
            const [lng, lat] = key.split(',').map(Number);
            const el = document.createElement('div');
            el.className = 'namibia-story-marker';
            el.innerHTML = `<div style="position: relative;"><svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="10" fill="#0a0a0a" stroke="#ffffff" stroke-width="2"/>${groupStories.length > 1 ? `<text x="14" y="18" text-anchor="middle" fill="white" font-size="10" font-weight="500">${groupStories.length}</text>` : ''}</svg></div>`;
            el.style.cursor = 'pointer';

            const popupContent = groupStories.length === 1
              ? `<a href="/story/${groupStories[0].slug}" style="display: block; padding: 12px 16px; max-width: 240px; background: #0a0a0a; text-decoration: none;"><p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: rgba(255,255,255,0.4); margin-bottom: 6px;">${groupStories[0].category || 'Story'}</p><p style="font-family: 'Libre Baskerville', serif; font-size: 14px; font-weight: 400; color: white; margin-bottom: 4px; line-height: 1.3;">${groupStories[0].title}</p>${groupStories[0].region ? `<p style="font-size: 11px; color: rgba(255,255,255,0.5);">${groupStories[0].region}</p>` : ''}</a>`
              : `<div style="padding: 12px 16px; max-width: 260px; background: #0a0a0a;"><p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: rgba(255,255,255,0.4); margin-bottom: 8px;">${groupStories.length} Stories</p>${groupStories.slice(0, 5).map(s => `<a href="/story/${s.slug}" style="display: block; padding: 6px 0; text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.1);"><p style="font-size: 13px; color: white; margin: 0; line-height: 1.3;">${s.title}</p></a>`).join('')}${groupStories.length > 5 ? `<p style="font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 8px;">+ ${groupStories.length - 5} more</p>` : ''}</div>`;

            const popup = new mapboxgl!.Popup({ offset: 20, closeButton: true, closeOnClick: false, className: 'namibia-popup' }).setHTML(popupContent);
            const marker = new mapboxgl!.Marker(el).setLngLat([lng, lat]).setPopup(popup).addTo(map.current!);
            markersRef.current.push(marker);
            el.addEventListener('click', () => { markersRef.current.forEach(m => m.getPopup()?.remove()); popup.addTo(map.current!); });
          });
        });
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError(true);
        setIsLoading(false);
      }
    };

    initMap();
    return () => { markersRef.current.forEach(m => m.remove()); map.current?.remove(); map.current = null; };
  }, [stories]);

  if (mapError) {
    return (<div className={`relative ${className}`}><div className="w-full h-[400px] md:h-[500px] bg-[#1a1a1a] flex items-center justify-center"><p className="text-white/40 text-sm">Map unavailable</p></div></div>);
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (<div className="absolute inset-0 bg-[#1a1a1a] flex items-center justify-center z-10"><div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>)}
      <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none"><p className="text-xs text-black/50 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full">Tap map to enable scroll</p></div>
      <div ref={mapContainer} className="w-full h-[400px] md:h-[500px]" style={{ backgroundColor: '#f5f0e8' }} />
      <style jsx global>{`.mapboxgl-popup-content{background:#0a0a0a;border-radius:0;box-shadow:0 4px 20px rgba(0,0,0,0.3);padding:0;border:1px solid rgba(255,255,255,0.1)}.mapboxgl-popup-close-button{color:rgba(255,255,255,0.5);font-size:18px;padding:4px 8px}.mapboxgl-popup-close-button:hover{color:white;background:transparent}.mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip{border-top-color:#0a0a0a}.mapboxgl-popup-anchor-top .mapboxgl-popup-tip{border-bottom-color:#0a0a0a}.mapboxgl-popup-anchor-left .mapboxgl-popup-tip{border-right-color:#0a0a0a}.mapboxgl-popup-anchor-right .mapboxgl-popup-tip{border-left-color:#0a0a0a}.namibia-story-marker{transition:transform 0.2s ease}.namibia-story-marker:hover{transform:scale(1.15)}.mapboxgl-ctrl-group{border-radius:0!important;box-shadow:0 1px 4px rgba(0,0,0,0.1)!important;background:#0a0a0a!important;border:1px solid rgba(255,255,255,0.1)!important}.mapboxgl-ctrl-group button{border-radius:0!important;background:#0a0a0a!important}.mapboxgl-ctrl-group button span{filter:invert(1)}.mapboxgl-ctrl-group button:hover{background:#1a1a1a!important}`}</style>
    </div>
  );
}

export function prepareStoriesForNamibiaMap(stories: Array<{ slug: string; title: string; subtitle?: string; category?: string; region?: string; }>): StoryLocation[] {
  return stories.map(story => ({ slug: story.slug, title: story.title, subtitle: story.subtitle, category: story.category, region: story.region, coordinates: getCoordinatesForStory(story.region || '') || NAMIBIA_COORDINATES['Namibia'] }));
}
