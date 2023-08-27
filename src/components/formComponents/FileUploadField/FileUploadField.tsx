import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material';
import { Stack } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';
import '@uploadthing/react/styles.css';
import { UploadButton } from '@src/utils/uploadthing';
import type { TPostUploadImageFile } from '@src/types/product.types';

interface FileUploadFieldProps {
  imageUpdate: (images: TPostUploadImageFile[]) => void;
  imageRemove: (index: number) => void;
  images: TPostUploadImageFile[];
  imageErrors: string | null;
  imageErrorsUpdate: (error: string | null) => void;
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
  imageErrorsUpdate,
  primaryIdx,
  primaryIdxUpdate,
  imageAltText,
  handleImageAltUpdate
}) => {
  return (
    <>
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
              <Grid item xs={6} sx={{ overflow: 'hidden' }}>
                <FormControlLabel
                  value={i}
                  control={<Radio />}
                  label={
                    <Typography fontSize="small">
                      {img.key.substring(img.key.indexOf('_') + 1)}
                    </Typography>
                  }
                />
              </Grid>
              <Grid item xs={6}>
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
                    value={imageAltText[i] || ''}
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
        <UploadButton
          endpoint="products"
          onClientUploadComplete={(res) => {
            imageUpdate(
              res?.map((file) => ({ key: file.key, url: file.url })) || []
            );
          }}
          onUploadError={(error: Error) => {
            imageErrorsUpdate(error.message);
          }}
        />
        <FormHelperText>{imageErrors}</FormHelperText>
      </FormControl>
    </>
  );
};

export default FileUploadField;
