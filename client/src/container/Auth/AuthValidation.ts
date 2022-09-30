export const AuthValidation = {
   user_name: {
      required: {
         value: true,
         message: 'Name cannot be empty',
      },
   },
   email: {
      required: {
         value: true,
         message: 'Email cannot be empty',
      },
   },
   password: {
      required: {
         value: true,
         message: 'Password cannot be empty',
      },
      minLength: {
         value: 8,
         message: 'Password must be at least 8 characters'
      }
   },
};
