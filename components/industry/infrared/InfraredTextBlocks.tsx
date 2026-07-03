import {
  HOME_POINT_BODY_CLASS,
  HOME_POINT_TITLE_CLASS,
} from "@/components/home/HomeContent";

type TextBlock = {
  eyebrow: string;
  paragraphs: readonly string[];
};

export function InfraredTextBlocks({
  blocks,
  className = "space-y-4 md:space-y-6",
}: {
  blocks: readonly TextBlock[];
  className?: string;
}) {
  return (
    <div className={className}>
      {blocks.map((block) => (
        <div
          key={block.eyebrow}
          className="group w-full rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-500 hover:border-blue-100 hover:shadow-xl max-lg:rounded-2xl max-lg:p-5 md:p-8"
        >
          <h3 className={`mb-6 ${HOME_POINT_TITLE_CLASS}`}>{block.eyebrow}</h3>
          <div className={`space-y-4 ${HOME_POINT_BODY_CLASS}`}>
            {block.paragraphs.map((paragraph, index) => {
              if (paragraph === "objects above absolute 0 emit thermal radiation") {
                return (
                  <h4 key={index} className={HOME_POINT_TITLE_CLASS}>
                    {paragraph}
                  </h4>
                );
              }

              return (
                <p
                  key={index}
                  className="opacity-80 transition-opacity group-hover:opacity-100"
                >
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
