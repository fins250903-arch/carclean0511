import assert from 'node:assert/strict';
import test from 'node:test';
import { FOCUS_REGION_IDS, isKeptArea, isKeptConcernSlug } from '@/data/consolidationPolicy';
import {
  evidenceForArea,
  evidenceForConcern,
  evidenceIsEmpty,
} from './keptPageEvidence.ts';

test('area pages use only cases that name that area', () => {
  const osakaCity = evidenceForArea('osaka', 'osaka-city');
  assert.ok(osakaCity.posts.some((post) => post.title.includes('大阪市')));
  assert.ok(osakaCity.caseIds.includes('osaka-nbox-vomit'));
  assert.ok(osakaCity.testimonialIds.includes('testimonial-01'));
  assert.equal(osakaCity.posts.some((post) => post.title.includes('堺')), false);

  const kitasen = evidenceForArea('osaka', 'kitasen');
  assert.deepEqual(kitasen.posts, []);
  assert.ok(kitasen.caseIds.includes('osaka-sienta-vomit'));
  assert.ok(kitasen.caseIds.includes('osaka-suita-yaris-kerosene'));

  const senshu = evidenceForArea('osaka', 'senshu');
  assert.ok(senshu.posts.some((post) => post.title.includes('堺市')));
  assert.ok(senshu.caseIds.includes('osaka-car-tobacco'));

  const kobe = evidenceForArea('hyogo', 'kobe');
  assert.ok(kobe.posts.some((post) => post.title.includes('神戸市')));
  assert.deepEqual(kobe.caseIds, []);

  const hanshin = evidenceForArea('hyogo', 'hanshin');
  assert.ok(hanshin.posts.some((post) => post.title.includes('西宮市')));

  const fukuoka = evidenceForArea('fukuoka', 'fukuoka-city');
  assert.ok(fukuoka.posts.some((post) => post.title.includes('博多')));
  const chikugo = evidenceForArea('fukuoka', 'chikugo');
  assert.ok(chikugo.posts.some((post) => post.title.includes('久留米')));
  assert.equal(evidenceIsEmpty(evidenceForArea('fukuoka', 'kitakyushu')), true);

  assert.equal(evidenceIsEmpty(evidenceForArea('osaka', 'kitakawachi')), true);
  assert.equal(evidenceIsEmpty(evidenceForArea('aichi', 'nagoya')), true);
});

test('concern pages use only matching real cases, and list the rest as empty', () => {
  const vomit = evidenceForConcern('osaka', 'vomit-cleaning');
  assert.ok(vomit.posts.some((post) => post.title.includes('嘔吐')));
  assert.ok(vomit.caseIds.includes('osaka-nbox-vomit'));
  assert.ok(vomit.testimonialIds.includes('testimonial-01'));

  const tobacco = evidenceForConcern('osaka', 'tabako-yani');
  assert.ok(tobacco.caseIds.includes('osaka-car-tobacco'));
  const kerosene = evidenceForConcern('osaka', 'touyu-kobosi');
  assert.ok(kerosene.caseIds.includes('osaka-suita-yaris-kerosene'));
  assert.ok(kerosene.testimonialIds.includes('testimonial-02'));

  const hyogoVomit = evidenceForConcern('hyogo', 'vomit-cleaning');
  assert.ok(hyogoVomit.posts.some((post) => post.title.includes('嘔吐')));
  assert.deepEqual(hyogoVomit.testimonialIds, []);

  const miyagiKerosene = evidenceForConcern('miyagi', 'touyu-kobosi');
  assert.ok(miyagiKerosene.posts.some((post) => post.title.includes('灯油')));
  const miyagiVomit = evidenceForConcern('miyagi', 'kyuto-cleaning');
  assert.ok(miyagiVomit.posts.some((post) => post.title.includes('嘔吐')));

  const empty: string[] = [];
  for (const regionId of FOCUS_REGION_IDS) {
    const areaIds =
      regionId === 'osaka'
        ? ['osaka-city', 'kitasen', 'senshu']
        : regionId === 'hyogo'
          ? ['kobe', 'hanshin']
          : regionId === 'fukuoka'
            ? ['fukuoka-city', 'kitakyushu', 'chikugo']
            : [];
    for (const areaId of areaIds) {
      if (!isKeptArea(regionId, areaId)) continue;
      if (evidenceIsEmpty(evidenceForArea(regionId, areaId))) empty.push(`${regionId}/${areaId}`);
    }
  }
  assert.deepEqual(empty, ['fukuoka/kitakyushu']);

  const emptyConcerns: string[] = [];
  for (const regionId of FOCUS_REGION_IDS) {
    for (const slug of [
      'ac-nioi',
      'kareisyu',
      'tabako-yani',
      'vomit-cleaning',
      'kyuto-cleaning',
      'odor-removal',
      'kuruma-nioi-keshi',
      'oshikko',
      'omorashi',
      'pet-nioi',
      'pet-unko',
      'seat-senjo',
      'seat-washing',
      'mold-odor',
      'shanai-nioi',
      'touyu-kobosi',
    ]) {
      if (!isKeptConcernSlug(regionId, slug)) continue;
      if (evidenceIsEmpty(evidenceForConcern(regionId, slug))) {
        emptyConcerns.push(`${regionId}/${slug}`);
      }
    }
  }
  assert.ok(emptyConcerns.includes('osaka/ac-nioi'));
  assert.ok(emptyConcerns.includes('fukuoka/kitakyushu') === false);
  assert.equal(emptyConcerns.includes('osaka/vomit-cleaning'), false);
  assert.equal(emptyConcerns.includes('miyagi/kyuto-cleaning'), false);
  assert.ok(emptyConcerns.length > 0);
});
