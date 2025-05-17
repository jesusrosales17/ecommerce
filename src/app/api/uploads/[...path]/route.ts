import { NextRequest } from "next/server";
import { join } from "path";
import { readFile } from "fs/promises";

const baseUploadsPath = process.env.NEXT_PUBLIC_UPLOADS_PATH || join(process.cwd(), "uploads");

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }>}
) {
  try {
    const { path } = await params;
    const filePath = join(process.cwd(), baseUploadsPath, ...path);
    const file = await readFile(filePath);
    console.log("file",file)

    const ext = filePath.split('.').pop();
    const contentType = ext === "jpg" || ext === "jpeg"
      ? "image/jpeg"
      : ext === "png"
      ? "image/png"
      : "application/octet-stream";

    return new Response(file, {
      headers: { "Content-Type": contentType }
    });
  } catch (error) {
    console.log(error)
    return new Response("Not Found", { status: 404 });
  }
}
