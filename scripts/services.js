async function getTrendingTopics(URL) {
    const response = await fetch(URL);
    if (response.ok) {
        const json = await response.json();
        return (json);
    } else {
        throw new Error("Hay un error");
    }
}


export {
    getTrendingTopics
}