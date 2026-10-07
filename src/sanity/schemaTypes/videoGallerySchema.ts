import { defineArrayMember, defineField } from "sanity"
import { portableTextSchema } from "./helpers/portableText"

/**
 * Array member for `gallerySchema`'s list. Mirrors the image gallery's shape
 * (title, show title, description) so editing a video gallery feels the same.
 */
export const videoGalleryMember = defineArrayMember({
  name: "videoGallery",
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: "boolean",
      name: "showTitle",
      title: "Show Title",
      description: "Show or hide the title for this video gallery.",
      initialValue: true,
    }),
    portableTextSchema({
      name: "description",
      title: "Gallery Description",
    }),
    defineField({
      name: "videos",
      type: "array",
      description: "The videos to display in this gallery.",
      of: [
        defineArrayMember({
          name: "galleryVideo",
          type: "object",
          fields: [
            defineField({
              name: "videoName",
              title: "Video Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "videoFile",
              title: "Video",
              type: "file",
              options: { accept: "video/*" },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "posterImage",
              title: "Thumbnail",
              description: "Optional image shown before the video is played.",
              type: "image",
              options: { hotspot: true },
            }),
          ],
          preview: {
            select: { title: "videoName", media: "posterImage" },
          },
        }),
      ],
    }),
  ],
})
