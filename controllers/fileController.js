const path = require('path');
const fs = require('fs');
const File = require('../models/File');
const User = require('../models/User');

exports.uploadFile = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const file = req.files.file;
  const { isPublic } = req.body;
  const uploadPath = path.join(__dirname, '..', 'uploads', file.name);

  file.mv(uploadPath, async (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    const newFile = new File({
      name: file.name,
      path: uploadPath,
      owner: req.user.id,
      isPublic: isPublic || false,
    });

    await newFile.save();
    res.send('File uploaded!');
  });
};

exports.uploadFolder = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const files = req.files.files;
  const uploadPath = path.join(__dirname, '..', 'uploads');

  const fileUploadPromises = Object.values(files).map(async (file) => {
    const filePath = path.join(uploadPath, file.name);
    await file.mv(filePath);

    const newFile = new File({
      name: file.name,
      path: filePath,
      owner: req.user.id,
      isPublic: false,
    });

    return newFile.save();
  });

  try {
    await Promise.all(fileUploadPromises);
    res.send('Folder uploaded!');
  } catch (err) {
    res.status(500).send(err);
  }
};


exports.getFiles = async (req, res) => {
  const files = await File.find({ owner: req.user.id, deleted: false })
    .populate('sharedWith.user', 'username email')
    .exec();
  res.json(files);
};

// Download a file
exports.downloadFile = async (req, res) => {
  const file = await File.findOne({ _id: req.params.fileId });
  if (!file) {
    return res.status(404).send('File not found');
  }

  const directoryPath = path.join(__dirname, '..', 'uploads');
  res.download(path.join(directoryPath, file.name), file.name, (err) => {
    if (err) {
      res.status(500).send({
        message: 'Could not download the file. ' + err,
      });
    }
  });
};

// Delete a file
exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findOneAndUpdate(
      { _id: req.params.fileId, owner: req.user.id },
      { deleted: true },
      { new: true }
    );

    if (!file) {
      return res.status(404).send('File not found');
    }

    res.send('File moved to trash');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};


// Permanently delete a file
exports.permanentDeleteFile = async (req, res) => {
  const file = await File.findOneAndDelete({ _id: req.params.fileId, owner: req.user.id, deleted: true });

  if (!file) {
    return res.status(404).send('File not found');
  }

  const filePath = path.join(__dirname, '..', 'uploads', file.name);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
    }
  });

  res.send('File permanently deleted');
};

// Restore a file from trash
// Restore a file (remove from trash)
exports.restoreFile = async (req, res) => {
  try {
    const file = await File.findOneAndUpdate(
      { _id: req.params.fileId, owner: req.user.id },
      { deleted: false },
      { new: true }
    );

    if (!file) {
      return res.status(404).send('File not found');
    }

    res.send('File restored');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};
  
// Share a file
exports.shareFile = async (req, res) => {
  try {
    const { fileId, userEmail, canEdit } = req.body;
    const file = await File.findOne({ _id: fileId, owner: req.user.id });

    if (!file) {
      return res.status(404).send('File not found');
    }

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).send('User not found');
    }

    file.sharedWith.push({ user: user._id, canEdit });
    await file.save();
    res.send('File shared!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};



exports.getSharedFiles = async (req, res) => {
  try {
    const files = await File.find({ 'sharedWith.user': req.user.id })
      .populate('owner', 'username email')
      .exec();
    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.renameFile = async (req, res) => {
  const { oldName, newName } = req.body;

  try {
    const file = await File.findOne({ name: oldName, owner: req.user.id });
    if (!file) {
      return res.status(404).json({ msg: 'File not found' });
    }

    const fileExtension = path.extname(oldName);
    const newFileName = path.basename(newName, fileExtension) + fileExtension;
    const oldPath = file.path;
    const newPath = path.join(path.dirname(oldPath), newFileName);

    // Rename the file in the file system
    fs.rename(oldPath, newPath, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Server error');
      }

      file.name = newFileName;
      file.path = newPath;
      await file.save();

      res.json(file);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

// Get files shared by the current user
exports.getMySharedFiles = async (req, res) => {
  const files = await File.find({ owner: req.user.id, 'sharedWith.0': { $exists: true } })
    .populate('sharedWith.user', 'username email')
    .exec();
  res.json(files);
};
// Get trashed files
exports.getTrashedFiles = async (req, res) => {
  const files = await File.find({ owner: req.user.id, deleted: true });
  res.json(files);
};

// Add an endpoint to get file data for previews
exports.previewFile = async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.fileId });
    if (!file) {
      return res.status(404).send('File not found');
    }
    const filePath = path.join(__dirname, '..', 'uploads', file.name);
    res.sendFile(filePath);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Revert sharing of a file
exports.revertShare = async (req, res) => {
  try {
    const { fileId, userId } = req.body;
    const file = await File.findOne({ _id: fileId, owner: req.user.id });

    if (!file) {
      return res.status(404).send('File not found');
    }

    file.sharedWith = file.sharedWith.filter(shared => shared.user.toString() !== userId);
    await file.save();

    res.send('Share reverted');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

exports.searchFiles = async (req, res) => {
  try {
    const query = req.query.q;
    const ownerId = req.user.id;

    const files = await File.find({
      owner: ownerId,
      name: new RegExp(query, 'i'),
      deleted: false,
    });

    const sharedFiles = await File.find({
      'sharedWith.user': ownerId,
      name: new RegExp(query, 'i'),
    });

    const trashedFiles = await File.find({
      owner: ownerId,
      name: new RegExp(query, 'i'),
      deleted: true,
    });

    const mySharedFiles = await File.find({
      owner: ownerId,
      'sharedWith.0': { $exists: true },
      name: new RegExp(query, 'i'),
    });

    res.json({ files, sharedFiles, trashedFiles, mySharedFiles });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};