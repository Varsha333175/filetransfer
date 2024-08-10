const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  uploadFile,
  uploadFolder,
  deleteFile,
  restoreFile,
  downloadFile,
  permanentDeleteFile,
  getTrashedFiles,
  getFiles,
  getSharedFiles,
  getMySharedFiles,
  previewFile,
  shareFile,
  renameFile,
  revertShare,
  searchFiles,
} = require('../controllers/fileController'); // Ensure this path is correct

router.post('/upload', auth, uploadFile); // POST request to upload a file
router.post('/upload-folder', auth, uploadFolder); // POST request to upload a folder
router.delete('/delete/:fileId', auth, deleteFile); // DELETE request to delete a file
router.put('/restore/:fileId', auth, restoreFile); // PUT request to restore a file
router.get('/download/:fileId', auth, downloadFile); // GET request to download a file
router.delete('/permanently-delete/:fileId', auth, permanentDeleteFile); // DELETE request to permanently delete a file
router.get('/trashed', auth, getTrashedFiles); // GET request to get trashed files
router.get('/', auth, getFiles); // GET request to get files
router.get('/shared', auth, getSharedFiles); // GET request to get shared files
router.get('/my-shared', auth, getMySharedFiles); // GET request to get files shared by the user
router.get('/preview/:fileId', auth, previewFile); // GET request to preview a file
router.post('/share', auth, shareFile); // POST request to share a file
router.post('/rename', auth, renameFile); // POST request to rename a file
router.post('/revert-share', auth, revertShare); // POST request to revert sharing of a file
router.get('/search', auth, searchFiles); // GET request to search files

module.exports = router;
