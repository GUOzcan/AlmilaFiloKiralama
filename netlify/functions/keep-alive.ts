import { schedule } from "@netlify/functions";

const handler = schedule("@daily", async () => {
  const supabaseUrl = "https://hmkvqrxokqzmlrlnntss.supabase.co";
  const supabaseKey = "sb_publishable_8OFbcB4CaVB7_lkfK-kwdw_9PfuTa5R";

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/vehicles?limit=1`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    );

    console.log("Supabase keep-alive ping:", response.status);
    return { statusCode: 200 };
  } catch (err) {
    console.error("Keep-alive hatası:", err);
    return { statusCode: 500 };
  }
});

export { handler };
