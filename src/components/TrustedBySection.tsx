import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";

export interface TrustedByLogo {
  _id: string;
  companyName: string;
  logo: string;
  websiteUrl?: string;
  isActive: boolean;
  order: number;
}

interface TrustedBySectionProps {
  logos: TrustedByLogo[];
}

export default function TrustedBySection({ logos }: TrustedBySectionProps) {
  // If no logos are configured yet in the admin panel, do not render an empty section
  if (!logos || logos.length === 0) {
    return null;
  }

  // To make infinite marquee continuous and seamless, duplicate items if array is short
  const displayLogos =
    logos.length < 6
      ? [...logos, ...logos, ...logos, ...logos]
      : [...logos, ...logos];

  return (
    <section className="relative w-full py-12 md:py-16 bg-[#040404] border-t border-white/5 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[120px] bg-lenux-emerald/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 mb-8 text-center relative z-10">
        <ScrollReveal>
          <div className="inline-flex items-center px-5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-gray-300 text-sm sm:text-base font-semibold tracking-wider uppercase mb-2">
            Trusted by
          </div>

        </ScrollReveal>
      </div>

      {/* Marquee Track with Gradient Fades on Left & Right */}
      <div className="relative w-full overflow-hidden">
        {/* Left and Right Gradient Mask for smooth fade-in / fade-out */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[#040404] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[#040404] to-transparent z-10" />

        {/* Marquee Container */}
        <div className="flex w-max animate-marquee pause-hover items-center gap-6 sm:gap-10 py-2">
          {displayLogos.map((item, index) => {
            const logoContent = (
              <div
                className="group/logo relative h-16 sm:h-20 px-6 sm:px-10 flex items-center justify-center transition-all duration-300 shrink-0"
              >
                <div className="relative h-12 sm:h-16 w-full flex items-center justify-center">
                  <Image
                    src={item.logo}
                    alt={item.companyName}
                    width={220}
                    height={75}
                    className="max-h-12 sm:max-h-16 w-auto max-w-[170px] sm:max-w-[220px] object-contain opacity-70 grayscale brightness-95 group-hover/logo:grayscale-0 group-hover/logo:opacity-100 group-hover/logo:brightness-100 group-hover/logo:scale-110 transition-all duration-300"
                  />
                </div>
              </div>
            );

            if (item.websiteUrl) {
              return (
                <a
                  key={`${item._id}-${index}`}
                  href={item.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={item.companyName}
                  className="cursor-pointer outline-none"
                >
                  {logoContent}
                </a>
              );
            }

            return (
              <div key={`${item._id}-${index}`} title={item.companyName}>
                {logoContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
