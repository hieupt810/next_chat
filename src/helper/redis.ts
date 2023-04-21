const upstashRedisRestURL = process.env.UPSTASH_REDIS_REST_URL;
const authToken = process.env.UPSTASH_REDIS_REST_TOKEN;

type Command = "zrange" | "sismember" | "get" | "smember";

export async function fetchRedis(
  command: Command,
  ...args: (string | number)[]
) {
  const commandURL = `${upstashRedisRestURL}/${command}/${args.join("/")}`;
  const response = await fetch(commandURL, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Error excuting Redis command: ${response.statusText}`);
  }
  const data = await response.json();
  return data.result;
}
