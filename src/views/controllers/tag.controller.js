/**
 * Methods to interact with Tag model
 */
const { PrismaClient } = require("@prisma/client");
const path = require("path");
const formidable = require("formidable");

const prisma = new PrismaClient();

// Get all tags from the database
const getTags = async () => {
  try {
    const tags = await prisma.tag
    .findMany({
      select: {
        TagId: true,
        TagName: true,
        TagColor: true,
        TagImage: true,
        _count: {
          select: {
            Post: true,
          },
        },
        created_at: true,
      },
    })

    return tags;
  } catch (err) {
    throw new Error(err.message);
  }
};

// Get a specific tag by its ID
const getTagById = async (id) => {
  try {
    const tag = await prisma.tag
    .findUnique({
      where: {
        TagId: id,
      },
      select: {
        TagId: true,
        TagName: true,
        TagColor: true,
        TagImage: true,
        _count: {
          select: {
            Post: true,
          },
        },
        created_at: true,
      },
    })

    if (tag == null)
      throw new Error(`Unable to find the tag with id: ${id}.`);
    return tag;
  } catch (err) {
    throw new Error(err.message);
  }
};

// Create a new tag
const createTag = async (req, res) => {
  // define the path where the TagImage will be stored
  const imagePath = path.resolve(__dirname, "../../../public/img");

  // parse a form-data request containing a file
  var form = new formidable.IncomingForm({
    multiples: false,
    maxFiles: 1,
    maxFields: 2,
    keepExtensions: true,
    createDirsFromUploads: false,
    uploadDir: imagePath,
  });

  return new Promise((resolve, reject) => {
    form
      .parse(req)
      .then(async (result) => {
        const [fields, files] = result;

        // Check if form fields are not empty
        if (!fields.TagName[0] || !fields.TagName[0].length) {
          throw new Error("Error: Tag must have a name");
        } else if (!fields.TagColor[0] || !fields.TagColor[0].length) {
          throw new Error("Error: Tag must have a color");
        } else if (!files.TagImage) {
          throw new Error("Error: no tag image has been provided.");
        }

        // Create a new tag in the database
        const newTag = await prisma.tag.create({
          data: {
            TagName: fields.TagName[0],
            TagColor: fields.TagColor[0],
            TagImage: `/public/img/${files.TagImage[0].newFilename}`,
          },
          select: {
            TagId: true,
            TagName: true,
            TagColor: true,
            TagImage: true,
            created_at: true,
          },
        });

        resolve({ message: "Your new tag has been created.", data: newTag });
      })
      .catch((err) => {
        if (err.code == 1015)
          err.message = "Error: you can upload only one file at a time.";
        else if (err.code == 1010)
          err.message = "Error: no tag picture provided but 1 is required.";
        reject(err);
      });
  });
};

// Delete a specific tag by its ID  
const deleteTag = async (id) => {
  try {
    await prisma.tag
    .delete({
      where: { TagId: id },
    })

    return "The tag has been deleted.";
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {
  getTags,
  getTagById,
  createTag,
  deleteTag,
};
