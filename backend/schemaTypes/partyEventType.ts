import {defineField, defineType} from 'sanity'

export const partyEventType = defineType({
  name: 'partyEvent',
  title: 'Party Event',
  type: 'document',
  icon: () => '🎉',
  fields: [
    defineField({
      name: 'title',
      title: 'Event Title',
      type: 'string',
      description: 'Name of the party/event',
      validation: (rule) => rule.required().min(3).max(100).error('Event title is required and must be between 3-100 characters'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly identifier',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Brief description of the event',
      rows: 4,
    }),
    defineField({
      name: 'eventDate',
      title: 'Event Date',
      type: 'datetime',
      description: 'When is the party happening?',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Where is the party?',
    }),
    defineField({
      name: 'items',
      title: 'Party Items',
      type: 'array',
      description: 'Items needed for this event',
      of: [
        {
          type: 'reference',
          to: [{type: 'partyItem'}],
        },
      ],
    }),
    defineField({
      name: 'attendees',
      title: 'Attendees',
      type: 'array',
      description: 'People attending this event',
      of: [
        {
          type: 'reference',
          to: [{type: 'partyPerson'}],
        },
      ],
    }),
    defineField({
      name: 'budget',
      title: 'Total Budget',
      type: 'number',
      description: 'Total budget for the event (Rs.)',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'status',
      title: 'Event Status',
      type: 'string',
      options: {
        list: [
          {title: '📝 Planning', value: 'planning'},
          {title: '✅ Confirmed', value: 'confirmed'},
          {title: '🎊 In Progress', value: 'in-progress'},
          {title: '✔️ Completed', value: 'completed'},
          {title: '❌ Cancelled', value: 'cancelled'},
        ],
        layout: 'radio',
      },
      initialValue: 'planning',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      description: 'Main image for the event',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
      ],
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
    defineField({
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      eventDate: 'eventDate',
      status: 'status',
      media: 'coverImage',
    },
    prepare(selection) {
      const {title, eventDate, status, media} = selection
      const date = eventDate ? new Date(eventDate).toLocaleDateString() : 'No date set'
      const statusIcons = {
        planning: '📝',
        confirmed: '✅',
        'in-progress': '🎊',
        completed: '✔️',
        cancelled: '❌',
      }
      const statusIcon = statusIcons[status as keyof typeof statusIcons] || '📝'
      
      return {
        title: `${statusIcon} ${title || 'Untitled Event'}`,
        subtitle: `${date} • ${status || 'planning'}`,
        media: media,
      }
    },
  },
})
