// Kent Cubes take ~50% of any product grid that uses mixPriority.
export const CUBE_SHARE = 0.5;

// Kent + Spuds fill ~90% of whatever slots remain after the cubes.
export const PRIORITY_SHARE = 0.9;

export const isKent = (p) => /kent/i.test(p.category || "");
export const isSpuds = (p) => /potato chips|spuds/i.test(p.category || "");
export const isPriority = (p) => isKent(p) || isSpuds(p);
export const isCubes = (p) => /cube/i.test(`${p.title || ""} ${p.name || ""}`);

function interleave(a, b) {
  const out = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i]) out.push(a[i]);
    if (b[i]) out.push(b[i]);
  }
  return out;
}

// Kent + Spuds mix without any cube handling.
function mixKentSpuds(list, total) {
  const kent = list.filter(isKent);
  const spuds = list.filter(isSpuds);
  const others = list.filter((p) => !isPriority(p));

  const want = Math.round(total * PRIORITY_SHARE);
  const priority = interleave(kent, spuds).slice(0, want);
  const rest = others.slice(0, total - priority.length);
  return [...priority, ...rest];
}

// Cubes first (up to CUBE_SHARE of `total`), then the Kent + Spuds mix fills
// the remaining slots. If there are fewer cubes than their share, the other
// products take the leftover slots.
// Order of `list` is respected within each group, so put the products
// you want first (e.g. badged ones) at the front.
export function mixCubes(list, total) {
  const cubes = list.filter(isCubes).slice(0, Math.round(total * CUBE_SHARE));
  const rest = mixKentSpuds(
    list.filter((p) => !isCubes(p)),
    total - cubes.length,
  );
  return [...cubes, ...rest];
}

// Existing callers keep using mixPriority and now get cubes at ~50% too.
export const mixPriority = mixCubes;