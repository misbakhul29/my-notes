import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        console.log('credentials = ', credentials);
        try {
          const LOGIN_API_URL = "https://notes-api.dicoding.dev/v1/login";
          const USER_ME_API_URL = "https://notes-api.dicoding.dev/v1/users/me"; // Endpoint baru

          // --- Langkah 1: Panggilan API Login ---
          const loginResponse = await fetch(LOGIN_API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const loginData = await loginResponse.json();
          console.log("API Login Response:", loginData);

          if (!loginResponse.ok || loginData.status === "fail") {
            throw new Error(
              loginData.message || "Kredensial tidak valid."
            );
          }

          // Ambil accessToken dari respons login
          const { accessToken } = loginData.data;

          if (!accessToken) {
               throw new Error("Token akses tidak ditemukan dalam respons login.");
          }

          // --- Langkah 2: Panggilan API Get User Data (/users/me) ---
          const userMeResponse = await fetch(USER_ME_API_URL, {
              method: "GET", // Biasanya GET untuk mengambil data user
              headers: {
                  "Authorization": `Bearer ${accessToken}`, // Gunakan token akses
                  "Content-Type": "application/json", // Opsional, tapi baik untuk disertakan
              },
          });

          const userMeData = await userMeResponse.json();
          console.log("API User Me Response:", userMeData);

          if (!userMeResponse.ok || userMeData.status === "fail") {
              // Jika panggilan users/me gagal, lemparkan error
              throw new Error(userMeData.message || "Gagal mengambil data pengguna.");
          }

          // Ambil data user dari respons /users/me
          const user = userMeData.data;

          // Pastikan data user memiliki id
          if (user && user.id) {
            // Gabungkan data user dan accessToken untuk dikembalikan oleh authorize
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              accessToken: accessToken, // Sertakan kembali accessToken di objek user
            };
          } else {
            // Jika respons users/me sukses tapi data user tidak lengkap
            throw new Error("Data pengguna dari API tidak lengkap.");
          }

        } catch (error: any) {
          console.error("Error during API authentication:", error.message);
          // Lemparkan error agar NextAuth menampilkannya di halaman error
          throw new Error(error.message || "Terjadi kesalahan saat login.");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // user hanya ada pada saat sign in pertama kali atau saat session diupdate
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.accessToken = user.accessToken; // Simpan accessToken dari objek user ke token
      }
      return token;
    },
    async session({ session, token }) {
      // Kirim data dari token ke session
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      session.accessToken = token.accessToken as string; // Kirim accessToken ke session
      return session;
    },
  },
});