// external import
const { getStorage, ref, deleteObject } = require("firebase/storage");

async function firebaseFileDelete(img_ref) {
  try {
    // storage location
    const storage = getStorage();

    // Create a reference to the file to delete
    const storageRef = ref(storage, img_ref);

    // delete the correspondence image from firebase
    await deleteObject(storageRef);
  } catch (err) {
    throw new Error("Failed to delete image!");
  }
}

module.exports = firebaseFileDelete;
