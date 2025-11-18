import {defineField, defineType} from 'sanity'

export const partyItemType = defineType({
  name: 'partyItem',
  title: 'Party Item',
  type: 'document',
  icon: () => '🛍️',
  fields: [
    defineField({
      name: 'name',
      title: 'Item Name',
      type: 'string',
      description: 'Name of the party item (e.g., Chicken, Beverages)',
      validation: (rule) => rule.required().min(2).max(100).error('Item name is required and must be between 2-100 characters'),
    }),
    defineField({
      name: 'unitPrice',
      title: 'Unit Price (Rs.)',
      type: 'number',
      description: 'Price per unit in Sri Lankan Rupees',
      validation: (rule) => rule.required().min(0).error('Unit price must be a positive number'),
      initialValue: 0,
    }),
    defineField({
      name: 'quantity',
      title: 'Quantity',
      type: 'number',
      description: 'Number of units needed',
      validation: (rule) => rule.required().min(1).error('Quantity must be at least 1'),
      initialValue: 1,
    }),
    defineField({
      name: 'isAlcoholic',
      title: 'Alcoholic Item',
      type: 'boolean',
      description: 'Is this an alcoholic item? (Will affect cost splitting)',
      initialValue: false,
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Category of the item',
      options: {
        list: [
          {title: 'Food', value: 'food'},
          {title: 'Beverages', value: 'beverages'},
          {title: 'Alcoholic Drinks', value: 'alcoholic'},
          {title: 'Snacks', value: 'snacks'},
          {title: 'Supplies', value: 'supplies'},
          {title: 'Decorations', value: 'decorations'},
          {title: 'Other', value: 'other'},
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      description: 'Additional notes about this item',
      rows: 3,
    }),
    defineField({
      name: 'image',
      title: 'Item Image',
      type: 'image',
      description: 'Optional image of the item',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for SEO and accessibility',
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
      title: 'name',
      unitPrice: 'unitPrice',
      quantity: 'quantity',
      isAlcoholic: 'isAlcoholic',
      media: 'image',
    },
    prepare(selection) {
      const {title, unitPrice, quantity, isAlcoholic, media} = selection
      const total = (unitPrice || 0) * (quantity || 1)
      const alcoholicBadge = isAlcoholic ? '🍺' : '🥤'
      
      return {
        title: `${alcoholicBadge} ${title || 'Untitled'}`,
        subtitle: `Rs.${unitPrice?.toLocaleString() || 0} × ${quantity || 1} = Rs.${total.toLocaleString()}`,
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
      title: 'Price Low to High',
      name: 'priceAsc',
      by: [{field: 'unitPrice', direction: 'asc'}],
    },
    {
      title: 'Price High to Low',
      name: 'priceDesc',
      by: [{field: 'unitPrice', direction: 'desc'}],
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
  ],
})
