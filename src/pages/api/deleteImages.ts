import type { NextApiHandler } from 'next';
import { utapi } from 'uploadthing/server';

const deleteImages: NextApiHandler<boolean> = async (req, res) => {
  if (req.method !== 'DELETE') {
    res.status(405).end();
    return;
  }

  try {
    await utapi.deleteFiles(req.body);
    res.status(200).json(true);
  } catch (error) {
    res.status(500).end();
    throw error;
  }
};

export default deleteImages;
