import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function NewPin() {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    check();
  }, [session]);

  async function check() {
    if (session?.user?.id) {
      const { data } = await supabaseClient
        .from("Users")
        .select("userid")
        .eq("userid", session?.user?.id)
        .limit(1)

      if (data) location.href = "/"
      else {
        const pin = prompt("Set your new PIN.");
        if (!Number(pin) || pin.length !== 4) {
          alert(
            "Please follow 4 number pin. Which should be number pin. Please refresh this website."
          );
        } else if (Number(pin) && pin.length == 4) {
          await supabaseClient.from("Users").insert({
            userid: session?.user?.id,
            pin: pin,
          });

          return location.href = "/"
        }
      }
    }
  }

  return (
    <main
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <h1>Setting up new pin*</h1>
    </main>
  );
}
