
const host = process.env.NEXT_PUBLIC_API; 

export const endpoints = {
  host: host,
  /*################## Auth #############################*/
  loginRoute: `/api/auth/login`,
  registerRoute: `/api/auth/register`,
  resetPassword: `/api/auth/reset-password`,
  forgotPassword: `/api/auth/forgotpassword`,
  checkToken: `/api/auth/checktoken`,
  logoutRoute: `/api/auth/logout`,
  /*################## Users #############################*/
  cardsRoute: `/api/auth/users/cards/`,
  getAllUsers: `/api/auth/users`,
  getSingleUser: `/api/auth/users`,
  registerUserManually: `/api/auth/users`,
  updateUser: `/api/auth/users`,
  deleteUser: `/api/auth/users`,
  updateAccount: `/api/auth/account`,
};

export const routes = {
  entrada: {
    url: "/entrada",
  },
  registo: {
    url: "/registo",
  },
  agenda: {
    url: "/agenda",
  },
  noticias: {
    url: "/noticias",
  },
  conta: {
    url: "/conta",
  },
  inicio: {
    url: "/",
  },
  contactos: {
    url: "/contactos",
  },
  newsletter: {
    url: "/newsletter",
  },
  forgotpassword: {
    url: "/forgot-password",
  },
  dashboard: {
    url: "/dashboard",
    entries: "/dashboard/entries",
    articles: "/dashboard/articles",
    offpeak: "/dashboard/offpeak",
    vouchers: "/dashboard/vouchers",
    videoCredits: "/dashboard/video-credits",
    orders: "/dashboard/orders",
    users: "/dashboard/users",
    validations: "/dashboard/validations",
    configurations: "/dashboard/configurations",
  },
};