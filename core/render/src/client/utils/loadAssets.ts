export const loadScript = async (src: string) =>
  new Promise((resolve, reject) => {
    // check Already load
    const allScriptsTags = document.querySelectorAll("script");
    for (let i = 0; i < allScriptsTags.length; i++) {
      const scriptsTags = allScriptsTags[i];
      if (!scriptsTags.src) {
        continue;
      }
      if (src === scriptsTags.src) {
        console.log("Already load");
        return resolve("Already load");
      }
    }

    const script = document.createElement("script");
    script.src = src;

    document.head.append(script);
    script.onload = resolve;
    script.onerror = reject;
  });

export const loadStyle = async (src: string) =>
  new Promise((resolve, reject) => {
    // check already load style tag (inline tag)
    // data-href - mark by minicssextract loader
    // <style data-href="styles.css">
    const allStyleTags = document.querySelectorAll("style");
    for (let i = 0; i < allStyleTags.length; i++) {
      const href = allStyleTags[i].getAttribute("data-href") || "";
      if (!href) {
        continue;
      }

      if (href === src) {
        return resolve("Already load");
      }
    }

    // check already load link style
    // <link rel="stylesheet" href="styles.css" >
    const allLinksStyle = document.querySelectorAll('[rel="stylesheet"]');
    for (let i = 0; i < allLinksStyle.length; i++) {
      const href = allLinksStyle[i].getAttribute("href");
      if (!href) {
        continue;
      }

      if (href === src) {
        console.log("Already load");
        return resolve("Already load");
      }
    }

    const link = document.createElement("link");
    link.href = src;

    document.head.append(link);
    link.onload = resolve;
    link.onerror = reject;
  });
