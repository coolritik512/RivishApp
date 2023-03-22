export const tweetSchema = {
  name: 'tweets',
  type: 'document',
  title: 'Tweets',
  fields: [
    {
      name: 'tweet',
      type: 'number',
      title: 'Tweet',
    },
    {
      name: 'timestamp',
      type: 'datetime',
      title: 'Timestamp',
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'users' }],
    },
  ],
}
