import { createClient } from "@/lib/supabase/client";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/**
 * Uploads an image to the public `article-media` bucket (client-side).
 * Returns the public URL on success, or an error message to show inline.
 */
export async function uploadArticleMedia(
  file: File,
): Promise<{ url: string } | { error: string }> {
  if (file.size > MAX_SIZE) {
    return { error: "File is too large. Maximum 5 MB." };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Unsupported file type." };
  }

  const supabase = createClient();

  // Path: YYYY-MM/{uuid}.{ext}
  const now = new Date();
  const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const uuid = crypto.randomUUID();
  const path = `${yearMonth}/${uuid}.${ext}`;

  const { error } = await supabase.storage
    .from("article-media")
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (error) return { error: "Upload failed. Try again." };

  const { data } = supabase.storage.from("article-media").getPublicUrl(path);

  return { url: data.publicUrl };
}
