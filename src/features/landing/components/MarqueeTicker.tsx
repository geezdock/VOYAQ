  "use client";

const items = [
  "GOA WEEKEND",
  "MANALI TREKS",
  "PARENTAL PERMISSION SORTED",
  'NO MORE "WE WILL SEE"',
  "BUDGET LOCKED",
  "VOTES CLOSED",
];

function MarqueeRow() {
  return (
    <div className="flex items-center whitespace-nowrap">
      {items.flatMap((text, i) => [
        <span key={`t${i}`} className="font-mono text-sm tracking-widest uppercase text-peach">
          {text}
        </span>,
        <span key={`d${i}`} className="size-2 bg-error rounded-full border border-peach ml-10 mr-2" />,
      ])}
    </div>
  );
}

export function MarqueeTicker() {
  return (
    <div className="w-full border-t-2 border-ink bg-ink overflow-hidden h-14 flex items-center">
      <div className="flex animate-ticker" style={{ width: "fit-content" }}>
        <MarqueeRow />
        <MarqueeRow />
      </div>
    </div>
  );
}
