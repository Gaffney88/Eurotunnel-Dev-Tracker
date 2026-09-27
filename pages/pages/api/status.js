const DEFAULT_USER_ID = 423428585; // HARRY2O6
const DEFAULT_USERNAME = "HARRY2O6";

export default async function handler(req, res) {
  const userId = Number(process.env.ROBLOX_USER_ID) || DEFAULT_USER_ID;

  try {
    const [presenceRes, avatarRes, userRes] = await Promise.all([
      fetch("https://presence.roblox.com/v1/presence/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: [userId] }),
      }),
      fetch(
        `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=true`
      ),
      fetch(`https://users.roblox.com/v1/users/${userId}`),
    ]);

    if (!presenceRes.ok) {
      throw new Error(`presence api ${presenceRes.status}`);
    }

    const presenceData = await presenceRes.json();
    const presence = presenceData.userPresences?.[0] ?? {};

    let avatarUrl = null;
    if (avatarRes.ok) {
      const avatarData = await avatarRes.json();
      avatarUrl = avatarData.data?.[0]?.imageUrl ?? null;
    }

    let username = DEFAULT_USERNAME;
    if (userRes.ok) {
      const userData = await userRes.json();
      username = userData.name || DEFAULT_USERNAME;
    }

    // userPresenceType: 0 Offline, 1 Online (website), 2 InGame, 3 InStudio
    const typeMap = { 0: "offline", 1: "online", 2: "playing", 3: "studio" };
    const status = typeMap[presence.userPresenceType] ?? "offline";

    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({
      userId,
      username,
      avatarUrl,
      status,
      lastLocation: presence.lastLocation || null,
      placeId: presence.placeId || null,
      lastOnline: presence.lastOnline || null,
      fetchedAt: Date.now(),
    });
  } catch (err) {
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({
      userId,
      username: DEFAULT_USERNAME,
      avatarUrl: null,
      status: "unknown",
      error: "Could not reach Roblox right now.",
      fetchedAt: Date.now(),
    });
  }
}
