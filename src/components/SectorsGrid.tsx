import { motion, useReducedMotion } from 'motion/react';
import { SECTORS } from '../data/agencyContent';

/**
 * Crisp dashed architectural sector matrix matching United Carriers Image 4:
 * column-aligned header row ('Where we deploy' | 'SECTORS ACROSS KARNATAKA'),
 * clean centered typography inside spacious dashed cells with subtle corner markers.
 */
export function SectorsGrid() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="sectors"
      aria-labelledby="sectors-heading"
      className="relative z-20 bg-white pt-10 pb-20 text-[#0E1117] sm:pt-14 sm:pb-24 lg:pt-16 lg:pb-28"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {/* Top Column-Aligned Header Strip inside Architectural Grid Frame (Image 4) */}
        <div className="grid grid-cols-1 border border-b-0 border-[#0E1117]/10 px-6 py-5 sm:grid-cols-2 lg:grid-cols-4 lg:px-0">
          <div className="flex items-center lg:px-7">
            <span className="text-xs font-medium text-[#525B6A]">Where we deploy</span>
          </div>
          <div className="mt-1 flex items-center sm:mt-0 lg:col-span-3 lg:px-7">
            <h2
              id="sectors-heading"
              className="font-display text-xs font-extrabold tracking-[0.12em] text-[#0E1117] uppercase sm:text-sm"
            >
              SECTORS ACROSS KARNATAKA
            </h2>
          </div>
        </div>

        {/* Clean 4-Column Centered Dashed Architectural Matrix */}
        <div className="grid grid-cols-1 border-t border-l border-dashed border-[#0E1117]/14 sm:grid-cols-2 lg:grid-cols-4">
          {SECTORS.map((sector, idx) => (
            <motion.div
              key={sector.name}
              initial={
                prefersReducedMotion
                  ? false
                  : { opacity: 0, y: 14, filter: 'blur(6px)' }
              }
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '0px 0px -12% 0px', amount: 0.2 }}
              transition={{
                duration: 0.72,
                delay: (idx % 4) * 0.06,
                ease: [0.16, 0.72, 0.28, 1],
              }}
              className="group relative flex min-h-[168px] flex-col items-center justify-center border-r border-b border-dashed border-[#0E1117]/14 px-6 py-8 text-center transition-colors duration-200 will-change-[transform,opacity,filter] hover:bg-[#F4F5F7]"
            >
              {/* Subtle Corner Registration Dots (Image 4 architectural craft) */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-2 left-2 h-[2px] w-[2px] rounded-full bg-[#0E1117]/25"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-2 bottom-2 h-[2px] w-[2px] rounded-full bg-[#0E1117]/25"
              />

              <h3 className="font-display text-sm font-extrabold tracking-[-0.01em] text-[#0E1117] uppercase transition-colors duration-200 group-hover:text-[#EA580C] sm:text-[15px]">
                {sector.name}
              </h3>
              <span className="mt-2 font-mono-tech text-[10px] tracking-[0.14em] text-[#64748B] uppercase">
                {sector.regionTag}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
