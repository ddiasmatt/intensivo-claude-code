import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ImersaoHeroSection } from '@/components/imersao/ImersaoHeroSection';
import { ImersaoBenefitsSection } from '@/components/imersao/ImersaoBenefitsSection';
import { ImersaoTimelineSection } from '@/components/imersao/ImersaoTimelineSection';
import { ImersaoTestimonialsSection } from '@/components/imersao/ImersaoTestimonialsSection';
import { ImersaoUseCasesSection } from '@/components/imersao/ImersaoUseCasesSection';
import { ImersaoFinalSection } from '@/components/imersao/ImersaoFinalSection';
import { ImersaoFAQSection } from '@/components/imersao/ImersaoFAQSection';
import { ImersaoFooter } from '@/components/imersao/ImersaoFooter';
import { CaptureModal } from '@/components/imersao/CaptureModal';
import { CONFIG } from '@/components/imersao/config';

const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

const Intensivo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [utmParams, setUtmParams] = useState<Record<string, string>>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const captured: Record<string, string> = {};
    UTM_PARAMS.forEach((param) => {
      const value = params.get(param);
      if (value) captured[param] = value;
    });
    setUtmParams(captured);
  }, []);

  const openModal = () => setIsModalOpen(true);

  return (
    <>
      <Helmet>
        <title>Intensivo Claude Code — Produza por 10 pessoas em 1 sabado</title>
        <meta
          name="description"
          content="Evento ao vivo sabado 16/05 no Zoom. Um dia inteiro montando o Sistema 10x com Claude Code. Oferta unica de R$27 no ingresso para quem entra no grupo antes de 26/04."
        />
        <meta property="og:title" content="Intensivo Claude Code — Produza por 10 pessoas em 1 sabado" />
        <meta
          property="og:description"
          content="Evento ao vivo 16/05. O Sistema 10x com Claude Code. Oferta unica de R$27 no grupo."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://intensivo.grupovuk.com.br/" />
        <meta property="og:image" content="https://intensivo.grupovuk.com.br/og-image.png" />
        <meta property="og:locale" content="pt_BR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Intensivo Claude Code — Produza por 10 pessoas em 1 sabado" />
        <meta name="twitter:description" content="Evento ao vivo 16/05. O Sistema 10x com Claude Code." />
        <meta name="twitter:image" content="https://intensivo.grupovuk.com.br/og-image.png" />
        <link rel="canonical" href="https://intensivo.grupovuk.com.br/" />
      </Helmet>

      {/* Top bar urgencia */}
      <button
        onClick={openModal}
        className="w-full bg-[#E07A3A] hover:bg-[#C85D25] text-white font-semibold text-xs sm:text-sm py-2.5 px-4 text-center transition-colors cursor-pointer tracking-wide"
        aria-label="Abrir formulario de captura"
      >
        {CONFIG.TOP_BAR_TEXT}
      </button>

      <main className="bg-[#FAF9F7] text-[#1A1A1A] font-sans">
        <ImersaoHeroSection onOpenModal={openModal} />
        <ImersaoTestimonialsSection />
        <ImersaoUseCasesSection />
        <ImersaoBenefitsSection onOpenModal={openModal} />
        <ImersaoTimelineSection />
        <ImersaoFinalSection onOpenModal={openModal} />
        <ImersaoFAQSection />
        <ImersaoFooter />
      </main>

      <CaptureModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        utmParams={utmParams}
      />
    </>
  );
};

export default Intensivo;
