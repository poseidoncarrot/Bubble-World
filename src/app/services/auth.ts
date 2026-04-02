import { supabase } from '../utils/supabase';
import { AuthResponse as SupabaseAuthResponse, User } from '@supabase/supabase-js';

export interface AuthResponse {
  data: SupabaseAuthResponse['data'];
  error: SupabaseAuthResponse['error'];
}

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Authentication services
export const authService = {
  async signUp(email: string, password: string, firstName: string, lastName: string): Promise<AuthResponse> {
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
        },
        emailRedirectTo: `${window.location.origin}/login`
      }
    });
    
    return { data, error };
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { data, error };
  },

  async signOut(): Promise<{ error: any }> {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async confirmSignUp(email: string, token: string): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup'
    });
    
    return { data, error };
  },

  async resendConfirmationEmail(email: string): Promise<{ error: any }> {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/login`
      }
    });
    
    return { error };
  },

  onAuthStateChange(callback: (event: string, session: SupabaseAuthResponse['data']['session']) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },

  // Helper method to check if user exists (using the identities array trick)
  checkIfUserExists(signUpData: AuthResponse['data']): boolean {
    // Supabase trick: if email enumeration protection is ON, it returns a user but with an empty identities array for duplicates
    return !!(signUpData?.user && signUpData.user.identities && signUpData.user.identities.length === 0);
  },

  // Helper method to determine if email confirmation is needed
  isEmailConfirmationNeeded(signUpData: AuthResponse['data']): boolean {
    return !!(signUpData?.user && signUpData?.session === null);
  },

  // Helper method to check if user is immediately logged in
  isUserImmediatelyLoggedIn(signUpData: AuthResponse['data']): boolean {
    return !!(signUpData?.session !== null);
  }
};
