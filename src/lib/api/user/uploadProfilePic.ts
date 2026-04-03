export async function uploadProfilePic(profilePicture: string): Promise<string> {
  let profilePicUrl: string | null = null;

    const imageBlob = await (await fetch(profilePicture)).blob();

    const uploadRes = await fetch('/api/user/profilePic', {
      method: 'POST',
      body: imageBlob,
    });
    if (!uploadRes.ok) {
      throw new Error('Profile image upload failed');
    }
    const uploadJson = await uploadRes.json();
    profilePicUrl = uploadJson.secure_url ?? null;
    return profilePicUrl ?? "";
}