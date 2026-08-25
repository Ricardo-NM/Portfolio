type IntroCopyContentProps = {
  introHighlight: string;
  introRest: string;
  isDrawer?: boolean;
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
