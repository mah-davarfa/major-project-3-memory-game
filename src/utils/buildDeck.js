export async function getDogs(count) {
  try {
    const response = await fetch(`https://dog.ceo/api/breeds/image/random/${count}`);
    if (!response.ok) throw new Error("Failed to fetch dog images");

    const data = await response.json();
    if (!data?.message || !Array.isArray(data.message)) {
      throw new Error("Dog API returned invalid data");
    }

    return data.message.map((url) => ({ url }));
  } catch (err) {
    return { error: true, message: err.message || "Unknown error fetching dogs" };
  }
}

export async function getRandom(count) {
  try {
    const response = await fetch(`https://picsum.photos/v2/list?page=2&limit=${count}`);
    if (!response.ok) throw new Error("Failed to fetch random images");

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("Picsum API returned invalid data");
    }

    return data.map((item) => ({ url: item.download_url }));
  } catch (err) {
    return { error: true, message: err.message || "Unknown error fetching random images" };
  }
}

export async function getCats(count) {
  try {
    const response = await fetch(`https://api.thecatapi.com/v1/images/search?limit=${count}`);
    if (!response.ok) throw new Error("Failed to fetch cat images");

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("Cat API returned invalid data");
    }

    return data.slice(0,count).map((cat) => ({ url: cat.url }));
  } catch (err) {
    return { error: true, message: err.message || "Unknown error fetching cats" };
  }
}
