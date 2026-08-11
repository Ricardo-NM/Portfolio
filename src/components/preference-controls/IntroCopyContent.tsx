type IntroCopyContentProps = {
  introHighlight: string;
  introRest: string;
};

export default function IntroCopyContent({
  introHighlight,
  introRest,
}: IntroCopyContentProps) {
  return (
    <>
      <strong>{introHighlight}</strong>
      {introRest}
    </>
  );
}
