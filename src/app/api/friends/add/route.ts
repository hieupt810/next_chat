import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { fetchRedis } from "@/helper/redis";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email: emailToAdd } = addFriendValidator.parse(body.email);

    const idToAdd = (await fetchRedis(
      "get",
      `user:email:${emailToAdd}`
    )) as string;
    if (!idToAdd) {
      return new Response("Người này hiện không tồn tại", { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
    if (idToAdd === session.user.id) {
      return new Response("Không thể thêm bản thân vào danh sách bạn bè!", {
        status: 400,
      });
    }

    // Check if User is already added
    const alreadyAdded = await fetchRedis(
      "sismember",
      `user:${idToAdd}:incoming_friend_requests`,
      session.user.id
    );
    if (alreadyAdded) {
      return new Response("Bạn đã gửi lời mời kết bạn trước đây rồi!", {
        status: 400,
      });
    }

    // Check if User is already friend
    const alreadyFriend = (await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd
    )) as 0 | 1;
    if (alreadyFriend) {
      return new Response("Hai bạn đã là bạn bè của nhau!", {
        status: 400,
      });
    }

    // Valid request, send friend request
    db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id);
    return new Response("Đã gửi lời mời kết bạn.");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }

    return new Response("Invalid request", { status: 400 });
  }
}
