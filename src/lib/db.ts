import { Redis } from "@upstash/redis";

export const db = new Redis({
  url: "https://apn1-advanced-earwig-33885.upstash.io",
  token:
    "AYRdASQgZGMxMjE0NGEtZjI3OC00OGRjLTgxMjgtZmRiNjNkODU2M2Y2YzZjMTY2ZDg1NjMxNDBlYWI0NzhmZmNmYjZlZDc0Yjg=",
});
