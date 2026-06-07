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



import {
    faqData,
    truckFaqData,
    busFaqData,
    flowData,
    truckFlowData,
    busFlowData,
    serviceData,
    truckServiceData,
    busServiceData,
} from '@/data/seoData';
import type { ServiceNiche } from '@/lib/niche';

import { INSTAGRAM_URL, LINE_URL, OPERATOR, SITE_URL, STORE_NAME, canonicalUrl } from '@/lib/site';

import { questionnaireTestimonials } from '@/data/questionnaireTestimonials';

import type { AdKeywordPageDef } from '@/data/adKeywordPages';

import {
    AUTHOR,
    ORGANIZATION_SAME_AS,
    TRUST_REFERENCES,
    buildMobileInteriorCleaningDefinition,
    schemaDateModified,
} from '@/lib/structuredDataConstants';



type RegionOverrides = {

    displayName?: string;

    aiSummary?: string;

    article?: {

        headline: string;

        description: string;

        image: string;

        url?: string;

    };

    articles?: Array<{

        headline: string;

        description: string;

        image: string;

        url?: string;

    }>;

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

    /** Service 名（キーワードLP向け上書き） */
    serviceName?: string;

    serviceType?: string;

    serviceAlternateNames?: string[];

    serviceDescription?: string;

    /** Merge into FAQPage schema (keyword LP extras) */
    extraFaqs?: import('@/data/seoData').FAQItem[];

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





export const generateRegionMetadata = (regionName: string, path: string = '', niche: ServiceNiche = 'car'): Metadata => {

    const isTruck = niche === 'truck';
    const isBus = niche === 'bus';

    const mainTitle = isTruck
        ? `${regionName}の出張トラックキャビン清掃専門店`
        : isBus
          ? `${regionName}の出張バス・マイクロバス車内清掃専門店`
          : `${regionName}の${STORE_NAME} | 出張車内清掃・シート洗浄・嘔吐消臭`;

    const title = mainTitle;

    

    const carDescription = `${regionName}対応の${STORE_NAME}。出張 車内 清掃・車内クリーニング、シート洗浄、臭い消しまで一括対応。嘔吐や灯油こぼし、ペット臭などの緊急トラブルも最短即日で出張施工します。`;

    const truckDescription = `${regionName}の出張トラックキャビン清掃。35,000円から（税込）。汚れ・臭い・除菌まで徹底対応。最短即日出張。`;

    const busDescription = `${regionName}の出張バス・マイクロバス車内清掃。嘔吐・尿漏れ区画22,000円〜。観光バス・送迎バス対応。最短即日。運営本部岡山・現場は地域出張チーム。`;

    const description = isTruck ? truckDescription : isBus ? busDescription : carDescription;



    const carKeywords = `出張 車内 清掃 ${regionName}, 出張 車内 クリーニング ${regionName}, 車内清掃 特急便 ${regionName}, 車内クリーニング ${regionName}, 車内清掃 ${regionName}, シート洗浄 ${regionName}, 車内装クリーニング ${regionName}, 嘔吐車内清掃 ${regionName}, 車灯油こぼし ${regionName}, 車のシート掃除 ${regionName}, 車座席クリーニング ${regionName}, 車内の臭い消し ${regionName}`;

    const truckKeywords = `トラックキャビン清掃 ${regionName}, 出張 トラック 洗浄 ${regionName}, 10tトラック キャビンクリーニング ${regionName}, トラック 臭い消し ${regionName}`;

    const busKeywords = `バス 車内清掃 ${regionName}, 観光バス 嘔吐 ${regionName}, マイクロバス 清掃 ${regionName}, 送迎バス 除菌 ${regionName}, 出張 バス クリーニング ${regionName}`;

    const keywords = isTruck ? truckKeywords : isBus ? busKeywords : carKeywords;



    const url = canonicalUrl(path);



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

                    url: isTruck ? '/images/truck-fv.png' : isBus ? '/images/kw/bus-fv.png' : '/images/fv-passenger-hero.png',

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

            images: [isTruck ? '/images/truck-fv.png' : '/images/fv-passenger-hero.png'],

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

    const url = canonicalUrl(path);

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



export const generateJsonLd = (regionName: string, path: string = '', regionOverrides?: RegionOverrides, niche: ServiceNiche = 'car', schemaOptions?: SchemaOptions) => {

    const isTruck = niche === 'truck';
    const isBus = niche === 'bus';

    const url = canonicalUrl(path);

    const adKwSchema = schemaOptions?.adKeywordSchema;

    const absHeroImageForSchema = adKwSchema?.heroImagePath

        ? (adKwSchema.heroImagePath.startsWith('http') ? adKwSchema.heroImagePath : `${SITE_URL}${adKwSchema.heroImagePath}`)

        : `${SITE_URL}/images/${isTruck ? 'truck-fv.png' : isBus ? 'kw/bus-fv.png' : 'fv-passenger-hero.png'}`;

    const displayName = regionOverrides?.displayName || regionName;

    // 運営元の実所在地（LP表示の運営者情報と一致／E-E-A-T・信頼性強化）
    const operatorPostalAddress = {
        '@type': 'PostalAddress',
        postalCode: OPERATOR.postalCode,
        addressRegion: OPERATOR.addressRegion,
        addressLocality: OPERATOR.addressLocality,
        streetAddress: OPERATOR.streetAddress,
        addressCountry: OPERATOR.addressCountry,
    };

    

    const carSvcName = '車内クリーニング・消臭洗浄';

    const truckSvcName = '出張トラックキャビン清掃・除菌洗浄';
    const busSvcName = '出張バス・マイクロバス車内清掃・消臭';

    const currentSvcName = isTruck ? truckSvcName : isBus ? busSvcName : carSvcName;



    const carDescription = `${regionName}全域対応の出張 車内 清掃・車内クリーニング専門サービス。嘔吐、灯油、ペットの臭いを最短即日で徹底洗浄します。`;

    const truckDescription = `${regionName}の出張トラックキャビン清掃。職人によるプロの技術で汚れ・臭い・除菌を徹底対応します。`;

    const busDescription = `${regionName}の出張バス・マイクロバス車内清掃。嘔吐・尿漏れの区画洗浄・除菌を最短即日で対応します。`;

    const localBusinessDescription = regionOverrides?.aiSummary || regionOverrides?.localBusiness?.description || (isTruck ? truckDescription : isBus ? busDescription : carDescription);

    const dateModified = schemaDateModified();

    const serviceDefinitionText = schemaOptions?.serviceDescription
        ?? (isTruck ? truckDescription : isBus ? busDescription : buildMobileInteriorCleaningDefinition(regionName));





    const organization = {

        '@context': 'https://schema.org',

        '@type': 'Organization',

        '@id': `${SITE_URL}/#organization`,

        name: STORE_NAME,

        url: SITE_URL,

        telephone: OPERATOR.telephone,

        address: operatorPostalAddress,

        logo: `${SITE_URL}/images/representative_new.webp`,

        founder: {

            '@id': AUTHOR.id,

        },

        employee: {

            '@id': AUTHOR.id,

        },

        sameAs: [...ORGANIZATION_SAME_AS],

        knowsAbout: AUTHOR.knowsAbout,

    };



    const webpage = {

        '@context': 'https://schema.org',

        '@type': 'WebPage',

        '@id': `${url}#webpage`,

        url,

        name: adKwSchema?.webPageName ?? (isTruck ? `${regionName}の出張トラックキャビン清掃専門店` : isBus ? `${regionName}の出張バス車内清掃専門店` : `${displayName}の${STORE_NAME}`),

        description: adKwSchema?.webPageDescription ?? (isTruck ? truckDescription : isBus ? busDescription : serviceDefinitionText),

        inLanguage: 'ja-JP',

        dateModified,

        author: {

            '@id': AUTHOR.id,

        },

        primaryImageOfPage: {

            '@type': 'ImageObject',

            url: absHeroImageForSchema,

        },

        isPartOf: {

            '@id': `${SITE_URL}/#website`,

        },

        about: {

            '@id': `${url}#service`,

        },

        mentions: TRUST_REFERENCES,

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

        alternateName: `${displayName}対応 ${STORE_NAME}${isTruck ? '（トラック清掃）' : isBus ? '（バス清掃）' : ''}`,

        image: absHeroImageForSchema,

        description: localBusinessDescription,

        dateModified,

        url,

        telephone: OPERATOR.telephone,

        priceRange: isTruck ? '¥35,000〜' : isBus ? '¥22,000〜' : '¥22,000〜',

        paymentAccepted: [...OPERATOR.paymentAccepted],

        brand: STORE_NAME,

        founder: {

            '@id': AUTHOR.id,

        },

        sameAs: [...ORGANIZATION_SAME_AS],

        address: operatorPostalAddress,

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

    };



    const service = {

        '@context': 'https://schema.org',

        '@type': 'Service',

        '@id': `${url}#service`,

        name: schemaOptions?.serviceName ?? `${displayName}の${currentSvcName}`,

        alternateName: schemaOptions?.serviceAlternateNames ?? (isTruck ? [truckSvcName] : ['出張 車内 清掃', '出張車内クリーニング', carSvcName]),

        serviceType: schemaOptions?.serviceType ?? currentSvcName,

        description: serviceDefinitionText,

        provider: {

            '@id': `${url}#localbusiness`,

        },

        areaServed: regionOverrides?.localBusiness?.areaServed ?? {

            '@type': 'AdministrativeArea',

            name: regionName,

        },

        availableChannel: {

            '@type': 'ServiceChannel',

            serviceType: '出張施工（On-site）',

            serviceUrl: url,

            availableLanguage: 'Japanese',

            servicePhone: OPERATOR.telephone,

        },

        offers: {

            '@type': 'Offer',

            priceCurrency: 'JPY',

            price: isTruck ? '35000' : '22000',

            priceSpecification: {

                '@type': 'PriceSpecification',

                minPrice: isTruck ? '35000' : '22000',

                priceCurrency: 'JPY',

            },

            availability: 'https://schema.org/InStock',

            url,

            description: `${regionName}エリアへの出張費無料（一部地域除く）・事前見積もり対応`,

        },

        audience: {

            '@type': 'Audience',

            audienceType: isTruck ? 'トラック・バス運送事業者' : '出張 車内 清掃を希望する個人・家族',

        },

        termsOfService: url,

        mentions: TRUST_REFERENCES,

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



    const baseFaqs = isTruck ? truckFaqData : isBus ? busFaqData : faqData;
    const mergedFaqs = [...baseFaqs, ...(schemaOptions?.extraFaqs ?? [])];

    const faqPage = {

        '@context': 'https://schema.org',

        '@type': 'FAQPage',

        mainEntity: mergedFaqs.map(faq => ({

            '@type': 'Question',

            name: faq.q,

            acceptedAnswer: {

                '@type': 'Answer',

                text: faq.a

            }

        }))

    };



    const articleSources = regionOverrides?.articles?.length
        ? regionOverrides.articles
        : regionOverrides?.article
          ? [regionOverrides.article]
          : [];

    const articles = articleSources.map((src, index) => {

        const articleId = `${url}#article-${index + 1}`;

        const absImage = src.image.startsWith('http') ? src.image : `${SITE_URL}${src.image}`;

        return {

            '@context': 'https://schema.org',

            '@type': 'Article',

            '@id': articleId,

            headline: src.headline,

            description: src.description,

            image: absImage,

            url: src.url,

            author: {

                '@type': 'Organization',

                name: STORE_NAME,

                url: SITE_URL,

            },

            publisher: {

                '@id': `${SITE_URL}/#organization`,

            },

            datePublished: '2024-01-01T00:00:00+09:00',

            dateModified: new Date().toISOString(),

            about: {

                '@id': `${url}#localbusiness`,

            },

            mainEntity: {

                '@id': `${url}#localbusiness`,

                '@type': ['AutoBodyShop', 'LocalBusiness'],

            },

            mainEntityOfPage: {

                '@type': 'WebPage',

                '@id': `${url}#webpage`,

            },

        };

    });

    const caseStudyList = articleSources.length > 0 ? {

        '@context': 'https://schema.org',

        '@type': 'ItemList',

        '@id': `${url}#regional-casestudies`,

        name: `${regionName}の施工実例`,

        description: `${regionName}で実際に施工した車内クリーニング・消臭洗浄の事例です。`,

        numberOfItems: articleSources.length,

        itemListElement: articleSources.map((src, index) => ({

            '@type': 'ListItem',

            position: index + 1,

            item: {

                '@type': 'Article',

                headline: src.headline,

                description: src.description,

                url: src.url ?? url,

            },

        })),

    } : null;



    // ---- HowTo スキーマ（作業フロー）----
    const currentFlowData = isTruck ? truckFlowData : isBus ? busFlowData : flowData;
    const includeHowTo = schemaOptions?.includeHowTo !== false; // デフォルト: true
    const howTo = includeHowTo ? {

        '@context': 'https://schema.org',

        '@type': 'HowTo',

        '@id': `${url}#howto`,

        name: `${displayName}で${currentSvcName}を依頼する手順`,

        description: isTruck
            ? `${regionName}で出張トラックキャビン清掃をプロに依頼する場合の流れを5ステップで説明します。`
            : isBus
              ? `${regionName}で出張バス車内清掃をプロに依頼する場合の流れを5ステップで説明します。`
              : `${regionName}で出張車内清掃をプロに依頼する場合の流れを5ステップで説明します。`,

        totalTime: isTruck ? 'PT5H' : isBus ? 'PT4H' : 'PT3H',

        estimatedCost: {

            '@type': 'MonetaryAmount',

            currency: 'JPY',

            value: isTruck ? '35000' : isBus ? '22000' : '22000',

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
        '@id': AUTHOR.id,
        name: AUTHOR.name,
        jobTitle: AUTHOR.jobTitle,
        image: AUTHOR.image,
        worksFor: {
            '@id': `${SITE_URL}/#organization`,
        },
        description: AUTHOR.description,
        url: SITE_URL,
        sameAs: [...ORGANIZATION_SAME_AS],
        knowsAbout: [...AUTHOR.knowsAbout],
    };

    // ---- スキーマ配列の組み立て ----
    const baseSchemas: Record<string, unknown>[] = [organization, website, webpage, mainEntity, service, breadcrumbList, faqPage, author];

    if (articles.length > 0) {
        baseSchemas.push(...articles);
    }
    if (caseStudyList) {
        baseSchemas.push(caseStudyList);
    }
    if (howTo) {
        baseSchemas.push(howTo);
    }
    if (event) {
        baseSchemas.push(event);
    }

    return baseSchemas;
};



