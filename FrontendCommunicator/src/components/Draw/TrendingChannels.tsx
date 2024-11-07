import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Button,
  Modal,
  TextField,
  Divider,
} from "@mui/material";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { MEDIA_URL } from "../../config.ts";
import { Link } from "react-router-dom";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import jwtAxiosInterceptor from "../../axios/jwtinterceptor.ts";

interface Server {
  id: number;
  name: string;
  category: string;
  icon: string;
}

type Props = {
  open: boolean;
};

const TrendingChannels: React.FC<Props> = ({ open }) => {
  const jwtAxios = jwtAxiosInterceptor();
  const [dataCRUD, setDataCRUD] = useState<Server[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [serverName, setServerName] = useState("");
  const [serverCategory, setServerCategory] = useState("");
  const [serverIcon, setServerIcon] = useState<any>(null);
  const [serverBanner, setServerBanner] = useState<any>(null);

  const theme = useTheme();

  useEffect(() => {
  axios.get("/server/select/")
    .then((response) => {
      if (Array.isArray(response.data)) {
        console.log(response.data); // Check the data structure
        setDataCRUD(response.data);
      } else {
        setDataCRUD([]);
      }
    })
    .catch((error) => {
      console.error(error);
      setDataCRUD([]);
    });
}, []);

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => {
    setOpenModal(false);
    setServerName("");
    setServerCategory("");
    setServerIcon(null);
    setServerBanner(null);
  };

  const handleAddServer = async () => {
  const formData = new FormData();
  formData.append("name", serverName);
  formData.append("category", serverCategory);

  // Make sure files are appended if they exist
  if (serverIcon) {
    formData.append("icon", serverIcon);
  }
  if (serverBanner) {
    formData.append("banner", serverBanner);
  }

  try {
    const response = await jwtAxios.post("http://127.0.0.1:8000/api/server/create/", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Ensure it's set to multipart/form-data for file uploads
      },
      withCredentials: true,
    });
    // Add the new server to the list
    setDataCRUD((prevData) => [...prevData, response.data]);
    handleClose();
  } catch (error) {
    console.error("Error creating server:", error.response?.data || error.message);
  }
};

  return (
    <>
      <Box sx={{ height: "50px", display: "flex", alignItems: "center", px: 2, borderBottom: `1px solid ${theme.palette.divider}`, position: "sticky", top: 1, backgroundColor: theme.palette.background.default }}>
        <Typography variant="body1" sx={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
          Servers
        </Typography>
      </Box>
      <List>
        {dataCRUD.map((item) => (
          <ListItem key={`${item.id}-${item.name}`} disablePadding sx={{ display: "block" }} dense>
            <Link to={`/server/${item.id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <ListItemButton sx={{ minHeight: 48 }}>
                <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" }}>
                  <ListItemAvatar sx={{ minWidth: "50px" }}>
                    <Avatar alt="Server Icon" src={`${MEDIA_URL}${item.icon}`} />
                  </ListItemAvatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                      {item.name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.2, color: "textSecondary" }}>
                      {item.category}
                    </Typography>
                  }
                />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>

      <Divider />
      <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
        <Button variant="contained" sx={{ backgroundColor: 'gray', color: 'white' }} onClick={handleOpen}>
          Create new server
        </Button>
      </Box>

      {/* Modal to Create Server */}
      <Modal open={openModal} onClose={handleClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2, width: 400 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Create a New Server
          </Typography>
          <TextField label="Server Name" variant="outlined" fullWidth value={serverName} onChange={(e) => setServerName(e.target.value)} sx={{ mb: 2 }} />
          <TextField label="Category" variant="outlined" fullWidth value={serverCategory} onChange={(e) => setServerCategory(e.target.value)} sx={{ mb: 2 }} />
          <Button variant="outlined" component="label" fullWidth sx={{ mb: 2 }}>
            Upload Banner
            <input type="file" hidden onChange={(event) => setServerBanner(event.target.files[0])} />
          </Button>
          <Button variant="outlined" component="label" fullWidth sx={{ mb: 2 }}>
            Upload Icon
            <input type="file" hidden onChange={(event) => setServerIcon(event.target.files[0])} />
          </Button>

          <Button variant="contained" color="primary" onClick={handleAddServer} disabled={!serverName || !serverCategory}>
            Create Server
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default TrendingChannels;
