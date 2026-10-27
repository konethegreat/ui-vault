import * as React from "react";
import { Button } from "@/vendor/Button";

export default function ButtonDemo() {
  const [loading, setLoading] = React.useState(false);
  const [saved, setSaved] = React.useState(0);

  function save() {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setSaved((n) => n + 1);
    }, 1400);
  }

  return (
    <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-2">
      <div className="space-y-5">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-stone-500">
          Variants
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Start a project</Button>
          <Button variant="secondary">View work</Button>
          <Button variant="ghost">Learn more</Button>
          <Button variant="danger">Delete</Button>
        </div>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-stone-500">
          Sizes
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>

      <div className="space-y-5 md:border-l md:border-stone-200 md:pl-8">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-stone-500">
          States
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={save} loading={loading}>
            {loading ? "Saving" : "Save changes"}
          </Button>
          <Button disabled>Disabled</Button>
          <Button variant="secondary" onClick={() => setSaved(0)}>
            Reset
          </Button>
        </div>
        <p
          aria-live="polite"
          className="min-h-5 text-sm text-stone-600"
        >
          {saved > 0
            ? `Saved ${saved} ${saved === 1 ? "time" : "times"}. The spinner keeps the label in place.`
            : "Loading keeps the label and announces aria-busy."}
        </p>
        <Button fullWidth variant="secondary">
          Full width for forms and mobile actions
        </Button>
      </div>
    </div>
  );
}
