import fs from "fs";
import path from "path";

// Increase the body parser limit since images can be large
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb",
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ message: "No image provided" });
    }

    // Strip the base64 metadata (e.g., "data:image/png;base64,")
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data, "base64");

    // Define the path to the public folder
    const filePath = path.join(process.cwd(), "public", "icon.png");

    // Write the file
    fs.writeFileSync(filePath, buffer);

    return res
      .status(200)
      .json({ success: true, message: "Logo updated successfully" });
  } catch (error) {
    console.error("Error saving logo:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
