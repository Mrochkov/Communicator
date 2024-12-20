import React, { useEffect } from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Container,
  Card,
  CardMedia,
  CardContent,
  Grid,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { MEDIA_URL } from "../../config.ts";
import thisUseCRUD from "../../hooks/thisUseCRUD.ts";
import Scrolling from "./Scrolling";

const PLACEHOLDER_BANNER_URL = "https://media.giphy.com/media/26FPGD4iGDgsqHThS/giphy.gif";

interface Server {
  id: number;
  name: string;
  category: string;
  icon: string;
  banner: string;
}

const ExploreServers = () => {
  const { categoryName } = useParams();
  const url = categoryName ? `/server/select/?category=${categoryName}` : "/server/select";
  const { dataCRUD, fetchData } = thisUseCRUD<Server>([], url);

  useEffect(() => {
    fetchData();
  }, [categoryName]);

  return (
    <>
      <Container maxWidth="lg">
        <Box sx={{ pt: 6 }}>
          <Typography
            variant="h3"
            noWrap
            component="h1"
            sx={{
              display: { sm: "block", fontWeight: 700, letterSpacing: "-2px", textTransform: "capitalize" },
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            {categoryName ? categoryName : "Trending ServerChannels"}
          </Typography>
        </Box>
        <Box>
          <Typography
            variant="h6"
            noWrap
            component="h2"
            color="textSecondary"
            sx={{
              display: { sm: "block", fontWeight: 700, letterSpacing: "-1px" },
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            {categoryName ? `Channels talking about ${categoryName}` : "Check out other popular channels"}
          </Typography>
        </Box>

        <Typography variant="h6" sx={{ pt: 6, pb: 1, fontWeight: 700, letterSpacing: "-1px" }}>
          Click on a channel to join in and see what's there!
        </Typography>

        <Scrolling>
          <Grid container spacing={{ xs: 0, sm: 2 }}>
            {dataCRUD.map((item) => (
              <Grid item key={item.id} xs={12} sm={6} md={6} lg={3}>
                <Card sx={{ height: "100%", display: "flex", flexDirection: "column", boxShadow: "none", backgroundImage: "none", borderRadius: 0 }}>
                  <Link to={`/server/${item.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <CardMedia component="img" src={item.banner ? `${MEDIA_URL}${item.banner}` : PLACEHOLDER_BANNER_URL} alt="server banner" />
                    <CardContent sx={{ flexGrow: 1, padding: 0, "&:last-child": { paddingBottom: 0 } }}>
                      <List>
                        <ListItem disablePadding>
                          <ListItemIcon sx={{ minWidth: 0 }}>
                            <ListItemAvatar sx={{ minWidth: "50px" }}>
                              <Avatar alt="server Icon" src={`${MEDIA_URL}${item.icon}`} />
                            </ListItemAvatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography
                                variant="body2"
                                textAlign="start"
                                sx={{ fontWeight: 700, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
                              >
                                {item.name}
                              </Typography>
                            }
                            secondary={<Typography variant="body2">{item.category}</Typography>}
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Link>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Scrolling>
      </Container>
    </>
  );
};

export default ExploreServers;
