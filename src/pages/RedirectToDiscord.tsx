import { useEffect } from "react";

const DISCORD_INVITE_URL = "https://discord.gg/fYkTeMRSEr";

export default function RedirectToDiscord() {
  useEffect(() => {
    window.location.replace(DISCORD_INVITE_URL);
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <p>Redirecting you to Discord…</p>
      <p>
        If nothing happens,{" "}
        <a href={DISCORD_INVITE_URL}>click here</a>.
      </p>
    </div>
  );
}