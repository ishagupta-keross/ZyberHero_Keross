

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { motion } from "framer-motion";
// import Image from "next/image";
// import { Shield, Users, Search, Sparkles, Home } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { signIn, type UserRole, getDashboardPath } from "@/lib/auth";
// import usersData from "@/lib/mock/users.json";
// import { ThemeToggle } from "@/components/ui/theme-toggle";
// import { login } from "./loginauth";
// import { toast } from "sonner";

// const roles = [
//   {
//     id: "child" as UserRole,
//     title: "Child",
//     description: "Learn how to stay safe online",
//     icon: Sparkles,
//     color: "from-blue-400 to-cyan-400",
//     bgColor:
//       "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950",
//   },
//   {
//     id: "parent" as UserRole,
//     title: "Parent",
//     description: "Monitor and protect your children",
//     icon: Users,
//     color: "from-emerald-400 to-teal-400",
//     bgColor:
//       "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950",
//   },
//   {
//     id: "investigator" as UserRole,
//     title: "Investigator",
//     description: "Investigate threats and cases",
//     icon: Search,
//     color: "from-amber-400 to-orange-400",
//     bgColor:
//       "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950",
//   },
// ];

// export default function LoginPage() {
//   const router = useRouter();
//   const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
//   const [selectedUserId, setSelectedUserId] = useState<string>("");
//   const [username, setUsername] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [error, setError] = useState<string>("");

//   const usersForRole = usersData.filter((u) => u.role === selectedRole);

//   const handleLogin = async (isNewUser: boolean = false) => {
//     if (!selectedRole) return;

//     // Allow sign-in either by a previously selected user id (legacy flow)
//     // or by username/password entered in the inputs.


//     let idToUse = selectedUserId;
//     if (!idToUse && !username) {
//       toast.error("Please enter a username");
//       return;
//     }

//     // Prefer the selected user id or username as identifier to send to the server
//     const userloginPayload = idToUse || username;

//     try {
//      const logindata= await login(userloginPayload, password);

//       toast.success("Login successful!");

//       // if (!res.ok) {
//       //   const json = await res.json().catch(() => ({}));
//       //   const msg = json?.error || `Login failed with status ${res.status}`;

//       //   // If API failed, fall back to static mock sign-in when possible
//       //   const found = usersData.find(u => (u.id === userloginPayload || (u.name && u.name.toLowerCase() === String(userloginPayload).toLowerCase())) && u.role === selectedRole);
//       //   if (found) {
//       //     signIn(selectedRole, found.id);
//       //     if (isNewUser) router.push('/payment');
//       //     else if (selectedRole === 'parent') router.push('/dashboard/parent');
//       //     else router.push(getDashboardPath(selectedRole));
//       //     return;
//       //   }

//       //   setError(msg);
//       //   return;
//       // }
// console.log(logindata,"login d")
//       // API succeeded — navigate
//     } catch (err: any) {
//       toast.error(err?.message || "Login request failed");
//     }
//     if (isNewUser) {
//       // router.push("/payment");
//             // router.push("/dashboard/parent");

//     } else if (selectedRole === "parent") {
//       router.push("/dashboard/parent");
//     } else {
//       router.push(getDashboardPath(selectedRole));
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
//       <div className="absolute top-4 left-4">
//         <Button
//           variant="ghost"
//           className="hover:bg-cyan-50 hover:text-cyan-600 dark:hover:bg-cyan-950 dark:hover:text-cyan-400"
//           asChild
//         >
//           <Link href="/">
//             <Home className="w-4 h-4 mr-2" />
//             Back to Home
//           </Link>
//         </Button>
//       </div>
//       <div className="absolute top-4 right-4">
//         <ThemeToggle />
//       </div>
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="w-full max-w-5xl"
//       >
//         <div className="text-center mb-8">
//           <motion.div
//             initial={{ scale: 0.5, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             transition={{ duration: 0.5, delay: 0.1 }}
//             className="flex justify-center mb-6"
//           >
//             <div className="relative w-48 h-48 rounded-2xl overflow-hidden">
//               <Image
//                 src="/zyber-logo.png"
//                 alt="ZyberHero Logo"
//                 fill
//                 className="object-contain"
//                 priority
//               />
//             </div>
//           </motion.div>

//           <motion.h1
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//             className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2"
//           >
//             ZyberHero
//           </motion.h1>

//           <motion.p
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.5, delay: 0.3 }}
//             className="text-lg md:text-xl text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2"
//           >
//             Innocence Deserves Protection
//           </motion.p>
//         </div>

//         {!selectedRole ? (
//           <div className="grid md:grid-cols-3 gap-6">
//             {roles.map((role, index) => {
//               const Icon = role.icon;
//               return (
//                 <motion.div
//                   key={role.id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
//                 >
//                   <Card
//                     className={`cursor-pointer transition-all hover:scale-105 hover:shadow-xl ${role.bgColor} border-2 border-transparent hover:border-cyan-500`}
//                     onClick={() => setSelectedRole(role.id)}
//                   >
//                     <CardHeader className="text-center">
//                       <div
//                         className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-br ${role.color} flex items-center justify-center mb-4`}
//                       >
//                         <Icon className="w-8 h-8 text-white" />
//                       </div>
//                       <CardTitle className="text-2xl">{role.title}</CardTitle>
//                       <CardDescription className="text-base">
//                         {role.description}
//                       </CardDescription>
//                     </CardHeader>
//                   </Card>
//                 </motion.div>
//               );
//             })}
//           </div>
//         ) : (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.3 }}
//           >
//             <Card className="max-w-md mx-auto">
//               <CardContent className="space-y-4">
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-black-700 dark:text-gray-300 mb-1">
//                       Username
//                     </label>
//                     <Input
//                       name="login-username"
//                       autoComplete="off"
//                       value={username}
//                       onChange={(e: any) => setUsername(e.target.value)}
//                       placeholder="Enter username"
//                       className="w-full"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-black-700 dark:text-gray-300 mb-1">
//                       Password
//                     </label>
//                     <Input
//                       name="login-password"
//                       autoComplete="new-password"
//                       type="password"
//                       value={password}
//                       onChange={(e: any) => setPassword(e.target.value)}
//                       placeholder="Enter password"
//                       className="w-full"
//                     />
//                   </div>
//                 </div>

//                 {error && (
//                   <div className="text-sm text-red-600 dark:text-red-400">
//                     {error}
//                   </div>
//                 )}

//                 <div className="flex gap-2">
//                   <Button
//                     variant="outline"
//                     className="flex-1 border-2 border-cyan-500/50 bg-transparent text-cyan-400 hover:bg-cyan-500 hover:text-white hover:shadow-2xl hover:shadow-cyan-500/70 transition-all"
//                     onClick={() => {
//                       setSelectedRole(null);
//                       setSelectedUserId("");
//                       setUsername("");
//                       setPassword("");
//                     }}
//                   >
//                     Back
//                   </Button>
//                   <Button
//                     className="flex-1 bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-cyan-500/50"
//                     disabled={!selectedUserId && !username}
//                     onClick={() => handleLogin(false)}
//                   >
//                     Sign In
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         )}
//       </motion.div>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { Shield, Users, Search, Sparkles, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { signIn, type UserRole, getDashboardPath } from "@/lib/auth";
import usersData from "@/lib/mock/users.json";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { login } from "./loginauth";
import { toast } from "sonner";

const roles = [
  {
    id: "child" as UserRole,
    title: "Child",
    description: "Learn how to stay safe online",
    icon: Sparkles,
    color: "from-blue-400 to-cyan-400",
    bgColor:
      "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950",
  },
  {
    id: "parent" as UserRole,
    title: "Parent",
    description: "Monitor and protect your children",
    icon: Users,
    color: "from-emerald-400 to-teal-400",
    bgColor:
      "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950",
  },
  {
    id: "investigator" as UserRole,
    title: "Investigator",
    description: "Investigate threats and cases",
    icon: Search,
    color: "from-amber-400 to-orange-400",
    bgColor:
      "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const usersForRole = usersData.filter((u) => u.role === selectedRole);

//   const handleLogin = async (isNewUser: boolean = false) => {
//     if (!selectedRole) return;

//     // Allow sign-in either by a previously selected user id (legacy flow)
//     // or by username/password entered in the inputs.


//     let idToUse = selectedUserId;
//     if (!idToUse && !username) {
//       toast.error("Please enter a username");
//       return;
//     }
//     // Prefer the selected user id or username as identifier to send to the server
//     const userloginPayload = idToUse || username;

//     try {
//      const logindata= await login(userloginPayload, password);

//       toast.success("Login successful!");

//       // if (!res.ok) {
//       //   const json = await res.json().catch(() => ({}));
//       //   const msg = json?.error || `Login failed with status ${res.status}`;

//       //   // If API failed, fall back to static mock sign-in when possible
//       //   const found = usersData.find(u => (u.id === userloginPayload || (u.name && u.name.toLowerCase() === String(userloginPayload).toLowerCase())) && u.role === selectedRole);
//       //   if (found) {
//       //     signIn(selectedRole, found.id);
//       //     if (isNewUser) router.push('/payment');
//       //     else if (selectedRole === 'parent') router.push('/dashboard/parent');
//       //     else router.push(getDashboardPath(selectedRole));
//       //     return;
//       //   }

//       //   setError(msg);
//       //   return;
//       // }
// console.log(logindata,"login d")
//       // API succeeded — navigate
//     } catch (err: any) {
//       toast.error(err?.message || "Login request failed");
//     }
//     if (isNewUser) {
//       // router.push("/payment");
//             // router.push("/dashboard/parent");

//     } else if (selectedRole === "parent") {
//       router.push("/dashboard/parent");
//     } else {
//       router.push(getDashboardPath(selectedRole));
//     }
//   };


const handleLogin = async (isNewUser: boolean = false) => {
  if (!selectedRole) return;

  let idToUse = selectedUserId;
  if (!idToUse && !username) {
    toast.error("Please enter a username");
    return;
  }

  const userloginPayload = idToUse || username;

  try {
    // Force TypeScript to treat login response as ANY
    const logindata: any = await login(userloginPayload, password);

    toast.success("Login successful!");

    signIn(selectedRole, {
      id: userloginPayload,
      username,
      role: selectedRole,
      accessToken: logindata?.accessToken ?? null,
      refreshToken: logindata?.refreshToken ?? null,
    });

    if (selectedRole === "parent") {
      router.push("/dashboard/parent");
      return;
    }

    router.push(getDashboardPath(selectedRole));

  } catch (err: any) {
    toast.error(err?.message || "Login request failed");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="absolute top-4 left-4">
        <Button
          variant="ghost"
          className="hover:bg-cyan-50 hover:text-cyan-600 dark:hover:bg-cyan-950 dark:hover:text-cyan-400"
          asChild
        >
          <Link href="/">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl"
      >
   <div className="text-center mb-24">
  
  {/* 1. Large IKON Logo (Centered) */}
  <motion.div
    initial={{ scale: 0.5, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.5, delay: 0.1 }}
    // Container for the logo. The mb-4 provides spacing to the text below.
    className="flex justify-center mb-4" 
  >
    {/* Use a size that reflects the "IKON" image shown in your visual example. */}
    {/* I'll use w-64 h-20 (wide and short) to mimic the full wordmark. */}
    <div className="relative w-64 h-20 overflow-hidden">
      <Image
        // This image should be the full "IKON" wordmark (IKON with the circle)
        src="/ikon-logo.png" 
        alt="IKON Wordmark"
        fill
        className="object-contain"
        priority
      />
    </div>
  </motion.div>

  {/* 2. Slogan Text (Centered directly below) */}
  <motion.p
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5, delay: 0.3 }}
    // Styling for the slogan
    className="text-gray-300 mb-6 text-xl" 
  >
    Harness the Power of Data
  </motion.p>
  
</div>

        <div className="text-center mb-8">
          {/* 1. Logo and Heading Row (Centered horizontally) */}
          <div className="flex items-center justify-center mb-2">

            {/* Logo: Smaller and to the left of the text */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              // Small size, right margin for spacing
              className="relative w-12 h-12 mr-3 rounded-lg overflow-hidden flex-shrink-0"
            >
              <Image
                src="/zyber-logo.png"
                alt="ZyberHero Logo"
                fill
                className="object-contain"
                priority
              />
            </motion.div>

            {/* Heading Text */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              // Removed margin-bottom here to keep it tight with the logo
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white"
            >
              ZyberHero
            </motion.h1>
          </div>
          {/* End of Logo and Heading Row */}

          {/* 2. Slogan/Slogan Text (Centered directly below the combined unit) */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            // Added margin-top (mt-1) to create separation from the heading
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mt-1 flex items-center justify-center gap-2"
          >
            Innocence Deserves Protection
          </motion.p>

        </div>

        {!selectedRole ? (
          <div className="grid md:grid-cols-3 gap-6">
            {roles.map((role, index) => {
              const Icon = role.icon;
              return (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  <Card
                    className={`cursor-pointer transition-all hover:scale-105 hover:shadow-xl ${role.bgColor} border-2 border-transparent hover:border-cyan-500`}
                    onClick={() => setSelectedRole(role.id)}
                  >
                    <CardHeader className="text-center">
                      <div
                        className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-br ${role.color} flex items-center justify-center mb-4`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl">{role.title}</CardTitle>
                      <CardDescription className="text-base">
                        {role.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="max-w-md mx-auto pt-5">
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-black-700 dark:text-gray-300 mb-1">
                      Username
                    </label>
                    <Input
                      name="login-username"
                      autoComplete="off"
                      value={username}
                      onChange={(e: any) => setUsername(e.target.value)}
                      placeholder="Enter username"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black-700 dark:text-gray-300 mb-1">
                      Password
                    </label>
                    <Input
                      name="login-password"
                      autoComplete="new-password"
                      type="password"
                      value={password}
                      onChange={(e: any) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full"
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-sm text-red-600 dark:text-red-400">
                    {error}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-2 border-cyan-500/50 bg-transparent text-cyan-400 hover:bg-cyan-500 hover:text-white hover:shadow-2xl hover:shadow-cyan-500/70 transition-all"
                    onClick={() => {
                      setSelectedRole(null);
                      setSelectedUserId("");
                      setUsername("");
                      setPassword("");
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-cyan-500/50"
                    disabled={!selectedUserId && !username}
                    onClick={() => handleLogin(false)}
                  >
                    Sign In
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}