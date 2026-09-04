import { useEffect } from "react";

export default function ArabicNumbers() {
  useEffect(() => {
    const convertNumbers = () => {
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
      );

      const textNodes = [];

      let node;

      while ((node = walker.nextNode())) {
        textNodes.push(node);
      }

      textNodes.forEach((textNode) => {
        if (textNode.parentElement?.closest("input, textarea, script, style")) {
          return;
        }

        textNode.nodeValue = textNode.nodeValue.replace(
          /\d/g,
          (digit) => "٠١٢٣٤٥٦٧٨٩"[digit],
        );
      });
    };

    convertNumbers();

    const observer = new MutationObserver(() => {
      convertNumbers();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
