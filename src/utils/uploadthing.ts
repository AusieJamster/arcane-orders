import { generateComponents } from '@uploadthing/react';
import type { OurFileRouter } from '@src/server/uploadthing';

export const { UploadButton } = generateComponents<OurFileRouter>();
