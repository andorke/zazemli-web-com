import { Fleuron } from "@/components/ui/fleuron";
import { KickerHeader } from "@/components/ui/kicker-header";
import { home } from "@/content/home";

/* Statement 219:2 — тёмная секция: кикер + крупная italic-цитата + фльерон */
export function Statement() {
  const { statement } = home;
  return (
    <section className="bg-charcoal text-bone flex flex-col items-center gap-7 px-6 py-28 text-center">
      <KickerHeader className="text-bone/60">{statement.kicker}</KickerHeader>
      <p className="max-w-3xl font-voice text-[clamp(2rem,5vw,3.5rem)] leading-tight italic">
        {statement.quote}
      </p>
      <Fleuron className="text-[26px] opacity-100" />
    </section>
  );
}
