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

  for (const file of list) {
    const { data } = await axios.get(
      `http://localhost:5000/songs/${file}.json`
    );
    const haystack = `${data.title} ${data.artist}`.toLowerCase();
    if (haystack.includes(query.toLowerCase())) results.push({ ...data, file });
  }
  return results;
}
