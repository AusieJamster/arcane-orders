import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { MuiFileInput } from "mui-file-input";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";

interface FileUploadFieldProps {
  imageUpdate: (images: File[]) => void;
  imageRemove: (index: number) => void;
  images: File[];
  imageErrors: string | null;
  primaryIdx: string;
  primaryIdxUpdate: (idx: string) => void;
  imageAltText: string[];
  handleImageAltUpdate: (idx: number, altText: string) => void;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  imageUpdate,
  imageRemove,
  images,
  imageErrors,
  primaryIdx,
  primaryIdxUpdate,
  imageAltText,
  handleImageAltUpdate,
}) => {
  return (
    <FormControl error={!!imageErrors} fullWidth>
      <RadioGroup
        value={primaryIdx}
        onChange={(_, idx) => primaryIdxUpdate(idx)}
      >
        {images.map((img, i) => (
          <Grid
            container
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="center"
            key={`image-name-${i}`}
          >
            <Grid xs={6} sx={{ overflow: "hidden" }}>
              <FormControlLabel
                value={i}
                control={<Radio />}
                label={<Typography fontSize="small">{img.name}</Typography>}
              />
            </Grid>
            <Grid xs={6}>
              <Stack direction="row">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => imageRemove(i)}
                >
                  <CloseIcon />
                </IconButton>
                <TextField
                  size="small"
                  placeholder="alt text"
                  value={imageAltText[i] || ""}
                  fullWidth
                  onChange={(event) =>
                    handleImageAltUpdate(i, event.target.value)
                  }
                />
              </Stack>
            </Grid>
          </Grid>
        ))}
      </RadioGroup>
      <MuiFileInput
        multiple
        value={images}
        onChange={imageUpdate}
        inputProps={{ accept: "image/*" }}
      />
      <FormHelperText>{imageErrors}</FormHelperText>
    </FormControl>
  );
};

export default FileUploadField;
