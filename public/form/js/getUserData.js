export const userData = fetch('/userData')
    .then((response) => response.json())
    .then((user) => {
        return user;
    })
    .catch((err) => console.error({ message: err.message }));
