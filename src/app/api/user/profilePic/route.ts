export async function POST(request: Request) {

  const CLOUDINARY_PRESET_KEY = process.env.CLOUDINARY_PRESET_KEY || '';
  const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || '';
  const cloudinaryURL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  const imageBlob = await request.blob();
  const imageData = new FormData();
  imageData.append('file', imageBlob, 'profile-picture.jpg');
  imageData.append('upload_preset', CLOUDINARY_PRESET_KEY);
  const uploadRes = await fetch(cloudinaryURL, {
    method: 'POST',
    body: imageData,
  });
  if (!uploadRes.ok) {
    throw new Error('Profile image upload failed');
  }
  const uploadJson = await uploadRes.json();
 
  return new Response(JSON.stringify(uploadJson), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}