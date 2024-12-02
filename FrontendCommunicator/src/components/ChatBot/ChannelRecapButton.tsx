import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
  DialogActions,
} from "@mui/material";
import jwtAxiosInterceptor from "../../axios/jwtinterceptor.ts";

interface ChannelRecapButtonProps {
  channelId: string;
}

const ChannelRecapButton: React.FC<ChannelRecapButtonProps> = ({ channelId }) => {
  const [openChoiceDialog, setOpenChoiceDialog] = useState(false);
  const [openResultDialog, setOpenResultDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [numMessages, setNumMessages] = useState(10); // Default to 10 messages
  const jwtAxios = jwtAxiosInterceptor();

  const handleOpenChoiceDialog = () => {
    setOpenChoiceDialog(true);
  };

  const handleChoiceDialogClose = () => {
    setOpenChoiceDialog(false);
  };

  const handleRecap = async () => {
    setLoading(true);
    setError(null);
    try {
      // Close the choice dialog when making the request
      setOpenChoiceDialog(false);

      const response = await jwtAxios.post(
        `http://127.0.0.1:8000/api/messages/${channelId}/channel_recap/`,
        { num_messages: numMessages }, // Send selected number of messages
        { withCredentials: true }
      );
      setSummary(response.data.summary);
    } catch (err: any) {
      setError(err.response?.data?.error || "An unexpected error occurred.");
    } finally {
      setLoading(false);
      setOpenResultDialog(true); // Show the result dialog
    }
  };

  const handleResultDialogClose = () => {
    setOpenResultDialog(false);
    setSummary(null);
    setError(null);
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpenChoiceDialog}>
        Summarize Channel
      </Button>

      {/* Dialog for selecting number of messages */}
      <Dialog open={openChoiceDialog} onClose={handleChoiceDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Select Number of Messages</DialogTitle>
        <DialogContent>
          <RadioGroup
            value={numMessages}
            onChange={(e) => setNumMessages(Number(e.target.value))} // Update numMessages
          >
            <FormControlLabel value={10} control={<Radio />} label="10 Messages" />
            <FormControlLabel value={20} control={<Radio />} label="20 Messages" />
            <FormControlLabel value={40} control={<Radio />} label="40 Messages" />
            <FormControlLabel value={100} control={<Radio />} label="100 Messages" />
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleChoiceDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleRecap} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for displaying the summary */}
      <Dialog open={openResultDialog} onClose={handleResultDialogClose} maxWidth="sm" fullWidth>
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
        <DialogActions>
          <Button onClick={handleResultDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChannelRecapButton;
