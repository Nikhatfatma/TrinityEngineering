import { CAREERS_CONTENT_WIDTH, CAREERS_GRID, CAREERS_SECTION_SHELL } from "./careersContent";

export default function CareersGridSection() {
  return (
    <section id={CAREERS_GRID.id} className="bg-[#F5F5F5] py-8 md:py-10 lg:py-12">
      <div className={CAREERS_SECTION_SHELL}>
        <div className={CAREERS_CONTENT_WIDTH}>
          <p className="text-left text-[10px] font-bold uppercase tracking-[0.22em] text-[#2563EB] sm:text-[11px] md:tracking-[0.28em]">
            {CAREERS_GRID.eyebrow}
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-6 lg:gap-5">
          {CAREERS_GRID.cards.map((card, index) => (
            <article
              key={`${card.title}-${index}`}
              className="flex min-w-0 flex-col rounded-sm bg-[#05163D] p-4 sm:p-5"
            >
              <img
                src={card.imageSrc}
                alt={card.imageAlt}
                className="aspect-[2/1] w-full max-h-[165px] object-cover sm:max-h-[175px]"
              />
              <h3 className="mt-3 text-sm font-bold leading-tight text-white">{card.title}</h3>
              <p className={`mt-2 text-[12px] leading-relaxed text-white md:text-[13px]`}>
                {card.description}
              </p>
            </article>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}
