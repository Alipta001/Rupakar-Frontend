import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosInstance, setAccessToken } from "@/api/axios/axios";
import { endPoints } from "@/api/endPoints/endPoints";

export interface User {
  id: string;
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  phoneNumber?: string;
  avatar?: string;
  profileImage?: string;
  name?: string;
  fullName?: string;
  role?: string;
  preferences?: Record<string, any>;
  isVerified?: boolean;
}

export const AUTH_USER_STORAGE_KEY = "auth_user";

const normalizeUser = (rawUser: any): User | null => {
  if (!rawUser || typeof rawUser !== "object") return null;

  const firstName = rawUser.firstName ?? rawUser.first_name ?? rawUser.name?.split(" ")[0] ?? "User";
  const lastName = rawUser.lastName ?? rawUser.last_name ?? rawUser.name?.split(" ").slice(1).join(" ") ?? "";
  const email = rawUser.email ?? rawUser.emailAddress ?? rawUser.username ?? "";
  const name = rawUser.name ?? rawUser.fullName ?? ([firstName, lastName].filter(Boolean).join(" ") || email || "Customer");
  const phone = rawUser.phone ?? rawUser.phoneNumber ?? "";
  const avatar = rawUser.avatar ?? rawUser.picture ?? rawUser.avatarUrl ?? rawUser.profileImage ?? undefined;

  return {
    id: String(rawUser.id ?? rawUser._id ?? ""),
    _id: String(rawUser.id ?? rawUser._id ?? ""),
    firstName,
    lastName,
    email,
    phone,
    phoneNumber: phone,
    avatar,
    profileImage: avatar,
    name,
    fullName: name,
    role: rawUser.role ?? "customer",
    preferences: rawUser.preferences ?? {},
    isVerified: Boolean(rawUser.isVerified ?? rawUser.isEmailVerified),
  };
};

export interface AuthState {
  isAuthenticated: boolean;
  data: User | null;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  data: null,
  user: null,
  token: null,
  loading: false,
  error: null,
  successMessage: null,
};

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface LoginResponse {
  accessToken?: string;
  token?: string;
  user?: User | null;
}

const persistAuth = (user: User | null, token: string | null) => {
  setAccessToken(token);

  if (typeof window !== "undefined") {
    if (user) {
      window.localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    }
  }
};

export const authRegister = createAsyncThunk<
  ApiEnvelope<{ user: User; accessToken: string }>,
  { name?: string; firstName?: string; lastName?: string; email: string; password: string },
  { rejectValue: string }
>("auth/register", async (payload, thunkAPI) => {
  try {
    const normalizedName = payload.name ?? [payload.firstName, payload.lastName].filter(Boolean).join(" ").trim();
    const body = {
      name: normalizedName || payload.email.split("@")[0],
      email: payload.email,
      password: payload.password,
    };

    const response = await AxiosInstance.post(endPoints.auth.signup, body);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.error?.message || error.response?.data?.message || "Registration failed");
  }
});

export const verifyRegisterOtp = createAsyncThunk<
  ApiEnvelope<Record<string, unknown>>,
  { email: string; otp: string },
  { rejectValue: string }
>("auth/verifyOtp", async (payload, thunkAPI) => {
  try {
    const response = await AxiosInstance.post(endPoints.auth.otp, payload);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.error?.message || error.response?.data?.message || "OTP verification failed");
  }
});

export const authLogin = createAsyncThunk<
  ApiEnvelope<LoginResponse>,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (payload, thunkAPI) => {
  try {
    const response = await AxiosInstance.post(endPoints.auth.signin, payload);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.error?.message || error.response?.data?.message || "Login failed");
  }
});

export const forgotPassword = createAsyncThunk<
  ApiEnvelope<Record<string, unknown>>,
  { email: string },
  { rejectValue: string }
>("auth/forgotPassword", async (payload, thunkAPI) => {
  try {
    const response = await AxiosInstance.post(endPoints.auth.forgotPassword, payload);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.error?.message || error.response?.data?.message || "Failed to send reset OTP");
  }
});

export const resetPassword = createAsyncThunk<
  ApiEnvelope<Record<string, unknown>>,
  { email: string; otp: string; newPassword: string },
  { rejectValue: string }
>("auth/resetPassword", async (payload, thunkAPI) => {
  try {
    const response = await AxiosInstance.post(endPoints.auth.resetPassword, payload);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.error?.message || error.response?.data?.message || "Password reset failed");
  }
});

export const authLogout = createAsyncThunk<
  ApiEnvelope<{ loggedOut: boolean }>,
  void,
  { rejectValue: string }
>("auth/logout", async (_, thunkAPI) => {
  try {
    const response = await AxiosInstance.post(endPoints.auth.logout);
    persistAuth(null, null);
    return response.data;
  } catch (error: any) {
    persistAuth(null, null);
    return thunkAPI.rejectWithValue(error.response?.data?.error?.message || error.response?.data?.message || "Logout variance encountered");
  }
});

export const fetchCurrentUserThunk = createAsyncThunk<
  ApiEnvelope<any>,
  void,
  { rejectValue: string }
>("auth/fetchCurrentUser", async (_, thunkAPI) => {
  try {
    const response = await AxiosInstance.get(endPoints.user.me);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.error?.message || error.response?.data?.message || "Failed to fetch profile"
    );
  }
});

export const updateProfileThunk = createAsyncThunk<
  ApiEnvelope<any>,
  { name?: string; fullName?: string; firstName?: string; lastName?: string; phone?: string; phoneNumber?: string; avatar?: string; profileImage?: string; email?: string },
  { rejectValue: string }
>("auth/updateProfile", async (payload, thunkAPI) => {
  try {
    const response = await AxiosInstance.patch(endPoints.user.me, payload);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.error?.message || error.response?.data?.message || "Failed to update profile"
    );
  }
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthStatus: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    setAuth: (
      state,
      action: PayloadAction<{ token?: string; user?: any; isAuthenticated?: boolean; successMessage?: string; error?: string }>,
    ) => {
      const payload = action.payload;
      if (payload.user !== undefined) {
        const normalizedUser = normalizeUser(payload.user);
        state.data = normalizedUser;
        state.user = normalizedUser;
        persistAuth(normalizedUser, payload.token ?? state.token);
      }
      if (payload.token !== undefined) {
        state.token = payload.token;
        setAccessToken(payload.token);
      }
      if (payload.isAuthenticated !== undefined) state.isAuthenticated = Boolean(payload.isAuthenticated);
      if (payload.successMessage !== undefined) state.successMessage = payload.successMessage;
      if (payload.error !== undefined) state.error = payload.error;
      state.isAuthenticated = Boolean(state.token || state.user);
      if (state.token && state.user) persistAuth(state.user, state.token);
    },
    updateProfile: (
      state,
      action: PayloadAction<Partial<User> & { phone?: string; avatar?: string; name?: string }>,
    ) => {
      if (state.data) {
        state.data = { ...state.data, ...action.payload } as User;
        state.user = state.data;
        persistAuth(state.data, state.token);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message ?? "Registration successful";
      })
      .addCase(verifyRegisterOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message ?? "OTP verified";
      })
      .addCase(authLogin.fulfilled, (state, action) => {
        state.loading = false;

        const payload = (action.payload?.data ?? action.payload ?? {}) as LoginResponse & { user?: any };
        const token = payload.accessToken ?? payload.token ?? null;
        const normalizedUser = normalizeUser(payload.user ?? null);

        state.data = normalizedUser;
        state.user = normalizedUser;
        state.token = token;
        state.isAuthenticated = Boolean(token || normalizedUser);
        state.successMessage = action.payload?.message ?? "Login successful";
        persistAuth(normalizedUser, token);
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message ?? "Request sent";
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message ?? "Password reset successful";
      })
      .addCase(authLogout.fulfilled, (state) => {
        state.loading = false;
        state.data = null;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        state.successMessage = "Logged out clean.";
      })
      .addCase(fetchCurrentUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        const raw = action.payload?.data ?? action.payload ?? null;
        const normalizedUser = normalizeUser(raw);
        if (normalizedUser) {
          state.data = normalizedUser;
          state.user = normalizedUser;
          state.isAuthenticated = true;
          persistAuth(normalizedUser, state.token);
        }
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.loading = false;
        const raw = action.payload?.data ?? action.payload ?? null;
        const normalizedUser = normalizeUser(raw);
        if (normalizedUser) {
          state.data = normalizedUser;
          state.user = normalizedUser;
          state.successMessage = action.payload?.message ?? "Profile updated successfully";
          persistAuth(normalizedUser, state.token);
        }
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
          state.successMessage = null;
        },
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action: any) => {
          state.loading = false;
          state.error = action.payload ?? "An unexpected authentication error occurred";
        },
      );
  },
});

export const { clearAuthStatus, updateProfile, setAuth } = authSlice.actions;
export default authSlice;