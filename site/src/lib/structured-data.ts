// site/src/lib/structured-data.ts
export function buildStructuredData({ canonical, eventStart, eventEnd, redirectUrl }: {
  canonical: string;
  eventStart: string;
  eventEnd: string;
  redirectUrl: string;
}) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Grupo VUK',
      url: 'https://grupovuk.com.br',
      logo: `${canonical}favicon.png`,
      sameAs: ['https://www.instagram.com/grupovuk', 'https://www.youtube.com/@mateusdiasmkt'],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Intensivo Claude Code',
      url: canonical,
      inLanguage: 'pt-BR',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: 'Intensivo Claude Code',
      startDate: eventStart,
      endDate: eventEnd,
      eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      location: { '@type': 'VirtualLocation', url: 'https://zoom.us/j/TODO' },
      description: 'Intensivo online ao vivo para construir 10 agentes de IA em 1 sabado, sem programar.',
      organizer: { '@type': 'Organization', name: 'Grupo VUK', url: 'https://grupovuk.com.br' },
      image: [`${canonical}og-image.png`],
      offers: {
        '@type': 'Offer',
        priceCurrency: 'BRL',
        price: '27.00',
        availability: 'https://schema.org/InStock',
        validFrom: '2026-04-22',
        url: redirectUrl,
      },
      performer: { '@type': 'Person', name: 'Mateus Dias' },
    },
  ];
}
