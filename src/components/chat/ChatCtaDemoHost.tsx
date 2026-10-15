import React, { useMemo, useState } from 'react';
import ChatCta from './ChatCta';
import { composeAreaLabel } from '@/data/chatCtaScenario';

const DEMO_REGIONS = [
  { id: 'osaka', regionName: '大阪府', displayName: '大阪府', niche: 'car' as const },
  { id: 'fukuoka', regionName: '福岡県', displayName: '福岡県', niche: 'car' as const },
  { id: 'miyagi', regionName: '宮城県', displayName: '宮城県', niche: 'car' as const },
] as const;

export default function ChatCtaDemoHost() {
  const [regionId, setRegionId] = useState<(typeof DEMO_REGIONS)[number]['id']>('osaka');
  const current = useMemo(() => DEMO_REGIONS.find((r) => r.id === regionId) ?? DEMO_REGIONS[0], [regionId]);
  const areaLabel = composeAreaLabel(current.regionName, current.displayName);

  return (
    <>
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-sm font-black text-gray-800">地域の出し分け（ページの props と同じ）</h2>
        <p className="mt-2 text-xs text-gray-500">
          LP は各ページの <code>regionName</code> を渡します。下のタブで福岡に切り替えると、挨拶・LINE本文・折り返しメールが「大阪」ではなく「福岡県」になります。
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {DEMO_REGIONS.map((region) => (
            <button
              key={region.id}
              type="button"
              onClick={() => setRegionId(region.id)}
              className={`rounded-full px-4 py-2 text-sm font-bold ${
                regionId === region.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {region.regionName}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm font-bold text-gray-800">
          いまの引き継ぎ地域：<span className="text-accent">{areaLabel}</span>
        </p>
        <p className="mt-1 font-mono text-[11px] text-gray-500">
          regionName={current.regionName} / displayName={current.displayName} / niche={current.niche}
        </p>
      </section>

      <ChatCta
        key={current.id}
        regionName={current.regionName}
        displayName={current.displayName}
        niche={current.niche}
        teaserDelaySeconds={6}
      />
    </>
  );
}
