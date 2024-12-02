import React, { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, Typography, CircularProgress } from "@mui/material";
import jwtAxiosInterceptor from "../../axios/jwtinterceptor.ts";
interface ChannelRecapButtonProps {
  channelId: string;
}

const ChannelRecapButton: React.FC<ChannelRecapButtonProps> = ({ channelId }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const jwtAxios = jwtAxiosInterceptor();

  const handleRecap = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await jwtAxios.post(`http://127.0.0.1:8000/api/messages/${channelId}/channel_recap/`, {
        num_messages: 10,
      }, {withCredentials: true});
      setSummary(response.data.summary);
    } catch (err: any) {
      setError(err.response?.data?.error || "An unexpected error occurred.");
    } finally {
      setLoading(false);
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSummary(null);
    setError(null);
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleRecap}>
        Summarize Channel
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Channel Summary</DialogTitle>
        <DialogContent>
          {loading && <CircularProgress />}
          {error && (
            <Typography color="error">
              {error}
            </Typography>
          )}
          {summary && (
            <Typography>
              {summary}
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChannelRecapButton;
