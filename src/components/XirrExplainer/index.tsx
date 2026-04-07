import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function XirrExplainer() {
  return (
    <Accordion type="single" collapsible className="w-full rounded-lg border border-border px-3">
      <AccordionItem value="xirr" className="border-none">
        <AccordionTrigger className="text-sm py-3 hover:no-underline">
          What is XIRR?
        </AccordionTrigger>
        <AccordionContent className="text-sm text-muted-foreground pb-3">
          <p className="mb-2">
            <strong className="text-foreground">XIRR</strong> (extended internal rate of return) is an annualized return that accounts for{" "}
            <em>when</em> each rupee went in or came out — not just totals.
          </p>
          <p>
            That makes it a fairer way to judge a chit fund than dividing profit by total paid, because your money is tied up month by month until the final payout.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
