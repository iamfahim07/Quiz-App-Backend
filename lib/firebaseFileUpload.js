// external import
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");

async function firebaseFileUpload(file, name) {
  try {
    // Create a root reference
    const storage = getStorage();
    const storageRef = ref(storage, name);

    const metadata = {
      contentType: file.type,
    };

    await uploadBytes(storageRef, file, metadata);

    const img_link = await getDownloadURL(storageRef);

    return img_link;
  } catch (err) {
    throw new Error("Failed to upload image!");
  }
}

module.exports = firebaseFileUpload;
