export const endPoints = {
  auth: {
    signin: "/auth/login",
    signup: "/auth/register",
    otp: "/auth/verify-otp",
    resendOtp: "/auth/resend-otp",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
  },
  user: {
    me: "/users/me",
    addresses: "/users/addresses",
    changePassword: "/users/change-password",
  },
  cart: {
    list: "/cart",
    items: "/cart/items",
  },
  wishlist: {
    list: "/wishlist",
  },
  product: {
    list: "/products",
    details: "/products/:slug",
    search: "/products",
    filter: "/products",
  },
  categories: {
    list: "/categories",
    detail: "/categories/:slug",
  },
  brands: {
    list: "/brands",
  },
  orders: {
    list: "/orders",
    details: "/orders/:id",
    cancel: "/orders/:id/cancel",
  },
  checkout: {
    preview: "/checkout/preview",
    placeOrder: "/checkout",
  },
  payments: {
    config: "/payments/config",
    verify: "/payments/verify",
  },
  reviews: {
    product: "/reviews/product",
    create: "/reviews",
  },
};
