// external import
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");

async function firebaseFileUpload(file, name) {
  // Create a root reference
  const storage = getStorage();
  const storageRef = ref(storage, name);

  const metadata = {
    contentType: file.type,
  };

  await uploadBytes(storageRef, file, metadata);

  const img_link = await getDownloadURL(storageRef);

  return img_link;
}

module.exports = firebaseFileUpload;
