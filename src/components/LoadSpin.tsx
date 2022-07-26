import cn from "clsx";

const variants = {
  brand: "border-dark-brand-500",
  white: "border-white",
};

type Props = {
  variant?: keyof typeof variants;
};

export function LoadSpin({ variant = "brand" }: Props) {
  return (
    <div className="w-full pt-[100%] relative" role="status">
      <div
        className={cn(
          variants[variant],
          "absolute inset-0 border-4 border-r-transparent animate-spin rounded-full inline-block w-full h-full"
        )}
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
