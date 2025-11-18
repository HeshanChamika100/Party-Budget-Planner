import {defineField, defineType} from 'sanity'

export const partyPersonType = defineType({
  name: 'partyPerson',
  title: 'Party Person',
  type: 'document',
  icon: () => '👤',
  fields: [
    defineField({
      name: 'name',
      title: 'Person Name',
      type: 'string',
      description: 'Name of the party attendee',
      validation: (rule) => rule.required().min(2).max(100).error('Person name is required and must be between 2-100 characters'),
    }),
    defineField({
      name: 'isAlcoholic',
      title: 'Drinks Alcohol',
      type: 'boolean',
      description: 'Does this person drink alcohol? (Affects cost splitting)',
      initialValue: false,
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      description: 'Email address (optional)',
      validation: (rule) => rule.email().error('Must be a valid email address'),
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      description: 'Contact phone number (optional)',
    }),
    defineField({
      name: 'dietaryRestrictions',
      title: 'Dietary Restrictions',
      type: 'array',
      description: 'Any dietary restrictions or preferences',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Vegetarian', value: 'vegetarian'},
          {title: 'Vegan', value: 'vegan'},
          {title: 'Gluten-Free', value: 'gluten-free'},
          {title: 'Lactose Intolerant', value: 'lactose-intolerant'},
          {title: 'Nut Allergy', value: 'nut-allergy'},
          {title: 'Halal', value: 'halal'},
          {title: 'Kosher', value: 'kosher'},
          {title: 'Other', value: 'other'},
        ],
      },
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      description: 'Additional notes about this person',
      rows: 3,
    }),
    defineField({
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
      description: 'Optional profile picture',
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
      name: 'rsvpStatus',
      title: 'RSVP Status',
      type: 'string',
      description: 'Has the person confirmed attendance?',
      options: {
        list: [
          {title: '✅ Confirmed', value: 'confirmed'},
          {title: '❓ Pending', value: 'pending'},
          {title: '❌ Declined', value: 'declined'},
          {title: '🤔 Maybe', value: 'maybe'},
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
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
      title: 'name',
      isAlcoholic: 'isAlcoholic',
      rsvpStatus: 'rsvpStatus',
      media: 'avatar',
    },
    prepare(selection) {
      const {title, isAlcoholic, rsvpStatus, media} = selection
      const drinkIcon = isAlcoholic ? '🍺' : '🥤'
      const statusIcons = {
        confirmed: '✅',
        pending: '❓',
        declined: '❌',
        maybe: '🤔',
      }
      const statusIcon = statusIcons[rsvpStatus as keyof typeof statusIcons] || '❓'
      
      return {
        title: `${drinkIcon} ${title || 'Untitled'}`,
        subtitle: `${statusIcon} ${rsvpStatus || 'pending'}`,
        media: media,
      }
    },
  },
  orderings: [
    {
      title: 'Name A-Z',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
    {
      title: 'Name Z-A',
      name: 'nameDesc',
      by: [{field: 'name', direction: 'desc'}],
    },
    {
      title: 'Recently Created',
      name: 'createdAtDesc',
      by: [{field: 'createdAt', direction: 'desc'}],
    },
    {
      title: 'Alcoholic First',
      name: 'alcoholicFirst',
      by: [{field: 'isAlcoholic', direction: 'desc'}],
    },
    {
      title: 'RSVP Status',
      name: 'rsvpStatus',
      by: [{field: 'rsvpStatus', direction: 'asc'}],
    },
  ],
})
