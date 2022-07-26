type SplitTextProps = {
  primary: string;
  secondary?: string;
};

export function TwoToneHeading({ primary, secondary }: SplitTextProps) {
  return (
    <>
      {primary}
      {secondary ? (
        <span className="dark:text-dark-gray-600"> {secondary}</span>
      ) : null}
    </>
  );
}
