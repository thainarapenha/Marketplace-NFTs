import { AspectRatio } from "@/components/ui/aspect-ratio";

interface NftImageProps {
  src: string;
  alt: string;
}

export const NftImage = ({ src, alt }: NftImageProps) => {
  return (
    <AspectRatio
      ratio={1}
      className="overflow-hidden rounded-lg bg-secondary"
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
      />
    </AspectRatio>
  );
}