import { motion, useReducedMotion } from 'motion/react';
import { TESTIMONIALS } from '../data/agencyContent';
import { TextReveal } from './TextReveal';

export function Testimonials() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="testimonials-heading"
      data-nav-theme="light"
      className="relative z-20 border-t border-[#0E1117]/10 bg-white text-[#0E1117]"
    >
      <div className="bg-white py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="mb-14 max-w-3xl sm:mb-20">
            <p className="mb-3 font-mono-tech text-[11px] tracking-[0.18em] text-[#2B303A] uppercase">
              CLIENT DEPLOYMENT OUTCOMES
            </p>
            <TextReveal
              id="testimonials-heading"
              as="h2"
              theme="light"
              lines={['TRUSTED BY FACILITY', '& OPERATIONS LEADERS']}
              className="font-display text-[clamp(1.85rem,4vw,3.4rem)] leading-[1.04] font-bold tracking-[-0.03em] uppercase"
            />
          </div>

          <div className="divide-y divide-[#0E1117]/12 border-t border-b border-[#0E1117]/12">
            {TESTIMONIALS.map((item, idx) => (
              <motion.article
                key={item.id}
                initial={
                  prefersReducedMotion
                    ? false
                    : { opacity: 0, y: 24, filter: 'blur(8px)' }
                }
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '0px 0px -14% 0px', amount: 0.2 }}
                transition={{ duration: 0.95, delay: idx * 0.1, ease: [0.16, 0.72, 0.28, 1] }}
                className="grid grid-cols-1 gap-8 py-14 will-change-[transform,opacity,filter] lg:grid-cols-12 lg:gap-12 lg:py-20"
              >
                {/* Left: Editorial Portrait + Attribution */}
                <div className="flex items-start gap-5 lg:col-span-4 lg:flex-col">
                  <motion.div
                    initial={
                      prefersReducedMotion
                        ? false
                        : { clipPath: 'inset(14% 0% 0% 0%)', opacity: 0.3 }
                    }
                    whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="shrink-0 overflow-hidden rounded-sm"
                  >
                    <img
                      src={item.image}
                      alt={`Portrait of ${item.name}, ${item.role} at ${item.organization}`}
                      loading="lazy"
                      width={144}
                      height={144}
                      className="h-24 w-24 object-cover object-top grayscale-[20%] transition-transform duration-500 hover:scale-105 sm:h-28 sm:w-28 lg:h-32 lg:w-32"
                    />
                  </motion.div>
                  <div>
                    <h3 className="font-display text-xs font-bold tracking-[0.04em] text-[#0E1117] uppercase sm:text-sm">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-[#525B6A] sm:text-sm">
                      {item.role}
                    </p>
                    <p className="text-xs text-[#525B6A] sm:text-sm">
                      {item.organization} · {item.location}
                    </p>
                    <p className="mt-3 inline-block rounded-sm bg-[#F4F6F9] px-2.5 py-1 font-mono-tech text-[10px] tracking-[0.08em] text-[#2B303A] uppercase">
                      {item.scope}
                    </p>
                  </div>
                </div>

                {/* Right: Long-Form Realistic Testimonial */}
                <div className="lg:col-span-7 lg:col-start-6">
                  <blockquote className="text-base leading-[1.7] font-normal text-[#0E1117] sm:text-lg lg:text-[1.18rem]">
                    “{item.quote}”
                  </blockquote>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
