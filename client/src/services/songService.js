import axios from "axios";

export async function searchSongs(query) {
  if (!query.trim()) return [];

  const list = [
    "veech_shelo",
    "hey_jude",
    "Bohemian_Rhapsody",
    "Man_In_The_Mirror",
    "Matanot_Ketannot",
  ];
  const results = [];
  const BASE_URL = process.env.REACT_APP_API_URL;
  console.log(BASE_URL);
  for (const file of list) {
    const { data } = await axios.get(`${BASE_URL}/songs/${file}.json`);
    const haystack = `${data.title} ${data.artist}`.toLowerCase();
    if (haystack.includes(query.toLowerCase())) results.push({ ...data, file });
  }
  return results;
}
