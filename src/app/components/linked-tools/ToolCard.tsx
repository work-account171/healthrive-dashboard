import Image, { StaticImageData } from "next/image";
import cardlink from "@/../public/icons/card-link.png";
import { useState } from "react";

type ToolCardProps = {
  icon: StaticImageData;
  title: string;
  subheading: string;
  tags?: string[];
  criticalTags?: string[];
};

const ToolCard = ({
  icon,
  title,
  subheading,
  tags = [],
  criticalTags = [],
}: ToolCardProps) => {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const handleTagClick = (tag: string) => {
    setActiveTag((prev) => (prev === tag ? null : tag)); // toggle
  };

  return (
    <div className="flex flex-col gap-[24px] border border-gray-200 rounded-xl px-[24px] pt-[24px] pb-[40px] lg:w-[33%] md:w-[47%] relative min-h-[223px]  hover:shadow-md">
      {/* Header row */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-row items-center gap-[14px]">
          <Image
            src={icon}
            alt={`${title} icon`}
            width={36}
            height={36}
            className="object-contain"
          />
          <h2 className="font-semibold text-[20px] text-primary mb-1">
            {title}
          </h2>
        </div>
        <Image
          src={cardlink}
          alt="link"
          height={24}
          width={24}
          className="object-contain"
        />
      </div>

      {/* Body */}
      <div className="flex flex-col gap-[18px]">
        <div className="text-gray-600 text-sm">{subheading}</div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 group min-w-[249px] min-h-[60px] ">
          {tags.map((tag, idx) => {
            const isCritical = criticalTags.includes(tag);
            const isActive = activeTag === tag;

            const baseClasses =
              "px-3 py-1 rounded-lg text-xs font-medium border cursor-pointer transition";

      
            let tagClasses = baseClasses;

            if (isActive || isCritical) {
              tagClasses += " bg-black text-white border-black ";
              tagClasses +=
                " group-hover:bg-[#E7F4FF] group-hover:text-[#4277BB] group-hover:border-[#4277BB] ";
            } else { 
              tagClasses +=
                " border-black text-gray-800 group-hover:bg-[#E7F4FF] group-hover:text-[#4277BB] group-hover:border-[#4277BB] h-fit w-fit";
            }

            return (
              <span
                key={idx}
                onClick={() => handleTagClick(tag)}
                className={tagClasses}
              >
                {tag}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
