import getUserId from "../../utils/getUserId";
import cloudinary from "cloudinary";
import { createWriteStream } from "fs";
import shortid from "shortid";
import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import mkdirp from 'mkdirp'

const adapter = new FileSync('./images/db.json')
const db = low(adapter)
db.defaults({ images: []}).write()
mkdirp.sync('./images')

const uploadFile = async (parent, { file }, { prisma }, info) => {

  const storeUpload = async ({ stream, filename }) => {
      const id = shortid.generate();
      const path = `images/${id}-${filename}`;

      return new Promise((resolve, reject) =>
         stream
            .pipe(createWriteStream(path))
            .on("finish", () => resolve({ id, path }))
            .on("error", reject)
      );
   };

  const uploadToCloud = async file => {
    const { createReadStream, filename, mimetype, encoding } = await file;
    const stream = createReadStream();
    const { id, path } = await storeUpload({ stream, filename });
    return new Promise((resolve, reject) => {
      return cloudinary.v2.uploader.upload(`${path}`, function(
        error,
        result
      ) {
          if (error) throw new Error(error)
          if (result) {
              return resolve(result)
          }
      });
    });
  };

  const uploadedFile =  await uploadToCloud(file);
  const { url, original_filename } = uploadedFile

  return {
    filepath: url,
    filename: original_filename,
  }

};

export { uploadFile as default };
