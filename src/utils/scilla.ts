export const isAdt = (type: string) => {
  return (
    type.startsWith('Bool') ||
    type.startsWith('List') ||
    type.startsWith('Pair') ||
    type.startsWith('Option')
  );
};
