"use client";

import { useEffect, useRef } from "react";

type AdMarkupProps = {
  markup: string;
};

export default function AdMarkup({ markup }: AdMarkupProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = markup;

    const scripts = containerRef.current.querySelectorAll("script");
    scripts.forEach((script) => {
      const replacement = document.createElement("script");

      Array.from(script.attributes).forEach((attribute) => {
        replacement.setAttribute(attribute.name, attribute.value);
      });

      replacement.text = script.text;
      script.parentNode?.replaceChild(replacement, script);
    });
  }, [markup]);

  return <div ref={containerRef} className="text-sm text-gray-200 [&_a]:text-blue-300 [&_iframe]:w-full [&_img]:h-auto [&_img]:max-w-full" />;
}
