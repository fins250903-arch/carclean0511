export interface Metadata {

  title?: string;

  description?: string;

  keywords?: string;

  metadataBase?: URL;

  alternates?: {

    canonical?: string;

  };

  openGraph?: {

    title?: string;

    description?: string;

    url?: string;

    siteName?: string;

    locale?: string;

    type?: string;

    images?: Array<{

      url: string;

      width?: number;

      height?: number;

      alt?: string;

    }>;

  };

  twitter?: {

    card?: string;

    title?: string;

    description?: string;

    images?: string[];

  };

  robots?: {

    index?: boolean;

    follow?: boolean;

    googleBot?: {

      index?: boolean;

      follow?: boolean;

      'max-video-preview'?: number;

      'max-image-preview'?: string;

      'max-snippet'?: number;

    };

  };

}



import { faqData, truckFaqData, flowData, truckFlowData, serviceData, truckServiceData } from '@/data/seoData';

import { INSTAGRAM_URL, LINE_URL, SITE_URL, STORE_NAME } from '@/lib/site';

import { questionnaireTestimonials } from '@/data/questionnaireTestimonials';

import type { AdKeywordPageDef } from '@/data/adKeywordPages';



type RegionOverrides = {

    displayName?: string;

    aiSummary?: string;

    article?: {

        headline: string;

        description: string;

        image: string;

    };

    localBusiness?: {

        areaServed?: unknown;

        description?: string;

        geo?: Record<string, unknown>;

    };

};



type SchemaOptions = {

    /** HowTo スキーマ（作業フロー5ステップ）を含めるか。デフォルト: true */
    includeHowTo?: boolean;

    /** Event スキーマ（キャンペーン情報）を含めるか。デフォルト: true */
    includeEvent?: boolean;

    /** キャンペーン終了日（ISO 8601 形式: 'YYYY-MM-DD'）。デフォルト: '2026-12-31' */
    campaignEndDate?: string;

    /** 広告キーワードLP：WebPage / LocalBusiness の文言・画像 */
    adKeywordSchema?: {

        webPageName: string;

        webPageDescription: string;

        heroImagePath: string;

    };

};



function getDynamicRating(regionName: string) {

    let hash = 0;

    for (let i = 0; i < regionName.length; i++) {

        hash = regionName.charCodeAt(i) + ((hash << 5) - hash);

    }

    const seed = Math.abs(hash);

    const ratingValue = (4.7 + (seed % 4) * 0.1).toFixed(1); // 4.7 to 5.0

    const reviewCount = (12 + (seed % 45)).toString(); // 12 to 56

    return { ratingValue, reviewCount };

}





export const generateRegionMetadata = (regionName: string, path: string = '', niche: 'car' | 'truck' = 'car'): Metadata => {

    const isTruck = niche === 'truck';

    const serviceName = isTruck ? 'トラックキャビン清掃' : '車内クリーニング';

    const mainTitle = isTruck ? `${regionName}の大型トラック・バス キャビン洗浄専門店` : `${regionName}の${STORE_NAME} | 車内クリーニング・シート洗浄・嘔吐消臭`;

    const title = mainTitle;

    

    const carDescription = `${regionName}対応の${STORE_NAME}。車内クリーニング、シート洗浄、車内装クリーニング、臭い消しまで一括対応。嘔吐や灯油こぼし、ペット臭などの緊急トラブルも最短即日で出張施工します。`;

    const truckDescription = `${regionName}の大型トラック・バス専門キャビン洗浄。35,000円から（税込）の納得価格で、プロによる本格洗浄。汚れ・臭い・除菌まで徹底対応。最短即日出張。`;

    const description = isTruck ? truckDescription : carDescription;



    const carKeywords = `車内清掃 特急便 ${regionName}, 車内クリーニング ${regionName}, 車内清掃 ${regionName}, シート洗浄 ${regionName}, 車内装クリーニング ${regionName}, 嘔吐車内清掃 ${regionName}, 車灯油こぼし ${regionName}, 車のシート掃除 ${regionName}, 車座席クリーニング ${regionName}, 車内の臭い消し ${regionName}`;

    const truckKeywords = `トラックキャビン清掃 ${regionName}, 大型トラック 洗浄 ${regionName}, バス 車内清掃 ${regionName}, 10tトラック キャビンクリーニング ${regionName}, トラック 臭い消し ${regionName}, 業務用 車内清掃 ${regionName}`;

    const keywords = isTruck ? truckKeywords : carKeywords;



    const isOsaka = path === '/regions/osaka' || path === '/regions/osaka/';

    const normalizedPath = isOsaka ? '' : path;

    const url = `${SITE_URL}${normalizedPath}${normalizedPath.endsWith('/') ? '' : '/'}`;



    return {

        title,

        description,

        keywords,

        metadataBase: new URL(SITE_URL),

        alternates: {

            canonical: url,

        },

        openGraph: {

            title,

            description,

            url,

            siteName: STORE_NAME,

            locale: 'ja_JP',

            type: 'website',

            images: [

                {

                    url: isTruck ? '/images/truck-fv.png' : '/images/fv.png',

                    width: 1200,

                    height: 630,

                    alt: `${regionName}対応 ${STORE_NAME}`,

                },

            ],

        },

        twitter: {

            card: 'summary_large_image',

            title,

            description,

            images: [isTruck ? '/images/truck-fv.png' : '/images/fv.png'],

        },

        robots: {

            index: true,

            follow: true,

            googleBot: {

                index: true,

                follow: true,

                'max-video-preview': -1,

                'max-image-preview': 'large',

                'max-snippet': -1,

            },

        },

    };

};



export const generateAdKeywordRegionMetadata = (regionName: string, path: string, kw: AdKeywordPageDef): Metadata => {

    const title = `${regionName}の${kw.seoTitle}｜${STORE_NAME}`;

    const description = kw.seoDescription(regionName);

    const keywords = kw.seoKeywords(regionName);

    const normalizedPath = (path.endsWith('/') ? path.slice(0, -1) : path) || path;

    const url = `${SITE_URL}${normalizedPath}/`;

    const ogPath = kw.ogImage;



    return {

        title,

        description,

        keywords,

        metadataBase: new URL(SITE_URL),

        alternates: {

            canonical: url,

        },

        openGraph: {

            title,

            description,

            url,

            siteName: STORE_NAME,

            locale: 'ja_JP',

            type: 'website',

            images: [

                {

                    url: ogPath,

                    width: 1200,

                    height: 630,

                    alt: `${regionName} ${kw.seoTitle} ${STORE_NAME}`,

                },

            ],

        },

        twitter: {

            card: 'summary_large_image',

            title,

            description,

            images: [ogPath],

        },

        robots: {

            index: true,

            follow: true,

            googleBot: {

                index: true,

                follow: true,

                'max-video-preview': -1,

                'max-image-preview': 'large',

                'max-snippet': -1,

            },

        },

    };

};



export const generateJsonLd = (regionName: string, path: string = '', regionOverrides?: RegionOverrides, niche: 'car' | 'truck' = 'car', schemaOptions?: SchemaOptions) => {

    const isTruck = niche === 'truck';

    const isOsaka = path === '/regions/osaka' || path === '/regions/osaka/';

    const normalizedPath = isOsaka ? '' : path;

    const url = `${SITE_URL}${normalizedPath}${normalizedPath.endsWith('/') ? '' : '/'}`;

    const adKwSchema = schemaOptions?.adKeywordSchema;

    const absHeroImageForSchema = adKwSchema?.heroImagePath

        ? (adKwSchema.heroImagePath.startsWith('http') ? adKwSchema.heroImagePath : `${SITE_URL}${adKwSchema.heroImagePath}`)

        : `${SITE_URL}/images/${isTruck ? 'truck-fv.png' : 'fv.png'}`;

    const displayName = regionOverrides?.displayName || regionName;

    

    const carSvcName = '車内クリーニング・消臭洗浄';

    const truckSvcName = 'トラックキャビン清掃・除菌洗浄';

    const currentSvcName = isTruck ? truckSvcName : carSvcName;



    const carDescription = `${regionName}全域対応の車内クリーニング・消臭洗浄サービス。嘔吐、灯油、ペットの臭いを徹底洗浄します。`;

    const truckDescription = `${regionName}の大型トラック・バス専門キャビン洗浄。職人によるプロの技術で汚れ・臭い・除菌を徹底対応します。`;

    const localBusinessDescription = regionOverrides?.aiSummary || regionOverrides?.localBusiness?.description || (isTruck ? truckDescription : carDescription);





    const organization = {

        '@context': 'https://schema.org',

        '@type': 'Organization',

        '@id': `${SITE_URL}/#organization`,

        name: STORE_NAME,

        url: SITE_URL,

        telephone: '070-8428-0866',

        logo: `${SITE_URL}/images/fv.png`,

        sameAs: [INSTAGRAM_URL, LINE_URL],

    };



    const webpage = {

        '@context': 'https://schema.org',

        '@type': 'WebPage',

        '@id': `${url}#webpage`,

        url,

        name: adKwSchema?.webPageName ?? (isTruck ? `${regionName}の大型トラック・バス キャビン洗浄専門店` : `${displayName}の${STORE_NAME}`),

        description: adKwSchema?.webPageDescription ?? (isTruck ? truckDescription : `${regionName}で車内クリーニング、シート洗浄、嘔吐消臭、灯油こぼし清掃に対応する出張LPです。`),

        inLanguage: 'ja-JP',

        dateModified: new Date().toISOString(),

        isPartOf: {

            '@id': `${SITE_URL}/#website`,

        },

        about: {

            '@id': `${url}#service`,

        },

    };



    const website = {

        '@context': 'https://schema.org',

        '@type': 'WebSite',

        '@id': `${SITE_URL}/#website`,

        url: SITE_URL,

        name: STORE_NAME,

        inLanguage: 'ja-JP',

        publisher: {

            '@id': `${SITE_URL}/#organization`,

        },

    };



    const mainEntity = {

        '@context': 'https://schema.org',

        '@type': ['AutoBodyShop', 'LocalBusiness'],

        '@id': `${url}#localbusiness`,

        name: STORE_NAME,

        alternateName: `${displayName}対応 ${STORE_NAME}${isTruck ? '（トラック清掃）' : ''}`,

        image: absHeroImageForSchema,

        description: localBusinessDescription,

        dateModified: new Date().toISOString(),

        url,

        telephone: '070-8428-0866',

        priceRange: isTruck ? '¥35,000〜' : '¥22,000〜',

        brand: STORE_NAME,

        sameAs: [SITE_URL, INSTAGRAM_URL, LINE_URL],

        address: {

            '@type': 'PostalAddress',

            addressRegion: regionName,

            addressCountry: 'JP'

        },

        areaServed: regionOverrides?.localBusiness?.areaServed || {

            '@type': 'State',

            name: regionName,

        },

        geo: regionOverrides?.localBusiness?.geo,

        openingHoursSpecification: {

            '@type': 'OpeningHoursSpecification',

            dayOfWeek: [

                'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'

            ],

            opens: '08:00',

            closes: '22:00',

        },

        aggregateRating: {

            '@type': 'AggregateRating',

            ratingValue: getDynamicRating(regionName).ratingValue,

            reviewCount: questionnaireTestimonials.length.toString(),

            bestRating: '5',

            worstRating: '1',

        },

        review: questionnaireTestimonials.map((t, index) => ({

            '@type': 'Review',

            reviewRating: {

                '@type': 'Rating',

                ratingValue: '5',

                bestRating: '5',

                worstRating: '1',

            },

            author: {

                '@type': 'Person',

                name: t.name,

            },

            reviewBody: t.comment,

            datePublished: new Date(Date.now() - (index * 14 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],

        })),

        hasOfferCatalog: {

            '@type': 'OfferCatalog',

            name: isTruck ? 'トラック清掃メニュー' : '車内クリーニングメニュー',

            itemListElement: (isTruck ? truckServiceData : serviceData).map(service => ({

                '@type': 'Offer',

                itemOffered: {

                    '@type': 'Service',

                    name: service.name,

                    description: service.description

                },

                price: service.price,

                priceCurrency: 'JPY'

            }))

        },

        sameAs: [INSTAGRAM_URL, LINE_URL],

    };



    const service = {

        '@context': 'https://schema.org',

        '@type': 'Service',

        '@id': `${url}#service`,

        name: `${displayName}の${currentSvcName}`,

        serviceType: currentSvcName,

        provider: {

            '@id': `${url}#localbusiness`,

        },

        areaServed: {

            '@type': 'AdministrativeArea',

            name: regionName,

        },

        availableChannel: {

            '@type': 'ServiceChannel',

            serviceUrl: url,

            availableLanguage: 'Japanese',

        },

        audience: {

            '@type': 'Audience',

            audienceType: '車内クリーニングを希望する個人・家族',

        }

    };



    const breadcrumbList = {

        '@context': 'https://schema.org',

        '@type': 'BreadcrumbList',

        itemListElement: [

            {

                '@type': 'ListItem',

                position: 1,

                name: STORE_NAME,

                item: SITE_URL,

            },

            {

                '@type': 'ListItem',

                position: 2,

                name: regionName,

                item: url,

            },

        ],

    };



    const faqPage = {

        '@context': 'https://schema.org',

        '@type': 'FAQPage',

        mainEntity: (isTruck ? truckFaqData : faqData).map(faq => ({

            '@type': 'Question',

            name: faq.q,

            acceptedAnswer: {

                '@type': 'Answer',

                text: faq.a

            }

        }))

    };



    const article = regionOverrides?.article ? {

        '@context': 'https://schema.org',

        '@type': 'Article',

        '@id': `${url}#article`,

        headline: regionOverrides.article.headline,

        description: regionOverrides.article.description,

        image: regionOverrides.article.image.startsWith('http') ? regionOverrides.article.image : `${SITE_URL}${regionOverrides.article.image}`,

        author: {

            '@type': 'Organization',

            name: STORE_NAME,

            url: SITE_URL

        },

        publisher: {

            '@id': `${SITE_URL}/#organization`,

        },

        datePublished: '2024-01-01T00:00:00+09:00',

        dateModified: new Date().toISOString(),

        mainEntity: {

            '@id': `${url}#localbusiness`,

            '@type': ['AutoBodyShop', 'LocalBusiness']

        },

        mainEntityOfPage: {

            '@type': 'WebPage',

            '@id': `${url}#webpage`

        }

    } : null;



    // ---- HowTo スキーマ（作業フロー）----
    const currentFlowData = isTruck ? truckFlowData : flowData;
    const includeHowTo = schemaOptions?.includeHowTo !== false; // デフォルト: true
    const howTo = includeHowTo ? {

        '@context': 'https://schema.org',

        '@type': 'HowTo',

        '@id': `${url}#howto`,

        name: `${displayName}で${currentSvcName}を依頼する手順`,

        description: isTruck
            ? `${regionName}でトラックキャビン清掃をプロに依頼する場合の流れを5ステップで説明します。`
            : `${regionName}で車内クリーニングをプロに依頼する場合の流れを5ステップで説明します。`,

        totalTime: isTruck ? 'PT5H' : 'PT3H',

        estimatedCost: {

            '@type': 'MonetaryAmount',

            currency: 'JPY',

            value: isTruck ? '35000' : '22000',

        },

        supply: [

            { '@type': 'HowToSupply', name: '出張用専用車両（電源・水道不要）' },

            { '@type': 'HowToSupply', name: '100℃スチーム洗浄機' },

            { '@type': 'HowToSupply', name: 'リンサー（強力吸引洗浄機）' },

        ],

        step: currentFlowData.map((item, index) => ({

            '@type': 'HowToStep',

            position: index + 1,

            name: item.title,

            text: item.desc,

            url: `${url}#step-${index + 1}`,

        })),

    } : null;



    // ---- Event スキーマ（キャンペーン）----
    const includeEvent = schemaOptions?.includeEvent !== false; // デフォルト: true
    const campaignEndDate = schemaOptions?.campaignEndDate || '2026-12-31';
    const event = includeEvent ? {

        '@context': 'https://schema.org',

        '@type': 'Event',

        '@id': `${url}#campaign-event`,

        name: `${displayName}WEBキャンペーン｜抗菌コート無料プレゼント`,

        description: `${displayName}でWEBからご予約のお客様限定。通常2,000円の抗菌コートを無料でプレゼント。車内クリーニング後のきれいな状態を長持ちさせ、菌の繁殖を抑えます。`,

        startDate: '2024-01-01',

        endDate: campaignEndDate,

        eventStatus: 'https://schema.org/EventScheduled',

        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',

        location: {

            '@type': 'Place',

            name: regionName,

            address: {

                '@type': 'PostalAddress',

                addressRegion: regionName,

                addressCountry: 'JP',

            },

        },

        organizer: {

            '@type': 'Organization',

            name: STORE_NAME,

            url: SITE_URL,

        },

        offers: {

            '@type': 'Offer',

            name: '抗菌コート無料プレゼント（WEB予約限定）',

            price: '0',

            priceCurrency: 'JPY',

            availability: 'https://schema.org/InStock',

            validFrom: '2024-01-01',

            validThrough: campaignEndDate,

            url,

        },

    } : null;



    const author = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': `${SITE_URL}/#author`,
        name: '車内清掃 特急便 代表',
        jobTitle: '車内クリーニング・消臭専門技術者',
        worksFor: {
            '@id': `${SITE_URL}/#organization`
        },
        description: '年間300台以上の車内クリーニング、嘔吐・ペット臭・灯油消臭を手掛ける専門技術者。',
        url: SITE_URL,
        sameAs: [SITE_URL, INSTAGRAM_URL, LINE_URL],
        knowsAbout: ['車内クリーニング', '嘔吐消臭', '灯油除去', 'ペット臭対策']
    };

    // ---- スキーマ配列の組み立て ----
    const baseSchemas: Record<string, unknown>[] = [organization, website, webpage, mainEntity, service, breadcrumbList, faqPage, author];

    if (article) {
        baseSchemas.push(article);
    }
    if (howTo) {
        baseSchemas.push(howTo);
    }
    if (event) {
        baseSchemas.push(event);
    }

    return baseSchemas;
};



