import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  IconButton,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Checkbox,
  Tooltip,
  InputAdornment,
} from '@mui/material';
import { Delete, GetApp, Edit, Restore, Share, RemoveCircleOutline, Search } from '@mui/icons-material';

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function FileExplorer({ onLogout, currentUser }) {
  const [files, setFiles] = useState([]);
  const [sharedFiles, setSharedFiles] = useState([]);
  const [trashedFiles, setTrashedFiles] = useState([]);
  const [mySharedFiles, setMySharedFiles] = useState([]);
  const [openRenameDialog, setOpenRenameDialog] = useState(false);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newFileName, setNewFileName] = useState('');
  const [shareEmail, setShareEmail] = useState('');
  const [canEdit, setCanEdit] = useState(false);
  const [currentTab, setCurrentTab] = useState('1');
  const [previews, setPreviews] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchFiles();
    fetchSharedFiles();
    fetchTrashedFiles();
    fetchMySharedFiles();

    const intervalId = setInterval(() => {
      fetchSharedFiles();
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  const fetchFiles = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/files', {
        headers: { 'x-auth-token': token },
      });
      setFiles(res.data);
      handleBatchPreview(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSharedFiles = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/files/shared', {
        headers: { 'x-auth-token': token },
      });
      setSharedFiles(res.data);
      handleBatchPreview(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTrashedFiles = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/files/trashed', {
        headers: { 'x-auth-token': token },
      });
      setTrashedFiles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMySharedFiles = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/files/my-shared', {
        headers: { 'x-auth-token': token },
      });
      setMySharedFiles(res.data);
      handleBatchPreview(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async (event) => {
    const token = localStorage.getItem('token');
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('isPublic', false);

    try {
      await axios.post('http://localhost:5000/files/upload', formData, {
        headers: { 'x-auth-token': token },
      });
      fetchFiles();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadFolder = async (event) => {
    const token = localStorage.getItem('token');
    const files = event.target.files;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      await axios.post('http://localhost:5000/files/upload-folder', formData, {
        headers: { 'x-auth-token': token },
      });
      fetchFiles();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRename = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(
        'http://localhost:5000/files/rename',
        { oldName: selectedFile.name, newName: newFileName },
        { headers: { 'x-auth-token': token } }
      );

      setFiles(files.map(file => file._id === selectedFile._id ? res.data : file));

      setPreviews(prevPreviews => {
        const newPreviews = { ...prevPreviews };
        if (newPreviews[selectedFile._id]) {
          newPreviews[res.data._id] = newPreviews[selectedFile._id];
          delete newPreviews[selectedFile._id];
        }
        return newPreviews;
      });

      await handlePreview(res.data);

      setOpenRenameDialog(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (fileId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/files/delete/${fileId}`, {
        headers: { 'x-auth-token': token },
      });
      fetchFiles();
      fetchTrashedFiles();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = async (fileId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`http://localhost:5000/files/download/${fileId}`, {
        headers: { 'x-auth-token': token },
        responseType: 'blob',
      });

      const disposition = res.headers['content-disposition'];
      let filename = 'downloaded_file';

      if (disposition && disposition.indexOf('attachment') !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) { 
          filename = matches[1].replace(/['"]/g, '');
        }
      }

      const blob = new Blob([res.data], { type: res.data.type });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading the file:', err);
      alert('File download failed. Please try again.');
    }
  };

  const handleShare = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'http://localhost:5000/files/share',
        { fileId: selectedFile._id, userEmail: shareEmail, canEdit },
        { headers: { 'x-auth-token': token } }
      );
      setOpenShareDialog(false);
      fetchFiles();
      fetchMySharedFiles();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRevertShare = async (fileId, userId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'http://localhost:5000/files/revert-share',
        { fileId, userId },
        { headers: { 'x-auth-token': token } }
      );
      fetchMySharedFiles();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRestore = async (fileId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/files/restore/${fileId}`, {}, {
        headers: { 'x-auth-token': token },
      });
      fetchTrashedFiles();
      fetchFiles();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePermanentDelete = async (fileId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/files/permanently-delete/${fileId}`, {
        headers: { 'x-auth-token': token },
      });
      fetchTrashedFiles();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handlePreview = async (file) => {
    const token = localStorage.getItem('token');
    const fileExtension = file.name.split('.').pop().toLowerCase();
    try {
      const res = await axios.get(`http://localhost:5000/files/preview/${file._id}`, {
        headers: { 'x-auth-token': token },
        responseType: ['mp4', 'mkv'].includes(fileExtension) ? 'blob' : 'arraybuffer',
      });
      let previewUrl;
      if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
        const blob = new Blob([res.data], { type: `image/${fileExtension}` });
        previewUrl = URL.createObjectURL(blob);
      } else if (['mp4', 'mkv'].includes(fileExtension)) {
        const blob = new Blob([res.data], { type: `video/${fileExtension}` });
        previewUrl = URL.createObjectURL(blob);
      } else if (fileExtension === 'pdf') {
        const blob = new Blob([res.data], { type: 'application/pdf' });
        previewUrl = URL.createObjectURL(blob);
      } else if (['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'].includes(fileExtension)) {
        previewUrl = `https://docs.google.com/gview?url=http://localhost:5000/files/preview/${file._id}&embedded=true`;
      } else if (['json', 'js', 'html', 'c', 'cpp', 'java', 'py', 'txt', 'css', 'md'].includes(fileExtension)) {
        const textContent = new TextDecoder('utf-8').decode(res.data);
        previewUrl = `data:text/plain;base64,${btoa(textContent)}`;
      } else {
        previewUrl = '';
      }
      setPreviews((prevPreviews) => ({
        ...prevPreviews,
        [file._id]: previewUrl,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleBatchPreview = async (files) => {
    for (const file of files) {
      await handlePreview(file);
    }
  };

  const handleDoubleClick = (file) => {
    const token = localStorage.getItem('token');
    window.open(`http://localhost:5000/files/preview/${file._id}?token=${token}`, '_blank');
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSharedFiles = sharedFiles.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTrashedFiles = trashedFiles.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMySharedFiles = mySharedFiles.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#1E88E5' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            File Sharer
          </Typography>
          <TextField
            variant="outlined"
            placeholder="Search files"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ backgroundColor: 'white', borderRadius: 1, mr: 2 }}
          />
          <Typography variant="body1" sx={{ marginRight: 2 }}>
            {currentUser}
          </Typography>
          <Button color="inherit" onClick={onLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Tabs
  value={currentTab}
  onChange={handleTabChange}
  aria-label="file explorer tabs"
  sx={{ backgroundColor: '#1976D2' }}
  TabIndicatorProps={{ style: { backgroundColor: '#FFF' } }} // White indicator
>
  <Tab
    label="Home"
    value="1"
    sx={{
      minWidth: 'auto',
      color: currentTab === '1' ? '#FFFFFF !important' : '#E0E0E0', // Ensure white text for selected tab
      fontWeight: currentTab === '1' ? 'bold' : 'normal',
    }}
  />
  <Tab
    label="Shared with me"
    value="2"
    sx={{
      minWidth: 'auto',
      color: currentTab === '2' ? '#FFFFFF !important' : '#E0E0E0', // Ensure white text for selected tab
      fontWeight: currentTab === '2' ? 'bold' : 'normal',
    }}
  />
  <Tab
    label="Trash"
    value="3"
    sx={{
      minWidth: 'auto',
      color: currentTab === '3' ? '#FFFFFF !important' : '#E0E0E0', // Ensure white text for selected tab
      fontWeight: currentTab === '3' ? 'bold' : 'normal',
    }}
  />
  <Tab
    label="My Shared Links"
    value="4"
    sx={{
      minWidth: 'auto',
      color: currentTab === '4' ? '#FFFFFF !important' : '#E0E0E0', // Ensure white text for selected tab
      fontWeight: currentTab === '4' ? 'bold' : 'normal',
    }}
  />
</Tabs>

      {currentTab === '1' && (
        <Box mt={2}>
          <Typography variant="h4" gutterBottom>My Uploads</Typography>
          <Button variant="contained" component="label" sx={{ backgroundColor: '#1E88E5' }}>
            Upload File
            <input type="file" hidden onChange={handleUpload} />
          </Button>
          <Button variant="contained" component="label" sx={{ ml: 2, backgroundColor: '#1E88E5' }}>
            Upload Folder
            <input type="file" hidden webkitdirectory="true" onChange={handleUploadFolder} />
          </Button>
          <Grid container spacing={2}>
            {filteredFiles.map((file) => (
              <Grid item xs={12} md={6} lg={4} key={file._id}>
                <Card sx={{ height: '350px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <CardContent>
                    <Typography>{file.name}</Typography>
                    <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {previews[file._id] && (
                        ['jpg', 'jpeg', 'png'].includes(file.name.split('.').pop().toLowerCase()) ? (
                          <img src={previews[file._id]} alt="File Preview" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                        ) : ['mp4', 'mkv'].includes(file.name.split('.').pop().toLowerCase()) ? (
                          <video src={previews[file._id]} controls style={{ maxWidth: '100%', maxHeight: '100%' }} />
                        ) : file.name.split('.').pop().toLowerCase() === 'pdf' ? (
                          <iframe src={previews[file._id]} style={{ width: '100%', height: '100%' }}></iframe>
                        ) : ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'].includes(file.name.split('.').pop().toLowerCase()) ? (
                          <iframe src={previews[file._id]} style={{ width: '100%', height: '100%' }}></iframe>
                        ) : (
                          <pre style={{ maxHeight: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{atob(previews[file._id].split(',')[1]).substring(0, 500)}</pre>
                        )
                      )}
                    </div>
                    <Typography variant="body2" color="textSecondary" component="p">
                      Shared with:
                      {file.sharedWith.map((shared) => (
                        <div key={shared.user._id}>
                          {shared.user.username} ({shared.user.email}) - Can Edit: {shared.canEdit ? 'Yes' : 'No'}
                        </div>
                      ))}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Created at: {formatDate(file.createdAt)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Updated at: {formatDate(file.updatedAt)}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Tooltip title="Download">
                      <IconButton color="primary" onClick={() => handleDownload(file._id)}>
                        <GetApp />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="secondary" onClick={() => handleDelete(file._id)}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Rename">
                      <IconButton color="default" onClick={() => { setSelectedFile(file); setOpenRenameDialog(true); }}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Share">
                      <IconButton color="default" onClick={() => { setSelectedFile(file); setOpenShareDialog(true); }}>
                        <Share />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      {currentTab === '2' && (
        <Box mt={2}>
          <Typography variant="h4" gutterBottom>Shared with me</Typography>
          <Grid container spacing={2}>
            {filteredSharedFiles.map((file) => (
              <Grid item xs={12} md={6} lg={4} key={file._id}>
                <Card sx={{ height: '350px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <CardContent>
                    <Typography>{file.name}</Typography>
                    <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {previews[file._id] && (
                        ['jpg', 'jpeg', 'png'].includes(file.name.split('.').pop().toLowerCase()) ? (
                          <img src={previews[file._id]} alt="File Preview" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                        ) : ['mp4', 'mkv'].includes(file.name.split('.').pop().toLowerCase()) ? (
                          <video src={previews[file._id]} controls style={{ maxWidth: '100%', maxHeight: '100%' }} />
                        ) : file.name.split('.').pop().toLowerCase() === 'pdf' ? (
                          <iframe src={previews[file._id]} style={{ width: '100%', height: '100%' }}></iframe>
                        ) : ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'].includes(file.name.split('.').pop().toLowerCase()) ? (
                          <iframe src={previews[file._id]} style={{ width: '100%', height: '100%' }}></iframe>
                        ) : (
                          <pre style={{ maxHeight: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{atob(previews[file._id].split(',')[1]).substring(0, 500)}</pre>
                        )
                      )}
                    </div>
                    <Typography variant="body2" color="textSecondary" component="p">
                      Shared by: {file.owner.username} ({file.owner.email})
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Created at: {formatDate(file.createdAt)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Updated at: {formatDate(file.updatedAt)}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Tooltip title="Download">
                      <IconButton color="primary" onClick={() => handleDownload(file._id)}>
                        <GetApp />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      {currentTab === '3' && (
        <Box mt={2}>
          <Typography variant="h4" gutterBottom>Trash</Typography>
          <Grid container spacing={2}>
            {filteredTrashedFiles.map((file) => (
              <Grid item xs={12} md={6} lg={4} key={file._id}>
                <Card sx={{ height: '350px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <CardContent>
                    <Typography>{file.name}</Typography>
                    <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {previews[file._id] && (
                        ['jpg', 'jpeg', 'png'].includes(file.name.split('.').pop().toLowerCase()) ? (
                          <img src={previews[file._id]} alt="File Preview" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                        ) : ['mp4', 'mkv'].includes(file.name.split('.').pop().toLowerCase()) ? (
                          <video src={previews[file._id]} controls style={{ maxWidth: '100%', maxHeight: '100%' }} />
                        ) : file.name.split('.').pop().toLowerCase() === 'pdf' ? (
                          <iframe src={previews[file._id]} style={{ width: '100%', height: '100%' }}></iframe>
                        ) : ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'].includes(file.name.split('.').pop().toLowerCase()) ? (
                          <iframe src={previews[file._id]} style={{ width: '100%', height: '100%' }}></iframe>
                        ) : (
                          <pre style={{ maxHeight: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{atob(previews[file._id].split(',')[1]).substring(0, 500)}</pre>
                        )
                      )}
                    </div>
                    <Typography variant="body2" color="textSecondary">
                      Created at: {formatDate(file.createdAt)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Updated at: {formatDate(file.updatedAt)}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Tooltip title="Restore">
                      <IconButton color="primary" onClick={() => handleRestore(file._id)}>
                        <Restore />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Forever">
                      <IconButton color="secondary" onClick={() => handlePermanentDelete(file._id)}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      {currentTab === '4' && (
        <Box mt={2}>
          <Typography variant="h4" gutterBottom>My Shared Links</Typography>
          <Grid container spacing={2}>
            {filteredMySharedFiles.map((file) => (
              <Grid item xs={12} md={6} lg={4} key={file._id}>
                <Card sx={{ height: '350px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <CardContent>
                    <Typography>{file.name}</Typography>
                    <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {previews[file._id] && (
                        ['jpg', 'jpeg', 'png'].includes(file.name.split('.').pop().toLowerCase()) ? (
                          <img src={previews[file._id]} alt="File Preview" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                        ) : ['mp4', 'mkv'].includes(file.name.split('.').pop().toLowerCase()) ? (
                          <video src={previews[file._id]} controls style={{ maxWidth: '100%', maxHeight: '100%' }} />
                        ) : file.name.split('.').pop().toLowerCase() === 'pdf' ? (
                          <iframe src={previews[file._id]} style={{ width: '100%', height: '100%' }}></iframe>
                        ) : ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'].includes(file.name.split('.').pop().toLowerCase()) ? (
                          <iframe src={previews[file._id]} style={{ width: '100%', height: '100%' }}></iframe>
                        ) : (
                          <pre style={{ maxHeight: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{atob(previews[file._id].split(',')[1]).substring(0, 500)}</pre>
                        )
                      )}
                    </div>
                    <Typography variant="body2" color="textSecondary" component="p">
                      Shared with:
                      {file.sharedWith.map((shared) => (
                        <div key={shared.user._id}>
                          {shared.user.username} ({shared.user.email}) - Can Edit: {shared.canEdit ? 'Yes' : 'No'}
                          <Tooltip title="Revert Share">
                            <IconButton color="secondary" onClick={() => handleRevertShare(file._id, shared.user._id)}>
                              <RemoveCircleOutline />
                            </IconButton>
                          </Tooltip>
                        </div>
                      ))}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Created at: {formatDate(file.createdAt)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Updated at: {formatDate(file.updatedAt)}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Tooltip title="Download">
                      <IconButton color="primary" onClick={() => handleDownload(file._id)}>
                        <GetApp />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      <Dialog open={openRenameDialog} onClose={() => setOpenRenameDialog(false)}>
        <DialogTitle>Rename File</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New File Name"
            type="text"
            fullWidth
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRenameDialog(false)} color="primary">Cancel</Button>
          <Button onClick={handleRename} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openShareDialog} onClose={() => setOpenShareDialog(false)}>
        <DialogTitle>Share File</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Share with (Email)"
            type="email"
            fullWidth
            value={shareEmail}
            onChange={(e) => setShareEmail(e.target.value)}
          />
          <Box display="flex" alignItems="center">
            <Typography>Can Edit</Typography>
            <Checkbox
              checked={canEdit}
              onChange={(e) => setCanEdit(e.target.checked)}
              color="primary"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenShareDialog(false)} color="primary">Cancel</Button>
          <Button onClick={handleShare} color="primary">Share</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default FileExplorer;
