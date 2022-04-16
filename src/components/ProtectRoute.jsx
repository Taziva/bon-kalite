import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const ProtectedRoute = (Component) => {
  const router = useRouter();
  useSession({
    required: true,
    onUnauthenticated() {
      // The user is not authenticated, handle it here.
      router.push("/api/auth/signin");
    },
  });

  return <Component {...arguments} />;
};

export function ProtectRoute(Component) {
  return () => ProtectedRoute(Component);
}

export default ProtectRoute;
