import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { usePhoneMask } from '@/hooks/usePhoneMask';
import { useMetaPixel } from '@/hooks/useMetaPixel';
import { useGoogleAnalytics } from '@/hooks/useGoogleAnalytics';
import { CONFIG } from './config';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const buildUrlWithUTMs = (baseUrl: string, utmParams: Record<string, string>): string => {
  try {
    const url = new URL(baseUrl);
    Object.entries(utmParams).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });
    return url.toString();
  } catch {
    return baseUrl;
  }
};

interface CaptureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  utmParams: Record<string, string>;
}

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

export const CaptureModal = ({ open, onOpenChange, utmParams }: CaptureModalProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const phone = usePhoneMask();
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { trackLead: trackMetaLead } = useMetaPixel();
  const { trackLead: trackGALead } = useGoogleAnalytics();

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      newErrors.email = 'E-mail invalido';
    }
    if (!phone.isValid) {
      newErrors.phone = 'Telefone deve ter 11 digitos';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');

    const payload = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.rawValue,
      utm_source: utmParams.utm_source || '',
      utm_medium: utmParams.utm_medium || '',
      utm_campaign: utmParams.utm_campaign || '',
      utm_content: utmParams.utm_content || '',
      utm_term: utmParams.utm_term || '',
    };

    fetch(CONFIG.WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {});

    trackMetaLead();
    trackGALead();

    if (CONFIG.REDIRECT_URL) {
      const redirectWithUTMs = buildUrlWithUTMs(CONFIG.REDIRECT_URL, utmParams);
      window.location.href = redirectWithUTMs;
      return;
    }

    setStatus('success');
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    phone.reset();
    setStatus('idle');
    setErrors({});
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) resetForm();
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md max-w-[92vw] bg-white text-gray-900 rounded-2xl p-0 overflow-hidden">
        <div className="p-6 sm:p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl sm:text-2xl font-bold text-center text-gray-900 tracking-tight">
              {CONFIG.MODAL_TITLE}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 text-sm sm:text-base mt-2">
              {CONFIG.MODAL_SUBTITLE}
            </DialogDescription>
          </DialogHeader>

          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <CheckCircle className="w-14 h-14 text-[#E07A3A]" />
              <p className="text-base sm:text-lg font-semibold text-[#E07A3A]">{CONFIG.MODAL_SUCCESS}</p>
              {CONFIG.REDIRECT_URL && (
                <p className="text-sm text-gray-500">Redirecionando...</p>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Input
                  id="name"
                  type="text"
                  placeholder="Primeiro nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="given-name"
                  className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 h-12 rounded-xl focus-visible:ring-2 focus-visible:ring-[#E07A3A]/40 focus-visible:ring-offset-0 focus-visible:border-[#E07A3A] focus:ring-0"
                />
                {errors.name && (
                  <p className="text-xs text-red-500 pl-1">{errors.name}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Input
                  id="email"
                  type="email"
                  placeholder="Melhor e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 h-12 rounded-xl focus-visible:ring-2 focus-visible:ring-[#E07A3A]/40 focus-visible:ring-offset-0 focus-visible:border-[#E07A3A] focus:ring-0"
                />
                {errors.email && (
                  <p className="text-xs text-red-500 pl-1">{errors.email}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Telefone com DDD"
                  value={phone.value}
                  onChange={phone.handleChange}
                  autoComplete="tel-national"
                  className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 h-12 rounded-xl focus-visible:ring-2 focus-visible:ring-[#E07A3A]/40 focus-visible:ring-offset-0 focus-visible:border-[#E07A3A] focus:ring-0"
                />
                {errors.phone && (
                  <p className="text-xs text-red-500 pl-1">{errors.phone}</p>
                )}
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{CONFIG.MODAL_ERROR}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-[#E07A3A] hover:bg-[#C85D25] text-white font-bold h-12 sm:h-14 text-base sm:text-lg rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(224,122,58,0.4)]"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Enviando...
                  </>
                ) : (
                  CONFIG.MODAL_SUBMIT
                )}
              </Button>

              <p className="text-xs text-center text-gray-400 pt-1">
                {CONFIG.MODAL_PRIVACY}
              </p>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
