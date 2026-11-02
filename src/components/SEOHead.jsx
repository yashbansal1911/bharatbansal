import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Reusable SEO, GEO & AEO Head component for React single page application.
 * Dynamically updates document head tags and injects rich JSON-LD Schema.org graphs.
 */
export default function SEOHead({
  title = "Parity Premium Mustard Oil | B Forever Foods Pvt Ltd",
  description = "Pure cold-pressed Kachi Ghani mustard oil by B Forever Foods Pvt Ltd. Double filtered, unrefined, zero preservatives with bold pungency and high omega-3 content.",
  keywords = "Parity Mustard Oil, B Forever Foods, Cold Pressed Mustard Oil, Kachi Ghani Oil, Pure Mustard Oil, Unrefined Cooking Oil, Indian Mustard Oil",
  image = "https://bforeverfoods.com/images/mustard-oil-new.jpg",
  path = "",
  type = "website",
  schemaGraph = null,
  faqs = null,
  recipeData = null,
  productData = null
}) {
  const location = useLocation();
  const currentPath = path || location.pathname;
  const canonicalUrl = `https://bforeverfoods.com${currentPath === '/' ? '' : currentPath}`;

  useEffect(() => {
    // 1. Update Document Title
    document.title = title;

    // Helper function to update or create meta tag
    const updateMetaTag = (selector, attributeName, attributeValue, content) => {
      let element = document.head.querySelector(`meta[${selector}="${attributeName}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(selector, attributeName);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper function to update link tag
    const updateLinkTag = (rel, href) => {
      let link = document.head.querySelector(`link[rel="${rel}"]`);
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };

    // 2. Standard Meta Tags
    updateMetaTag('name', 'description', description);
    updateMetaTag('name', 'keywords', keywords);
    updateMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    updateMetaTag('name', 'author', 'B Forever Foods Pvt Ltd');

    // 3. Canonical Tag
    updateLinkTag('canonical', canonicalUrl);

    // 4. Open Graph Meta Tags
    updateMetaTag('property', 'og:site_name', 'B Forever Foods - Parity Mustard Oil');
    updateMetaTag('property', 'og:type', type);
    updateMetaTag('property', 'og:title', title);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:url', canonicalUrl);
    updateMetaTag('property', 'og:image', image);
    updateMetaTag('property', 'og:locale', 'en_IN');

    // 5. Twitter Card Meta Tags
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', title);
    updateMetaTag('name', 'twitter:description', description);
    updateMetaTag('name', 'twitter:image', image);

    // 6. GEO & AEO JSON-LD Schema Construction
    const defaultGraph = [
      {
        "@type": ["Organization", "Corporation"],
        "@id": "https://bforeverfoods.com/#organization",
        "name": "B Forever Foods Pvt Ltd",
        "legalName": "B Forever Foods Private Limited",
        "alternateName": [
          "B Forever Foods",
          "Parity",
          "Parity Foods",
          "Parity Mustard Oil",
          "Parity Kachi Ghani"
        ],
        "url": "https://bforeverfoods.com",
        "logo": {
          "@type": "ImageObject",
          "@id": "https://bforeverfoods.com/#logo",
          "url": "https://bforeverfoods.com/images/parity-logo-new.png",
          "contentUrl": "https://bforeverfoods.com/images/parity-logo-new.png",
          "caption": "B Forever Foods Pvt Ltd - Parity Mustard Oil Logo"
        },
        "image": "https://bforeverfoods.com/images/parity-mustard-oil-5l-jar.png",
        "description": "B Forever Foods Pvt Ltd is a premier Indian manufacturer of traditional cold-pressed (Kachi Ghani) mustard oil, operating from Morena, Madhya Pradesh with pan-India distribution.",
        "foundingDate": "1980",
        "foundingLocation": {
          "@type": "Place",
          "name": "Morena, Madhya Pradesh, India"
        },
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Industrial Area",
          "addressLocality": "Morena",
          "addressRegion": "Madhya Pradesh",
          "postalCode": "476001",
          "addressCountry": "IN"
        },
        "areaServed": {
          "@type": "Country",
          "name": "India",
          "description": "All India Delivery & Wholesale Distribution"
        },
        "sameAs": [
          "https://www.facebook.com/bforeverfoods",
          "https://www.instagram.com/paritymustardoil/"
        ],
        "knowsAbout": [
          "Mustard Oil",
          "Kachi Ghani Mustard Oil",
          "Cold Pressed Oil",
          "Edible Oil Manufacturing",
          "Morena Mustard Seed Heritage"
        ],
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "email": "info@bforeverfoods.com",
            "telephone": "+91-9111512398",
            "areaServed": "IN",
            "availableLanguage": ["English", "Hindi"]
          },
          {
            "@type": "ContactPoint",
            "contactType": "sales",
            "email": "info@bforeverfoods.com",
            "telephone": "+91-9111512398",
            "areaServed": "IN",
            "availableLanguage": ["English", "Hindi"]
          }
        ]
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://bforeverfoods.com/#local-business-morena",
        "name": "B Forever Foods Pvt Ltd - Parity Mustard Oil Morena Plant",
        "url": "https://bforeverfoods.com/parity-kachi-ghani-mustard-oil",
        "telephone": "+91-9111512398",
        "priceRange": "₹220 - ₹3300",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Industrial Area",
          "addressLocality": "Morena",
          "addressRegion": "Madhya Pradesh",
          "postalCode": "476001",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 26.4998,
          "longitude": 77.9944
        },
        "areaServed": [
          {
            "@type": "Country",
            "name": "India"
          },
          "All India",
          "Pan India",
          "Morena",
          "Madhya Pradesh"
        ],
        "knowsAbout": ["Mustard Oil Morena", "Morena Kachi Ghani Mustard Oil", "Cold Pressed Mustard Oil"]
      },
      {
        "@type": "WebSite",
        "@id": "https://bforeverfoods.com/#website",
        "url": "https://bforeverfoods.com",
        "name": "B Forever Foods Pvt Ltd",
        "alternateName": "Parity Mustard Oil",
        "publisher": {
          "@id": "https://bforeverfoods.com/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://bforeverfoods.com/shop?search={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "ItemList",
        "@id": "https://bforeverfoods.com/#sitelinks",
        "name": "Primary Site Navigation",
        "description": "Key links for Google Sitelinks",
        "itemListElement": [
          {
            "@type": "SiteNavigationElement",
            "position": 1,
            "name": "Contact",
            "description": "Corporate office, distributorship opportunities, and customer support for B Forever Foods.",
            "url": "https://bforeverfoods.com/contact"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 2,
            "name": "About Us",
            "description": "Over 25+ years of trust, traditional stone milling heritage, and the story of Parity Mustard Oil.",
            "url": "https://bforeverfoods.com/about"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 3,
            "name": "Shop Products",
            "description": "Buy 100% pure cold-pressed mustard oil in 1L Bottle, 1L Pouch, 5L Jar, and 15kg Tin packs.",
            "url": "https://bforeverfoods.com/shop"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 4,
            "name": "Kachi Ghani Mustard Oil",
            "description": "Authentic stone-pressed cold-extraction mustard oil directly from Morena plant.",
            "url": "https://bforeverfoods.com/parity-kachi-ghani-mustard-oil"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 5,
            "name": "Why Us",
            "description": "Zero chemical solvents, unrefined purity, high Omega-3, and laboratory certified quality.",
            "url": "https://bforeverfoods.com/why-us"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 6,
            "name": "Traditional Recipes",
            "description": "Regional Indian recipes crafted with Parity Cold-Pressed Mustard Oil.",
            "url": "https://bforeverfoods.com/recipes"
          }
        ]
      },
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        "url": canonicalUrl,
        "name": title,
        "description": description,
        "isPartOf": {
          "@id": "https://bforeverfoods.com/#website"
        },
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": [".speakable-summary", ".speakable-title", ".speakable-answer"]
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://bforeverfoods.com"
          },
          ...(currentPath !== '/' ? [
            {
              "@type": "ListItem",
              "position": 2,
              "name": title.split('|')[0].trim(),
              "item": canonicalUrl
            }
          ] : [])
        ]
      }
    ];

    // Merge custom schema graphs if provided
    let finalGraph = [...defaultGraph];

    if (schemaGraph && Array.isArray(schemaGraph)) {
      finalGraph = [...finalGraph, ...schemaGraph];
    }

    // Include FAQ Schema if faqs prop passed
    if (faqs && Array.isArray(faqs) && faqs.length > 0) {
      const faqSchema = {
        "@type": "FAQPage",
        "@id": `${canonicalUrl}#faq`,
        "mainEntity": faqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      };
      finalGraph.push(faqSchema);
    }

    // Include Recipe Schema if recipeData prop passed
    if (recipeData) {
      const recipeSchema = {
        "@type": "Recipe",
        "@id": `${canonicalUrl}#recipe`,
        "name": recipeData.title,
        "image": recipeData.image ? [recipeData.image.startsWith('http') ? recipeData.image : `https://bforeverfoods.com${recipeData.image}`] : ["https://bforeverfoods.com/images/mustard-oil-new.jpg"],
        "description": recipeData.desc || recipeData.intro,
        "prepTime": "PT10M",
        "cookTime": recipeData.time ? `PT${parseInt(recipeData.time) || 30}M` : "PT30M",
        "totalTime": recipeData.time ? `PT${(parseInt(recipeData.time) || 30) + 10}M` : "PT40M",
        "recipeYield": recipeData.serves ? `${recipeData.serves} servings` : "4 servings",
        "recipeCategory": "Main Course",
        "recipeCuisine": recipeData.tags && recipeData.tags.length > 0 ? recipeData.tags[0] : "Indian",
        "keywords": recipeData.tags ? recipeData.tags.join(', ') : "Mustard Oil, Indian Recipe",
        "author": {
          "@type": "Organization",
          "name": "Parity Foods Kitchen"
        },
        "publisher": {
          "@id": "https://bforeverfoods.com/#organization"
        },
        "recipeIngredient": recipeData.ingredients || [],
        "recipeInstructions": (recipeData.steps || []).map((step, idx) => ({
          "@type": "HowToStep",
          "position": idx + 1,
          "name": step.title,
          "text": step.desc
        }))
      };
      finalGraph.push(recipeSchema);
    }

    // Include Product Schema if productData passed
    if (productData) {
      const productSchema = {
        "@type": "Product",
        "@id": `${canonicalUrl}#product`,
        "name": productData.name || "Parity Premium Mustard Oil",
        "image": productData.image ? (productData.image.startsWith('http') ? productData.image : `https://bforeverfoods.com${productData.image}`) : "https://bforeverfoods.com/images/mustard-oil-new.jpg",
        "description": productData.details || productData.desc || "Pure cold-pressed kachi ghani mustard oil.",
        "brand": {
          "@type": "Brand",
          "name": "Parity"
        },
        "manufacturer": {
          "@id": "https://bforeverfoods.com/#organization"
        },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "INR",
          "price": productData.price || "350",
          "availability": "https://schema.org/InStock",
          "url": canonicalUrl,
          "seller": {
            "@id": "https://bforeverfoods.com/#organization"
          }
        }
      };
      finalGraph.push(productSchema);
    }

    // 7. Inject JSON-LD Script into <head>
    let scriptTag = document.head.querySelector('#jsonld-dynamic-seo');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'jsonld-dynamic-seo';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    scriptTag.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": finalGraph
    });

  }, [title, description, keywords, image, currentPath, type, schemaGraph, faqs, recipeData, productData, canonicalUrl]);

  return null;
}
