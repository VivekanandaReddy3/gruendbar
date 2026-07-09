/**
 * Fetches a subsetted TTF from Google Fonts at build time, for use in
 * ImageResponse (satori) routes. `family` is a css2 spec, e.g.
 * "Schibsted+Grotesk:wght@700".
 */
export async function loadGoogleFont(
  family: string,
  text: string
): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const match = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);

  if (!match) {
    throw new Error(`Could not resolve font: ${family}`);
  }

  return await (await fetch(match[1])).arrayBuffer();
}
