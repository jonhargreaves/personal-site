/**
 * Reconcile values emitted by a library callback with the precise values that
 * entered the integration. This preserves the caller's generic type without
 * trusting an independently generic callback signature.
 */
export function retainKnownValues<T, Candidate>(
  knownValues: ReadonlyArray<T>,
  candidates: ReadonlyArray<Candidate>
): Array<T> {
  return candidates.flatMap((candidate) => {
    const index = knownValues.findIndex((value) => Object.is(value, candidate));
    return index === -1 ? [] : knownValues.slice(index, index + 1);
  });
}
