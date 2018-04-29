import User from '@/models/User'

it('user', async () => {
  var user = await User.findOne(1)
  console.log(user)
})
