import { CONFIG } from './config';

export const ImersaoFooter = () => {
  return (
    <footer className="py-8 bg-[#FAF9F7] border-t border-black/[0.06]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[#7A7A7A] text-xs sm:text-sm">
          {CONFIG.COPYRIGHT}
        </p>
      </div>
    </footer>
  );
};
