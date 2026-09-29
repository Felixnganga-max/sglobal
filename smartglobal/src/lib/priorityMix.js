// Kent + Spuds fill ~90% of any product grid that uses mixPriority.
export const PRIORITY_SHARE = 0.9;

export const isKent = (p) => /kent/i.test(p.category || "");
export const isSpuds = (p) => /potato chips|spuds/i.test(p.category || "");
export const isPriority = (p) => isKent(p) || isSpuds(p);

function interleave(a, b) {
  const out = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i]) out.push(a[i]);
    if (b[i]) out.push(b[i]);
  }
  return out;
}

// Order of `list` is respected within each group, so put the products
// you want first (e.g. badged ones) at the front.
export function mixPriority(list, total) {
  const kent = list.filter(isKent);
  const spuds = list.filter(isSpuds);
  const others = list.filter((p) => !isPriority(p));

  const want = Math.round(total * PRIORITY_SHARE);
  const priority = interleave(kent, spuds).slice(0, want);
  const rest = others.slice(0, total - priority.length);
  return [...priority, ...rest];
}