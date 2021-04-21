const User = {
  model: 'User',
  documents: [
    {
      _id: '60382dd567c98d15dc9c8fc8',
      email: 'godspowercuche56@gmail.com',
      password: '$argon2i$v=19$m=4096,t=3,p=1$OHVLCET1KiRZqhBw8DwRWQ$e7o2rvJa1malV4FkW/+Vw+ZNyoR66ukRXnVrRzYDgok',
      posts: [
        {
          _id: '605f83b5ba67ca5d6b515af8',
          post: "Lorem Ipsum is simply dummy text of the printing and typesetting's galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into.",
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: '60382dd567c98f15dc9c8fb4',
      email: 'wisdom@gmail.com',
      password: '$argon2i$v=19$m=4096,t=3,p=1$oJtM82Opu9BzS2YXp3sAsg$yXZKaZnTxbOCB369Ke8m+6GncMg8s5jGjo8Zduv4Zt8',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
};

export default User;
