export function objectDefined<T>(obj: T): T {
  const acc: Partial<T> = {};
  for (const key in obj) {
    if (obj[key] !== undefined || obj[key] !== null) acc[key] = obj[key];
  }
  return acc as T;
}

export function tenYearsAgo() {
  const curDate = new Date();
  const tenYearsAgo = curDate.setFullYear(curDate.getFullYear() - 10);
  return new Date(tenYearsAgo, 1, 1)
}

export function generateSessions(refDate?: Date): string[] {
  if(!refDate) {
    refDate = tenYearsAgo()
  }
  var max = new Date().getFullYear()
  var min = new Date(refDate).getFullYear()
  var years = []

  for (var i = max; i >= min; i--) {
    years.push(`${i} - ${i+1}`)
  }
  return years
}
