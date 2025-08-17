export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function randomSleep(min: number, max: number) {
  return new Promise((resolve) =>
    setTimeout(resolve, Math.random() * (max - min) + min),
  );
}
